import { type Database, handleContentCreate } from 'emdash';
import type { Kysely } from 'kysely';
import { submissionId, value, type Submission } from './contract';

export interface SubmissionRow {
  id: string; form: string; title: string; payload: string; source_path: string; client_hash: string;
  created_at: string; reviewed_at: string | null; content_collection: string | null; content_id: string | null;
  delivery: string; attempts: number; last_attempt: string | null; lease_until: string | null;
}
export const submissionDb = (db: Kysely<Database>) => db.withTables<{ _dos_submissions: SubmissionRow }>();

export async function ensureSubmissionTable(db: Kysely<Database>) {
  await submissionDb(db).schema.createTable('_dos_submissions').ifNotExists()
    .addColumn('id', 'varchar(64)', c => c.primaryKey())
    .addColumn('form', 'text', c => c.notNull()).addColumn('title', 'text', c => c.notNull())
    .addColumn('payload', 'text', c => c.notNull()).addColumn('source_path', 'text', c => c.notNull())
    .addColumn('client_hash', 'varchar(64)', c => c.notNull()).addColumn('created_at', 'text', c => c.notNull())
    .addColumn('reviewed_at', 'text').addColumn('content_collection', 'text').addColumn('content_id', 'text')
    .addColumn('delivery', 'text', c => c.notNull()).addColumn('attempts', 'integer', c => c.notNull().defaultTo(0))
    .addColumn('last_attempt', 'text').addColumn('lease_until', 'text').execute();
  await submissionDb(db).schema.createIndex('dos_submissions_created').ifNotExists().on('_dos_submissions').columns(['created_at']).execute();
}

function draftFor(input: Submission) {
  const f = input.fields;
  const paragraph = (text: string) => [{ _type: 'block', _key: 'submission', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: 'text', text, marks: [] }] }];
  const date = (key: string) => {
    const raw = value(f, key);
    // Event form times are Malawi local time, independent of the server's zone.
    return raw ? new Date(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(raw) ? `${raw}:00+02:00` : raw).toISOString() : null;
  };
  if (input.form === 'job-submission') return { collection: 'jobs', data: {
    title: value(f, 'title'), organization: value(f, 'organization'), description: value(f, 'description'),
    content: paragraph(value(f, 'description')), location: value(f, 'location'), type: value(f, 'type'),
    category: value(f, 'category'), job_status: 'open', posted: new Date().toISOString(), deadline: date('deadline'),
    salary: value(f, 'salary'), skills: value(f, 'skills').split(',').map(s => s.trim()).filter(Boolean),
    contact: { email: value(f, 'email'), phone: value(f, 'phone'), website: value(f, 'website') },
  } };
  if (input.form === 'event-submission') return { collection: 'events', data: {
    title: value(f, 'title'), description: value(f, 'description'), content: paragraph(value(f, 'description')),
    location: value(f, 'location'), category: value(f, 'category'), organizer: value(f, 'organizerName'),
    date: date('date'), end_date: date('endDate'), event_status: 'auto',
    capacity: value(f, 'capacity') ? Number(value(f, 'capacity')) : null,
    contact: { email: value(f, 'organizerEmail'), phone: value(f, 'organizerPhone'), whatsapp: value(f, 'organizerWhatsApp') },
    registration: { required: value(f, 'registrationRequired') === 'yes', url: value(f, 'registrationUrl'), deadline: date('registrationDeadline') },
    tags: value(f, 'tags').split(',').map(s => s.trim()).filter(Boolean),
    ...(value(f, 'imageUrl') ? { image: { provider: 'external', id: '', src: value(f, 'imageUrl'), alt: value(f, 'title') } } : {}),
  } };
  if (input.form !== 'service-registration') return null;
  const title = value(f, 'orgName');
  const description = value(f, 'serviceDescription');
  const category = value(f, 'serviceCategory');
  if (!title || !description || !category) throw new Error('Service name, description and category are required.');
  const categories: Record<string, string> = { education: 'Education', health: 'Healthcare', legal: 'Legal Services', business: 'Business', community: 'Community', youth: 'Youth', women: 'Women', tech: 'Technology', arts: 'Arts & Culture', environment: 'Environment', sports: 'Sports', other: 'Other' };
  const body = [value(f, 'orgDescription'), description].filter(Boolean).map((text, index) => ({
    _type: 'block', _key: `submission-${index}`, style: 'normal', markDefs: [], children: [{ _type: 'span', _key: `text-${index}`, text, marks: [] }],
  }));
  const logo = value(f, 'logoUrl');
  return { collection: 'services', data: {
    title, description, category: categories[category] || category, listing_status: 'active', content: body,
    contact_email: value(f, 'email'), contact_phone: value(f, 'phone'), contact_hours: value(f, 'availability'),
    website: value(f, 'website'), facebook: value(f, 'facebook'), twitter: value(f, 'twitter'),
    instagram: value(f, 'instagram'), linkedin: value(f, 'linkedin'),
    ...Object.fromEntries(['eligibility', 'fees', 'documents', 'appointment', 'accessibility'].map(key => [`access_${key}`, value(f, `access_${key}`)])),
    access_languages: value(f, 'access_languages').split(',').map(s => s.trim()).filter(Boolean).join('\n'),
    ...(logo && /^https:\/\//.test(logo) ? { logo: { provider: 'external', id: '', src: logo, alt: title } } : {}),
  } };
}

export async function saveSubmission(db: Kysely<Database>, input: Submission) {
  const id = submissionId(input);
  return db.transaction().execute(async transaction => {
    const trx = submissionDb(transaction);
    const existing = await trx.selectFrom('_dos_submissions').selectAll().where('id', '=', id).executeTakeFirst();
    if (existing) return existing;
    const recent = await trx.selectFrom('_dos_submissions').select(({ fn }) => fn.countAll<number>().as('count'))
      .where('client_hash', '=', input.clientHash).where('created_at', '>', new Date(Date.now() - 3600000).toISOString()).executeTakeFirstOrThrow();
    if (!input.test && Number(recent.count) >= 10) throw new Error('Too many submissions. Please try again later.');
    const title = value(input.fields, 'orgName') || value(input.fields, 'title') || value(input.fields, 'eventName') || input.form;
    const created = await trx.insertInto('_dos_submissions').values({ id, form: input.form, title: title.slice(0, 300),
      payload: JSON.stringify(input.fields), source_path: input.sourcePath, client_hash: input.clientHash,
      created_at: new Date().toISOString(), reviewed_at: null, content_collection: null, content_id: null,
      delivery: input.test ? 'test' : 'pending', attempts: 0, last_attempt: null, lease_until: null,
    }).onConflict(c => c.column('id').doNothing()).returningAll().executeTakeFirst();
    if (!created) return trx.selectFrom('_dos_submissions').selectAll().where('id', '=', id).executeTakeFirstOrThrow();
    const draft = draftFor(input);
    if (draft) {
      const result = await handleContentCreate(transaction, draft.collection, { data: draft.data, slug: `submission-${id.slice(0, 24)}`, status: 'draft' });
      if (!result.success) throw new Error(`The ${draft.collection} draft could not be saved: ${result.error.code}`);
      return trx.updateTable('_dos_submissions').set({ content_collection: draft.collection, content_id: result.data.item.id })
        .where('id', '=', id).returningAll().executeTakeFirstOrThrow();
    }
    return created;
  });
}

export async function deliverSubmissions(db: Kysely<Database>, onlyId?: string, send: typeof fetch = fetch) {
  const database = submissionDb(db);
  const now = new Date().toISOString();
  let query = database.selectFrom('_dos_submissions').selectAll().where('delivery', '=', 'pending')
    .where(eb => eb.or([eb('lease_until', 'is', null), eb('lease_until', '<', now)]))
    .where(eb => eb.or([eb('last_attempt', 'is', null), eb('last_attempt', '<', new Date(Date.now() - 600000).toISOString())]));
  if (onlyId) query = query.where('id', '=', onlyId);
  const pending = await query.orderBy('created_at', 'asc').limit(5).execute();
  await Promise.all(pending.map(async row => {
    const claim = await database.updateTable('_dos_submissions').set({ lease_until: new Date(Date.now() + 120000).toISOString(), last_attempt: now, attempts: row.attempts + 1 })
      .where('id', '=', row.id).where('delivery', '=', 'pending')
      .where(eb => eb.or([eb('lease_until', 'is', null), eb('lease_until', '<', now)]))
      .where(eb => eb.or([eb('last_attempt', 'is', null), eb('last_attempt', '<', new Date(Date.now() - 600000).toISOString())]))
      .returning('id').executeTakeFirst();
    if (!claim) return;
    try {
      const response = await send('https://formspree.io/f/xqaaajae', { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(15000),
        headers: { Accept: 'application/json', 'Content-Type': 'application/json', Origin: 'https://services.dzaleka.com' },
        body: JSON.stringify({ ...JSON.parse(row.payload), 'form-name': row.form, submission_id: row.id, source: `https://services.dzaleka.com${row.source_path}` }),
      });
      if (response.ok) await database.updateTable('_dos_submissions').set({ delivery: 'sent', lease_until: null }).where('id', '=', row.id).execute();
      else await database.updateTable('_dos_submissions').set({ lease_until: null }).where('id', '=', row.id).execute();
    } catch { await database.updateTable('_dos_submissions').set({ lease_until: null }).where('id', '=', row.id).execute(); }
  }));
}

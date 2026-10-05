import { describe, expect, it, vi } from 'vitest';
import { Kysely } from 'kysely';
import { createDialect } from 'emdash/db/sqlite';
import { runMigrations } from 'emdash/db';
import { applySeed, type SeedFile } from 'emdash/seed';
import { ContentRepository, RevisionRepository, type Database } from 'emdash';
import { buildSeed } from '../scripts/emdash/seed.mjs';
import { completeIntegration } from '../scripts/emdash/complete-integration';
import { saveSubmission, submissionDb, deliverSubmissions } from '../src/lib/submissions/store';
import { signSubmission, validSignature, type Submission } from '../src/lib/submissions/contract';
import { relaySubmission } from '../src/lib/submissions/relay';

const fields = { orgName: 'Test service', orgType: 'NGO', orgDescription: 'Local organization', serviceDescription: 'Education and support', serviceCategory: 'education', email: 'test@example.org', phone: '+265123456', availability: ['Monday', 'Tuesday'], logoUrl: 'https://example.org/logo.png' };
const input: Submission = { form: 'service-registration', sourcePath: '/services/register', clientHash: 'a'.repeat(64), test: true, fields };
const secret = 'test-secret-'.repeat(5);

describe('EmDash submission workflow', () => {
  it('backfills missing source fields without replacing live edits or publishing pending revisions', async () => {
    const db = new Kysely<Database>({ dialect: createDialect({ url: ':memory:' }) });
    try {
      await runMigrations(db);
      const seed = await buildSeed({ fullTextSearch: false });
      const source = seed.content.events.find(event => event.data.host)!;
      const old = structuredClone(seed);
      const missing = ['organizer_url', 'capacity', 'host'];
      old.collections.find(c => c.slug === 'events')!.fields = old.collections.find(c => c.slug === 'events')!.fields.filter(field => !missing.includes(field.slug));
      const data: Record<string, unknown> = { ...source.data };
      for (const key of missing) delete data[key];
      await applySeed(db, { ...old, content: { events: [{ ...source, data }] } } as SeedFile, { includeContent: true });
      const content = new ContentRepository(db);
      const entry = (await content.findBySlug('events', source.slug))!;
      await content.update('events', entry.id, { data: { description: 'Live editorial change' } });
      await content.updateDraftAware('events', entry.id, { data: { title: 'Pending editorial title' } });
      await completeIntegration(db);
      const live = (await content.findById('events', entry.id))!;
      const draft = (await new RevisionRepository(db).findById(live.draftRevisionId!))!;
      expect(live.data.description).toBe('Live editorial change');
      expect(live.data.title).toBe(source.data.title);
      expect(live.data.host).toEqual(source.data.host);
      expect(draft.data.title).toBe('Pending editorial title');
      expect(draft.data.host).toEqual(source.data.host);
      expect(live.status).toBe('published');
      await content.update('events', entry.id, { data: { host: { name: 'Editor-selected host' } } });
      await completeIntegration(db);
      expect((await content.findById('events', entry.id))?.data.host).toEqual({ name: 'Editor-selected host' });
    } finally { await db.destroy(); }
  }, 30000);

  it('rejects forged and expired requests', () => {
    const body = JSON.stringify(input), timestamp = String(Date.now());
    const signature = signSubmission(body, secret, timestamp);
    expect(validSignature(body, secret, timestamp, signature)).toBe(true);
    expect(validSignature(body + ' ', secret, timestamp, signature)).toBe(false);
    expect(validSignature(body, secret, '1', signSubmission(body, secret, '1'))).toBe(false);
    expect(validSignature(body, undefined, timestamp, signature)).toBe(false);
  });

  it('validates at the public boundary and only signs server-controlled envelopes', async () => {
    const send = vi.fn<typeof fetch>().mockImplementation(async () => Response.json({ success: true, data: { accepted: true, id: 'saved' } }));
    const request = (body: unknown, origin = 'https://services.dzaleka.com') => new Request('https://services.dzaleka.com/api/submissions?form=service-registration', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json', Origin: origin }, body: JSON.stringify(body),
    });
    expect((await relaySubmission(request({ ...fields, test: 'true', _next: 'https://bad.example' }), '127.0.0.1', secret, send)).status).toBe(200);
    const options = send.mock.calls[0][1]!;
    const envelope = JSON.parse(String(options.body));
    expect(envelope.test).toBe(false);
    expect(envelope.fields._next).toBeUndefined();
    expect(envelope.clientHash).not.toContain('127.0.0.1');
    const headers = new Headers(options.headers);
    expect(validSignature(String(options.body), secret, headers.get('x-dos-timestamp'), headers.get('x-dos-signature'))).toBe(true);
    expect((await relaySubmission(request({ orgName: 'Only a name' }), 'ip', secret, send)).status).toBe(400);
    expect((await relaySubmission(request({ ...fields, website: 'javascript:alert(1)' }), 'ip', secret, send)).status).toBe(400);
    expect((await relaySubmission(request(fields, 'https://bad.example'), 'ip', secret, send)).status).toBe(403);
    expect((await relaySubmission(request({ ...fields, serviceDescription: 'x'.repeat(70000) }), 'ip', secret, send)).status).toBe(413);
    expect((await relaySubmission(request({ ...fields, _gotcha: 'spam' }), 'ip', secret, send)).status).toBe(200);
    expect(send).toHaveBeenCalledTimes(1);
    const verification = request(fields);
    const time = String(Date.now());
    verification.headers.set('x-dos-timestamp', time);
    verification.headers.set('x-dos-test-signature', signSubmission(JSON.stringify(fields), secret, time));
    expect((await relaySubmission(verification, 'ip', secret, send)).status).toBe(200);
    expect(JSON.parse(String(send.mock.calls[1][1]?.body)).test).toBe(true);
    const forged = request(fields);
    forged.headers.set('x-dos-test-signature', 'f'.repeat(64));
    expect((await relaySubmission(forged, 'ip', secret, send)).status).toBe(403);
    expect(send).toHaveBeenCalledTimes(2);
  });

  it('saves drafts once, preserves corrections, retries delivery and safely backfills pending edits', async () => {
    const db = new Kysely<Database>({ dialect: createDialect({ url: ':memory:' }) });
    try {
      await runMigrations(db);
      const seed = await buildSeed({ fullTextSearch: false });
      await applySeed(db, { ...seed, content: { services: [seed.content.services[0]], events: [seed.content.events[0]], jobs: [seed.content.jobs[0]] } } as SeedFile, { includeContent: true });
      const content = new ContentRepository(db);
      const published = await content.findBySlug('services', seed.content.services[0].slug);
      await content.updateDraftAware('services', published!.id, { data: { title: 'Private editor work' } });
      await completeIntegration(db);
      const saved = await saveSubmission(db, input);
      expect(saved.content_collection).toBe('services');
      const draft = await content.findById('services', saved.content_id!);
      expect(draft?.status).toBe('draft');
      expect(draft?.data.contact_hours).toBe('Monday, Tuesday');
      expect(draft?.data.logo).toMatchObject({ src: fields.logoUrl });
      expect((await saveSubmission(db, input)).id).toBe(saved.id);
      const correction = await saveSubmission(db, { ...input, form: 'service-correction', fields: { title: 'Correction', listingUrl: `https://services.dzaleka.com/services/${published!.slug}`, description: 'Unverified correction' } });
      expect(correction.content_id).toBeNull();
      const current = await content.findById('services', published!.id);
      expect(current?.data.title).toBe(published?.data.title);
      expect((await new RevisionRepository(db).findById(current!.draftRevisionId!))?.data.title).toBe('Private editor work');
      for (const [form, data, collection] of [
        ['job-submission', { title: 'Teacher', description: 'Teach classes', organization: 'School', location: 'Dzaleka', type: 'full-time', category: 'education', deadline: '2030-01-01', email: 'test@example.org' }, 'jobs'],
        ['event-submission', { title: 'Workshop', description: 'Community workshop', date: '2030-01-01T14:00', category: 'education', location: 'Dzaleka', organizerName: 'School' }, 'events'],
      ] as const) {
        const row = await saveSubmission(db, { ...input, form, fields: data });
        expect((await content.findById(collection, row.content_id!))?.status).toBe('draft');
      }
      const send = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 502 }));
      await deliverSubmissions(db, undefined, send);
      expect(send).not.toHaveBeenCalled();
      await submissionDb(db).updateTable('_dos_submissions').set({ delivery: 'pending' }).where('id', '=', saved.id).execute();
      await deliverSubmissions(db, saved.id, send);
      expect((await submissionDb(db).selectFrom('_dos_submissions').selectAll().where('id', '=', saved.id).executeTakeFirst())?.delivery).toBe('pending');
      await submissionDb(db).updateTable('_dos_submissions').set({ last_attempt: null }).where('id', '=', saved.id).execute();
      send.mockResolvedValue(new Response(null, { status: 200 }));
      await deliverSubmissions(db, saved.id, send);
      expect((await submissionDb(db).selectFrom('_dos_submissions').selectAll().where('id', '=', saved.id).executeTakeFirst())?.delivery).toBe('sent');
      await deliverSubmissions(db, saved.id, send);
      expect(send).toHaveBeenCalledTimes(2);
    } finally { await db.destroy(); }
  }, 30000);
});

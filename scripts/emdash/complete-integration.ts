import { Kysely, sql } from 'kysely';
import { ContentRepository, RevisionRepository, SchemaRegistry, OptionsRepository, setSiteSettings, type Database } from 'emdash';
import { buildSeed } from './seed.mjs';
import { ensureSubmissionTable } from '../../src/lib/submissions/store';

export async function completeIntegration(db: Kysely<Database>) {
  const seed = await buildSeed({ fullTextSearch: false });
  const sources: Record<string, Array<{ slug: string; data: Record<string, unknown> }>> = seed.content;
  const options = new OptionsRepository(db);
  if (await options.get('site:title') === 'Dzaleka Online Services CMS') await setSiteSettings({ title: 'Dzaleka Online Services' }, db);
  const schema = new SchemaRegistry(db);
  const additions: Record<string, string[]> = { events: ['organizer_url', 'capacity', 'host'], jobs: ['requirements'] };
  for (const [collection, names] of Object.entries(additions)) {
    const model = seed.collections.find(c => c.slug === collection)!;
    for (const name of names) {
      if (!await schema.getField(collection, name)) {
        const field = model.fields.find(f => f.slug === name)!;
        await schema.createField(collection, field);
      }
    }
  }
  const statusField = await schema.getField('events', 'event_status');
  const needsAutomaticStatus = !statusField?.validation?.options?.includes('auto');
  let changed = 0;
  for (const [collection, names] of Object.entries(additions)) {
    for (const source of sources[collection]) {
      await db.transaction().execute(async trx => {
        const repo = new ContentRepository(trx);
        const item = await repo.findBySlug(collection, source.slug);
        if (!item) return;
        const pending = item.draftRevisionId ? await new RevisionRepository(trx).findById(item.draftRevisionId) : null;
        const patch = Object.fromEntries(names.filter(name => item.data[name] == null && source.data[name] != null).map(name => [name, source.data[name]]));
        if (collection === 'events' && needsAutomaticStatus) patch.event_status = 'auto';
        if (!Object.keys(patch).length) return;
        // Add missing source fields without publishing an editor's pending revision.
        await repo.update(collection, item.id, { data: patch });
        if (pending) {
          const draftPatch = Object.fromEntries(Object.entries(patch).filter(([key]) => pending.data[key] == null || (key === 'event_status' && pending.data[key] === item.data[key])));
          if (Object.keys(draftPatch).length) await repo.updateDraftAware(collection, item.id, { data: draftPatch });
        }
        changed++;
      });
    }
  }
  await schema.updateField('events', 'event_status', { label: 'Status (automatic or override)', validation: { options: ['auto', 'upcoming', 'past'] } });
  await ensureSubmissionTable(db);
  return { changed };
}

if (process.argv.includes('--apply')) {
  const { createMigrationDialect } = await import('../../src/lib/news/staging-postgres.mjs');
  const db = new Kysely<Database>({ dialect: createMigrationDialect() });
  try {
    const { rows: [row] } = await sql<{ schema: string; exposed: boolean }>`SELECT current_schema() AS schema, has_schema_privilege('anon', 'emdash_staging', 'USAGE') AS exposed`.execute(db);
    if (row.schema !== 'emdash_staging' || row.exposed) throw new Error('The CMS database must use the private schema.');
    console.log(await completeIntegration(db));
  } finally { await db.destroy(); }
}

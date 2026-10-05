import { randomUUID } from 'node:crypto';
import { sql, type Kysely } from 'kysely';
import type { Database } from 'emdash';
import { linkSchema, trackedDestination, type LinkInput } from './contract';

export interface LinkRow extends LinkInput { id: string; revision: number; created_at: string; updated_at: string; health: string; checked_at: string | null; failures: number }
export interface EventRow { id: string; at: string; day: string; visitor: string; name: string; path: string; target: string; referrer: string; source: string; medium: string; campaign: string; device: string; browser: string; link_id: string }
type Tables = { _dos_links: Omit<LinkRow, 'enabled'> & { enabled: number }; _dos_events: EventRow; _dos_insights_settings: { id: string; retention: number; enabled: number }; _dos_event_limits: { id: string; hits: number; expires: string } }
export const insightsDb = (db: Kysely<Database>) => db.withTables<Tables>();
export async function migrateInsights(db: Kysely<Database>) {
  const s = insightsDb(db).schema;
  await s.createTable('_dos_links').ifNotExists().addColumn('id', 'text', c => c.primaryKey()).addColumn('slug', 'text', c => c.notNull().unique())
    .addColumn('title', 'text', c => c.notNull()).addColumn('destination', 'text', c => c.notNull()).addColumn('enabled', 'integer', c => c.notNull())
    .addColumn('tags', 'text', c => c.notNull()).addColumn('source', 'text', c => c.notNull()).addColumn('medium', 'text', c => c.notNull()).addColumn('campaign', 'text', c => c.notNull())
    .addColumn('expires_at', 'text', c => c.notNull()).addColumn('revision', 'integer', c => c.notNull()).addColumn('created_at', 'text', c => c.notNull()).addColumn('updated_at', 'text', c => c.notNull())
    .addColumn('health', 'text', c => c.notNull()).addColumn('checked_at', 'text').addColumn('failures', 'integer', c => c.notNull()).execute();
  await s.createTable('_dos_events').ifNotExists().addColumn('id', 'text', c => c.primaryKey()).addColumn('at', 'text', c => c.notNull()).addColumn('day', 'text', c => c.notNull())
    .addColumn('visitor', 'text', c => c.notNull()).addColumn('name', 'text', c => c.notNull()).addColumn('path', 'text', c => c.notNull()).addColumn('target', 'text', c => c.notNull())
    .addColumn('referrer', 'text', c => c.notNull()).addColumn('source', 'text', c => c.notNull()).addColumn('medium', 'text', c => c.notNull()).addColumn('campaign', 'text', c => c.notNull())
    .addColumn('device', 'text', c => c.notNull()).addColumn('browser', 'text', c => c.notNull()).addColumn('link_id', 'text', c => c.notNull()).execute();
  await insightsDb(db).updateTable('_dos_events').set({ path: sql`coalesce(nullif(rtrim(path, '/'), ''), '/')` }).where('path', 'like', '%/').where('path', '!=', '/').execute();
  for (const column of ['at', 'path', 'link_id', 'visitor']) await s.createIndex(`dos_events_${column}`).ifNotExists().on('_dos_events').column(column).execute();
  await s.createTable('_dos_insights_settings').ifNotExists().addColumn('id', 'text', c => c.primaryKey()).addColumn('retention', 'integer', c => c.notNull()).addColumn('enabled', 'integer', c => c.notNull()).execute();
  await insightsDb(db).insertInto('_dos_insights_settings').values({ id: 'site', retention: 90, enabled: 1 }).onConflict(c => c.column('id').doNothing()).execute();
  await s.createTable('_dos_event_limits').ifNotExists().addColumn('id', 'text', c => c.primaryKey()).addColumn('hits', 'integer', c => c.notNull()).addColumn('expires', 'text', c => c.notNull()).execute();
}
export async function saveLink(db: Kysely<Database>, input: unknown, id?: string, revision?: number) {
  const values = linkSchema.parse(input), now = new Date().toISOString(), database = insightsDb(db);
  if (id) {
    const previous = await database.selectFrom('_dos_links').selectAll().where('id', '=', id).executeTakeFirst();
    if (!previous || previous.revision !== revision) throw new Error('This link changed. Reload it before saving.');
    if (values.slug !== previous.slug) throw new Error('The short URL cannot be renamed. Create another link to keep existing shares working.');
    const row = await database.updateTable('_dos_links').set({ ...values, enabled: Number(values.enabled), updated_at: now, revision: previous.revision + 1,
      ...(values.destination !== previous.destination ? { health: 'unchecked', checked_at: null, failures: 0 } : {}) }).where('id', '=', id).where('revision', '=', revision!).returningAll().executeTakeFirst();
    if (!row) throw new Error('This link changed. Reload it before saving.');
    return row;
  }
  const row = await database.insertInto('_dos_links').values({ ...values, enabled: Number(values.enabled), id: randomUUID(), revision: 1, created_at: now, updated_at: now, health: 'unchecked', checked_at: null, failures: 0 }).onConflict(c => c.column('slug').doNothing()).returningAll().executeTakeFirst();
  if (!row) throw new Error('That short URL already exists. Choose a different slug.');
  return row;
}
export async function resolveLink(db: Kysely<Database>, slug: string) {
  const row = await insightsDb(db).selectFrom('_dos_links').selectAll().where('slug', '=', slug).executeTakeFirst();
  if (!row) return { status: 404 as const };
  if (!row.enabled || (row.expires_at && row.expires_at <= new Date().toISOString())) return { status: 410 as const };
  return { status: 302 as const, destination: trackedDestination({ ...row, enabled: !!row.enabled }), link: row };
}
export async function recordEvent(db: Kysely<Database>, event: EventRow) {
  const database = insightsDb(db);
  const settings = await database.selectFrom('_dos_insights_settings').selectAll().where('id', '=', 'site').executeTakeFirstOrThrow();
  if (!settings.enabled) return false;
  const bucket = `${event.visitor}:${event.at.slice(0, 16)}`;
  const limit = await database.insertInto('_dos_event_limits').values({ id: bucket, hits: 1, expires: new Date(Date.now() + 3600000).toISOString() })
    .onConflict(c => c.column('id').doUpdateSet({ hits: sql`_dos_event_limits.hits + 1` })).returning('hits').executeTakeFirstOrThrow();
  if (limit.hits > 120) return false;
  await database.insertInto('_dos_events').values(event).onConflict(c => c.column('id').doNothing()).execute();
  return true;
}
export async function cleanupInsights(db: Kysely<Database>) {
  const database = insightsDb(db), settings = await database.selectFrom('_dos_insights_settings').selectAll().where('id', '=', 'site').executeTakeFirstOrThrow();
  await database.deleteFrom('_dos_events').where('at', '<', new Date(Date.now() - settings.retention * 86400000).toISOString()).execute();
  await database.deleteFrom('_dos_event_limits').where('expires', '<', new Date().toISOString()).execute();
}

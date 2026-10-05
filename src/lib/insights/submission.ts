import type { Kysely } from 'kysely';
import type { Database } from 'emdash';
import { insightsDb } from './store';
import type { Submission } from '../submissions/contract';

export async function recordSubmission(db: Kysely<Database>, input: Submission, id: string, createdAt: string) {
  if (input.test || !input.analytics) return;
  const database = insightsDb(db);
  const settings = await database.selectFrom('_dos_insights_settings').selectAll().where('id', '=', 'site').executeTakeFirstOrThrow();
  if (!settings.enabled) return;
  const day = new Date(Date.parse(createdAt) + 7200000).toISOString().slice(0, 10);
  await database.insertInto('_dos_events').values({ id: `submission-${id}`, at: createdAt, day, name: 'submission', path: input.sourcePath,
    ...input.analytics, referrer: '', target: '', link_id: '' }).onConflict(c => c.column('id').doNothing()).execute();
}

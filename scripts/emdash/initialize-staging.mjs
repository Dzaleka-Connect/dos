import assert from 'node:assert/strict';
import { Kysely, sql } from 'kysely';
import { runMigrations } from 'emdash/db';
import { applySeed } from 'emdash/seed';
import { handleMediaUsageActivationAdvance } from 'emdash';
import { createMigrationDialect } from '../../src/lib/news/staging-postgres.mjs';
import { buildSeed } from './seed.mjs';

const db = new Kysely({ dialect: createMigrationDialect() });
try {
  const { rows: [access] } = await sql`SELECT current_schema() AS schema,
    has_schema_privilege('anon', 'emdash_staging', 'USAGE') AS anon_access,
    has_schema_privilege('authenticated', 'emdash_staging', 'USAGE') AS authenticated_access,
    has_schema_privilege('service_role', 'emdash_staging', 'USAGE') AS service_role_access`.execute(db);
  assert.equal(access.schema, 'emdash_staging', 'Initialize only the private CMS schema.');
  assert(!access.anon_access && !access.authenticated_access && !access.service_role_access, 'The CMS schema must be private.');
  console.log('Applying EmDash migrations to the private staging schema.');
  const migrations = await runMigrations(db, { raceWaitMs: 45000 });
  console.log(`Applied ${migrations.applied.length} migrations.`);
  const activation = await db.selectFrom('_emdash_media_usage_activation').select('state').executeTakeFirst();
  if (activation?.state !== 'active') {
    const users = await db.selectFrom('users').select(({ fn }) => fn.countAll().as('count')).executeTakeFirstOrThrow();
    assert.equal(Number(users.count), 0, 'Stop existing writers before activating media tracking on a site with editor accounts.');
    const result = await handleMediaUsageActivationAdvance(db, { writersDrained: true });
    assert(result.success && result.data.outcome === 'active', 'Media tracking must be active before importing content.');
  }
  const seed = await buildSeed({ fullTextSearch: false });
  await applySeed(db, seed, { includeContent: true, onConflict: 'skip' });
  console.log(`News import complete: ${seed.content.news.length} source articles; existing entries preserved.`);
} finally {
  await db.destroy();
}

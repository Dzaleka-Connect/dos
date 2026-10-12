import { build } from 'esbuild';
import { rm } from 'node:fs/promises';
import { Kysely, sql } from 'kysely';
import { createMigrationDialect } from '../../src/lib/news/staging-postgres.mjs';
if (!process.argv.includes('--apply')) throw new Error('Use --apply with the private CMS environment.');
const output = new URL('./.form-guard-run.mjs', import.meta.url);
const db = new Kysely({ dialect: createMigrationDialect() });
try {
  const { rows: [row] } = await sql`SELECT current_schema() AS schema, has_schema_privilege('anon', 'emdash_staging', 'USAGE') AS exposed`.execute(db);
  if (row.schema !== 'emdash_staging' || row.exposed) throw new Error('Expected private CMS schema.');
  await build({ entryPoints: ['src/lib/submissions/guard-store.ts'], outfile: output.pathname, bundle: true, packages: 'external', platform: 'node', format: 'esm' });
  await (await import(output.href)).ensureGuardTable(db);
  console.log('Form verification storage is ready. Existing submissions are unchanged.');
} finally { await db.destroy(); await rm(output, { force: true }); }

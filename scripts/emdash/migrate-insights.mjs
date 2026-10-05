import { build } from 'esbuild';
import { Kysely } from 'kysely';
import { rm } from 'node:fs/promises';
import { createMigrationDialect } from '../../src/lib/news/staging-postgres.mjs';
if (!process.argv.includes('--apply')) throw new Error('Pass --apply to create the Links and Statistics tables.');
const outfile = new URL('./.insights-migrate.mjs', import.meta.url);
await build({ entryPoints: ['src/lib/insights/store.ts'], outfile: outfile.pathname, bundle: true, packages: 'external', platform: 'node', format: 'esm' });
const db = new Kysely({ dialect: createMigrationDialect() });
try { const { migrateInsights } = await import(outfile.href); await migrateInsights(db); console.log('Links and Statistics tables ready. Existing data preserved.'); }
finally { await db.destroy(); await rm(outfile, { force: true }); }

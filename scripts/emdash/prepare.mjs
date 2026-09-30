import { mkdir, writeFile, readFile, chmod } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { buildSeed, newCollectionsOnly } from './seed.mjs';

process.chdir(fileURLToPath(new URL('../../', import.meta.url)));
if (process.env.NETLIFY) throw new Error('This pilot must not run on Netlify.');
await mkdir('.emdash-pilot', { recursive: true, mode: 0o700 });
const seed = await buildSeed();
await writeFile('.emdash-pilot/seed.json', JSON.stringify(seed, null, 2) + '\n');
function run(args) {
  const result = spawnSync(process.execPath, ['node_modules/emdash/dist/cli/index.mjs', ...args], { stdio: 'inherit' });
  if (result.status !== 0) throw new Error(`EmDash ${args[0]} failed; setup can be retried.`);
}
run(['secrets', 'generate', '--write', '.emdash-pilot/.env']);
await chmod('.emdash-pilot/.env', 0o600);
// The marker lists imported collections; an older marker (a timestamp) means News only.
let imported = [];
try {
  const marker = (await readFile('.emdash-pilot/import-complete', 'utf8')).trim();
  imported = marker.startsWith('{') ? JSON.parse(marker).collections : ['news'];
} catch {}
const pending = newCollectionsOnly(seed, new Set(imported));
if (pending.collections.length) {
  // Seeding only new collections avoids restoring entries deleted in the pilot.
  await writeFile('.emdash-pilot/seed-pending.json', JSON.stringify(pending, null, 2) + '\n');
  run(['seed', '.emdash-pilot/seed-pending.json', '--database', '.emdash-pilot/news.db', '--uploads-dir', '.emdash-pilot/uploads', '--on-conflict', 'skip']);
  const collections = [...imported, ...pending.collections.map((collection) => collection.slug)];
  await writeFile('.emdash-pilot/import-complete', JSON.stringify({ collections, updated: new Date().toISOString() }) + '\n');
}
console.log(`CMS pilot ready: ${seed.content.news.length} articles, ${seed.content.events.length} events and ${seed.content.jobs.length} jobs. Existing CMS edits are preserved.`);
console.log('Editor: http://localhost:4322/_emdash/admin/');

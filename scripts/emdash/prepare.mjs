import { mkdir, writeFile, access, chmod } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { buildSeed } from './seed.mjs';

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
let imported = false;
try { await access('.emdash-pilot/import-complete'); imported = true; } catch {}
if (!imported) {
  run(['seed', '.emdash-pilot/seed.json', '--database', '.emdash-pilot/news.db', '--uploads-dir', '.emdash-pilot/uploads', '--on-conflict', 'skip']);
  await writeFile('.emdash-pilot/import-complete', new Date().toISOString() + '\n');
}
console.log(`News pilot ready: ${seed.content.news.length} source articles. Existing CMS edits are preserved.`);
console.log('Editor: http://localhost:4322/_emdash/admin/');

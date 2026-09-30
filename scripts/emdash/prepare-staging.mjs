import { chmod, readFile, writeFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const path = '.env.staging';
let content;
try { content = await readFile(path, 'utf8'); }
catch (error) {
  if (error.code !== 'ENOENT') throw error;
  content = await readFile('deployment/emdash/staging.env.example', 'utf8');
}
for (const key of ['DOS_STAGING_PASSWORD', 'EMDASH_CRON_SECRET']) {
  const line = new RegExp(`^${key}=(.*)$`, 'm');
  if (!content.match(line)?.[1]?.trim()) {
    const value = `${key}=${randomBytes(32).toString('hex')}`;
    content = line.test(content) ? content.replace(line, value) : `${content}\n${value}\n`;
  }
}
await writeFile(path, content, { mode: 0o600 });
await chmod(path, 0o600);
const result = spawnSync(process.execPath, ['node_modules/emdash/dist/cli/index.mjs', 'secrets', 'generate', '--write', path], { stdio: 'inherit' });
if (result.status !== 0) throw new Error('Could not prepare the EmDash encryption key.');
console.log('Prepared private .env.staging; existing secrets are preserved. Fill in the new staging services, then copy settings to Netlify.');

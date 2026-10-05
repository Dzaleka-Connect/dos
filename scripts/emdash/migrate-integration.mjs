import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import { rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

if (!process.argv.includes('--apply')) throw new Error('Run with --apply and the private CMS environment to apply this migration.');
const output = fileURLToPath(new URL('./.complete-integration-run.mjs', import.meta.url));
try {
  await build({ entryPoints: [fileURLToPath(new URL('./complete-integration.ts', import.meta.url))], outfile: output,
    bundle: true, packages: 'external', platform: 'node', format: 'esm',
    external: ['./seed.mjs', '../../src/lib/news/staging-postgres.mjs'],
  });
  const result = spawnSync(process.execPath, [output, '--apply'], { stdio: 'inherit', env: process.env });
  process.exitCode = result.status ?? 1;
} finally { await rm(output, { force: true }); }

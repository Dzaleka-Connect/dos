import { build } from 'esbuild';
import { cp, mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// A directory outside the Git checkout prevents Netlify CLI from selecting the
// public site's root .netlify/v1 bundle after both Astro targets have built.
const release = await mkdtemp(join(tmpdir(), 'dos-cms-release-'));
await mkdir(join(release, '.netlify'), { recursive: true });
await cp('deployment/emdash/.netlify/v1', join(release, '.netlify/v1'), { recursive: true });
await cp('dist-emdash-staging', join(release, 'dist'), { recursive: true });
await build({ entryPoints: ['netlify/emdash-functions/emdash-maintenance.mjs'], outfile: join(release, 'functions/emdash-maintenance.mjs'), bundle: true, platform: 'node', format: 'esm' });
await writeFile(join(release, 'package.json'), JSON.stringify({ name: 'dos-cms-release', private: true, type: 'module' }));
await writeFile(join(release, 'netlify.toml'), '[build]\n  publish = "dist"\n[functions]\n  directory = "functions"\n[[headers]]\n  for = "/*"\n  [headers.values]\n    X-Robots-Tag = "noindex, nofollow, noarchive"\n');
await writeFile('.emdash-pilot/cms-release-path', release);
console.log(release);

import { build } from 'astro';
import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { buildSeed } from './seed.mjs';
import { stagingOrigin } from './staging-env.mjs';

stagingOrigin();
await mkdir('.emdash-pilot', { recursive: true, mode: 0o700 });
await writeFile('.emdash-pilot/seed.json', JSON.stringify(await buildSeed({ fullTextSearch: false })) + '\n');
await build({ configFile: './astro.emdash.netlify.config.mjs' });
// Crawlers must be able to read the site-wide noindex response header. Do not
// copy the public site's sitemap links or search/AI opt-in to the private CMS.
await writeFile('dist-emdash-staging/robots.txt', 'User-agent: *\nAllow: /\n');
// The CLI discovers framework functions relative to its staging config directory.
await rm('deployment/emdash/.netlify/v1', { recursive: true, force: true });
await cp('.netlify/v1', 'deployment/emdash/.netlify/v1', { recursive: true });

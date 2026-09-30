import assert from 'node:assert/strict';
import { readFile, cp, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const middleware = await readFile('.netlify/build/virtual_astro_middleware.mjs', 'utf8');
assert.match(middleware, /createScheduler:\s*null/, 'The Netlify build must disable the in-process scheduler');
const bundle = await mkdtemp(join(tmpdir(), 'dos-emdash-bundle-'));
try {
  await cp('.netlify/v1/functions/ssr', bundle, { recursive: true });
  const { default: handler } = await import(pathToFileURL(join(bundle, 'ssr.mjs')).href);
  const stagingPassword = process.env.DOS_STAGING_PASSWORD;
  const origin = 'https://dos-news-staging-test.netlify.app';
  process.env.DOS_STAGING_PASSWORD = 'build-verification-only-'.repeat(3);
  const paths = ['/', '/news', '/news/category/news', '/news/nonexistent', '/_emdash/admin/', '/_emdash/api/setup',
    '/api/search-index.json', '/api/rss', '/sitemap.xml', '/news-sitemap.xml', '/encyclopedia/nonexistent',
    '/staff', '/dashboard', '/dzaleka-wellbeing'];
  for (const path of paths) {
    const response = await handler(new Request(origin + path), { ip: '127.0.0.1' });
    assert.equal(response.status, 401, `${path} must run through the staging gate`);
    assert.match(response.headers.get('cache-control') || '', /no-store/);
    assert.match(response.headers.get('x-robots-tag') || '', /noindex/);
  }
  const deniedCron = await handler(new Request(origin + '/_emdash/api/dos-maintenance', {
    method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' },
  }), { ip: '127.0.0.1' });
  assert.equal(deniedCron.status, 401, 'Maintenance must require its separate bearer secret');
  console.log(`Built Netlify handler verified: ${paths.length} dynamic routes protected, maintenance authenticated, background timer disabled.`);

  if (process.argv.includes('--staging')) {
    const { stagingOrigin, validateStagingRuntime } = await import('./staging-env.mjs');
    const { buildSeed } = await import('./seed.mjs');
    process.env.DOS_STAGING_PASSWORD = stagingPassword;
    validateStagingRuntime();
    const seed = await buildSeed({ fullTextSearch: false });
    const authorization = `Basic ${Buffer.from(`staging:${stagingPassword}`).toString('base64')}`;
    for (const path of [`/news/${seed.content.news[0].slug}`, '/sitemap.xml']) {
      const response = await handler(new Request(stagingOrigin() + path, {
        headers: { Authorization: authorization },
      }), { ip: '127.0.0.1' });
      assert.equal(response.status, 200, path);
      await response.arrayBuffer();
    }
    console.log('Authenticated News article and sitemap render successfully.');
  }

} finally {
  await rm(bundle, { recursive: true, force: true });
}

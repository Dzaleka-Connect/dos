import assert from 'node:assert/strict';
import { buildSeed } from './seed.mjs';
import { stagingOrigin } from './staging-env.mjs';

const origin = stagingOrigin();
const password = process.env.DOS_STAGING_PASSWORD;
assert(password?.length >= 32, 'Set DOS_STAGING_PASSWORD in the environment.');
const authorization = `Basic ${Buffer.from(`staging:${password}`).toString('base64')}`;
const get = (path, authenticated = true) => fetch(new URL(path, origin), {
  headers: authenticated ? { Authorization: authorization } : {},
  redirect: 'manual', signal: AbortSignal.timeout(30000),
});

for (const path of ['/news', '/_emdash/admin/', '/api/search-index.json']) {
  const response = await get(path, false);
  assert.equal(response.status, 401, `${path} must require staging access`);
  assert.match(response.headers.get('cache-control') || '', /no-store/);
}

const seed = await buildSeed();
const paths = ['/', '/news', '/news/category/news', '/api/search-index.json', '/api/rss', '/news-sitemap.xml', '/sitemap.xml',
  ...seed.content.news.map((entry) => '/news/' + entry.slug.split('/').map(encodeURIComponent).join('/'))];
for (const path of paths) {
  const response = await get(path);
  assert.equal(response.status, 200, `${path} must return 200 after staging setup`);
  assert.match(response.headers.get('x-robots-tag') || '', /noindex/, `${path} must not be indexed`);
  assert.match(response.headers.get('cache-control') || '', /no-store/, `${path} must show current CMS content`);
  await response.arrayBuffer();
}
assert.equal((await get('/news/dos-staging-missing-article-check')).status, 404);
const adminApi = await get('/_emdash/api/content/news');
assert.equal(adminApi.status, 401, 'The staging password must not grant editor API access');
console.log(`Staging HTTP checks passed for ${paths.length} reader routes, access protection and missing articles.`);
console.log('Reader checks do not verify browser passkeys, editor sessions or the editor upload workflow.');

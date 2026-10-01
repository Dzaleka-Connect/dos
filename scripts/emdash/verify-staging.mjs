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
  assert.equal(response.status, path.startsWith('/api/') ? 401 : 302, `${path} must require sign-in`);
  assert.equal(response.headers.has('www-authenticate'), false);
  assert.match(response.headers.get('cache-control') || '', /no-store/);
}

const home = await get('/', false);
assert.equal(home.status, 302);
assert.equal(home.headers.get('location'), '/_emdash/admin/');
const login = await get('/_emdash/admin/login', false);
assert.equal(login.status, 200, 'Native sign-in loads without a shared password');
assert.equal(login.headers.has('www-authenticate'), false);
assert.match(login.headers.get('x-robots-tag') || '', /noindex/);
assert.match(await login.text(), /Dzaleka Online Services/);
const robots = await get('/robots.txt', false);
assert.equal(robots.status, 200);
assert.match(robots.headers.get('x-robots-tag') || '', /noindex/);
assert.equal((await robots.text()).trim(), 'User-agent: *\nAllow: /');
for (const path of ['/news', '/_emdash/api/media/file/verification-does-not-exist.png']) {
  const response = await fetch(new URL(path, origin), {
    headers: { Cookie: 'astro-session=00000000-0000-4000-8000-000000000000' },
    redirect: 'manual', signal: AbortSignal.timeout(30000),
  });
  assert.equal(response.status, path.startsWith('/news') ? 302 : 401, 'A cookie alone cannot grant access');
  assert.equal(response.headers.has('www-authenticate'), false);
}

const seed = await buildSeed();
const paths = ['/news', '/news/category/news', '/api/search-index.json', '/api/rss', '/news-sitemap.xml', '/sitemap.xml',
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

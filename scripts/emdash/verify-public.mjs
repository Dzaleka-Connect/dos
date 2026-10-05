import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { Kysely } from 'kysely';
import { ContentRepository, MediaRepository } from 'emdash';
import { createStorage } from 'emdash/storage/s3';
import { createDialect } from '../../src/lib/news/staging-postgres.mjs';
import { buildSeed } from './seed.mjs';
import { cmsOrigin, publicPrefix } from '../../src/lib/news/public-contract.mjs';

const target = process.argv.find(arg => arg.startsWith('--origin='))?.slice(9);
assert.ok(!target || /^https:\/\/[a-z0-9.-]+$/.test(target), 'Use an HTTPS deployment origin');
const db = new Kysely({ dialect: createDialect() });
const repository = new ContentRepository(db);
const mediaRepository = new MediaRepository(db);
const storage = createStorage({});
const slug = `cms-connection-check-${randomUUID()}`;
const key = `${slug}.png`;
const get = (path, origin = cmsOrigin) => fetch(new URL(path, origin), { redirect: 'manual', signal: AbortSignal.timeout(30000) });
const feed = async () => {
  const response = await get(`${publicPrefix}news.json`);
  assert.equal(response.status, 200, 'Published feed available without credentials');
  assert.match(response.headers.get('cache-control'), /no-store/);
  return (await response.json()).entries;
};
// Public pages are cached at the CDN for a minute and may be served stale once
// while they refresh, so give a publication change up to three minutes to show.
const settle = async (path, done) => {
  const deadline = Date.now() + 180000;
  for (;;) {
    const response = await get(path, target);
    const text = await response.text();
    if (done(response.status, text) || Date.now() > deadline) return { response, text };
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
};
const mentions = (path, text) => (path.startsWith('/api/search?') ? JSON.stringify(JSON.parse(text).results) : text).includes(slug);
let article, media;
try {
  const admin = await get('/_emdash/admin/');
  assert.equal(admin.status, 302, 'Admin requires native sign-in');
  assert.match(admin.headers.get('location'), /\/_emdash\/admin\/login/);
  assert.equal(admin.headers.has('www-authenticate'), false);
  assert.equal((await get('/_emdash/api/content/news')).status, 401, 'Editor API remains protected');
  assert.equal((await get(`${publicPrefix}media/backups/private.zip`)).status, 404);
  assert.equal((await get(`${publicPrefix}media/transfers/private.zip`)).status, 404);
  const initial = await feed();
  assert.ok(initial.length >= 30, 'Existing published news is present');
  const seed = await buildSeed({ fullTextSearch: false });
  article = await repository.create({ type: 'news', slug, data: {
    ...seed.content.news[0].data, title: slug, date: new Date().toISOString(), featured: true,
  } });
  assert.ok(!(await feed()).some(item => item.id === slug), 'Draft absent from feed');
  assert.equal((await get(`${publicPrefix}news/${slug}?_preview=invalid`)).status, 404, 'Draft body is private');
  if (target) assert.equal((await get(`/news/${slug}`, target)).status, 404, 'Draft is not on public site');
  const bytes = await readFile('public/images/dzaleka-digital-heritage.png');
  await storage.upload({ key, body: bytes, contentType: 'image/png' });
  media = await mediaRepository.create({ filename: key, storageKey: key, mimeType: 'image/png', size: bytes.length, status: 'ready' });
  const block = { _type: 'image', _key: 'public-image', asset: { _ref: media.id, provider: 'local', meta: { storageKey: key } }, alt: 'Connection check' };
  await repository.updateDraftAware('news', article.id, { data: {
    image: { provider: 'local', id: media.id, alt: 'Connection check', meta: { storageKey: key } },
    content: [...seed.content.news[0].data.content, block],
  } });
  assert.equal((await get(`${publicPrefix}media/${key}`)).status, 404, 'Draft upload is private');
  await repository.publish('news', article.id);
  const published = (await feed()).find(item => item.id === slug);
  assert.ok(published, 'Published article appears in feed');
  assert.equal(published.data.image, `${cmsOrigin}${publicPrefix}media/${key}`);
  const body = await get(`${publicPrefix}news/${slug}`);
  assert.equal(body.status, 200, 'Published body available');
  const html = await body.text();
  assert.ok(html.includes('data-dos-article'));
  assert.ok(html.includes(`${publicPrefix}media/${key}`), 'Inline media uses public delivery');
  const image = await get(`${publicPrefix}media/${key}`);
  assert.equal(image.status, 200);
  assert.deepEqual(Buffer.from(await image.arrayBuffer()), bytes);
  await repository.updateDraftAware('news', article.id, { data: { title: 'UNPUBLISHED PRIVATE EDIT' } });
  assert.equal((await feed()).find(item => item.id === slug).data.title, slug, 'Unpublished edit never leaks');
  if (target) {
    for (const path of [`/news/${slug}`, '/news', '/', '/api/search-index.json', '/api/rss', '/news-sitemap.xml', '/sitemap.xml', '/api/news', `/api/search?q=${slug}&collections=news`]) {
      const { response, text } = await settle(path, (status, body) => status === 200 && mentions(path, body));
      assert.equal(response.status, 200, path);
      assert.match(response.headers.get('cache-control'), /(?:^|,)\s*(?:no-store|max-age=0)\s*(?:,|$)/, `${path}: browsers check for publication changes`);
      assert.ok(mentions(path, text), `${path}: published article appears without a rebuild`);
      assert.ok(!text.includes('UNPUBLISHED PRIVATE EDIT'), `${path}: draft edit excluded`);
      if (path === `/news/${slug}`) {
        assert.ok(text.includes(`${cmsOrigin}${publicPrefix}media/${key}`), 'Public cover and inline image');
        assert.ok(text.includes(`https://services.dzaleka.com/news/${slug}`), 'Production canonical URL');
        assert.ok(!response.headers.get('x-robots-tag')?.includes('noindex'), 'Production article can be indexed');
      }
    }
  }
  await repository.unpublish('news', article.id);
  assert.ok(!(await feed()).some(item => item.id === slug));
  assert.equal((await get(`${publicPrefix}news/${slug}`)).status, 404);
  assert.equal((await get(`${publicPrefix}media/${key}`)).status, 404, 'Unpublished media is private again');
  if (target) {
    assert.equal((await settle(`/news/${slug}`, status => status === 404)).response.status, 404);
    for (const path of ['/api/search-index.json', '/api/news', `/api/search?q=${slug}&collections=news`]) {
      const { text } = await settle(path, (status, body) => !mentions(path, body));
      assert.ok(!mentions(path, text), `${path}: unpublished article removed`);
    }
  }
  console.log('Verified: published feed, draft privacy, edits, cover and inline images, unpublishing' + (target ? ', public pages, homepage, search, RSS and sitemaps.' : '.'));
} finally {
  if (article) { await repository.delete('news', article.id); await repository.permanentDelete('news', article.id); }
  if (media) await mediaRepository.delete(media.id);
  await storage.delete(key);
  await db.destroy();
  console.log('Removed the verification article and upload.');
}

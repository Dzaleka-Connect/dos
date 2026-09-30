import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { Kysely } from 'kysely';
import { createDialect } from 'emdash/db/sqlite';
import { ContentRepository, OptionsRepository, getPreviewUrl, MediaRepository } from 'emdash';
import { LocalStorage } from 'emdash/storage/local';
import { createStorage } from 'emdash/storage/s3';
import { createDialect as createPostgresDialect } from '../../src/lib/news/staging-postgres.mjs';
import { stagingOrigin, validateStagingRuntime } from './staging-env.mjs';
import { buildSeed } from './seed.mjs';

const staging = process.argv.includes('--staging');
if (staging) validateStagingRuntime();
const origin = staging ? stagingOrigin() : 'http://localhost:4322';
const headers = staging ? { Authorization: `Basic ${Buffer.from(`staging:${process.env.DOS_STAGING_PASSWORD}`).toString('base64')}` } : {};
const get = (path) => fetch(new URL(path, origin), { headers, redirect: 'manual', signal: AbortSignal.timeout(30000) });
const seed = await buildSeed();
for (const article of seed.content.news) {
  const response = await get(`/news/${encodeURIComponent(article.slug)}`);
  assert.equal(response.status, 200, article.slug);
  const html = await response.text();
  assert.ok(html.includes('rel="canonical"'), `${article.slug}: canonical`);
}
console.log(`Verified ${seed.content.news.length} original article URLs.`);
assert.equal((await get('/news/not-a-real-pilot-story')).status, 404);
assert.equal((await get('/news/category/not-a-category')).status, 404);
const unauthenticated = await get('/_emdash/api/content/news');
assert.ok([401, 403].includes(unauthenticated.status), 'Editor API requires authentication');

const db = new Kysely({ dialect: staging ? createPostgresDialect() : createDialect({ url: 'file:./.emdash-pilot/news.db' }) });
const repository = new ContentRepository(db);
const mediaRepository = new MediaRepository(db);
const storage = staging ? createStorage({}) : new LocalStorage({ directory: './.emdash-pilot/uploads', baseUrl: '/_emdash/api/media/file' });
const slug = `pilot-verification-${randomUUID()}`;
const key = `${slug}.png`;
let article;
let media;
try {
  article = await repository.create({ type: 'news', slug, data: { ...seed.content.news[0].data,
    title: slug, date: new Date().toISOString(), featured: true,
  } });
  assert.equal((await get(`/news/${slug}`)).status, 404, 'Draft must not be public');
  await get(`/news/${slug}?_preview=invalid`);
  const secret = await new OptionsRepository(db).get('emdash:preview_secret');
  assert.ok(typeof secret === 'string' && secret.length > 0, 'Preview secret initialized');
  const previewUrl = await getPreviewUrl({ collection: 'news', id: article.id, secret, expiresIn: '5m' });
  const preview = await get(previewUrl);
  assert.equal(preview.status, 200, 'Signed draft preview');
  assert.match(preview.headers.get('cache-control'), /no-store/);
  assert.match(preview.headers.get('x-robots-tag'), /noindex/);
  assert.ok((await preview.text()).includes('Draft preview.'));
  assert.equal((await get(`/news/${slug}?_preview=invalid`)).status, 404, 'Invalid token stays private');
  const expired = await getPreviewUrl({ collection: 'news', id: article.id, secret, expiresIn: -1 });
  assert.equal((await get(expired)).status, 404, 'Expired preview stays private');
  const unrelated = await repository.findBySlug('news', seed.content.news[0].slug);
  const wrongToken = await getPreviewUrl({ collection: 'news', id: unrelated.id, secret, expiresIn: '5m' });
  assert.equal((await get(`/news/${slug}${new URL(wrongToken, origin).search}`)).status, 404, 'Token cannot preview another draft');

  for (const path of ['/news', '/', '/api/search-index.json', '/api/rss', '/news-sitemap.xml']) {
    const response = await get(path);
    assert.equal(response.status, 200, path);
    assert.ok(!(await response.text()).includes(slug), `${path}: draft excluded`);
  }
  await repository.publish('news', article.id);
  for (const path of [`/news/${slug}`, '/news', '/', '/api/search-index.json', '/api/rss', '/news-sitemap.xml']) {
    const response = await get(path);
    assert.equal(response.status, 200, path);
    assert.ok((await response.text()).includes(slug), `${path}: published article included`);
  }
  const bytes = await readFile('public/images/dzaleka-digital-heritage.png');
  await storage.upload({ key, body: bytes, contentType: 'image/png' });
  media = await mediaRepository.create({ filename: key, storageKey: key, mimeType: 'image/png', size: bytes.length, status: 'ready' });
  await repository.updateDraftAware('news', article.id, { data: { image: {
    provider: 'local', id: media.id, mimeType: 'image/png', alt: 'Pilot image verification', meta: { storageKey: key },
  } } });
  assert.ok(!(await (await get(`/news/${slug}`)).text()).includes(key), 'Draft image stays unpublished');
  assert.ok((await (await get(previewUrl)).text()).includes(key), 'Signed preview shows draft image');
  await repository.publish('news', article.id);
  assert.ok((await (await get(`/news/${slug}`)).text()).includes(key), 'Published image displayed');
  const image = await get(`/_emdash/api/media/file/${key}`);
  assert.equal(image.status, 200);
  assert.match(image.headers.get('content-type'), /image\/png/);
  assert.deepEqual(Buffer.from(await image.arrayBuffer()), bytes, 'Delivered image must match the uploaded bytes');
  await repository.unpublish('news', article.id);
  assert.equal((await get(`/news/${slug}`)).status, 404);
  assert.ok(!(await (await get('/api/search-index.json')).text()).includes(slug));
  console.log('Passed: draft privacy, signed preview, publication, search/feed/homepage updates, image replacement and unpublishing.');
  if (staging) {
    await repository.schedule('news', article.id, new Date(Date.now() + 5000).toISOString());
    console.log('Waiting for Netlify scheduled maintenance to publish the disposable article.');
    const deadline = Date.now() + 180000;
    while (Date.now() < deadline) {
      if ((await repository.findById('news', article.id))?.status === 'published') break;
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
    assert.equal((await repository.findById('news', article.id))?.status, 'published', 'Netlify schedule must publish due content');
    assert.equal((await get(`/news/${slug}`)).status, 200);
    console.log('Passed: automatic scheduled publication on Netlify.');
  }
} finally {
  if (article) { await repository.delete('news', article.id); await repository.permanentDelete('news', article.id); }
  if (media) await mediaRepository.delete(media.id);
  await storage.delete(key);
  await db.destroy();
}

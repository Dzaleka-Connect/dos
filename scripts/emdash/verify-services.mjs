import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { parseHTML } from 'linkedom';
import { Kysely } from 'kysely';
import { ContentRepository, OptionsRepository, getPreviewUrl, MediaRepository } from 'emdash';
import { createStorage } from 'emdash/storage/s3';
import { createDialect } from '../../src/lib/news/staging-postgres.mjs';
import { buildSeed } from './seed.mjs';
import { cmsOrigin, publicPrefix } from '../../src/lib/news/public-contract.mjs';

const target = process.argv.find(arg => arg.startsWith('--origin='))?.slice(9);
assert(!target || /^https:\/\/[a-z0-9.-]+$/.test(target), 'Use an HTTPS deployment origin');
const get = (path, origin = cmsOrigin, headers = {}) => fetch(new URL(path, origin), { headers, redirect: 'manual', signal: AbortSignal.timeout(30000) });
const feed = async () => {
  const response = await get(`${publicPrefix}services.json`);
  assert.equal(response.status, 200, 'Services feed');
  assert.match(response.headers.get('cache-control'), /no-store/);
  return (await response.json()).entries;
};
const seed = await buildSeed({ fullTextSearch: false });
const initial = await feed();
for (const entry of seed.content.services) assert(initial.some(item => item.id === entry.slug), `Existing listing: ${entry.slug}`);
console.log(`Verified all ${seed.content.services.length} original listings in the CMS feed.`);

if (target) {
  const page = async path => {
    const response = await get(path, target);
    assert.equal(response.status, 200, path);
    assert.equal(response.headers.get('netlify-vary'), 'query', `${path}: separate cache entries for filters`);
    return parseHTML(await response.text()).document;
  };
  const first = await page('/services');
  const next = [...first.querySelectorAll('nav[aria-label="Pagination"] a')].find(a => a.textContent.trim() === 'Next');
  assert.equal(next?.getAttribute('href'), '/services/2');
  const second = await page('/services/2');
  // The heading lives inside the results header, so scope through the section.
  const cards = doc => [...doc.querySelectorAll('section[aria-labelledby="service-results"] article h3 a')].map(a => a.getAttribute('href'));
  assert.equal(cards(first).length, 6); assert.equal(cards(second).length, 6);
  assert(cards(first).every(link => !cards(second).includes(link)), 'Second page contains different services');
  assert.equal([...second.querySelectorAll('nav[aria-label="Pagination"] a')].find(a => a.textContent.trim() === 'Previous')?.getAttribute('href'), '/services');
  const filtered = await page('/services?category=Education&sort=name');
  const filteredNext = [...filtered.querySelectorAll('nav[aria-label="Pagination"] a')].find(a => a.textContent.trim() === 'Next')?.getAttribute('href');
  assert.equal(filteredNext, '/services/2?category=Education&sort=name');
  await page(filteredNext);
  await page('/services/category/education/2');
  const redirect = await get('/services?page=2&sort=name', target);
  assert.equal(redirect.status, 301); assert.equal(new URL(redirect.headers.get('location'), target).pathname, '/services/2');
  assert.equal(new URL(redirect.headers.get('location'), target).search, '?sort=name');
  assert.equal((await get('/services/99999', target)).status, 404);
  const query = await page('/services?q=refan');
  assert.equal(cards(query).length, 1, 'Search uses the entire directory');
  assert.notDeepEqual(cards(query), cards(first), 'Search is not served the unfiltered cached page');
  for (const path of ['/services/register', '/services/update-request']) {
    let response = await get(path, target);
    if (response.status === 301) response = await get(response.headers.get('location'), target);
    assert.equal(response.status, 200);
    const doc = parseHTML(await response.text()).document;
    assert.equal(doc.querySelector(path.endsWith('register') ? '#registrationForm' : '#updateForm').getAttribute('action'), path.endsWith('register') ? '/api/submissions?form=service-registration' : '/api/submissions?form=service-correction');
  }
  if (process.argv.includes('--all-listings')) {
    for (let start = 0; start < initial.length; start += 6) {
      await Promise.all(initial.slice(start, start + 6).map(async entry => {
        const response = await get(`/services/${entry.id}`, target);
        assert.equal(response.status, 200, entry.id);
        const doc = parseHTML(await response.text()).document;
        assert(doc.querySelector('h1')?.textContent.includes(entry.data.title), entry.id);
      }));
    }
    console.log(`Verified ${initial.length} service detail pages.`);
  }
  console.log('Verified path pagination, filters, search, legacy query redirects, category paging and Formspree form destinations.');
}
if (!process.argv.includes('--workflow')) process.exit(0);

const db = new Kysely({ dialect: createDialect() });
const repository = new ContentRepository(db);
const mediaRepository = new MediaRepository(db);
const storage = createStorage({});
const slug = `service-verification-${randomUUID()}`;
const key = `${slug}.png`;
const mentions = (path, body) => {
  if (path.startsWith('/api/search?')) return JSON.stringify(JSON.parse(body).results).includes(slug);
  if (path.startsWith('/services?')) return [...parseHTML(body).document.querySelectorAll('section[aria-labelledby="service-results"] article h3 a')]
    .some(link => link.getAttribute('href') === `/services/${slug}`);
  return body.includes(slug);
};
const auth = { Authorization: `Basic ${Buffer.from(`staging:${process.env.DOS_STAGING_PASSWORD}`).toString('base64')}` };
const settle = async (path, accept) => {
  const deadline = Date.now() + 180000;
  for (;;) {
    const response = await get(path, target); const body = await response.text();
    if (accept(response.status, body)) return body;
    assert(Date.now() < deadline, `${path}: publication change did not appear`);
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
};
let service, media;
try {
  service = await repository.create({ type: 'services', slug, data: {
    ...seed.content.services[0].data, title: slug, featured: true, last_updated: new Date().toISOString(),
    contact_email: 'qa@example.org', contact_phone: '+265000000000', contact_hours: 'Mon-Fri: 08:00 - 16:00',
    access_fees: 'Free', access_languages: 'English\nFrench', confirmation_by: 'QA provider', confirmation_date: new Date().toISOString(),
  } });
  assert(!(await feed()).some(item => item.id === slug));
  assert.equal((await get(`${publicPrefix}services/${slug}?_preview=invalid`)).status, 404);
  await get(`/services/${slug}?_preview=invalid`, cmsOrigin, auth);
  const secret = await new OptionsRepository(db).get('emdash:preview_secret');
  const previewUrl = await getPreviewUrl({ collection: 'services', id: service.id, secret, expiresIn: '5m' });
  const preview = await get(previewUrl, cmsOrigin, auth);
  assert.equal(preview.status, 200, 'Signed service preview');
  assert.match(preview.headers.get('cache-control'), /no-store/);
  assert.match(preview.headers.get('x-robots-tag'), /noindex/);
  assert((await preview.text()).includes('Draft preview.'));
  const bytes = await readFile('public/images/dzaleka-digital-heritage.png');
  await storage.upload({ key, body: bytes, contentType: 'image/png' });
  media = await mediaRepository.create({ filename: key, storageKey: key, mimeType: 'image/png', size: bytes.length, status: 'ready' });
  await repository.updateDraftAware('services', service.id, { data: { logo: { provider: 'local', id: media.id, meta: { storageKey: key } } } });
  assert.equal((await get(`${publicPrefix}media/${key}`)).status, 404, 'Draft logo remains private');
  await repository.publish('services', service.id);
  const published = (await feed()).find(item => item.id === slug);
  assert.equal(published.data.logo, `${cmsOrigin}${publicPrefix}media/${key}`);
  assert.deepEqual(published.data.access.languages, ['English', 'French']);
  assert.equal(published.data.providerConfirmation.by, 'QA provider');
  assert.equal((await get(`${publicPrefix}media/${key}`)).status, 200);
  await repository.updateDraftAware('services', service.id, { data: { title: 'PRIVATE UNPUBLISHED SERVICE EDIT' } });
  assert.equal((await feed()).find(item => item.id === slug).data.title, slug);
  if (target) {
    for (const path of [`/services/${slug}`, `/services?q=${slug}`, '/api/services', '/api/search-index.json', `/api/search?q=${slug}&collections=services`, '/sitemap.xml']) {
      const text = await settle(path, (status, body) => status === 200 && mentions(path, body));
      assert(!text.includes('PRIVATE UNPUBLISHED SERVICE EDIT'), path);
    }
    const expectedCount = String((await feed()).length);
    await settle('/datasets/services-directory', (status, body) => status === 200 &&
      [...parseHTML(body).document.querySelectorAll('strong')].some(node => node.textContent === expectedCount));
    console.log('Published CMS service reached the public directory, detail, API, search, sitemap and dataset without a rebuild.');
  }
  await repository.unpublish('services', service.id);
  assert(!(await feed()).some(item => item.id === slug));
  assert.equal((await get(`${publicPrefix}media/${key}`)).status, 404);
  if (target) {
    await settle(`/services/${slug}`, status => status === 404);
    for (const path of [`/services?q=${slug}`, '/api/services', '/api/search-index.json', `/api/search?q=${slug}&collections=services`, '/sitemap.xml']) {
      await settle(path, (status, body) => status === 200 && !mentions(path, body));
    }
  }
  console.log('Verified service drafts, signed preview, provider details, uploaded logo, unpublished edits and unpublishing.');
} finally {
  if (service) { await repository.delete('services', service.id); await repository.permanentDelete('services', service.id); }
  if (media) await mediaRepository.delete(media.id);
  await storage.delete(key);
  await db.destroy();
  console.log('Removed the temporary verification service and logo.');
}

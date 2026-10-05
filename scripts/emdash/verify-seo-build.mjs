import assert from 'node:assert/strict';
import { cp, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseHTML } from 'linkedom';
import { buildSeed } from './seed.mjs';
import { cmsOrigin, publicPrefix, publicMetadata } from '../../src/lib/news/public-contract.mjs';

// Run the actual public Netlify function against a controlled CMS boundary.
// No live records, form submissions, network access or CMS credentials are needed.
const seed = await buildSeed();
const fixtures = Object.fromEntries(Object.entries(seed.content).map(([collection, items]) => [collection,
  items.filter(item => item.status === 'published').map(publicMetadata[collection]),
]));
const targets = Object.entries(fixtures).map(([collection, entries]) => {
  const entry = entries[0];
  entry.id = collection === 'events' ? '2026-audit-event' : `${collection}-audit-entry`;
  entry.seo = { title: `Exact ${collection} title`, description: `Exact ${collection} description. ` + 'A complete editorial sentence. '.repeat(8),
    image: `${cmsOrigin}${publicPrefix}media/seo-test.webp`, canonical: `preferred/${collection}`, noIndex: true };
  if (collection === 'events') delete entry.data.image;
  return { collection, entry };
});
const realFetch = globalThis.fetch;
globalThis.fetch = async (input) => {
  const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url);
  assert.equal(url.origin, cmsOrigin, `Unexpected network request: ${url.origin}`);
  const path = url.pathname.slice(publicPrefix.length);
  const collection = path.replace(/\.json$/, '');
  if (fixtures[collection]) return Response.json({ version: 1, entries: fixtures[collection] });
  return new Response('<html><body><div data-dos-article><p>Published body fixture.</p></div></body></html>', { headers: { 'Content-Type': 'text/html' } });
};
const bundle = await mkdtemp(join(tmpdir(), 'dos-seo-bundle-'));
try {
  await cp('.netlify/v1/functions/ssr', bundle, { recursive: true });
  const { default: handler } = await import(pathToFileURL(join(bundle, 'ssr.mjs')).href);
  const request = path => handler(new Request(`https://services.dzaleka.com${path}`), { ip: '127.0.0.1' });
  for (const { collection, entry } of targets) {
    const path = `/${collection}/${entry.id}`;
    const response = await request(path);
    assert.equal(response.status, 200, path);
    const { document } = parseHTML(await response.text());
    const meta = name => document.querySelector(`meta[name="${name}"],meta[property="${name}"]`)?.getAttribute('content');
    assert.equal(document.title, entry.seo.title, `${collection}: exact editorial title`);
    for (const name of ['description', 'og:description', 'twitter:description']) assert.equal(meta(name), entry.seo.description.trim(), `${collection}: ${name}`);
    for (const name of ['og:title', 'twitter:title']) assert.equal(meta(name), entry.seo.title, `${collection}: ${name}`);
    for (const name of ['og:image', 'twitter:image']) assert.equal(meta(name), entry.seo.image, `${collection}: ${name}`);
    assert.equal(meta('og:url'), `https://services.dzaleka.com/preferred/${collection}`);
    assert.equal(document.querySelector('link[rel="canonical"]')?.getAttribute('href'), `https://services.dzaleka.com/preferred/${collection}`);
    assert.equal(meta('robots'), 'noindex, nofollow');
    assert.equal(document.querySelector('h1')?.textContent.trim(), entry.data.title, `${collection}: visible heading stays the content title`);
  }
  const sitemapResponse = await request('/sitemap.xml');
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  for (const { collection, entry } of targets) assert(!sitemap.includes(`/${collection}/${entry.id}</loc>`), `${collection}: hidden from sitemap`);
  assert.equal((await request('/events')).status, 200, 'An event without an image must not break the directory');
  assert.equal((await request('/events/missing-event')).status, 404, 'Missing event returns an actual 404');
  for (const { collection, entry } of targets) {
    delete entry.seo;
    const response = await request(`/${collection}/${entry.id}`);
    assert.equal(response.status, 200);
    const { document } = parseHTML(await response.text());
    assert(!document.querySelector('meta[name="robots"]')?.getAttribute('content').includes('noindex'));
    assert.equal(document.querySelector('link[rel="canonical"]')?.getAttribute('href'), `https://services.dzaleka.com/${collection}/${entry.id}`);
    assert(document.querySelector('meta[property="og:image"]')?.getAttribute('content'), `${collection}: fallback social image`);
  }
  console.log('Verified rendered SEO fields, social cards, canonical URLs, noindex, sitemap exclusion and fallback metadata for all four CMS collections; year-prefixed event slugs, missing images and real event 404s.');
} finally {
  globalThis.fetch = realFetch;
  await rm(bundle, { recursive: true, force: true });
}

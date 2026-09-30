import assert from 'node:assert/strict';
import { readFile, cp, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const bundle = await mkdtemp(join(tmpdir(), 'dos-public-bundle-'));
try {
  await cp('.netlify/v1/functions/ssr', bundle, { recursive: true });
  const { default: handler } = await import(pathToFileURL(join(bundle, 'ssr.mjs')).href);
  const feed = await fetch('https://cms.dzaleka.com/_dos/public/news.json');
  assert.equal(feed.status, 200);
  const { entries } = await feed.json();
  const paths = ['/', '/news', `/news/${entries[0].id}`, '/news/category/news', '/api/search-index.json', '/api/news', '/sitemap.xml', '/news-sitemap.xml'];
  for (const path of paths) {
    const response = await handler(new Request('https://services.dzaleka.com' + path), { ip: '127.0.0.1' });
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get('cache-control'), /no-store/);
    const body = await response.text();
    assert.ok(!response.headers.get('x-robots-tag')?.includes('noindex'));
    assert.ok(!body.includes('Draft preview.'));
  }
  assert.equal((await handler(new Request('https://services.dzaleka.com/news/not-a-real-story'), { ip: '127.0.0.1' })).status, 404);
  const middleware = await readFile('.netlify/build/virtual_astro_middleware.mjs', 'utf8');
  assert.ok(!middleware.includes('createScheduler: null'), 'Public site must not bundle CMS runtime');
  console.log(`Verified ${paths.length} public routes in an isolated function bundle without CMS credentials.`);
} finally { await rm(bundle, { recursive: true, force: true }); }

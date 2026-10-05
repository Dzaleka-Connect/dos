import assert from 'node:assert/strict';
import { randomUUID, createHmac } from 'node:crypto';
import { cp, mkdtemp, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { Kysely } from 'kysely';
import { ContentRepository, OptionsRepository, MediaRepository, handleContentCreate, handleContentPublish, getPreviewUrl, createRedirectAccess } from 'emdash';
import { generatePrefixedToken } from '@emdash-cms/auth';
import { validateBlocks } from '@emdash-cms/blocks/server';
import { createStorage } from 'emdash/storage/s3';
import { createDialect } from '../../src/lib/news/staging-postgres.mjs';
import { buildSeed } from './seed.mjs';

const live = process.argv.includes('--live');
const publicOrigin = process.argv.find(arg => arg.startsWith('--public-origin='))?.slice(16);
assert(!publicOrigin || /^https:\/\/[a-z0-9.-]+$/.test(publicOrigin), 'Use an HTTPS public deployment origin');
const origin = 'https://cms.dzaleka.com';
let bundle, handler;
if (!live) {
  bundle = await mkdtemp(join(tmpdir(), 'dos-integration-'));
  await cp('deployment/emdash/.netlify/v1/functions/ssr', bundle, { recursive: true });
  ({ default: handler } = await import(pathToFileURL(join(bundle, 'ssr.mjs')).href));
}
const request = (path, options = {}) => {
  const req = new Request(new URL(path, origin), { ...options, redirect: 'manual', signal: AbortSignal.timeout(45000) });
  return live ? fetch(req) : handler(req, { ip: '127.0.0.1' });
};
const db = new Kysely({ dialect: createDialect() });
const content = new ContentRepository(db), redirects = createRedirectAccess(db, true), mediaRepo = new MediaRepository(db);
const storage = createStorage({});
const prefix = `integration-check-${randomUUID()}`;
const items = [], rules = [], submissions = [];
let tokenId, media;
const key = `${prefix}.png`;
try {
  const user = await db.selectFrom('users').select('id').where('role', '>=', 50).where('disabled', '=', 0).executeTakeFirstOrThrow();
  const token = generatePrefixedToken('ec_pat_');
  tokenId = randomUUID();
  await db.insertInto('_emdash_api_tokens').values({ id: tokenId, name: prefix, token_hash: token.hash, prefix: token.prefix,
    user_id: user.id, scopes: JSON.stringify(['admin']), expires_at: new Date(Date.now() + 900000).toISOString() }).execute();
  const admin = { Authorization: `Bearer ${token.raw}`, 'Content-Type': 'application/json' };
  const basic = { Authorization: `Basic ${Buffer.from(`staging:${process.env.DOS_STAGING_PASSWORD}`).toString('base64')}` };
  const route = '/_emdash/api/plugins/dos-submissions/';
  assert.equal((await request(route + 'admin')).status, 401, 'Inbox is private');
  const unsigned = await request(route + 'receive', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'text/plain' }, body: '{}' });
  assert.equal((await unsigned.json()).data?.accepted, false, 'Unsigned submissions rejected');
  const input = { form: 'service-registration', sourcePath: '/services/register', test: true, clientHash: 'f'.repeat(64), fields: {
    orgName: prefix, orgDescription: 'Temporary automated verification', serviceDescription: 'Temporary verification draft', serviceCategory: 'education', email: 'test@example.org', phone: '+265123456', availability: ['Monday'],
  } };
  const body = JSON.stringify(input), timestamp = String(Date.now());
  const signature = createHmac('sha256', process.env.DOS_SUBMISSION_SECRET).update(`${timestamp}.${body}`).digest('hex');
  const send = () => request(route + 'receive', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'text/plain', 'x-dos-timestamp': timestamp, 'x-dos-signature': signature }, body });
  const saved = await (await send()).json();
  assert.equal(saved.data?.accepted, true, JSON.stringify(saved));
  submissions.push(saved.data.id);
  const row = await db.selectFrom('_dos_submissions').selectAll().where('id', '=', saved.data.id).executeTakeFirstOrThrow();
  items.push(['services', row.content_id]);
  assert.equal(row.delivery, 'test', 'No synthetic message is forwarded to Formspree');
  assert.equal((await content.findById('services', row.content_id)).status, 'draft');
  assert.equal((await (await send()).json()).data.id, row.id, 'Retry returns the same submission');
  if (publicOrigin) {
    const fields = { ...input.fields, orgName: `${prefix}-public`, orgType: 'NGO' };
    const payload = JSON.stringify(fields), time = String(Date.now());
    const signature = createHmac('sha256', process.env.DOS_SUBMISSION_SECRET).update(`${time}.${payload}`).digest('hex');
    const response = await fetch(`${publicOrigin}/api/submissions?form=service-registration`, {
      method: 'POST', body: payload, headers: { Origin: publicOrigin, 'Content-Type': 'application/json', Accept: 'application/json', 'x-dos-timestamp': time, 'x-dos-test-signature': signature },
    });
    const result = await response.json();
    assert.equal(response.status, 200, JSON.stringify(result));
    submissions.push(result.id);
    const saved = await db.selectFrom('_dos_submissions').selectAll().where('id', '=', result.id).executeTakeFirstOrThrow();
    items.push(['services', saved.content_id]);
    assert.equal(saved.delivery, 'test');
    assert.equal((await content.findById('services', saved.content_id)).status, 'draft');
    console.log('Verified public form → signed relay → private CMS inbox and service draft, without notifying Formspree.');
  }
  const inbox = await (await request(route + 'admin', { method: 'POST', headers: admin, body: JSON.stringify({ type: 'page_load', page: '/inbox' }) })).json();
  assert(inbox.success, JSON.stringify(inbox));
  assert(validateBlocks(inbox.data.blocks).valid, JSON.stringify(validateBlocks(inbox.data.blocks)));
  assert(JSON.stringify(inbox.data).includes(prefix), 'The draft is visible in the editor inbox');
  const opened = await (await request(route + 'admin', { method: 'POST', headers: admin, body: JSON.stringify({ type: 'block_action', action_id: 'open', value: row.id }) })).json();
  assert(validateBlocks(opened.data.blocks).valid, JSON.stringify(validateBlocks(opened.data.blocks)));
  assert(JSON.stringify(opened.data).includes(row.content_id), 'Inbox links to the draft editor');
  await request(route + 'admin', { method: 'POST', headers: admin, body: JSON.stringify({ type: 'block_action', action_id: 'reviewed', value: row.id }) });
  assert((await db.selectFrom('_dos_submissions').select('reviewed_at').where('id', '=', row.id).executeTakeFirst()).reviewed_at);
  console.log('Verified signed receive, duplicate retries, private draft, authenticated Block Kit inbox and reviewed state.');

  const settings = await request('/_dos/public/site.json?path=/about');
  assert.equal(settings.status, 200);
  assert.equal((await settings.json()).version, 1);
  for (const rule of [
    { source: `/${prefix}-old`, destination: '/services', type: 301 },
    { source: `/${prefix}-gone`, destination: '', type: 410 },
    { source: `/${prefix}-legal`, destination: '', type: 451 },
    { source: `/${prefix}-disabled`, destination: '/services', type: 302, enabled: false },
    { source: `/${prefix}-pattern/[...path]`, destination: '/services/[...path]', type: 302, isPattern: true },
  ]) rules.push((await redirects.create(rule)).redirect);
  const waitFor = async (path, predicate) => {
    for (let attempt = 0; attempt < 18; attempt++) {
      const response = await request(path), data = await response.json();
      if (predicate(data)) return data;
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    throw new Error(`Timed out checking ${path}`);
  };
  await waitFor(`/_dos/public/site.json?path=/${prefix}-old`, data => data.redirect?.status === 301 && data.redirect?.location === '/services');
  if (publicOrigin) {
    const response = await fetch(`${publicOrigin}/${prefix}-old`, { redirect: 'manual' });
    assert.equal(response.status, 301);
    assert.equal(new URL(response.headers.get('location'), publicOrigin).pathname, '/services');
  }
  for (const [suffix, status] of [['gone', 410], ['legal', 451], ['pattern/example', 302]]) {
    const data = await (await request(`/_dos/public/site.json?path=/${prefix}-${suffix}`)).json();
    assert.equal(data.redirect?.status, status, suffix);
    if (status === 302) assert.equal(data.redirect.location, '/services/example');
  }
  assert.equal((await (await request(`/_dos/public/site.json?path=/${prefix}-disabled`)).json()).redirect, undefined);
  console.log('Verified native exact/pattern redirects, disabled rules and HTTP 410/451.');

  const bytes = await readFile('public/images/dzaleka-digital-heritage.png');
  await storage.upload({ key, body: bytes, contentType: 'image/png' });
  media = await mediaRepo.create({ filename: key, storageKey: key, mimeType: 'image/png', size: bytes.length, status: 'ready' });
  const seed = await buildSeed({ fullTextSearch: false });
  for (const collection of ['news', 'events', 'jobs', 'services']) {
    const slug = `${prefix}-${collection}`;
    const created = await handleContentCreate(db, collection, { slug, status: 'draft', data: { ...seed.content[collection][0].data, title: prefix },
      seo: { title: 'Exact editor SEO title', description: 'Editor description', image: key, canonical: '/preferred-test-url', noIndex: true } });
    assert(created.success, JSON.stringify(created));
    const item = created.data.item;
    items.push([collection, item.id]);
    await request(`/${collection}/${slug}?_preview=invalid`, { headers: basic });
    const secret = await new OptionsRepository(db).get('emdash:preview_secret');
    const previewUrl = await getPreviewUrl({ collection, id: item.id, secret, expiresIn: '5m' });
    const preview = await request(previewUrl, { headers: basic });
    assert.equal(preview.status, 200, `${collection} signed preview`);
    assert.match(await preview.text(), /Draft preview\./);
    assert.match(preview.headers.get('cache-control'), /no-store/);
    const published = await handleContentPublish(db, collection, item.id);
    assert(published.success, JSON.stringify(published));
    const feed = await (await request(`/_dos/public/${collection}.json`)).json();
    const entry = feed.entries.find(entry => entry.id === slug);
    assert.equal(entry?.seo?.title, 'Exact editor SEO title');
    assert.equal(entry.seo.image, `${origin}/_dos/public/media/${key}`);
    if (publicOrigin) {
      const response = await fetch(`${publicOrigin}/${collection}/${slug}`);
      assert.equal(response.status, 200);
      const html = await response.text();
      assert(html.includes('<title>Exact editor SEO title</title>'), `${collection}: actual public SEO title`);
      assert(html.includes(`${origin}/_dos/public/media/${key}`), `${collection}: actual public SEO image`);
    }
  }
  const image = await request(`/_dos/public/media/${key}`);
  assert.equal(image.status, 200, 'Published SEO-only image available');
  assert.equal(image.headers.get('x-robots-tag'), 'index, follow', 'Public media can be indexed');
  assert.equal((await request(`/_emdash/api/media/file/${key}`)).status, 401, 'Raw CMS media remains private');
  console.log('Verified signed previews and published SEO fields for all four collections, plus SEO-only uploaded media.');
} catch (error) {
  console.error(error);
  throw error;
} finally {
  for (const [collection, id] of items) { await content.delete(collection, id); await content.permanentDelete(collection, id); }
  for (const id of submissions) await db.deleteFrom('_dos_submissions').where('id', '=', id).execute();
  for (const rule of rules) await redirects.delete(rule.id, { _rev: (await redirects.get(rule.id))._rev });
  if (media) await mediaRepo.delete(media.id);
  await storage.delete(key);
  if (tokenId) await db.deleteFrom('_emdash_api_tokens').where('id', '=', tokenId).execute();
  await db.destroy();
  if (bundle) await rm(bundle, { recursive: true, force: true });
  console.log('Temporary verification content, rules, media, inbox entries and token removed.');
}

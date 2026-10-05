import assert from 'node:assert/strict';
import { randomUUID, createHmac } from 'node:crypto';
import { cp, mkdtemp, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, extname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createServer } from 'node:http';
import { Kysely } from 'kysely';
import { generatePrefixedToken } from '@emdash-cms/auth';
import { createDialect } from '../../src/lib/news/staging-postgres.mjs';

const live = process.argv.includes('--live'), browserTest = process.argv.includes('--browser');
const publicOrigin = process.argv.find(v => v.startsWith('--public-origin='))?.slice(16);
const cmsOrigin = process.argv.find(v => v.startsWith('--cms-origin='))?.slice(13) || 'https://cms.dzaleka.com';
const db = new Kysely({ dialect: createDialect() }), prefix = `insights-check-${randomUUID().slice(0, 8)}`;
const linkIds = [], eventIds = [], tokenIds = [];
let bundle, handler, server, browser;
if (!live) {
  bundle = await mkdtemp(join(tmpdir(), 'dos-insights-'));
  await cp('deployment/emdash/.netlify/v1/functions/ssr', bundle, { recursive: true });
  ({ default: handler } = await import(pathToFileURL(join(bundle, 'ssr.mjs')).href));
}
const request = async (path, options = {}) => {
  const req = new Request(new URL(path, cmsOrigin), { ...options, redirect: 'manual', signal: AbortSignal.timeout(45000) });
  return live ? fetch(req) : handler(req, { ip: '127.0.0.1' });
};
const route = '/_emdash/api/plugins/dos-insights/';
try {
  const user = await db.selectFrom('users').select('id').where('role', '>=', 50).where('disabled', '=', 0).executeTakeFirstOrThrow();
  const token = generatePrefixedToken('ec_pat_'), tokenId = randomUUID(); tokenIds.push(tokenId);
  await db.insertInto('_emdash_api_tokens').values({ id: tokenId, name: prefix, token_hash: token.hash, prefix: token.prefix, user_id: user.id, scopes: JSON.stringify(['admin']), expires_at: new Date(Date.now() + 900000).toISOString() }).execute();
  const headers = { Authorization: `Bearer ${token.raw}`, 'Content-Type': 'application/json' };
  const restricted = generatePrefixedToken('ec_pat_'), restrictedId = randomUUID(); tokenIds.push(restrictedId);
  await db.insertInto('_emdash_api_tokens').values({ id: restrictedId, name: prefix, token_hash: restricted.hash, prefix: restricted.prefix, user_id: user.id, scopes: JSON.stringify(['content:read']), expires_at: new Date(Date.now() + 900000).toISOString() }).execute();
  assert.equal((await request(route + 'links', { headers: { Authorization: `Bearer ${restricted.raw}` } })).status, 403, 'Content-only tokens cannot access plugin administration');

  const admin = async (name, body) => {
    const res = await request(route + name, { headers, ...(body === undefined ? {} : { method: 'POST', body: JSON.stringify(body) }) });
    const result = await res.json(); assert.equal(res.status, 200, JSON.stringify(result)); assert.equal(result.success, true, JSON.stringify(result)); return result.data;
  };
  for (const name of ['links', 'report', 'settings']) assert.equal((await request(route + name)).status, 401, `${name} must be private`);
  const forged = await request(route + 'receive', { method: 'POST', headers: { 'Content-Type': 'text/plain', Origin: cmsOrigin }, body: '{}' });
  assert.equal((await forged.json()).data.ok, false);
  const link = { slug: prefix, title: prefix, destination: 'https://example.org/scholarship', enabled: true, tags: 'verification', source: 'whatsapp', medium: 'social', campaign: prefix, expires_at: '' };
  let saved = await admin('save', { link }); assert.equal(saved.ok, true, JSON.stringify(saved)); linkIds.push(saved.link.id);
  const signed = async input => {
    const body = JSON.stringify({ domain: 'dos-insights-v1', input }), timestamp = String(Date.now());
    const response = await request(route + 'receive', { method: 'POST', headers: { 'Content-Type': 'text/plain', Origin: cmsOrigin, 'x-dos-timestamp': timestamp, 'x-dos-signature': createHmac('sha256', process.env.DOS_SUBMISSION_SECRET).update(`${timestamp}.${body}`).digest('hex') }, body });
    assert.equal(response.status, 200); return (await response.json()).data;
  };
  const now = new Date(), today = new Date(now.getTime() + 7200000).toISOString().slice(0, 10);
  const event = { id: randomUUID(), at: now.toISOString(), day: today, visitor: createHmac('sha256', prefix).update('verification').digest('hex'), name: 'pageview', path: `/${prefix}`, referrer: 'example.org', target: '', source: '', medium: '', campaign: prefix, device: 'Desktop', browser: 'Chrome', link_id: '' };
  eventIds.push(event.id); assert.equal((await signed({ operation: 'event', event })).recorded, true); await signed({ operation: 'event', event });
  assert.equal(Number((await db.selectFrom('_dos_events').select(({ fn }) => fn.countAll().as('n')).where('id', '=', event.id).executeTakeFirstOrThrow()).n), 1);
  const click = { ...event, id: randomUUID(), name: 'link_click' }; eventIds.push(click.id);
  const resolved = await signed({ operation: 'resolve', slug: prefix, event: click });
  assert.equal(resolved.status, 302); assert.match(resolved.destination, /utm_source=whatsapp/);
  const report = await admin(`report?from=${today}&to=${today}&campaign=${prefix}`); assert.equal(Number(report.totals.events), 2);
  saved = await admin('save', { id: saved.link.id, revision: 1, link: { ...link, destination: 'https://example.org/updated' } }); assert.equal(saved.ok, true);
  assert.match((await signed({ operation: 'resolve', slug: prefix })).destination, /updated/);
  assert.equal((await admin('save', { id: saved.link.id, revision: 1, link })).ok, false, 'Stale edit must fail');
  await admin('save', { id: saved.link.id, revision: 2, link: { ...link, enabled: false } });
  assert.equal((await signed({ operation: 'resolve', slug: prefix })).status, 410);
  await admin('save', { id: saved.link.id, revision: 3, link });
  if (publicOrigin) {
    const publicRequest = (path, init = {}) => fetch(new URL(path, publicOrigin), { ...init, redirect: 'manual', signal: AbortSignal.timeout(20000) });
    const redirect = await publicRequest(`/go/${prefix}`, { headers: { 'User-Agent': 'DzalekaVerificationBot' } });
    assert.equal(redirect.status, 302); assert.match(redirect.headers.get('location'), /utm_source=whatsapp/); assert.match(redirect.headers.get('cache-control'), /no-store/);
    assert.equal((await publicRequest('/go/not-a-real-verification-link')).status, 404);
    const browserInput = { id: randomUUID(), name: 'pageview', path: `/${prefix}`, referrer: 'https://example.org/private?secret=discard', target: '', source: 'verification', medium: 'test', campaign: prefix };
    eventIds.push(browserInput.id);
    const collectHeaders = { Origin: publicOrigin, 'Content-Type': 'text/plain', 'User-Agent': 'Mozilla/5.0 Chrome/130 Safari/537.36' };
    const collected = await publicRequest('/api/analytics/collect', { method: 'POST', headers: collectHeaders, body: JSON.stringify(browserInput) });
    assert.equal(collected.status, 204);
    const stored = await db.selectFrom('_dos_events').selectAll().where('id', '=', browserInput.id).executeTakeFirstOrThrow(); assert.equal(stored.referrer, 'example.org');
    const denied = await publicRequest('/api/analytics/collect', { method: 'POST', headers: { ...collectHeaders, Origin: 'https://untrusted.example' }, body: JSON.stringify(browserInput) }); assert.equal(denied.status, 403);
    const excludedId = randomUUID(); eventIds.push(excludedId);
    assert.equal((await publicRequest('/api/analytics/collect', { method: 'POST', headers: { ...collectHeaders, DNT: '1' }, body: JSON.stringify({ ...browserInput, id: excludedId }) })).status, 204);
    assert.equal(await db.selectFrom('_dos_events').select('id').where('id', '=', excludedId).executeTakeFirst(), undefined);
    console.log('Verified public short-link redirect, collection relay, origin protection, query stripping and DNT.');
  }
  if (browserTest) {
    const { chromium } = await import(process.env.DOS_PLAYWRIGHT_MODULE || 'playwright');
    if (!live) {
      server = createServer(async (req, res) => {
        try {
          const path = new URL(req.url, 'http://localhost').pathname;
          if (path.startsWith('/_astro/') || path.startsWith('/images/')) {
            const file = resolve('dist-emdash-staging', '.' + path); assert(file.startsWith(resolve('dist-emdash-staging') + '/'));
            const data = await readFile(file), type = { '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml' }[extname(file)] || 'application/octet-stream'; res.writeHead(200, { 'Content-Type': type }); res.end(data); return;
          }
          const chunks = []; for await (const chunk of req) chunks.push(chunk);
          const response = await request(req.url, { method: req.method, headers: { ...req.headers, authorization: `Bearer ${token.raw}`, origin: cmsOrigin }, ...(['GET', 'HEAD'].includes(req.method) ? {} : { body: Buffer.concat(chunks) }) });
          res.writeHead(response.status, Object.fromEntries(response.headers)); res.end(Buffer.from(await response.arrayBuffer()));
        } catch { res.writeHead(500); res.end('Verification server failed'); }
      });
      await new Promise(resolve => server.listen(4344, '127.0.0.1', resolve));
    }
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, acceptDownloads: true });
    if (live) await context.route(`${cmsOrigin}/**`, async route => route.continue({ headers: { ...route.request().headers(), authorization: `Bearer ${token.raw}` } }));
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const uiOrigin = live ? cmsOrigin : 'http://127.0.0.1:4344';
    await page.goto(`${uiOrigin}/_emdash/admin/`, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: 'Dashboard', exact: true }).waitFor();
    await page.screenshot({ path: '/tmp/dos-emdash-native-dashboard.png', fullPage: true, animations: 'disabled' });
    await page.goto(`${uiOrigin}/_emdash/admin/plugins/dos-insights/links`, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: 'Links', exact: true }).waitFor();
    await page.getByLabel('Search links or tags').fill(prefix);
    await page.getByRole('button', { name: 'QR code', exact: true }).waitFor();
    await page.getByRole('button', { name: 'QR code', exact: true }).click();
    await page.getByRole('link', { name: 'Download PNG' }).waitFor();
    const png = Buffer.from((await page.getByRole('link', { name: 'Download PNG' }).getAttribute('href')).split(',')[1], 'base64');
    assert.equal(png.subarray(1, 4).toString(), 'PNG'); assert(png.length > 1000);
    await page.getByRole('button', { name: 'Edit', exact: true }).click();
    await page.getByLabel('Title', { exact: true }).fill(`${prefix} browser-edited`);
    await page.getByRole('button', { name: 'Save link', exact: true }).click();
    await page.getByText('Link saved. The public destination updates immediately.').waitFor();
    const downloadPromise = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export matching links' }).click();
    const downloaded = await downloadPromise; const csv = await readFile(await downloaded.path(), 'utf8'); assert(csv.includes(prefix));
    await page.screenshot({ path: '/tmp/dos-insights-links.png', fullPage: true, animations: 'disabled' });
    // Temporary, campaign-isolated history exercises non-empty charts and rankings; finally removes it.
    const chartFixtures = [];
    for (let days = 1; days <= 55; days++) {
      const at = new Date(now.getTime() - days * 86400000).toISOString();
      for (let n = 0; n < 1 + (days * 7 % 9); n++) chartFixtures.push({
        ...event, id: randomUUID(), at, day: new Date(Date.parse(at) + 7200000).toISOString().slice(0, 10),
        visitor: createHmac('sha256', prefix).update(`${days}:${n}`).digest('hex'),
        path: ['/services/example', '/jobs/example', '/news/example', '/events/example'][n % 4],
        referrer: ['google.com', 'facebook.com', '', 'dzaleka.com'][n % 4], device: n % 3 ? 'Mobile' : 'Desktop',
        browser: n % 3 ? 'Chrome' : 'Safari', source: n % 3 ? 'whatsapp' : '',
      });
    }
    await db.insertInto('_dos_events').values(chartFixtures).execute();
    console.log('Prepared isolated chart fixtures for browser verification.');
    await page.goto(`${uiOrigin}/_emdash/admin/plugins/dos-insights/statistics`, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: 'Statistics', exact: true }).waitFor();
    await page.getByRole('tab', { name: 'Overview', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Filters', exact: true }).click();
    await page.getByLabel('Campaign', { exact: true }).fill(prefix); await page.getByRole('button', { name: 'Apply filters / refresh' }).click();
    await page.getByRole('button', { name: `/${prefix}`, exact: true }).waitFor();
    await page.getByRole('button', { name: 'Filters •', exact: true }).click();
    await page.getByRole('img', { name: /Daily page views and visitor-days/ }).waitFor();
    await page.getByRole('tab', { name: 'Audience', exact: true }).click();
    await page.getByRole('heading', { name: 'Devices', exact: true }).waitFor();
    await page.getByRole('tab', { name: 'Actions', exact: true }).click();
    await page.getByRole('heading', { name: 'Actions and submissions', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Browse & export', exact: true }).click();
    const reportDownloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export all matching rows' }).click();
    assert((await readFile(await (await reportDownloadPromise).path(), 'utf8')).includes(prefix));
    await page.getByRole('tab', { name: 'Overview', exact: true }).click();
    await page.locator('.dos-statistics[aria-busy="false"]').waitFor();
    await page.screenshot({ path: '/tmp/dos-insights-statistics.png', fullPage: true, animations: 'disabled' });
    await page.getByRole('button', { name: 'Switch to dark', exact: true }).click();
    await page.locator('html[data-mode="dark"]').waitFor();
    await page.screenshot({ path: '/tmp/dos-insights-statistics-dark.png', fullPage: true, animations: 'disabled' });
    const cardColors = await page.locator('.dos-metric').first().evaluate(el => ({ background: getComputedStyle(el).backgroundColor, text: getComputedStyle(el).color }));
    assert.notEqual(cardColors.background, 'rgb(255, 255, 255)', 'Cards must follow the EmDash dark theme');
    await page.getByRole('button', { name: 'Switch to light', exact: true }).click();
    await page.getByRole('combobox', { name: 'Date range', exact: true }).click();
    await page.getByRole('option', { name: 'Today', exact: true }).click();
    await page.getByRole('img', { name: /Hourly page views and visitor-days/ }).waitFor();
    await page.getByRole('tab', { name: 'Content', exact: true }).click();
    const contentReport = page.waitForResponse(response => response.url().includes('/dos-insights/report?') && new URL(response.url()).searchParams.get('collection') === 'services');
    await page.getByRole('tab', { name: 'Services', exact: true }).click();
    await contentReport;
    await page.getByText('Content: services', { exact: true }).waitFor();
    await page.locator('.dos-statistics[aria-busy="false"]').waitFor();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('.dos-stat-header').scrollIntoViewIfNeeded();
    await page.screenshot({ path: '/tmp/dos-insights-statistics-mobile.png', fullPage: true, animations: 'disabled' });
    const overflow = await page.locator('.dos-statistics').evaluate(el => el.scrollWidth > el.clientWidth + 1);
    assert.equal(overflow, false, 'Statistics must fit a mobile viewport');
    assert.deepEqual(errors, [], 'Admin must hydrate without browser errors');
    console.log('Verified native EmDash UI: link editing, filtered list, QR PNG, CSV download and filtered statistics.');
    if (publicOrigin === 'https://services.dzaleka.com') {
      const publicContext = await browser.newContext({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36' });
      const visitor = await publicContext.newPage();
      await visitor.goto(`${publicOrigin}/services/register?utm_campaign=${prefix}`, { waitUntil: 'networkidle' });
      const formStart = visitor.waitForResponse(response => response.url().endsWith('/api/analytics/collect') && response.request().postData()?.includes('form_start'));
      await visitor.locator('#orgName').fill('Temporary verification, not submitted');
      assert.equal((await formStart).status(), 204);
      const actions = await db.selectFrom('_dos_events').select('name').where('campaign', '=', prefix).where('path', '=', '/services/register').execute();
      assert(actions.some(row => row.name === 'pageview')); assert(actions.some(row => row.name === 'form_start'));
      await publicContext.close();
      console.log('Verified the deployed browser tracker records real page views and form starts without submitting the form.');
    }

  }
  console.log('Verified CMS authorization, signed ingestion, durable deduplication, link lifecycle, campaign attribution and filtered reports.');
} finally {
  await browser?.close(); if (server) await new Promise(resolve => server.close(resolve));
  for (const id of linkIds) await db.deleteFrom('_dos_links').where('id', '=', id).execute();
  if (eventIds.length) await db.deleteFrom('_dos_events').where('id', 'in', eventIds).execute();
  await db.deleteFrom('_dos_events').where('campaign', '=', prefix).execute();
  await db.deleteFrom('_dos_event_limits').where('id', 'like', `${createHmac('sha256', prefix).update('verification').digest('hex')}:%`).execute();
  for (const id of tokenIds) await db.deleteFrom('_emdash_api_tokens').where('id', '=', id).execute();
  await db.destroy(); if (bundle) await rm(bundle, { recursive: true, force: true });
}

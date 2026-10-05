import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Kysely } from 'kysely';
import { createDialect } from 'emdash/db/sqlite';
import type { Database } from 'emdash';
import { migrateInsights, insightsDb, saveLink, resolveLink, recordEvent, cleanupInsights, type EventRow } from '../src/lib/insights/store';
import { report, reportSchema } from '../src/lib/insights/report';
import { browserEventSchema, csv, destinationUrl, excludedPath, referrerHost } from '../src/lib/insights/contract';
import { browserEvent, eventMetadata, shouldTrack, sendInsights, boundedText } from '../src/lib/insights/transport';
import { publicAddress, checkLinks } from '../src/lib/insights/health';
import { recordSubmission } from '../src/lib/insights/submission';
import { validSignature } from '../src/lib/submissions/contract';
import { randomUUID } from 'node:crypto';

const secret = 'verification-secret-'.repeat(4), ua = 'Mozilla/5.0 Chrome/130 Safari/537.36';
const link = { slug: 'scholarship', title: 'Scholarship', destination: 'https://example.org/apply?a=1', source: 'whatsapp', medium: 'social', campaign: 'education', tags: 'education', enabled: true, expires_at: '' };
const request = (headers: Record<string, string> = {}) => new Request('https://services.dzaleka.com/api/analytics/collect', { headers: { 'User-Agent': ua, ...headers } });
const event = (overrides: Partial<EventRow> = {}): EventRow => ({ id: randomUUID(), at: new Date().toISOString(), day: new Date(Date.now() + 7200000).toISOString().slice(0, 10), visitor: 'a'.repeat(64), name: 'pageview', path: '/services/example', target: '', referrer: '', source: '', medium: '', campaign: '', device: 'Desktop', browser: 'Chrome', link_id: '', ...overrides });
let db: Kysely<Database>;
beforeEach(async () => { db = new Kysely<Database>({ dialect: createDialect({ url: ':memory:' }) }); await migrateInsights(db); });
afterEach(async () => { await db.destroy(); });

describe('Links lifecycle', () => {
  it('creates, resolves, edits and disables a stable short URL with campaign parameters', async () => {
    const row = await saveLink(db, link);
    expect(await resolveLink(db, link.slug)).toMatchObject({ status: 302, destination: 'https://example.org/apply?a=1&utm_source=whatsapp&utm_medium=social&utm_campaign=education' });
    await saveLink(db, { ...link, destination: 'https://example.org/new' }, row.id, row.revision);
    expect(await resolveLink(db, link.slug)).toMatchObject({ status: 302, destination: expect.stringContaining('/new?') });
    await expect(saveLink(db, link, row.id, row.revision)).rejects.toThrow('changed');
    await saveLink(db, { ...link, enabled: false }, row.id, 2);
    expect(await resolveLink(db, link.slug)).toEqual({ status: 410 });
    await saveLink(db, link, row.id, 3);
    expect((await resolveLink(db, link.slug)).status).toBe(302);
  });
  it('rejects duplicate slugs, renames, loops, credentials, internal addresses and unsafe schemes', async () => {
    const row = await saveLink(db, link);
    await expect(saveLink(db, link)).rejects.toThrow('already exists');
    await expect(saveLink(db, { ...link, slug: 'renamed' }, row.id, 1)).rejects.toThrow('cannot be renamed');
    for (const destination of ['javascript:alert(1)', 'https://user:pass@example.org/', 'http://localhost/', 'http://127.0.0.1/', 'https://services.dzaleka.com/go/other', 'https://example.org:1234/']) expect(() => destinationUrl(destination)).toThrow();
  });
  it('expires links and leaves missing slugs as 404', async () => {
    await saveLink(db, { ...link, expires_at: '2020-01-01T00:00:00.000Z' });
    expect(await resolveLink(db, link.slug)).toEqual({ status: 410 });
    expect(await resolveLink(db, 'missing')).toEqual({ status: 404 });
  });
  it('marks missing destinations broken after two checks and recovers', async () => {
    const row = await saveLink(db, link), check = vi.fn().mockResolvedValue('missing');
    await checkLinks(db, row.id, check);
    expect((await insightsDb(db).selectFrom('_dos_links').selectAll().executeTakeFirst())?.health).toBe('suspected-missing');
    await checkLinks(db, row.id, check);
    expect((await insightsDb(db).selectFrom('_dos_links').selectAll().executeTakeFirst())?.health).toBe('broken');
    check.mockResolvedValue('healthy'); await checkLinks(db, row.id, check);
    expect((await insightsDb(db).selectFrom('_dos_links').selectAll().executeTakeFirst())?.health).toBe('healthy');
  });
  it('does not overwrite health after the destination changes during a check', async () => {
    const row = await saveLink(db, link);
    await checkLinks(db, row.id, async () => { await saveLink(db, { ...link, destination: 'https://example.org/new' }, row.id, 1); return 'missing'; });
    expect((await insightsDb(db).selectFrom('_dos_links').selectAll().executeTakeFirst())?.health).toBe('unchecked');
  });
  it('blocks private, reserved and mapped addresses in health checks', () => {
    for (const address of ['127.0.0.1', '10.0.0.1', '192.168.1.1', '172.31.0.1', '169.254.169.254', '100.64.0.1', '::1', '::ffff:127.0.0.1', 'fc00::1', '2001:db8::1']) expect(publicAddress(address)).toBe(false);
    expect(publicAddress('8.8.8.8')).toBe(true); expect(publicAddress('2606:4700:4700::1111')).toBe(true);
  });
});

describe('Statistics accuracy and privacy', () => {
  it('deduplicates retries and reports Malawi days, dimensions and exact page filters', async () => {
    const first = event({ at: '2026-10-04T22:30:00.000Z', day: '2026-10-05', campaign: 'education' });
    await recordEvent(db, first); await recordEvent(db, first);
    await recordEvent(db, event({ at: '2026-10-05T12:00:00.000Z', day: '2026-10-05', name: 'phone', campaign: 'education' }));
    await recordEvent(db, event({ at: '2026-10-05T12:00:00.000Z', day: '2026-10-05', path: '/jobs/another', visitor: 'b'.repeat(64) }));
    const result = await report(db, { from: '2026-10-05', to: '2026-10-06', path: first.path, campaign: 'education', dimension: 'name' });
    expect(Number(result.totals.events)).toBe(2); expect(Number(result.totals.visitorDays)).toBe(1);
    expect(result.rows.map(r => r.value).sort()).toEqual(['pageview', 'phone']);
    expect(result.daily.map(d => Number(d.views))).toEqual([1, 0]);
  });
  it('compares equal Malawi periods and separates page-view rankings from actions', async () => {
    const samples = [
      { at: '2026-10-02T22:00:00.000Z', day: '2026-10-03', path: '/services/old', visitor: 'b'.repeat(64) },
      { at: '2026-10-04T21:59:59.000Z', day: '2026-10-04', path: '/services/old' },
      { at: '2026-10-04T22:00:00.000Z', day: '2026-10-05', path: '/services/new' },
      { at: '2026-10-05T10:00:00.000Z', day: '2026-10-05', path: '/services/new', name: 'phone' as const },
      { at: '2026-10-05T10:00:00.000Z', day: '2026-10-05', path: '/jobs/other' },
      { at: '2026-10-06T22:00:00.000Z', day: '2026-10-07', path: '/services/future' },
    ];
    for (const sample of samples) await recordEvent(db, event({ ...sample, campaign: 'education' }));
    await recordEvent(db, event({ at: '2026-10-05T11:00:00.000Z', day: '2026-10-05', campaign: 'other' }));
    const result = await report(db, { from: '2026-10-05', to: '2026-10-06', collection: 'services', campaign: 'education' });
    expect(result.previous.from).toBe('2026-10-03'); expect(result.previous.to).toBe('2026-10-04');
    expect(Number(result.previous.totals.events)).toBe(2); expect(Number(result.totals.events)).toBe(2);
    expect(result.previous.daily.map(row => Number(row.views))).toEqual([1, 1]);
    expect(result.daily.map(row => Number(row.views))).toEqual([1, 0]);
    expect(result.top.path).toEqual([{ value: '/services/new', views: 1 }]);
    expect(result.top.browser).toEqual([{ value: 'Chrome', views: 1 }]);
    expect(result.top.campaign).toEqual([{ value: 'education', views: 1 }]);
    const exact = await report(db, { from: '2026-10-05', to: '2026-10-06', path: '/services/new/' });
    expect(Number(exact.previous.totals.events)).toBe(0);
    const hourly = await report(db, { from: '2026-10-05', to: '2026-10-05', collection: 'services', campaign: 'education' });
    expect(hourly.hourly).toHaveLength(24); expect(hourly.hourly?.[0]).toEqual({ day: '00:00', views: 1, visitors: 1 });
    expect(hourly.hourly?.[12].views).toBe(0); expect(hourly.previous.hourly?.[23].views).toBe(1);
  });
  it('normalizes existing trailing-slash paths without losing counts', async () => {
    await recordEvent(db, event({ path: '/services/example/' }));
    await migrateInsights(db);
    const today = event().day;
    const result = await report(db, { from: today, to: today, path: '/services/example/' });
    expect(Number(result.totals.events)).toBe(1); expect(result.rows[0].value).toBe('/services/example');
  });
  it('paginates grouped reports without losing rows', async () => {
    for (let i = 0; i < 105; i++) await recordEvent(db, event({ path: `/page-${String(i).padStart(3, '0')}` }));
    const today = event().day;
    const first = await report(db, { from: today, to: today });
    const second = await report(db, { from: today, to: today, offset: 100 });
    expect(first.rows).toHaveLength(100); expect(first.more).toBe(true); expect(second.rows).toHaveLength(5); expect(second.more).toBe(false);
  });
  it('limits abusive collection and respects collection disablement', async () => {
    for (let i = 0; i < 120; i++) expect(await recordEvent(db, event())).toBe(true);
    expect(await recordEvent(db, event())).toBe(false);
    await insightsDb(db).updateTable('_dos_insights_settings').set({ enabled: 0 }).execute();
    expect(await recordEvent(db, event({ visitor: 'b'.repeat(64) }))).toBe(false);
  });
  it('prunes expired events and counters without deleting links', async () => {
    await saveLink(db, link); await recordEvent(db, event({ at: '2020-01-01T00:00:00.000Z', day: '2020-01-01' }));
    await recordEvent(db, event()); await cleanupInsights(db); await migrateInsights(db);
    expect(await insightsDb(db).selectFrom('_dos_events').selectAll().execute()).toHaveLength(1);
    expect((await resolveLink(db, link.slug)).status).toBe(302);
  });
  it('does not store raw IP addresses, query strings, contact details or long-lived identifiers', () => {
    const a = eventMetadata(request(), '1.2.3.4', secret, new Date('2026-10-05T10:00:00Z'));
    const b = eventMetadata(request(), '1.2.3.4', secret, new Date('2026-10-06T10:00:00Z'));
    expect(a.visitor).not.toBe(b.visitor); expect(JSON.stringify(a)).not.toContain('1.2.3.4');
    const input = browserEventSchema.parse({ id: randomUUID(), name: 'outbound', path: '/services/example/', referrer: 'https://example.org/private?email=person@example.org', target: 'person@example.org' });
    const saved = browserEvent(request(), '1.2.3.4', secret, input);
    expect(saved.path).toBe('/services/example'); expect(saved.referrer).toBe('example.org'); expect(saved.target).toBe('');
    expect(referrerHost('javascript:alert(1)')).toBe(''); expect(excludedPath('/_emdash/admin')).toBe(true);
    expect(browserEventSchema.safeParse({ ...input, path: '/?email=private' }).success).toBe(false);
    expect(browserEventSchema.safeParse({ ...input, name: 'submission' }).success).toBe(false);
  });
  it('respects DNT, GPC, browser exclusions, bots and prefetch', () => {
    for (const headers of ([{ DNT: '1' }, { 'Sec-GPC': '1' }, { Cookie: 'dos_statistics_optout=1' }, { 'User-Agent': 'Googlebot' }, { Purpose: 'prefetch' }] as Record<string, string>[])) expect(shouldTrack(request(headers))).toBe(false);
    expect(shouldTrack(request())).toBe(true);
  });
  it('records confirmed submissions once without collecting submitted field values', async () => {
    const input = { form: 'service-registration', sourcePath: '/services/register', clientHash: 'a'.repeat(64), test: false, fields: { email: 'secret@example.org' }, analytics: { visitor: 'b'.repeat(64), device: 'Desktop', browser: 'Chrome', source: '', medium: '', campaign: '' } };
    await recordSubmission(db, input, 'submission-id', new Date().toISOString()); await recordSubmission(db, input, 'submission-id', new Date().toISOString());
    await recordSubmission(db, { ...input, test: true }, 'test-id', new Date().toISOString());
    const rows = await insightsDb(db).selectFrom('_dos_events').selectAll().execute(); expect(rows).toHaveLength(1); expect(rows[0].name).toBe('submission'); expect(JSON.stringify(rows)).not.toContain('secret@example.org');
  });
  it('signs a domain-separated transport envelope and rejects oversized streams', async () => {
    const send = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ success: true, data: { ok: true } }));
    await sendInsights({ operation: 'event', event: event() }, secret, send);
    const init = send.mock.calls[0][1]!, headers = new Headers(init.headers), body = String(init.body);
    expect(JSON.parse(body).domain).toBe('dos-insights-v1'); expect(validSignature(body, secret, headers.get('x-dos-timestamp'), headers.get('x-dos-signature'))).toBe(true);
    await expect(boundedText(new Request('https://example.org', { method: 'POST', body: 'a'.repeat(5000) }))).rejects.toThrow('too large');
  });
  it('rejects invalid date ranges and protects CSV exports from spreadsheet formula injection', () => {
    for (const filters of [{ from: '2026-99-01', to: '2026-10-05' }, { from: '2026-10-06', to: '2026-10-05' }, { from: '2024-10-05', to: '2026-10-05' }]) expect(reportSchema.safeParse(filters).success).toBe(false);
    expect(csv([{ title: '=IMPORTXML("evil")' }], ['title'])).toContain("'=");
  });
});

describe('Public collection boundary', () => {
  it('rejects cross-origin and malformed requests and reports missing configuration as unavailable', async () => {
    const { POST } = await import('../src/pages/api/analytics/collect');
    const input = { id: randomUUID(), name: 'pageview', path: '/services' };
    const call = async (origin: string, body: unknown) => POST({ request: new Request('https://services.dzaleka.com/api/analytics/collect', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'text/plain', 'User-Agent': ua }, body: JSON.stringify(body) }), clientAddress: '127.0.0.1' } as Parameters<typeof POST>[0]);
    expect((await call('https://evil.example', input)).status).toBe(403);
    expect((await call('https://services.dzaleka.com', { ...input, name: 'submission' })).status).toBe(400);
    const previous = process.env.DOS_SUBMISSION_SECRET; delete process.env.DOS_SUBMISSION_SECRET;
    try { expect((await call('https://services.dzaleka.com', input)).status).toBe(503); }
    finally { if (previous) process.env.DOS_SUBMISSION_SECRET = previous; }
  });
});

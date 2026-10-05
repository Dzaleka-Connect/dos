import { afterEach, describe, expect, it, vi } from 'vitest';
import { applySiteSettings, redirectResponse } from '../src/lib/news/site-response.mjs';
import { eventStatus } from '../src/lib/news/event-status.mjs';
import cmsSite from '../netlify/edge-functions/cms-site.mjs';

afterEach(() => vi.unstubAllGlobals());
const page = (exactTitle = false, defaultImage = true) => `<html><head><title>Original</title><meta property="og:image" content="old"><script id="dos-page-seo" type="application/json">${JSON.stringify({ title: 'Page', exactTitle, defaultImage })}</script></head><body>Untouched</body></html>`;
describe('CMS settings across public pages', () => {
  it('applies defaults and verification safely without replacing explicit page SEO', () => {
    const settings = { title: 'Community & Services', titleSeparator: ' — ', defaultOgImage: 'https://example.org/default.png', googleVerification: 'token"><script>alert(1)</script>', bingVerification: 'bing' };
    const html = applySiteSettings(page(), settings);
    expect(html).toContain('<title>Page — Community &amp; Services</title>');
    expect(html).toContain('content="https://example.org/default.png"');
    expect(html).toContain('name="msvalidate.01" content="bing"');
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('<body>Untouched</body>');
    const explicit = applySiteSettings(page(true, false), settings);
    expect(explicit).toContain('<title>Original</title>');
    expect(explicit).toContain('content="old"');
  });
  it('only redirects to local destinations and supports terminal statuses', () => {
    const url = new URL('https://services.dzaleka.com/old');
    expect(redirectResponse({ status: 301, location: '/new' }, url)?.headers.get('location')).toBe('https://services.dzaleka.com/new');
    for (const location of ['//bad.example', '/\\bad.example', '/old', 'https://bad.example']) expect(redirectResponse({ status: 301, location }, url)).toBeNull();
    expect(redirectResponse({ status: 410 }, url)?.status).toBe(410);
    expect(redirectResponse({ status: 451 }, url)?.status).toBe(451);
  });
  it('handles static HTML, robots and redirects while preserving privacy and outage fallback', async () => {
    const next = vi.fn().mockImplementation(async () => new Response(page(), { headers: { 'Content-Type': 'text/html', 'Cache-Control': 'private, no-store' } }));
    const settings = { title: 'New site', robotsTxt: 'User-agent: *\nDisallow: /private\n' };
    const fetcher = vi.fn().mockImplementation(async () => Response.json({ version: 1, settings }));
    vi.stubGlobal('fetch', fetcher);
    const request = new Request('https://services.dzaleka.com/about');
    const response = await cmsSite(request, { next });
    expect(await response.text()).toContain('Page | New site');
    expect(response.headers.get('cache-control')).toBe('private, no-store');
    const robots = await cmsSite(new Request('https://services.dzaleka.com/robots.txt'), { next });
    expect(await robots.text()).toBe(settings.robotsTxt);
    fetcher.mockImplementation(async () => Response.json({ version: 1, settings, redirect: { status: 302, location: '/services' } }));
    expect((await cmsSite(request, { next })).status).toBe(302);
    fetcher.mockRejectedValue(new Error('offline'));
    expect(await (await cmsSite(request, { next })).text()).toContain('<title>Original</title>');
  });
});
describe('Event status', () => {
  it('keeps multi-day events current through their Malawi end date, with explicit overrides', () => {
    const event = { date: '2026-10-01T08:00:00Z', end_date: '2026-10-05T15:00:00Z', event_status: 'auto' };
    expect(eventStatus(event, new Date('2026-10-05T20:00:00Z'))).toBe('upcoming');
    expect(eventStatus(event, new Date('2026-10-05T22:00:00Z'))).toBe('past');
    expect(eventStatus({ ...event, event_status: 'upcoming' }, new Date('2027-01-01'))).toBe('upcoming');
    expect(eventStatus({ ...event, event_status: 'past' }, new Date('2026-09-01'))).toBe('past');
  });
});

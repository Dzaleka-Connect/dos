import { describe, expect, it, vi } from 'vitest';
import { createPublishedCache, publishedRevision } from '../src/lib/news/published-cache.mjs';
import { publishedResponse } from '../src/lib/news/staging-access.mjs';

describe('Published response caching', () => {
  const request = (path = 'news.json', options = {}) => new Request(`https://cms.dzaleka.com/_dos/public/${path}`, options);
  it('caches published feeds, fragments, media and path-specific settings at the CDN only', () => {
    for (const path of ['news.json', 'services.json', 'events/event', 'media/cover.jpg', 'site.json?path=%2Fold']) {
      const result = publishedResponse(request(path), new Response('Published'));
      expect(result.headers.get('cache-control')).toBe('public, max-age=0, must-revalidate');
      expect(result.headers.get('netlify-cdn-cache-control')).toBe('public, durable, max-age=300, must-revalidate');
      expect(result.headers.get('netlify-vary')).toBe('query');
      expect(result.headers.get('x-robots-tag')).toContain(path.startsWith('media/') ? 'index, follow' : 'noindex');
    }
  });
  it('never shares failures, previews, authenticated responses, private routes or writes', () => {
    const cases = [
      [request(), new Response('Unavailable', { status: 503 })],
      [request(), new Response('Missing', { status: 404 })],
      [request('news.json?_preview=token'), new Response('Preview')],
      [request('news.json', { headers: { authorization: 'Bearer token' } }), new Response('Editor')],
      [request('news.json', { headers: { cookie: 'astro-session=test' } }), new Response('Editor')],
      [request(), new Response('Session', { headers: { 'Set-Cookie': 'astro-session=test' } })],
      [new Request('https://cms.dzaleka.com/_emdash/api/admin/users'), new Response('Private')],
      [request('news.json', { method: 'POST' }), new Response('Saved')],
    ] as const;
    for (const [req, res] of cases) {
      const result = publishedResponse(req, res);
      expect(result.headers.get('netlify-cdn-cache-control')).toBe('no-store');
      expect(result.headers.get('cache-control')).toBe('private, no-store');
    }
  });
});

describe('Published collection reuse', () => {
  it('checks the database revision but downloads unchanged content only once, including concurrent reads', async () => {
    const read = createPublishedCache(), revision = vi.fn().mockResolvedValue('v1');
    const load = vi.fn().mockResolvedValue([{ slug: 'story', data: { content: 'body' } }]);
    const values = await Promise.all(Array.from({ length: 10 }, () => read('news', revision, load)));
    expect(values[0]).toEqual(await read('news', revision, load));
    expect(load).toHaveBeenCalledTimes(1);
    expect(revision).toHaveBeenCalledTimes(3);
  });
  it('reloads edits, SEO changes and unpublishing when the fingerprint changes', async () => {
    const read = createPublishedCache(), revision = vi.fn().mockResolvedValue('v1');
    const load = vi.fn().mockResolvedValue([{ slug: 'story' }]);
    await read('news', revision, load);
    revision.mockResolvedValue('v2'); load.mockResolvedValue([{ slug: 'story', seo: { title: 'New SEO title' } }]);
    expect(await read('news', revision, load)).toEqual([{ slug: 'story', seo: { title: 'New SEO title' } }]);
    revision.mockResolvedValue('v3'); load.mockResolvedValue([]);
    expect(await read('news', revision, load)).toEqual([]);
    expect(load).toHaveBeenCalledTimes(3);
  });
  it('does not serve stale data on validation failure and retries failed loads', async () => {
    const read = createPublishedCache(), revision = vi.fn().mockResolvedValue('v1'), load = vi.fn().mockResolvedValue([]);
    await read('news', revision, load);
    revision.mockRejectedValueOnce(new Error('DB unavailable'));
    await expect(read('news', revision, load)).rejects.toThrow('DB unavailable');
    revision.mockResolvedValue('v2'); load.mockRejectedValueOnce(new Error('Failed load'));
    await expect(read('news', revision, load)).rejects.toThrow('Failed load');
    expect(await read('news', revision, load)).toEqual([]);
  });
  it('does not retain a snapshot changed during loading, or mix collections', async () => {
    const read = createPublishedCache(), revision = vi.fn().mockResolvedValueOnce('v1').mockResolvedValue('v2');
    const load = vi.fn().mockResolvedValue([]);
    await read('news', revision, load);
    await read('news', revision, load);
    await read('services', revision, load);
    expect(load).toHaveBeenCalledTimes(3);
    await expect(read('users', revision, load)).rejects.toThrow('Unknown public collection');
    await expect(publishedRevision({}, 'users')).rejects.toThrow('Unknown public collection');
  });
});

import { afterEach, describe, expect, it, vi } from 'vitest';
import { isPublicRead, newsMetadata, publicMediaUrl, referencedMediaKeys, safeMediaKey } from '../src/lib/news/public-contract.mjs';
import { articleFragment, getNews, getNewsEntry, NewsUnavailable, withNewsRequest } from '../src/lib/news/public-client.mjs';

const entry = { id: 'published-story', data: { title: 'Published title', date: '2026-09-30T00:00:00Z', description: 'A summary' } };
afterEach(() => vi.unstubAllGlobals());

describe('Public CMS boundary', () => {
  it('opens only explicit read routes, never admin, previews or writes', () => {
    for (const path of ['news.json', 'news/story', 'media/cover.png']) {
      expect(isPublicRead(new Request(`https://cms.dzaleka.com/_dos/public/${path}`))).toBe(true);
      expect(isPublicRead(new Request(`https://cms.dzaleka.com/_dos/public/${path}`, { method: 'POST' }))).toBe(false);
    }
    for (const path of ['/_emdash/admin/', '/_emdash/api/media/file/cover.png', '/news/story?_preview=token', '/_dos/public/admin']) {
      expect(isPublicRead(new Request(`https://cms.dzaleka.com${path}`))).toBe(false);
    }
  });

  it('exports only reader fields, without editor IDs, revisions or future custom fields', () => {
    const result = newsMetadata({ slug: 'live', id: 'private-id', authorId: 'admin', draftRevisionId: 'draft', status: 'published',
      data: { ...entry.data, internal_notes: 'Private note', content: ['private structure'], image: { provider: 'local', id: 'cover.png' } } });
    expect(result.id).toBe('live');
    expect(result.data.image).toBe('https://cms.dzaleka.com/_dos/public/media/cover.png');
    expect(JSON.stringify(result)).not.toMatch(/Private note|private-id|private structure|draftRevisionId|authorId/);
  });

  it('refuses backups, transfer archives and ambiguous storage paths even when referenced', () => {
    for (const key of ['backups/export.zip', 'transfers/exports/private.zip', '../a.png', 'a/../b.png', '/a.png', 'a//b', '%62ackups/a', 'a%2Fb', 'a\\b']) {
      expect(safeMediaKey(key), key).toBe(false);
      expect(publicMediaUrl(key), key).toBeUndefined();
    }
    const keys = referencedMediaKeys({ image: { provider: 'local', id: 'cover.png' }, content: [
      { asset: { _ref: 'photo-id', meta: { storageKey: 'uploads/photo.jpg' } } },
      { url: '/_emdash/api/media/file/body.png' },
      { provider: 'local', meta: { storageKey: 'backups/export.zip' } },
    ] });
    expect([...keys].sort()).toEqual(['body.png', 'cover.png', 'photo-id', 'uploads/photo.jpg']);
  });
});

describe('Public news reader', () => {
  it('shares one read within a request and refreshes on the next request', async () => {
    const fetchMock = vi.fn(async () => Response.json({ version: 1, entries: [entry] }));
    vi.stubGlobal('fetch', fetchMock);
    await withNewsRequest(async () => {
      const [a, b] = await Promise.all([getNews(), getNews()]);
      expect(a).toBe(b);
      expect(a[0].data.date).toBeInstanceOf(Date);
      await getNews();
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await withNewsRequest(getNews);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ redirect: 'error', cache: 'no-store' });
  });

  it('does not fall back to removed Markdown articles or forward preview tokens', async () => {
    const fetchMock = vi.fn(async () => Response.json({ version: 1, entries: [] }));
    vi.stubGlobal('fetch', fetchMock);
    expect(await getNewsEntry('unpublished?_preview=secret')).toEqual({ entry: undefined, isPreview: false });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).not.toContain('preview');
  });

  it('reports CMS outages and invalid responses rather than claiming there are no articles', async () => {
    for (const response of [new Response('', { status: 503 }), Response.json({ entries: [] }), Response.json({ version: 1, entries: [{ id: 'bad' }] })]) {
      vi.stubGlobal('fetch', vi.fn(async () => response));
      await expect(getNews()).rejects.toBeInstanceOf(NewsUnavailable);
    }
  });

  it('preserves article markup and its styles while routing uploaded images to public media', () => {
    const html = articleFragment('<html><head><link rel="stylesheet" href="/_astro/article.css"></head><body><div data-dos-article><h2>Heading</h2><table><tr><td>Value</td></tr></table><img src="/_emdash/api/media/file/cover.png" alt="Cover"></div></body></html>');
    expect(html).toContain('https://cms.dzaleka.com/_astro/article.css');
    expect(html).toContain('https://cms.dzaleka.com/_dos/public/media/cover.png');
    expect(html).toContain('<h2>Heading</h2>');
    expect(html).toContain('<td>Value</td>');
    expect(html).not.toMatch(/<html|<head|<body/);
  });
});

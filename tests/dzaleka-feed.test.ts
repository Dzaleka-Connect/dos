import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  DZALEKA_FEED_URL,
  getDzalekaFeed,
  parseFeed,
  resetFeedCache,
} from '../src/utils/dzalekaFeed';

const SAMPLE = `<?xml version="1.0"?>
<rss version="2.0"><channel>
  <item>
    <title>COOM Raises Concern Over Funding Cuts &amp; Food Shortages</title>
    <link>https://www.dzaleka.com/2026/08/coom-funding.html</link>
    <pubDate>Sun, 16 Aug 2026 09:00:00 +0000</pubDate>
    <category>COOM</category>
    <category>Food Security</category>
    <description>&lt;div&gt;Families face &lt;b&gt;reduced&lt;/b&gt; rations.&lt;/div&gt;</description>
  </item>
  <item>
    <title><![CDATA[Agro-Vet Shop Opens at Dzaleka]]></title>
    <link>https://www.dzaleka.com/2026/08/agrovet.html</link>
    <pubDate>Thu, 20 Aug 2026 07:00:00 +0000</pubDate>
    <description>New livestock supplies.</description>
  </item>
</channel></rss>`;

afterEach(() => {
  resetFeedCache();
  vi.unstubAllGlobals();
});

describe('parsing the Blogger feed', () => {
  const items = parseFeed(SAMPLE);

  it('reads every item', () => {
    expect(items).toHaveLength(2);
  });

  it('decodes HTML entities in titles', () => {
    expect(items[0].title).toBe('COOM Raises Concern Over Funding Cuts & Food Shortages');
  });

  it('unwraps CDATA in titles', () => {
    expect(items[1].title).toBe('Agro-Vet Shop Opens at Dzaleka');
  });

  it('strips markup from descriptions, leaving readable text', () => {
    expect(items[0].description).toBe('Families face reduced rations.');
    expect(items[0].description).not.toContain('<');
  });

  it('collects the publisher categories used for topic matching', () => {
    expect(items[0].categories).toEqual(['COOM', 'Food Security']);
  });

  it('parses publication dates', () => {
    expect(items[0].date.getUTCFullYear()).toBe(2026);
    expect(items[0].date.getUTCMonth()).toBe(7); // August
  });

  it('keeps the item link', () => {
    expect(items[0].link).toBe('https://www.dzaleka.com/2026/08/coom-funding.html');
  });

  it('returns nothing for empty or malformed input rather than throwing', () => {
    expect(parseFeed('')).toEqual([]);
    expect(parseFeed('<rss><channel></channel></rss>')).toEqual([]);
    expect(() => parseFeed('<item>truncated')).not.toThrow();
  });

  it('skips an item with no title or link', () => {
    expect(parseFeed('<item><description>orphan</description></item>')).toEqual([]);
  });

  it('falls back to the epoch for an unparseable date, never NaN', () => {
    const [item] = parseFeed(
      '<item><title>T</title><link>https://x.test/a</link><pubDate>not a date</pubDate></item>'
    );
    expect(Number.isNaN(item.date.getTime())).toBe(false);
  });
});

describe('fetching the feed', () => {
  it('requests the published feed URL', async () => {
    const fetchMock = vi.fn(async () => new Response(SAMPLE, { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const items = await getDzalekaFeed();
    expect(items).toHaveLength(2);
    expect(fetchMock.mock.calls[0][0]).toBe(DZALEKA_FEED_URL);
  });

  it('fetches once across many pages', async () => {
    const fetchMock = vi.fn(async () => new Response(SAMPLE, { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    // A build renders 80+ encyclopedia entries; each must not re-fetch.
    await Promise.all([getDzalekaFeed(), getDzalekaFeed(), getDzalekaFeed()]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  /** A publisher outage must not fail the site build. */
  it('returns an empty list when the feed is unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new Error('network down');
    }));
    await expect(getDzalekaFeed()).resolves.toEqual([]);
  });

  it('returns an empty list on a non-200 response', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('nope', { status: 503 })));
    await expect(getDzalekaFeed()).resolves.toEqual([]);
  });
});

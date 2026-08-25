/**
 * The dzaleka.com Blogger feed: the community's main news publication.
 *
 * The parsing here previously existed inline in encyclopedia/index.astro and
 * api/rss.ts. It is centralised so the encyclopedia's coverage sidebar, the
 * index page, and the RSS proxy all read the same items.
 *
 * The fetch is memoised at module scope. Astro renders 80+ encyclopedia pages
 * in one build and each would otherwise hit the feed again.
 *
 * A feed failure must never fail a build: every entry point returns an empty
 * list and logs a warning, so pages render without the sidebar section.
 */

export const DZALEKA_FEED_URL = 'https://www.dzaleka.com/feeds/posts/default?alt=rss';
export const DZALEKA_SITE_URL = 'https://www.dzaleka.com';

export interface FeedItem {
  title: string;
  description: string;
  date: Date;
  categories: string[];
  link: string;
}

/** Decode the entity escaping Blogger applies to feed content. */
function decodeEntities(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

function stripTags(value: string): string {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Parse a Blogger RSS document into feed items. Exported for testing. */
export function parseFeed(xml: string): FeedItem[] {
  const items: FeedItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const content = match[1];
    const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/);
    const linkMatch = content.match(/<link>([\s\S]*?)<\/link>/);
    if (!titleMatch || !linkMatch) continue;

    const dateMatch = content.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    const descMatch = content.match(/<description>([\s\S]*?)<\/description>/);
    const categories = [...content.matchAll(/<category[^>]*>([\s\S]*?)<\/category>/g)]
      .map((m) => decodeEntities(m[1]).trim())
      .filter(Boolean);

    const parsedDate = dateMatch ? new Date(dateMatch[1].trim()) : null;

    items.push({
      title: decodeEntities(titleMatch[1]).trim(),
      description: stripTags(decodeEntities(descMatch ? descMatch[1] : '')),
      date: parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : new Date(0),
      categories,
      link: linkMatch[1].trim(),
    });
  }

  return items;
}

let cached: Promise<FeedItem[]> | null = null;

/**
 * Fetch and parse the feed, memoised for the lifetime of the process.
 * Returns an empty array if the feed is unreachable or malformed.
 */
export function getDzalekaFeed(): Promise<FeedItem[]> {
  if (cached) return cached;

  cached = (async () => {
    try {
      const response = await fetch(DZALEKA_FEED_URL, {
        headers: { 'User-Agent': 'DzalekaOnlineServices/1.0' },
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) {
        console.warn(`dzaleka.com feed returned ${response.status}; continuing without it.`);
        return [];
      }
      return parseFeed(await response.text());
    } catch (error) {
      console.warn(
        'Could not fetch the dzaleka.com feed; continuing without it:',
        error instanceof Error ? error.message : error
      );
      return [];
    }
  })();

  return cached;
}

/** Test-only hook: drop the memoised feed. */
export function resetFeedCache(): void {
  cached = null;
}

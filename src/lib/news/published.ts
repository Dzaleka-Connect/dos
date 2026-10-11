import { ContentRepository, handleContentList } from 'emdash';
import { getDb } from 'emdash/runtime';
import { createPublishedCache, publishedRevision } from './published-cache.mjs';

const readPublished = createPublishedCache();

// Repository reads always use the live row, including during authenticated preview requests.
export async function publishedItems(collection: string): ReturnType<typeof loadPublishedItems> {
  const db = await getDb();
  const load = () => loadPublishedItems(db, collection);
  // The local SQLite pilot retains its normal repository path.
  return process.env.DOS_EMDASH_STAGING === '1'
    ? readPublished(collection, () => publishedRevision(db, collection), load)
    : load();
}

async function loadPublishedItems(db: Awaited<ReturnType<typeof getDb>>, collection: string) {
  const items = [];
  let cursor: string | undefined;
  do {
    // The list handler hydrates the separate SEO records; raw repository rows
    // omit them. Its explicit status filter continues to read only live data.
    const result = await handleContentList(db, collection, { status: 'published', limit: 100, cursor });
    if (!result.success) throw new Error(`Published ${collection} unavailable: ${result.error.code}`);
    items.push(...result.data.items);
    cursor = result.data.nextCursor;
  } while (cursor);
  return items;
}

export async function publishedItem(collection: string, slug: string) {
  const item = await new ContentRepository(await getDb()).findBySlug(collection, slug);
  return item?.status === 'published' ? item : null;
}

export const publishedNews = () => publishedItems('news');
export const publishedArticle = (slug: string) => publishedItem('news', slug);

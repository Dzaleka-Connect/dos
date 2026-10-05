import { ContentRepository, handleContentList } from 'emdash';
import { getDb } from 'emdash/runtime';

// Repository reads always use the live row, including during authenticated preview requests.
export async function publishedItems(collection: string) {
  const db = await getDb();
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

import { ContentRepository } from 'emdash';
import { getDb } from 'emdash/runtime';

// Repository reads always use the live row, including during authenticated preview requests.
export async function publishedItems(collection: string) {
  const repository = new ContentRepository(await getDb());
  const items = [];
  let cursor: string | undefined;
  do {
    const result = await repository.findMany(collection, { where: { status: 'published' }, limit: 100, cursor });
    items.push(...result.items);
    cursor = result.nextCursor;
  } while (cursor);
  return items;
}

export async function publishedItem(collection: string, slug: string) {
  const item = await new ContentRepository(await getDb()).findBySlug(collection, slug);
  return item?.status === 'published' ? item : null;
}

export const publishedNews = () => publishedItems('news');
export const publishedArticle = (slug: string) => publishedItem('news', slug);

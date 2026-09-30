import { ContentRepository } from 'emdash';
import { getDb } from 'emdash/runtime';

// Repository reads always use the live row, including during authenticated preview requests.
export async function publishedNews() {
  const repository = new ContentRepository(await getDb());
  const items = [];
  let cursor: string | undefined;
  do {
    const result = await repository.findMany('news', { where: { status: 'published' }, limit: 100, cursor });
    items.push(...result.items);
    cursor = result.hasMore ? result.nextCursor : undefined;
  } while (cursor);
  return items;
}

export async function publishedArticle(slug: string) {
  const item = await new ContentRepository(await getDb()).findBySlug('news', slug);
  return item?.status === 'published' ? item : null;
}

import { getCollection, getEntry as getFileEntry } from 'astro:content';

export const getEntries = (collection: string) => getCollection(collection as 'news');
export async function getEntry(collection: string, slug: string) {
  return { entry: await getFileEntry(collection as 'news', slug), isPreview: false };
}
export const getNews = () => getEntries('news');
export const getNewsEntry = (slug: string) => getEntry('news', slug);

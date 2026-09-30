import { getCollection, getEntry } from 'astro:content';

export const getNews = () => getCollection('news');
export async function getNewsEntry(slug: string) {
  return { entry: await getEntry('news', slug), isPreview: false };
}

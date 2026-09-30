import { getCollection, getEntry as getFileEntry } from 'astro:content';
import { getEntries, getEntry as getLiveEntry } from '@dos/news';
import { isLive } from './news/live-collections.mjs';

// Read a collection from the CMS when it is live there, otherwise from Markdown.
export async function getContent(name: string): Promise<any[]> {
  return isLive(name) ? getEntries(name) : getCollection(name as any);
}

export async function getContentEntry(name: string, slug: string): Promise<any> {
  return isLive(name) ? (await getLiveEntry(name, slug)).entry : getFileEntry(name as any, slug);
}

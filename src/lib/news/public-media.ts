import { getSiteSettings } from 'emdash';
import type { APIRoute } from 'astro';
import { publishedItems } from './published';
import { entryMedia, referencedMediaKeys, safeMediaKey } from './public-contract.mjs';
import { cmsCollections } from './live-collections.mjs';

export const GET: APIRoute = async ({ params, locals }) => {
  const key = params.key || '';
  if (!safeMediaKey(key)) return new Response('Not found', { status: 404 });
  const settings = await getSiteSettings();
  let referenced = referencedMediaKeys(entryMedia('news', {}, { image: settings.seo?.defaultOgImage?.url })).has(key);
  for (const collection of cmsCollections) {
    if (referenced) break;
    const published = await publishedItems(collection);
    if (published.some(item => referencedMediaKeys(entryMedia(collection, item.data, item.seo)).has(key))) { referenced = true; break; }
  }
  if (!referenced) {
    return new Response('Not found', { status: 404 });
  }
  if (!locals.emdash?.storage) return new Response('Media unavailable', { status: 503 });
  try {
    const file = await locals.emdash.storage.download(key);
    const inline = /^(image\/(jpeg|png|gif|webp|avif)|video\/(mp4|webm)|audio\/(mpeg|wav|ogg))$/.test(file.contentType);
    return new Response(file.body, { headers: {
      'Content-Type': file.contentType,
      'Content-Disposition': inline ? 'inline' : 'attachment',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "sandbox; default-src 'none'; img-src 'self'; style-src 'unsafe-inline'",
    } });
  } catch {
    return new Response('Media unavailable', { status: 503 });
  }
};

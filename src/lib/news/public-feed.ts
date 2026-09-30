import type { APIRoute } from 'astro';
import { publishedNews } from './published';
import { newsMetadata } from './public-contract.mjs';

export const GET: APIRoute = async () => {
  const items = await publishedNews();
  return Response.json({ version: 1, entries: items.map(newsMetadata) });
};

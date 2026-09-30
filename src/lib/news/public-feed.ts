import type { APIRoute } from 'astro';
import { publishedItems } from './published';
import { publicMetadata } from './public-contract.mjs';
import { isCmsCollection } from './live-collections.mjs';

export const GET: APIRoute = async ({ params }) => {
  const collection = params.collection || '';
  if (!isCmsCollection(collection)) return new Response('Not found', { status: 404 });
  const items = await publishedItems(collection);
  return Response.json({ version: 1, entries: items.map(publicMetadata[collection as keyof typeof publicMetadata]) });
};

import type { APIRoute } from 'astro';
import { apiCatalogDocument } from '../../data/agentDiscovery';

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(apiCatalogDocument, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/linkset+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });

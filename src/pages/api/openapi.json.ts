import type { APIRoute } from 'astro';
import { buildOpenApiDocument } from '../../data/agentDiscovery';

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(buildOpenApiDocument(), null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/openapi+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });

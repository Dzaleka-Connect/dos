import type { APIRoute } from 'astro';
import { apiCatalogDocument } from '../../data/agentDiscovery';

// Server-rendered: prerendering emits an extension-less static file, which is
// served as application/octet-stream instead of application/linkset+json.
export const prerender = false;

const headers = {
  'Content-Type': 'application/linkset+json; charset=utf-8',
  'Cache-Control': 'public, max-age=3600',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
};

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(apiCatalogDocument, null, 2), {
    status: 200,
    headers,
  });

export const HEAD: APIRoute = async () => new Response(null, { status: 200, headers });

export const OPTIONS: APIRoute = async () => new Response(null, { status: 204, headers });

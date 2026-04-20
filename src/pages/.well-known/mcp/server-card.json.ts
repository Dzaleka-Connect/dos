import type { APIRoute } from 'astro';
import {
  MCP_SERVER_CARD_CACHE_CONTROL,
  mcpServerCardDocument,
} from '../../../data/mcpServerCard';

export const prerender = false;

function buildHeaders() {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': MCP_SERVER_CARD_CACHE_CONTROL,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(mcpServerCardDocument, null, 2), {
    status: 200,
    headers: buildHeaders(),
  });

export const HEAD: APIRoute = async () =>
  new Response(null, {
    status: 200,
    headers: buildHeaders(),
  });

export const OPTIONS: APIRoute = async () =>
  new Response(null, {
    status: 204,
    headers: buildHeaders(),
  });

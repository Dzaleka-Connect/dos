import type { APIRoute } from 'astro';
import {
  API_BASE_URL,
  API_CATALOG_URL,
  API_DOCS_URL,
  API_STATUS_URL,
  OPENAPI_URL,
  SITE_URL,
} from '../../data/agentDiscovery';
import { MCP_SERVER_CARD_URL } from '../../data/mcpServerCard';

export const prerender = false;

export const GET: APIRoute = async () =>
  new Response(
    JSON.stringify(
      {
        status: 'ok',
        service: 'Dzaleka Online Services Public API',
        site: SITE_URL,
        apiBase: API_BASE_URL,
        documentation: API_DOCS_URL,
        catalog: API_CATALOG_URL,
        openapi: OPENAPI_URL,
        mcpServerCard: MCP_SERVER_CARD_URL,
        self: API_STATUS_URL,
        checkedAt: new Date().toISOString(),
      },
      null,
      2
    ),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    }
  );

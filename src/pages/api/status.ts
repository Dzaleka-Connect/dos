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
import { apiHeaders, API_VERSION } from '../../utils/api-utils';

export const prerender = false;

export const GET: APIRoute = async ({ request }) =>
  new Response(
    JSON.stringify(
      {
        status: 'ok',
        service: 'Dzaleka Online Services Public API',
        version: API_VERSION,
        site: SITE_URL,
        apiBase: API_BASE_URL,
        documentation: API_DOCS_URL,
        agentGuidance: `${SITE_URL}/llms.txt`,
        catalog: API_CATALOG_URL,
        openapi: OPENAPI_URL,
        mcp: `${SITE_URL}/.well-known/mcp`,
        mcpServerCard: MCP_SERVER_CARD_URL,
        self: API_STATUS_URL,
        rateLimit: { limit: 60, window: '60s', scope: 'per client IP' },
        checkedAt: new Date().toISOString(),
      },
      null,
      2
    ),
    {
      status: 200,
      headers: apiHeaders(request, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      }),
    }
  );

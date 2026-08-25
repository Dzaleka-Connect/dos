import type { APIRoute } from 'astro';
import {
  MCP_SERVER_CARD_CACHE_CONTROL,
  MCP_SERVER_CARD_PATH,
  MCP_PROTOCOL_VERSION,
  mcpServerCardDocument,
} from '../../data/mcpServerCard';
import { SITE_URL } from '../../data/agentDiscovery';
import { mcpToolDescriptors } from '../../data/mcpTools';
import {
  handleRpcMessage,
  rpcError,
  RPC_INVALID_REQUEST,
  RPC_PARSE_ERROR,
  type JsonRpcRequest,
  type JsonRpcResponse,
} from '../../utils/mcp-rpc';
import { checkRateLimit } from '../../utils/api-utils';

export const prerender = false;

/**
 * /.well-known/mcp - live MCP endpoint over Streamable HTTP.
 *
 * GET returns a discovery document so the well-known path resolves in a
 * browser; POST speaks JSON-RPC 2.0 so a client can complete a real
 * `initialize` handshake and call tools. The browser-side WebMCP surface
 * described by the server card is unchanged.
 */

const MCP_ENDPOINT_PATH = '/.well-known/mcp';

function baseHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, MCP-Protocol-Version, Mcp-Session-Id',
    'Access-Control-Expose-Headers': 'MCP-Protocol-Version, RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset, Retry-After',
    'MCP-Protocol-Version': MCP_PROTOCOL_VERSION,
  };
}

function jsonHeaders(extra: Record<string, string> = {}) {
  return {
    ...baseHeaders(),
    'Content-Type': 'application/json; charset=utf-8',
    ...extra,
  };
}

/** Discovery document returned on GET. */
const discoveryDocument = {
  ...mcpServerCardDocument,
  description:
    'Read-only MCP server for Dzaleka Online Services. POST JSON-RPC 2.0 to this URL for the Streamable HTTP transport, or open any page in a WebMCP-capable browser for the in-page tools.',
  transports: [
    {
      type: 'streamable-http',
      endpoint: `${SITE_URL}${MCP_ENDPOINT_PATH}`,
      methods: ['POST'],
      note: 'Send a JSON-RPC 2.0 `initialize` request to begin. Responses are single JSON objects; SSE streaming is not used.',
    },
    {
      type: 'webmcp',
      endpoint: '/',
      note: 'Registered via navigator.modelContext on any public page.',
    },
  ],
  tools: mcpToolDescriptors,
  serverCardUrl: `${SITE_URL}${MCP_SERVER_CARD_PATH}`,
};

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(discoveryDocument, null, 2), {
    status: 200,
    headers: jsonHeaders({ 'Cache-Control': MCP_SERVER_CARD_CACHE_CONTROL }),
  });

export const HEAD: APIRoute = async () =>
  new Response(null, {
    status: 200,
    headers: jsonHeaders({ 'Cache-Control': MCP_SERVER_CARD_CACHE_CONTROL }),
  });

export const OPTIONS: APIRoute = async () =>
  new Response(null, { status: 204, headers: baseHeaders() });

export const POST: APIRoute = async ({ request }) => {
  const limited = checkRateLimit(request);
  if (limited) return limited;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return new Response(
      JSON.stringify(rpcError(null, RPC_PARSE_ERROR, 'Request body is not valid JSON.')),
      { status: 400, headers: jsonHeaders() }
    );
  }

  const origin = new URL(request.url).origin;

  // A batch is an array of messages; a single message is an object.
  if (Array.isArray(payload)) {
    if (payload.length === 0) {
      return new Response(
        JSON.stringify(rpcError(null, RPC_INVALID_REQUEST, 'Batch must not be empty.')),
        { status: 400, headers: jsonHeaders() }
      );
    }
    const results = await Promise.all(
      payload.map((message) => handleRpcMessage(message as JsonRpcRequest, origin))
    );
    const responses = results.filter((entry): entry is JsonRpcResponse => entry !== null);
    // An all-notification batch gets no body, per JSON-RPC 2.0.
    if (responses.length === 0) {
      return new Response(null, { status: 202, headers: baseHeaders() });
    }
    return new Response(JSON.stringify(responses), { status: 200, headers: jsonHeaders() });
  }

  if (typeof payload !== 'object' || payload === null) {
    return new Response(
      JSON.stringify(rpcError(null, RPC_INVALID_REQUEST, 'Request must be a JSON object or array.')),
      { status: 400, headers: jsonHeaders() }
    );
  }

  const response = await handleRpcMessage(payload as JsonRpcRequest, origin);
  if (response === null) {
    return new Response(null, { status: 202, headers: baseHeaders() });
  }
  return new Response(JSON.stringify(response), { status: 200, headers: jsonHeaders() });
};

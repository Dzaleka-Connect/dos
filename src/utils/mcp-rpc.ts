/**
 * Transport-agnostic JSON-RPC 2.0 dispatch for the MCP endpoint.
 *
 * Kept separate from the Astro route so it can be unit tested without a server.
 */

import {
  MCP_PROTOCOL_VERSION,
  MCP_SERVER_NAME,
  MCP_SERVER_TITLE,
  MCP_SERVER_VERSION,
} from '../data/mcpServerCard';
import { mcpToolDescriptors, mcpToolsByName } from '../data/mcpTools';

export const JSON_RPC_VERSION = '2.0';

/** JSON-RPC 2.0 reserved error codes. */
export const RPC_PARSE_ERROR = -32700;
export const RPC_INVALID_REQUEST = -32600;
export const RPC_METHOD_NOT_FOUND = -32601;
export const RPC_INVALID_PARAMS = -32602;
export const RPC_INTERNAL_ERROR = -32603;

export const MCP_INSTRUCTIONS =
  'Read-only access to Dzaleka Online Services: a community directory, encyclopedia and open data source for Dzaleka Refugee Camp, Malawi. Start with search_dzaleka when unsure which collection holds an answer. Results are JSON strings matching the REST API at /api. Rate limited to 60 requests per minute per IP.';

export type JsonRpcRequest = {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: Record<string, any>;
};

export type JsonRpcResponse = {
  jsonrpc: typeof JSON_RPC_VERSION;
  id: string | number | null;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
};

export function rpcResult(id: string | number | null, result: unknown): JsonRpcResponse {
  return { jsonrpc: JSON_RPC_VERSION, id, result };
}

export function rpcError(
  id: string | number | null,
  code: number,
  message: string,
  data?: unknown
): JsonRpcResponse {
  return { jsonrpc: JSON_RPC_VERSION, id, error: { code, message, ...(data ? { data } : {}) } };
}

/** True when the message is a notification (no `id`) and so gets no response. */
export function isNotification(message: JsonRpcRequest): boolean {
  return message.id === undefined || message.id === null;
}

/**
 * Handle one JSON-RPC message.
 * Returns `null` for notifications, which must not produce a response body.
 */
export async function handleRpcMessage(
  message: JsonRpcRequest,
  origin: string
): Promise<JsonRpcResponse | null> {
  const id = message.id ?? null;

  if (message.jsonrpc !== JSON_RPC_VERSION) {
    if (isNotification(message)) return null;
    return rpcError(id, RPC_INVALID_REQUEST, 'Expected "jsonrpc":"2.0".');
  }

  switch (message.method) {
    case 'initialize':
      return rpcResult(id, {
        protocolVersion: MCP_PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: {
          name: MCP_SERVER_NAME,
          title: MCP_SERVER_TITLE,
          version: MCP_SERVER_VERSION,
        },
        instructions: MCP_INSTRUCTIONS,
      });

    case 'notifications/initialized':
    case 'notifications/cancelled':
      return null;

    case 'ping':
      return rpcResult(id, {});

    case 'tools/list':
      return rpcResult(id, { tools: mcpToolDescriptors });

    case 'tools/call': {
      const name = message.params?.name;
      const tool = typeof name === 'string' ? mcpToolsByName.get(name) : undefined;
      if (!tool) {
        return rpcError(id, RPC_INVALID_PARAMS, `Unknown tool: ${String(name)}`, {
          availableTools: mcpToolDescriptors.map((t) => t.name),
        });
      }
      try {
        const outcome = await tool.handler(message.params?.arguments ?? {}, origin);
        return rpcResult(id, {
          content: [{ type: 'text', text: outcome.text }],
          isError: Boolean(outcome.isError),
        });
      } catch (error) {
        return rpcError(
          id,
          RPC_INTERNAL_ERROR,
          error instanceof Error ? error.message : String(error)
        );
      }
    }

    // Advertised as unsupported rather than erroring opaquely.
    case 'resources/list':
      return rpcResult(id, { resources: [] });
    case 'prompts/list':
      return rpcResult(id, { prompts: [] });

    default:
      if (isNotification(message)) return null;
      return rpcError(id, RPC_METHOD_NOT_FOUND, `Method not found: ${String(message.method)}`);
  }
}

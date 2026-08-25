import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  handleRpcMessage,
  isNotification,
  rpcError,
  rpcResult,
  RPC_INVALID_PARAMS,
  RPC_INVALID_REQUEST,
  RPC_METHOD_NOT_FOUND,
} from '../src/utils/mcp-rpc';
import { MCP_PROTOCOL_VERSION, MCP_SERVER_NAME } from '../src/data/mcpServerCard';
import { mcpToolDescriptors, MCP_LIST_COLLECTIONS } from '../src/data/mcpTools';

const ORIGIN = 'https://services.dzaleka.com';

/** Capture the URL each tool call would hit, without touching the network. */
let fetched: string[] = [];

beforeEach(() => {
  fetched = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => {
      fetched.push(String(url));
      return new Response(JSON.stringify({ status: 'success', count: 0, data: {} }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    })
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('JSON-RPC envelope', () => {
  it('treats a message without an id as a notification', () => {
    expect(isNotification({ jsonrpc: '2.0', method: 'ping' })).toBe(true);
    expect(isNotification({ jsonrpc: '2.0', id: 1, method: 'ping' })).toBe(false);
    // id 0 is a valid id and must not be treated as absent.
    expect(isNotification({ jsonrpc: '2.0', id: 0, method: 'ping' })).toBe(false);
  });

  it('builds well-formed result and error envelopes', () => {
    expect(rpcResult(1, { ok: true })).toEqual({ jsonrpc: '2.0', id: 1, result: { ok: true } });
    expect(rpcError(1, RPC_INVALID_REQUEST, 'bad')).toEqual({
      jsonrpc: '2.0',
      id: 1,
      error: { code: RPC_INVALID_REQUEST, message: 'bad' },
    });
  });

  it('rejects a message that is not JSON-RPC 2.0', async () => {
    const response = await handleRpcMessage({ id: 1, method: 'ping' }, ORIGIN);
    expect(response!.error!.code).toBe(RPC_INVALID_REQUEST);
  });

  it('returns method not found for an unknown method', async () => {
    const response = await handleRpcMessage({ jsonrpc: '2.0', id: 3, method: 'nope' }, ORIGIN);
    expect(response!.error!.code).toBe(RPC_METHOD_NOT_FOUND);
  });

  it('never responds to a notification', async () => {
    expect(
      await handleRpcMessage({ jsonrpc: '2.0', method: 'notifications/initialized' }, ORIGIN)
    ).toBeNull();
    expect(await handleRpcMessage({ jsonrpc: '2.0', method: 'unknown/thing' }, ORIGIN)).toBeNull();
  });
});

describe('initialize handshake', () => {
  it('returns the protocol version, capabilities and server info', async () => {
    const response = await handleRpcMessage(
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: { protocolVersion: MCP_PROTOCOL_VERSION, capabilities: {}, clientInfo: { name: 'test', version: '1' } },
      },
      ORIGIN
    );
    const result: any = response!.result;
    expect(result.protocolVersion).toBe(MCP_PROTOCOL_VERSION);
    expect(result.capabilities.tools).toBeDefined();
    expect(result.serverInfo.name).toBe(MCP_SERVER_NAME);
    expect(result.instructions).toContain('Dzaleka');
  });

  it('answers ping with an empty result', async () => {
    const response = await handleRpcMessage({ jsonrpc: '2.0', id: 2, method: 'ping' }, ORIGIN);
    expect(response!.result).toEqual({});
  });
});

describe('tools/list', () => {
  it('lists every tool with a name, description and input schema', async () => {
    const response = await handleRpcMessage({ jsonrpc: '2.0', id: 4, method: 'tools/list' }, ORIGIN);
    const tools = (response!.result as any).tools;
    expect(tools.length).toBe(mcpToolDescriptors.length);
    for (const tool of tools) {
      expect(tool.name).toMatch(/^[a-z][a-z0-9_]*$/);
      expect(tool.description.length).toBeGreaterThan(20);
      expect(tool.inputSchema.type).toBe('object');
      // Handlers must never leak over the wire.
      expect(tool).not.toHaveProperty('handler');
    }
  });

  it('reports empty resource and prompt lists rather than erroring', async () => {
    const resources = await handleRpcMessage({ jsonrpc: '2.0', id: 5, method: 'resources/list' }, ORIGIN);
    expect((resources!.result as any).resources).toEqual([]);
    const prompts = await handleRpcMessage({ jsonrpc: '2.0', id: 6, method: 'prompts/list' }, ORIGIN);
    expect((prompts!.result as any).prompts).toEqual([]);
  });
});

describe('tools/call', () => {
  async function call(name: string, args: Record<string, any> = {}) {
    const response = await handleRpcMessage(
      { jsonrpc: '2.0', id: 9, method: 'tools/call', params: { name, arguments: args } },
      ORIGIN
    );
    return response!;
  }

  it('rejects an unknown tool and lists the valid ones', async () => {
    const response = await call('not_a_tool');
    expect(response.error!.code).toBe(RPC_INVALID_PARAMS);
    expect((response.error!.data as any).availableTools).toContain('search_dzaleka');
  });

  it('proxies search_dzaleka to the public search API', async () => {
    const response = await call('search_dzaleka', { query: 'legal aid', limit: 5 });
    expect((response.result as any).isError).toBe(false);
    expect(fetched[0]).toBe(`${ORIGIN}/api/search?q=legal+aid&limit=5`);
  });

  it('clamps an out-of-range limit instead of forwarding it', async () => {
    await call('search_dzaleka', { query: 'school', limit: 5000 });
    expect(fetched[0]).toContain('limit=50');
    fetched = [];
    await call('search_dzaleka', { query: 'school', limit: -3 });
    expect(fetched[0]).toContain('limit=10');
  });

  it('passes an optional collections filter through', async () => {
    await call('search_dzaleka', { query: 'clinic', collections: 'services,resources' });
    expect(fetched[0]).toContain('collections=services%2Cresources');
  });

  it('refuses an empty query without calling the API', async () => {
    const response = await call('search_dzaleka', { query: '   ' });
    expect((response.result as any).isError).toBe(true);
    expect(fetched).toEqual([]);
  });

  it('lists a known collection', async () => {
    await call('list_dzaleka_collection', { collection: 'services' });
    expect(fetched[0]).toBe(`${ORIGIN}/api/services`);
  });

  it('rejects a collection outside the allow-list without calling the API', async () => {
    const response = await call('list_dzaleka_collection', { collection: '../secrets' });
    expect((response.result as any).isError).toBe(true);
    expect(fetched).toEqual([]);
    const body = JSON.parse((response.result as any).content[0].text);
    expect(body.code).toBe('collection_not_found');
  });

  it('exposes only allow-listed collections in its schema', async () => {
    const tool = mcpToolDescriptors.find((t) => t.name === 'list_dzaleka_collection')!;
    expect(tool.inputSchema.properties.collection.enum).toEqual([...MCP_LIST_COLLECTIONS]);
  });

  it('fetches one encyclopedia entry by slug', async () => {
    await call('get_dzaleka_encyclopedia_entry', { slug: 'dzaleka-refugee-camp' });
    expect(fetched[0]).toBe(`${ORIGIN}/api/encyclopedia/dzaleka-refugee-camp`);
  });

  it('rejects a slug containing path traversal', async () => {
    const response = await call('get_dzaleka_encyclopedia_entry', { slug: '../../etc/passwd' });
    expect((response.result as any).isError).toBe(true);
    expect(fetched).toEqual([]);
  });

  it('searches the encyclopedia through the suggest endpoint', async () => {
    await call('search_dzaleka_encyclopedia', { query: 'population' });
    expect(fetched[0]).toBe(`${ORIGIN}/api/encyclopedia/suggest?q=population&limit=10`);
  });

  it('marks an upstream failure as a tool error rather than throwing', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new Error('network down');
    }));
    const response = await call('search_dzaleka', { query: 'clinic' });
    expect((response.result as any).isError).toBe(true);
    const body = JSON.parse((response.result as any).content[0].text);
    expect(body.code).toBe('upstream_unavailable');
  });

  it('surfaces a non-2xx API response as a tool error', async () => {
    vi.stubGlobal('fetch', vi.fn(async () =>
      new Response(JSON.stringify({ code: 'not_found' }), { status: 404 })
    ));
    const response = await call('get_dzaleka_encyclopedia_entry', { slug: 'missing-entry' });
    expect((response.result as any).isError).toBe(true);
  });
});

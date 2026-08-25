/**
 * Read-only MCP tools served over Streamable HTTP at /.well-known/mcp.
 *
 * Each tool proxies the site's own public JSON API rather than reimplementing
 * query logic, so MCP results stay identical to the documented REST responses
 * and cannot drift from them.
 */

/** Collections exposed through the generic list tool. */
export const MCP_LIST_COLLECTIONS = [
  'services',
  'resources',
  'events',
  'jobs',
  'news',
  'courses',
  'photos',
  'artists',
  'artworks',
  'poets',
  'stores',
  'marketplace',
  'community-voices',
] as const;

export type McpToolResult = { text: string; isError?: boolean };

type ToolHandler = (args: Record<string, any>, origin: string) => Promise<McpToolResult>;

export type McpToolDefinition = {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, any>;
  handler: ToolHandler;
};

/** Fetch a same-origin API path and return its body as text. */
async function callApi(origin: string, path: string): Promise<McpToolResult> {
  const url = `${origin}${path}`;
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'dzaleka-online-services-mcp/1.0',
      },
    });
    const body = await response.text();
    if (!response.ok) {
      return { text: body, isError: true };
    }
    return { text: body };
  } catch (error) {
    return {
      text: JSON.stringify({
        code: 'upstream_unavailable',
        detail: `Could not reach ${path}: ${error instanceof Error ? error.message : String(error)}`,
      }),
      isError: true,
    };
  }
}

function clampLimit(value: unknown, fallback: number, max: number): number {
  const parsed = typeof value === 'number' ? value : Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(Math.trunc(parsed), max);
}

export const mcpTools: McpToolDefinition[] = [
  {
    name: 'search_dzaleka',
    title: 'Search Dzaleka Online Services',
    description:
      'Full-text search across services, resources, events, jobs, news and encyclopedia entries about Dzaleka Refugee Camp. Use this first when you do not know which collection holds the answer.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search terms, for example "legal aid" or "school".' },
        collections: {
          type: 'string',
          description:
            'Optional comma-separated collections to restrict the search, for example "services,resources".',
        },
        limit: {
          type: 'integer',
          description: 'Maximum results to return (1-50, default 10).',
          minimum: 1,
          maximum: 50,
        },
      },
      required: ['query'],
    },
    handler: async (args, origin) => {
      const query = String(args.query ?? '').trim();
      if (!query) {
        return { text: JSON.stringify({ code: 'bad_request', detail: '`query` is required.' }), isError: true };
      }
      const params = new URLSearchParams({
        q: query,
        limit: String(clampLimit(args.limit, 10, 50)),
      });
      if (args.collections) params.set('collections', String(args.collections));
      return callApi(origin, `/api/search?${params.toString()}`);
    },
  },
  {
    name: 'list_dzaleka_collection',
    title: 'List a Dzaleka collection',
    description:
      'List every published record in one collection, for example all services or all upcoming events. Prefer search_dzaleka when you have a specific query.',
    inputSchema: {
      type: 'object',
      properties: {
        collection: {
          type: 'string',
          description: 'Collection to list.',
          enum: [...MCP_LIST_COLLECTIONS],
        },
      },
      required: ['collection'],
    },
    handler: async (args, origin) => {
      const collection = String(args.collection ?? '');
      if (!(MCP_LIST_COLLECTIONS as readonly string[]).includes(collection)) {
        return {
          text: JSON.stringify({
            code: 'collection_not_found',
            detail: `Unknown collection "${collection}".`,
            resolution: `Use one of: ${MCP_LIST_COLLECTIONS.join(', ')}.`,
          }),
          isError: true,
        };
      }
      return callApi(origin, `/api/${collection}`);
    },
  },
  {
    name: 'search_dzaleka_encyclopedia',
    title: 'Search the Dzaleka Encyclopedia',
    description:
      'Resolve a name or topic to encyclopedia entries with sourced background on Dzaleka Refugee Camp: history, demography, policy, infrastructure, organisations and people.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Topic or name to look up.' },
        limit: {
          type: 'integer',
          description: 'Maximum suggestions to return (1-25, default 10).',
          minimum: 1,
          maximum: 25,
        },
      },
      required: ['query'],
    },
    handler: async (args, origin) => {
      const query = String(args.query ?? '').trim();
      if (!query) {
        return { text: JSON.stringify({ code: 'bad_request', detail: '`query` is required.' }), isError: true };
      }
      const params = new URLSearchParams({
        q: query,
        limit: String(clampLimit(args.limit, 10, 25)),
      });
      return callApi(origin, `/api/encyclopedia/suggest?${params.toString()}`);
    },
  },
  {
    name: 'get_dzaleka_encyclopedia_entry',
    title: 'Get one encyclopedia entry',
    description:
      'Fetch the full text and cited sources of one encyclopedia entry by slug. Get the slug from search_dzaleka_encyclopedia first.',
    inputSchema: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          description: 'Entry slug, for example "dzaleka-refugee-camp".',
        },
      },
      required: ['slug'],
    },
    handler: async (args, origin) => {
      const raw = String(args.slug ?? '').trim();
      if (!/^[a-z0-9][a-z0-9-]*$/i.test(raw)) {
        return {
          text: JSON.stringify({
            code: 'bad_request',
            detail: '`slug` must be a lowercase hyphenated identifier.',
            resolution: 'Call search_dzaleka_encyclopedia to resolve a name to a slug.',
          }),
          isError: true,
        };
      }
      return callApi(origin, `/api/encyclopedia/${encodeURIComponent(raw.toLowerCase())}`);
    },
  },
];

export const mcpToolsByName = new Map(mcpTools.map((tool) => [tool.name, tool]));

/** Tool descriptors as sent over the wire (handlers stripped). */
export const mcpToolDescriptors = mcpTools.map(({ name, title, description, inputSchema }) => ({
  name,
  title,
  description,
  inputSchema,
}));

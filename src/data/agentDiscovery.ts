import { problemSchema } from '../utils/api-errors';
import { API_VERSION } from '../utils/api-headers';
import {
  DEPRECATION_POLICY_PATH,
  DEPRECATIONS,
  MINIMUM_NOTICE_PERIOD,
} from '../utils/api-deprecation';

export const SITE_URL = 'https://services.dzaleka.com';
export const API_BASE_URL = `${SITE_URL}/api`;
export const API_CATALOG_PATH = '/.well-known/api-catalog';
export const API_CATALOG_URL = `${SITE_URL}${API_CATALOG_PATH}`;
export const API_DOCS_PATH = '/api-docs';
export const API_DOCS_URL = `${SITE_URL}${API_DOCS_PATH}`;
export const OPENAPI_PATH = '/api/openapi.json';
export const OPENAPI_URL = `${SITE_URL}${OPENAPI_PATH}`;
export const API_STATUS_PATH = '/api/status';
export const API_STATUS_URL = `${SITE_URL}${API_STATUS_PATH}`;
export const ENCYCLOPEDIA_API_DOCS_URL = `${SITE_URL}/encyclopedia/developers`;

export const discoveryLinks = [
  {
    // Plain-text guidance on what this site covers and when an agent should use it.
    href: '/llms.txt',
    rel: 'describedby',
    type: 'text/plain',
  },
  {
    href: API_CATALOG_PATH,
    rel: 'api-catalog',
    type: 'application/linkset+json',
  },
  {
    href: OPENAPI_PATH,
    rel: 'service-desc',
    type: 'application/openapi+json',
  },
  {
    href: API_DOCS_PATH,
    rel: 'service-doc',
    type: 'text/html',
  },
  {
    href: API_STATUS_PATH,
    rel: 'status',
    type: 'application/json',
  },
];

export const apiCatalogDocument = {
  linkset: [
    {
      anchor: API_BASE_URL,
      'service-desc': [
        {
          href: OPENAPI_URL,
          type: 'application/openapi+json',
        },
      ],
      'service-doc': [
        {
          href: API_DOCS_URL,
          type: 'text/html',
        },
      ],
      status: [
        {
          href: API_STATUS_URL,
          type: 'application/json',
        },
      ],
      // `describedby` carries the agent-facing surfaces: plain-text guidance on
      // when to use this API, and the live MCP endpoint.
      describedby: [
        {
          href: `${SITE_URL}/llms.txt`,
          type: 'text/plain',
          title: 'Agent guidance: what this site covers and when to use it',
        },
        {
          href: `${SITE_URL}/.well-known/mcp`,
          type: 'application/json',
          title: 'Model Context Protocol server (Streamable HTTP)',
        },
        {
          href: `${SITE_URL}${DEPRECATION_POLICY_PATH}`,
          type: 'application/json',
          title: 'API versioning and deprecation policy',
        },
      ],
    },
    {
      anchor: `${API_BASE_URL}/encyclopedia`,
      'service-desc': [
        {
          href: OPENAPI_URL,
          type: 'application/openapi+json',
        },
      ],
      'service-doc': [
        {
          href: ENCYCLOPEDIA_API_DOCS_URL,
          type: 'text/html',
        },
      ],
    },
  ],
};

type OpenApiOperation = {
  method: 'get' | 'post' | 'options';
  summary: string;
  description: string;
  tags: string[];
  parameters?: Record<string, unknown>[];
};

function collectionOperations(summary: string, description: string): OpenApiOperation[] {
  return [
    {
      method: 'get',
      summary,
      description,
      tags: ['Collections'],
    },
    {
      method: 'post',
      summary: `${summary} with optional metadata`,
      description:
        `${description} Accepts an optional JSON body with export-style options such as includeMetadata and includeStats.`,
      tags: ['Collections'],
    },
    {
      method: 'options',
      summary: `CORS preflight for ${summary.toLowerCase()}`,
      description: 'Returns allowed methods and headers for the endpoint.',
      tags: ['Collections'],
    },
  ];
}

const openApiOperations: Record<string, OpenApiOperation[]> = {
  '/api/services': collectionOperations(
    'List published services',
    'Returns published service organisations and support listings.'
  ),
  '/api/resources': collectionOperations(
    'List published resources',
    'Returns published resources, documents, and downloads.'
  ),
  '/api/events': collectionOperations(
    'List published events',
    'Returns published community events and activity listings.'
  ),
  '/api/photos': collectionOperations(
    'List published photos',
    'Returns photo gallery items and related metadata.'
  ),
  '/api/jobs': collectionOperations(
    'List published jobs',
    'Returns published job listings and opportunity notices.'
  ),
  '/api/news': collectionOperations(
    'List published news',
    'Returns published news articles and updates.'
  ),
  '/api/courses': collectionOperations(
    'List published courses',
    'Returns published e-learning course records and learning resources.'
  ),
  '/api/community-voices': collectionOperations(
    'List community voices',
    'Returns published community voice and story submissions.'
  ),
  '/api/profiles': collectionOperations(
    'List skills exchange profiles',
    'Returns published skills exchange profiles.'
  ),
  '/api/talents': collectionOperations(
    'List talent profiles',
    'Returns talent directory records exposed through the API.'
  ),
  '/api/marketplace': collectionOperations(
    'List marketplace listings',
    'Returns published marketplace product and service listings.'
  ),
  '/api/stores': collectionOperations(
    'List marketplace stores',
    'Returns published marketplace store records.'
  ),
  '/api/rights': collectionOperations(
    'List rights guidance',
    'Returns rights and legal guidance entries from the rights navigator.'
  ),
  '/api/artists': collectionOperations(
    'List artists',
    'Returns published artist profiles used by the public art catalogue.'
  ),
  '/api/artworks': collectionOperations(
    'List artworks',
    'Returns published artwork records from the public art catalogue.'
  ),
  '/api/poets': collectionOperations(
    'List poets',
    'Returns poet profiles and creative directory entries.'
  ),
  '/api/dancers': collectionOperations(
    'List dancers',
    'Returns dancer and dance crew profiles.'
  ),
  '/api/docs': collectionOperations(
    'List documentation pages',
    'Returns documentation pages from the docs content collection.'
  ),
  '/api/pages': collectionOperations(
    'List published pages',
    'Returns published markdown reference pages served through the catch-all page route.'
  ),
  '/api/encyclopedia': [
    {
      method: 'get',
      summary: 'List and search encyclopedia entries',
      description: 'Returns filtered, sorted, and paginated Dzaleka Encyclopedia records.',
      tags: ['Encyclopedia'],
      parameters: [
        { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Full-text search query.' },
        { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Exact entry category.' },
        { name: 'type', in: 'query', schema: { type: 'string' }, description: 'Exact entry type.' },
        { name: 'status', in: 'query', schema: { type: 'string', enum: ['reviewed', 'developing'] } },
        { name: 'featured', in: 'query', schema: { type: 'boolean' } },
        { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
        { name: 'perPage', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 } },
        { name: 'sort', in: 'query', schema: { type: 'string', enum: ['title', 'updated'] } },
        { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] } },
        { name: 'include', in: 'query', schema: { type: 'string' }, description: 'Set to body to include Markdown bodies.' },
      ],
    },
    {
      method: 'options',
      summary: 'CORS preflight for encyclopedia entries',
      description: 'Returns allowed methods and headers.',
      tags: ['Encyclopedia'],
    },
  ],
  '/api/encyclopedia/{slug}': [
    {
      method: 'get',
      summary: 'Get an encyclopedia entry',
      description: 'Returns one complete entry as JSON or Schema.org JSON-LD.',
      tags: ['Encyclopedia'],
      parameters: [
        { name: 'slug', in: 'path', required: true, schema: { type: 'string' } },
        { name: 'format', in: 'query', schema: { type: 'string', enum: ['jsonld'] }, description: 'Return JSON-LD.' },
      ],
    },
    {
      method: 'options',
      summary: 'CORS preflight for an encyclopedia entry',
      description: 'Returns allowed methods and headers.',
      tags: ['Encyclopedia'],
    },
  ],
  '/api/encyclopedia/suggest': [
    {
      method: 'get',
      summary: 'Suggest encyclopedia entries',
      description: 'Returns lightweight ranked suggestions for search interfaces.',
      tags: ['Encyclopedia'],
      parameters: [
        { name: 'q', in: 'query', required: true, schema: { type: 'string', minLength: 2 } },
        { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 20, default: 8 } },
      ],
    },
  ],
  '/api/encyclopedia/facets': [
    {
      method: 'get',
      summary: 'Get encyclopedia facets',
      description: 'Returns entry counts by category, type, status, and initial letter.',
      tags: ['Encyclopedia'],
    },
  ],
  '/api/search': [
    {
      method: 'get',
      summary: 'Search across collections',
      description: 'Searches multiple public collections with rate limiting and short-lived caching.',
      tags: ['Search'],
    },
    {
      method: 'options',
      summary: 'CORS preflight for search',
      description: 'Returns allowed methods and headers for the search endpoint.',
      tags: ['Search'],
    },
  ],
  '/api/search-index.json': [
    {
      method: 'get',
      summary: 'Fetch the public search index',
      description: 'Returns a flat public search index used by site search and lightweight integrations.',
      tags: ['Search'],
    },
  ],
  '/api/rss': [
    {
      method: 'get',
      summary: 'Fetch the RSS feed',
      description: 'Returns the XML RSS feed for the latest news items.',
      tags: ['Feeds'],
    },
  ],
  '/api/alerts': [
    {
      method: 'get',
      summary: 'Get emergency alerts',
      description: 'Returns curated high-priority alert items for crisis messaging and dashboards.',
      tags: ['Data'],
    },
  ],
  '/api/population': [
    {
      method: 'get',
      summary: 'Get the population snapshot',
      description: 'Returns population totals, demographic split, nationality breakdown, and trend series.',
      tags: ['Data'],
    },
  ],
  '/api/finance': [
    {
      method: 'get',
      summary: 'Get the finance snapshot',
      description: 'Returns the funding snapshot used by the public data dashboard.',
      tags: ['Data'],
    },
  ],
  '/api/weather': [
    {
      method: 'get',
      summary: 'Get weather data',
      description: 'Returns current weather and forecast data, with a fallback if the upstream source is unavailable.',
      tags: ['Data'],
    },
  ],
  '/api/weather-alerts': [
    {
      method: 'get',
      summary: 'Get weather alerts',
      description: 'Returns weather alert items for the weather page.',
      tags: ['Data'],
    },
  ],
  '/api/geolocation': [
    {
      method: 'get',
      summary: 'Get coarse geolocation data',
      description: 'Returns coarse same-origin geolocation data or a safe unavailable response.',
      tags: ['Data'],
    },
  ],
  '/api/charts': [
    {
      method: 'get',
      summary: 'Get prepared chart data',
      description: 'Returns chart series used by visual dashboard sections.',
      tags: ['Data'],
    },
  ],
  '/api/analytics/pageviews': [
    {
      method: 'get',
      summary: 'Get pageview analytics',
      description: 'Returns a lightweight pageview total used by analytics widgets.',
      tags: ['Data'],
    },
  ],
  '/api/export': [
    {
      method: 'get',
      summary: 'Describe export options',
      description: 'Returns export endpoint usage details and supported collections.',
      tags: ['Actions'],
    },
    {
      method: 'post',
      summary: 'Export multiple collections',
      description: 'Exports multiple content collections in one JSON response.',
      tags: ['Actions'],
    },
    {
      method: 'options',
      summary: 'CORS preflight for export',
      description: 'Returns allowed methods and headers for the export endpoint.',
      tags: ['Actions'],
    },
  ],
  '/api/match-category': [
    {
      method: 'post',
      summary: 'Match a skills category',
      description: 'Accepts a skills category and returns a simple matching confirmation response.',
      tags: ['Actions'],
    },
  ],
  '/api/submit-voice': [
    {
      method: 'post',
      summary: 'Submit a community voice entry',
      description: 'Submits a community voice or story payload for follow-up review.',
      tags: ['Actions'],
    },
  ],
  '/api/send-booking-confirmation': [
    {
      method: 'post',
      summary: 'Send a visit booking confirmation',
      description: 'Processes a visit booking request and sends a booking confirmation email.',
      tags: ['Actions'],
    },
  ],
  '/api/status': [
    {
      method: 'get',
      summary: 'Get API status',
      description: 'Returns a lightweight health and discovery status document for the public API.',
      tags: ['Discovery'],
    },
  ],
  [DEPRECATION_POLICY_PATH]: [
    {
      method: 'get',
      summary: 'Get the versioning and deprecation policy',
      description:
        'Returns the machine-readable policy describing how the API is versioned, how removals are signalled ' +
        '(Deprecation per RFC 9745, Sunset per RFC 8594), the minimum notice period, and any endpoints currently ' +
        'scheduled for retirement.',
      tags: ['Discovery'],
    },
  ],
};

/**
 * Build a stable, unique operationId from a path and method, e.g.
 * `/api/encyclopedia/{slug}` + `get` -> `getApiEncyclopediaBySlug`.
 * Function-calling clients use this as the tool name, so it must be unique
 * and stable across releases.
 */
export function buildOperationId(path: string, method: string): string {
  const segments = path
    .split('/')
    .filter(Boolean)
    .map((segment) =>
      segment.startsWith('{')
        ? `By${capitalize(segment.replace(/[{}]/g, ''))}`
        : capitalize(segment.replace(/[^a-zA-Z0-9]+(.)?/g, (_m, chr) => (chr ? chr.toUpperCase() : '')))
    );
  return method.toLowerCase() + segments.join('');
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Shared error responses attached to every operation. */
function errorResponses() {
  const problem = { 'application/problem+json': { schema: { $ref: '#/components/schemas/Problem' } } };
  return {
    '400': { description: 'Malformed request or invalid body.', content: problem },
    '404': { description: 'Resource or collection not found.', content: problem },
    '429': {
      description: 'Rate limit exceeded. Retry after the number of seconds in Retry-After.',
      headers: {
        'Retry-After': { description: 'Seconds to wait before retrying.', schema: { type: 'integer' } },
        'RateLimit-Limit': { description: 'Requests permitted per window.', schema: { type: 'integer' } },
        'RateLimit-Remaining': { description: 'Requests left in the window.', schema: { type: 'integer' } },
        'RateLimit-Reset': { description: 'Seconds until the window resets.', schema: { type: 'integer' } },
      },
      content: problem,
    },
    '500': { description: 'Unexpected server error.', content: problem },
    '503': { description: 'Upstream dependency unavailable.', content: problem },
  };
}

/** Rate-limit and version headers returned on every successful response. */
const successHeaders = {
  'RateLimit-Limit': { description: 'Requests permitted per window.', schema: { type: 'integer' } },
  'RateLimit-Remaining': { description: 'Requests left in the current window.', schema: { type: 'integer' } },
  'RateLimit-Reset': { description: 'Seconds until the window resets.', schema: { type: 'integer' } },
  'RateLimit-Policy': { description: 'Policy expressed as limit;w=window-seconds.', schema: { type: 'string' } },
  'API-Version': { description: 'API version that served this response.', schema: { type: 'string' } },
};

export function buildOpenApiDocument() {
  const paths = Object.fromEntries(
    Object.entries(openApiOperations).map(([path, operations]) => {
      const pathItem = Object.fromEntries(
        operations.map((operation) => [
          operation.method,
          {
            operationId: buildOperationId(path, operation.method),
            tags: operation.tags,
            summary: operation.summary,
            description: operation.description,
            parameters: [
              ...(operation.parameters ?? []),
              {
                name: 'API-Version',
                in: 'header',
                required: false,
                description:
                  'Pin the API version for this request. Omit to use the current version.',
                schema: { type: 'string', default: API_VERSION },
              },
            ],
            responses: {
              '200': {
                description: 'Successful response',
                headers: successHeaders,
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      additionalProperties: true,
                    },
                  },
                },
              },
              ...errorResponses(),
            },
          },
        ])
      );

      return [path, pathItem];
    })
  );

  return {
    openapi: '3.1.0',
    info: {
      title: 'Dzaleka Online Services Public API',
      version: API_VERSION,
      description:
        'Machine-readable description of the public endpoints exposed by Dzaleka Online Services. ' +
        'All endpoints are read-only unless tagged Actions, require no authentication, and return JSON. ' +
        'Errors use RFC 9457 problem+json with a stable machine-readable `code`.',
      contact: {
        name: 'Dzaleka Online Services',
        email: 'dzalekaconnect@gmail.com',
        url: `${SITE_URL}/contact`,
      },
      license: {
        name: 'CC BY-SA 4.0',
        url: 'https://creativecommons.org/licenses/by-sa/4.0/',
      },
    },
    servers: [
      {
        url: SITE_URL,
        description: 'Production',
      },
    ],
    'x-api-version': API_VERSION,
    'x-version-policy': {
      strategy: 'header',
      header: 'API-Version',
      current: API_VERSION,
      description:
        'Send an optional API-Version request header to pin a version; the serving version is echoed on every response. ' +
        'Breaking changes ship under a new major version.',
      deprecation: {
        policy:
          'Deprecated endpoints return the Deprecation header (RFC 9745) and a Sunset header (RFC 8594) with the removal date, plus a Link header with rel="deprecation" and, where a replacement exists, rel="successor-version".',
        minimumNoticePeriod: MINIMUM_NOTICE_PERIOD,
        policyUrl: `${SITE_URL}${DEPRECATION_POLICY_PATH}`,
        announcementUrl: `${SITE_URL}/api-docs#versioning`,
        currentlyDeprecated: DEPRECATIONS.map((entry) => entry.path),
      },
    },
    'x-rate-limit': {
      limit: 60,
      window: '1 minute',
      scope: 'per client IP',
      headers: ['RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset', 'RateLimit-Policy'],
      retryHeader: 'Retry-After',
      description:
        'Successful responses carry RateLimit-* headers so clients can self-throttle. A 429 adds Retry-After.',
    },
    components: {
      schemas: {
        Problem: problemSchema,
      },
      responses: {
        Problem: {
          description: 'RFC 9457 problem details.',
          content: { 'application/problem+json': { schema: { $ref: '#/components/schemas/Problem' } } },
        },
      },
    },
    externalDocs: {
      description: 'Human-readable API documentation',
      url: API_DOCS_URL,
    },
    tags: [
      { name: 'Collections', description: 'Published collection endpoints.' },
      { name: 'Encyclopedia', description: 'Read-only Dzaleka Encyclopedia records, search, and facets.' },
      { name: 'Search', description: 'Search, index, and query endpoints.' },
      { name: 'Feeds', description: 'Syndication endpoints.' },
      { name: 'Data', description: 'Dashboard and snapshot endpoints.' },
      { name: 'Actions', description: 'Submission and export endpoints.' },
      { name: 'Discovery', description: 'Agent and API discovery endpoints.' },
    ],
    paths,
  };
}

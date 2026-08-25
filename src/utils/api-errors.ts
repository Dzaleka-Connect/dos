/**
 * Typed API error model (RFC 9457 "Problem Details for HTTP APIs").
 *
 * Every non-2xx API response uses this shape so agents can branch on a
 * machine-readable `code` instead of parsing prose or an HTML error page.
 * The `resolution` field is a non-standard extension carrying a short,
 * actionable hint.
 */

export const PROBLEM_CONTENT_TYPE = 'application/problem+json; charset=utf-8';

/** Base URI for problem `type` values. Each code resolves to a docs anchor. */
export const PROBLEM_TYPE_BASE = 'https://services.dzaleka.com/api-docs#error-';

export type ApiErrorCode =
  | 'bad_request'
  | 'invalid_body'
  | 'not_found'
  | 'collection_not_found'
  | 'method_not_allowed'
  | 'rate_limited'
  | 'upstream_unavailable'
  | 'internal_error';

/** Default HTTP status and human-readable title for each error code. */
const ERROR_CATALOG: Record<ApiErrorCode, { status: number; title: string; resolution: string }> = {
  bad_request: {
    status: 400,
    title: 'Bad request',
    resolution: 'Check the query parameters against /api/openapi.json and retry.',
  },
  invalid_body: {
    status: 400,
    title: 'Invalid request body',
    resolution: 'Send a JSON object matching the request schema in /api/openapi.json.',
  },
  not_found: {
    status: 404,
    title: 'Resource not found',
    resolution: 'Verify the identifier, or list available records from the collection endpoint.',
  },
  collection_not_found: {
    status: 404,
    title: 'Collection not found',
    resolution: 'Use /.well-known/api-catalog to discover valid collection endpoints.',
  },
  method_not_allowed: {
    status: 405,
    title: 'Method not allowed',
    resolution: 'Check the allowed methods in the Allow header or /api/openapi.json.',
  },
  rate_limited: {
    status: 429,
    title: 'Rate limit exceeded',
    resolution: 'Wait for the number of seconds in Retry-After, then retry.',
  },
  upstream_unavailable: {
    status: 503,
    title: 'Upstream service unavailable',
    resolution: 'This is usually transient. Retry with exponential backoff.',
  },
  internal_error: {
    status: 500,
    title: 'Internal server error',
    resolution: 'Retry once; if it persists, report it at https://services.dzaleka.com/contact.',
  },
};

export type ProblemDetails = {
  type: string;
  title: string;
  status: number;
  code: ApiErrorCode;
  detail: string;
  resolution: string;
  instance?: string;
};

/** Build the problem-details object for an error code. */
export function buildProblem(
  code: ApiErrorCode,
  detail?: string,
  instance?: string
): ProblemDetails {
  const entry = ERROR_CATALOG[code];
  return {
    type: `${PROBLEM_TYPE_BASE}${code}`,
    title: entry.title,
    status: entry.status,
    code,
    detail: detail ?? entry.title,
    resolution: entry.resolution,
    ...(instance ? { instance } : {}),
  };
}

/**
 * Build a Response carrying an RFC 9457 problem document.
 * Extra headers (CORS, rate limit, versioning) are merged in by the caller.
 */
export function problemResponse(
  code: ApiErrorCode,
  detail?: string,
  extraHeaders: Record<string, string> = {},
  instance?: string
): Response {
  const problem = buildProblem(code, detail, instance);
  return new Response(JSON.stringify(problem, null, 2), {
    status: problem.status,
    headers: {
      ...extraHeaders,
      'Content-Type': PROBLEM_CONTENT_TYPE,
    },
  });
}

/** The OpenAPI schema for the problem document, reused across responses. */
export const problemSchema = {
  type: 'object',
  title: 'Problem',
  description:
    'RFC 9457 problem details. Branch on `code`, which is stable across releases; `title` and `detail` are human-readable and may change.',
  required: ['type', 'title', 'status', 'code', 'detail'],
  properties: {
    type: { type: 'string', format: 'uri', description: 'URI identifying the error type.' },
    title: { type: 'string', description: 'Short human-readable summary.' },
    status: { type: 'integer', description: 'HTTP status code.' },
    code: {
      type: 'string',
      description: 'Stable machine-readable error code.',
      enum: Object.keys(ERROR_CATALOG),
    },
    detail: { type: 'string', description: 'Human-readable explanation of this occurrence.' },
    resolution: { type: 'string', description: 'Suggested action an agent can take to recover.' },
    instance: { type: 'string', description: 'URI of the specific request that failed.' },
  },
} as const;

export const errorCatalog = ERROR_CATALOG;

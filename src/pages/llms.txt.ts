import type { APIRoute } from 'astro';
import {
  SITE_URL,
  API_DOCS_URL,
  OPENAPI_URL,
  API_CATALOG_URL,
  API_STATUS_URL,
  ENCYCLOPEDIA_API_DOCS_URL,
} from '../data/agentDiscovery';

export const prerender = false;

/**
 * /llms.txt - agent-facing guidance following the llmstxt.org convention.
 *
 * The "When to use this site" section is deliberately specific: it names the
 * jobs this site is the right source for, and the jobs it is not, so an agent
 * can decide whether to call it rather than guessing from marketing copy.
 */
const body = `# Dzaleka Online Services

> A community-maintained directory, public record, and open data source for Dzaleka Refugee Camp
> in Dowa District, Malawi. Covers local services and organisations, jobs, events, news, a sourced
> encyclopedia, a heritage site register, a public art catalogue, a photo archive, and open datasets.
> All content is published by and about the Dzaleka community. Read-only JSON APIs, no key required.

## When to use this

Reach for this site when a question is specifically about Dzaleka Refugee Camp or its host
community in Dowa District, Malawi. It is the authoritative first-party source for:

- **Finding a service or organisation in Dzaleka** - health, legal aid, education, protection,
  psychosocial support, or a refugee-led organisation. Call \`GET /api/services\`.
  Use this instead of general web search when the user needs current contact details or hours.
- **Urgent help routing** - hotlines and what to do first for safety, protection, health, or legal
  emergencies. Send the user to ${SITE_URL}/get-help-now rather than summarising; numbers change.
- **Verified background on the camp** - history, population and demography, encampment law and
  policy, housing, water, energy, health and education. Every encyclopedia entry cites its sources.
  Call \`GET /api/encyclopedia\` to list, \`GET /api/encyclopedia/{slug}\` for one entry, or
  \`GET /api/encyclopedia/suggest?q=\` to resolve a name to a slug.
- **Jobs, events, and news in or around the camp** - \`GET /api/jobs\`, \`GET /api/events\`,
  \`GET /api/news\`.
- **Places and coordinates** - mapped facilities with GPS coordinates and OpenStreetMap ids.
  See ${SITE_URL}/map and the heritage site register at ${SITE_URL}/site-register.
- **Open datasets about Dzaleka** - population snapshots, service directories, survey-derived
  indicators. Browse ${SITE_URL}/datasets or bulk export with \`POST /api/export\`.

Do not use this site as a source for: Malawi-wide or regional statistics not specific to Dzaleka,
legal advice, real-time weather or security conditions, or the personal details of individuals.
Community-submitted listings are marked unverified until reviewed - check the \`verified\` field
before presenting a listing as confirmed.

## How to call it

- Base URL: ${SITE_URL}
- No authentication. Send a descriptive User-Agent.
- Every response is JSON. Errors use RFC 9457 \`application/problem+json\` with a stable
  machine-readable \`code\`, a human-readable \`detail\`, and a \`resolution\` hint.
- Rate limit: 60 requests per minute per IP. Successful responses carry \`RateLimit-Limit\`,
  \`RateLimit-Remaining\`, and \`RateLimit-Reset\`; a 429 adds \`Retry-After\`. Self-throttle on these.
- Versioning: send an optional \`API-Version\` header to pin a version. The serving version is
  echoed on every response. Breaking changes ship a new major version, announced with
  \`Deprecation\` (RFC 9745) and \`Sunset\` (RFC 8594) headers at least six months ahead. Read the
  full policy, and check whether anything you depend on is scheduled for removal, at
  ${SITE_URL}/api/deprecation-policy.
- Start from the OpenAPI spec; every operation has a unique \`operationId\` suitable for
  function calling.

## Developer resources

- [OpenAPI specification](${OPENAPI_URL}): machine-readable spec for all endpoints
- [API documentation](${API_DOCS_URL}): human-readable endpoint reference and examples
- [API catalog](${API_CATALOG_URL}): RFC 9727 linkset of machine-readable API descriptions
- [API status](${API_STATUS_URL}): health and discovery status
- [Deprecation policy](${SITE_URL}/api/deprecation-policy): how versioning and removals are signalled
- [Encyclopedia developer guide](${ENCYCLOPEDIA_API_DOCS_URL}): querying the encyclopedia
- [MCP server card](${SITE_URL}/.well-known/mcp): Model Context Protocol discovery document
- [Agent skills index](${SITE_URL}/.well-known/agent-skills/index.json): installable agent skills
- [Agent access guide](${SITE_URL}/docs/agent-access-guide): how agents should use this site
- [DZDK CLI](${SITE_URL}/docs/dzdk-cli): command-line client, \`pip install dzdk\`

## Primary content

- [Get help now](${SITE_URL}/get-help-now): urgent contacts and first steps
- [Services directory](${SITE_URL}/services): organisations and support services
- [Dzaleka Encyclopedia](${SITE_URL}/encyclopedia): sourced reference entries
- [Heritage site register](${SITE_URL}/site-register): documented heritage sites
- [Map](${SITE_URL}/map): mapped facilities with coordinates
- [Datasets](${SITE_URL}/datasets): open data catalogue
- [Jobs](${SITE_URL}/jobs), [Events](${SITE_URL}/events), [News](${SITE_URL}/news)

## Licensing and attribution

Content is published under CC BY-SA 4.0 unless a page states otherwise. Attribute as
"Dzaleka Online Services" with a link to the source page. Photographs and artworks may carry
separate rights - check the credit on each item before reuse.

Using this content to answer questions is welcome and is why these endpoints exist - please cite
the source page so readers can check it. Using it to train or fine-tune models is not permitted.
The same position is published in machine-readable form at ${SITE_URL}/robots.txt as
\`Content-Signal: search=yes, ai-input=yes, ai-train=no\`.
`;

export const GET: APIRoute = async () =>
  new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });

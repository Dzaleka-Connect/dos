---
title: Dzaleka Online Services agent access and MCP
slug: agent-access-guide
description: Builder guide for discovering the public API, connecting over MCP, requesting markdown, loading agent skills, and using browser tools
section: developers
lastUpdated: 2026-08-25
---
If you are building a search client, assistant, integration, or browser agent on top of Dzaleka Online Services, start here.

This guide explains the public machine-readable surface, what is safe to build against, and what is only meant for site workflows.

## What you can build today

- Search across published services, resources, events, jobs, news, photos, and docs without scraping cards from the website.
- Fetch published content as JSON through the public API.
- Request markdown instead of HTML when an agent needs cleaner page text.
- Discover the API from well-known documents and `Link` response headers.
- Connect an MCP client to a live read-only MCP server over Streamable HTTP.
- Discover the browser-side WebMCP tool surface from an MCP Server Card.
- Load published agent skills from a machine-readable index.
- Use read-only WebMCP browser tools on supported browsers.

## What this is not

- This is not a general authenticated write API or CMS publishing API.
- `/api/pages` is not a full inventory of every Astro route on the site. It returns published markdown reference pages only.
- Workflow routes such as community voice submission or booking confirmation exist, but they are flow-specific endpoints, not a general ingestion layer for third-party apps.

## Start with discovery

Use the discovery documents first instead of hardcoding route assumptions:

- `/llms.txt`
- `/.well-known/api-catalog`
- `/.well-known/mcp`
- `/.well-known/mcp/server-card.json`
- `/api/openapi.json`
- `/api/status`
- `/api-docs`

HTML pages also return `Link` response headers that point to the catalog, service description, service docs, and status endpoint.

```http
Link: </.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"
Link: </api/openapi.json>; rel="service-desc"; type="application/openapi+json"
Link: </api-docs>; rel="service-doc"; type="text/html"
Link: </api/status>; rel="status"; type="application/json"
```

### Recommended discovery flow

1. Read `/llms.txt` for a short description of what this site covers and when to use it.
2. Call `/api/status` to confirm the service is reachable.
3. Read `/.well-known/api-catalog` for the published service relationships.
4. Load `/api/openapi.json` if you need the current machine-readable contract. Every operation has a unique `operationId` you can bind directly to a function-calling tool.
5. Use `/api-docs` or [API Reference](/docs/api-reference) for human-readable examples and caveats.

## Choose the right integration path

### Use the JSON API when you need structured content

Choose this path for backend integrations, search clients, scheduled sync jobs, and data exports.

### Use markdown negotiation when you need clean page text

Choose this path for RAG pipelines, citation-friendly crawlers, or agents that need page text without parsing HTML.

### Use the skills index when your agent supports Agent Skills

Choose this path when you want published instructions that help an agent route to the right pages, use the public API safely, or prioritise urgent support flows.

### Use the MCP server when your runtime speaks Model Context Protocol

Choose this path when your agent runtime can connect to an MCP server directly. Point it at `https://services.dzaleka.com/.well-known/mcp` and it gets four read-only tools without any HTTP plumbing on your side. See [MCP server](#mcp-server) below.

### Use the MCP Server Card when your runtime supports server discovery

Choose this path when the runtime wants to detect the site's read-only browser WebMCP surface before opening the page and registering tools.

### Use WebMCP when the agent is running inside the browser

Choose this path when a browser-based agent should interact with the live site through explicit tools instead of trying to guess actions from the UI.

### Use the CLI when you are working from a terminal or a script

Install it with `pip install dzdk` and run `dzdk health` to check the API. See
[DZDK CLI](/docs/dzdk-cli) for the command list.

## Public API quick start

Base URL:

```text
https://services.dzaleka.com/api
```

The public API is cross-origin by default and returns JSON unless noted otherwise.

Routes are currently unversioned. Do not assume a `/v1` prefix. Use the API catalog and OpenAPI document to discover the current surface.

### Published collection endpoints

These routes expose published records from content collections. The current collection surface includes:

- `/api/services`
- `/api/resources`
- `/api/events`
- `/api/photos`
- `/api/jobs`
- `/api/news`
- `/api/docs`
- `/api/pages`
- `/api/courses`
- `/api/community-voices`
- `/api/profiles`
- `/api/talents`
- `/api/marketplace`
- `/api/stores`
- `/api/rights`
- `/api/artists`
- `/api/artworks`
- `/api/poets`
- `/api/dancers`

For these collection routes:

- `GET` returns the full published collection.
- `POST` returns the same collection and can include `options.includeMetadata` and `options.includeStats`.
- `OPTIONS` handles CORS preflight.

### Response shape

Collection endpoints return this pattern:

```json
{
  "status": "success",
  "count": 2,
  "data": {
    "services": [
      {
        "id": "sample-service",
        "collection": "services",
        "title": "Sample service"
      }
    ]
  }
}
```

### Search endpoint

Use `/api/search` when the caller does not yet know which collection to read.

Query parameters:

- `q` required search query, minimum 2 characters
- `collections` optional comma-separated list such as `services,events,docs`
- `limit` optional result count per collection, default `10`

Example:

```bash
curl "https://services.dzaleka.com/api/search?q=education&collections=services,events&limit=5"
```

Search responses return grouped results with route URLs:

```json
{
  "status": "success",
  "query": "education",
  "totalResults": 3,
  "results": {
    "services": [
      {
        "slug": "sample-service",
        "title": "Education service",
        "collection": "services",
        "url": "/services/sample-service"
      }
    ]
  }
}
```

Search responses also return a short cache header and cache status:

- `Cache-Control: public, max-age=300`
- `X-Cache: HIT` or `X-Cache: MISS`

### Export endpoint

Use `/api/export` when you need multiple collections in one response.

```bash
curl -X POST "https://services.dzaleka.com/api/export" \
  -H "Content-Type: application/json" \
  -d '{"collections":["services","resources","events"],"options":{"includeMetadata":true,"includeStats":true}}'
```

### Other useful API routes

- `/api/search-index.json` for a flat search snapshot
- `/api/rss` for the news RSS feed
- `/api/alerts` for curated high-priority alert items
- `/api/population` for public population snapshots
- `/api/finance` for funding snapshots used on the data page
- `/api/weather` and `/api/weather-alerts` for weather summaries and alerts
- `/api/geolocation` for the same-origin geolocation proxy
- `/api/charts` for prepared dashboard chart series
- `/api/status` for service health and discovery pointers

### Rate limits

Collection endpoints, `/api/search` and the MCP endpoint apply rate limiting at `60` requests per
minute per IP.

Every successful response carries the current budget so you can self-throttle before being cut off:

- `RateLimit-Limit` - requests allowed in the window
- `RateLimit-Remaining` - requests left
- `RateLimit-Reset` - seconds until the window resets
- `RateLimit-Policy` - the policy, for example `60;w=60`

The legacy `X-RateLimit-Limit`, `X-RateLimit-Remaining` and `X-RateLimit-Reset` headers are still
sent for older clients; note that `X-RateLimit-Reset` is a Unix timestamp while `RateLimit-Reset`
is a count of seconds.

If the limit is exceeded the API returns `429` with `Retry-After` alongside the headers above.

### Error responses

Every error is an [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457) problem document served as
`application/problem+json`. This includes unknown `/api/*` paths, which return JSON rather than the
HTML 404 page.

```json
{
  "type": "https://services.dzaleka.com/api-docs#error-not_found",
  "title": "Resource not found",
  "status": 404,
  "code": "not_found",
  "detail": "No encyclopedia entry with slug \"no-such-entry\".",
  "resolution": "Verify the identifier, or list available records from the collection endpoint.",
  "instance": "/api/encyclopedia/no-such-entry"
}
```

Branch on `code`, which is stable across releases. `title` and `detail` are human-readable and may
change. `resolution` is a short hint describing what to do next.

| `code` | Status | Means |
| --- | --- | --- |
| `bad_request` | 400 | A query parameter is missing or malformed. |
| `invalid_body` | 400 | The request body did not match the schema. |
| `not_found` | 404 | No record with that identifier. |
| `collection_not_found` | 404 | No such endpoint or collection. |
| `method_not_allowed` | 405 | Wrong HTTP method; check the `Allow` header. |
| `rate_limited` | 429 | Budget exhausted; wait for `Retry-After`. |
| `upstream_unavailable` | 503 | A dependency failed. Retry with backoff. |
| `internal_error` | 500 | Unexpected server error. |

### Versioning

The current API version is `1.0.0`. It is echoed on every response in the `API-Version` header, and
you may send `API-Version` on a request to pin it.

Breaking changes ship under a new major version. Endpoints scheduled for removal return the
`Deprecation` header ([RFC 9745](https://www.rfc-editor.org/rfc/rfc9745)) and a `Sunset` header
([RFC 8594](https://www.rfc-editor.org/rfc/rfc8594)) with the removal date, plus a `Link` header
carrying `rel="deprecation"` and, where a replacement exists, `rel="successor-version"`. Nothing is
removed with less than six months of notice.

The full policy is published in machine-readable form at
[`/api/deprecation-policy`](https://services.dzaleka.com/api/deprecation-policy). It lists the
signals, the notice period, and every endpoint currently scheduled for retirement, so you can check
before integrating and again on a schedule:

```bash
curl https://services.dzaleka.com/api/deprecation-policy
```

`deprecated` is an empty array when nothing is scheduled for removal.

## MCP server

`https://services.dzaleka.com/.well-known/mcp` is a live Model Context Protocol server using the
Streamable HTTP transport. It is read-only, needs no authentication, and speaks protocol version
`2025-06-18`. The same server is also served at `https://services.dzaleka.com/mcp` for clients that
expect a bare `/mcp` path; both run the same handlers, and `/.well-known/mcp` is the canonical URL.

`GET` the URL to read a discovery document listing the transports and tools. `POST` JSON-RPC 2.0
messages to the same URL to use it.

### Connecting

Most MCP clients only need the URL. For a client configured by file:

```json
{
  "mcpServers": {
    "dzaleka": {
      "type": "http",
      "url": "https://services.dzaleka.com/.well-known/mcp"
    }
  }
}
```

### Handshake

```bash
curl -X POST https://services.dzaleka.com/.well-known/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"my-agent","version":"1.0"}}}'
```

The server replies with its protocol version, capabilities, `serverInfo`, and an `instructions`
string describing what the site covers. Send `notifications/initialized` afterwards; notifications
receive `202` with no body, as JSON-RPC requires.

### Tools

| Tool | What it does |
| --- | --- |
| `search_dzaleka` | Full-text search across services, resources, events, jobs, news, and encyclopedia entries. Start here when you do not know which collection holds the answer. |
| `list_dzaleka_collection` | Lists every published record in one collection. The `collection` argument is restricted to a published allow-list. |
| `search_dzaleka_encyclopedia` | Resolves a name or topic to encyclopedia entries. |
| `get_dzaleka_encyclopedia_entry` | Returns the full text and cited sources of one entry by slug. |

Call `tools/list` for the current schemas rather than hardcoding them.

```bash
curl -X POST https://services.dzaleka.com/.well-known/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"search_dzaleka","arguments":{"query":"legal aid","limit":5}}}'
```

Each tool returns a single text content block holding the JSON body of the matching REST endpoint,
so results are identical to calling the API directly. `isError` is `true` when the underlying call
failed; the text then holds a problem document.

### Limits

The MCP endpoint shares the same 60 requests per minute per IP budget as the REST API. It exposes
tools only, no resources or prompts, and it never writes. `resources/list` and `prompts/list` return
empty lists rather than errors.

### Browser WebMCP

Separately from the HTTP server, every public page registers read-only tools through
`navigator.modelContext` for agents running inside the browser. See [WebMCP browser tools](#webmcp-browser-tools).

## Markdown for agents

HTML pages can return markdown when the request sends:

```http
Accept: text/markdown
```

When markdown negotiation succeeds, the response includes:

- `Content-Type: text/markdown; charset=utf-8`
- `Vary: Accept`
- `x-markdown-tokens`

Use this when:

- you need text for retrieval or summarization
- you want cleaner page text than raw HTML
- you are indexing guidance pages such as [Get Help Now](/get-help-now), [New to Dzaleka](/new-to-dzaleka), or [Languages](/languages)

Do not expect markdown from JSON API routes. This negotiation is for HTML page responses.

Example:

```bash
curl "https://services.dzaleka.com/get-help-now" \
  -H "Accept: text/markdown"
```

## Agent Skills

Agent Skills are machine-readable instruction sets that help AI agents safely navigate the site and its API. 

The published skills index is:

```text
/.well-known/agent-skills/index.json
```

Use the index when your runtime supports Agent Skills and you want the site to publish task-specific instructions instead of relying on prompt-only routing.

**Learn more:**  
For a detailed breakdown of available skills and implementation examples, see the [Agent Skills Guide](/docs/agent-skills).

Current skill coverage includes:
- urgent help and safety routing
- public API usage guidance
- site navigation and public page handoff

## WebMCP browser tools

On supported browsers, the site exposes read-only WebMCP tools when the page is open in a secure top-level context.

The corresponding MCP Server Card is published at `/.well-known/mcp/server-card.json`.

Current tool names:

- `dzaleka.search_site`
- `dzaleka.search_services`
- `dzaleka.get_weather_summary`
- `dzaleka.get_help_contacts`
- `dzaleka.get_language_support`
- `dzaleka.get_newcomer_guide`

These tools are useful when:

- a browser agent is already on the site
- the task is page-aware and should use live site context
- you want predictable, explicit tool calls instead of DOM scraping

These tools are not a replacement for the public API. Use the JSON API for server-side integrations and long-running jobs.

## Workflow-specific POST routes

The site also exposes a small number of POST routes tied to first-party flows:

- `/api/submit-voice`
- `/api/send-booking-confirmation`
- `/api/match-category`

Use care here:

- they are designed around existing site workflows
- they are not documented as a stable general-purpose write surface
- they do not replace a full partner or publisher API

Current expected payloads are narrow:

- `/api/submit-voice` expects at least `title`, `author`, and `content`
- `/api/send-booking-confirmation` expects booking fields such as `name`, `email`, `visitDate`, `visitTime`, `groupSize`, `tourType`, `meetingPoint`, and `paymentMethod`
- `/api/match-category` expects `category`

If you are building a third-party product that needs durable write access, contact the project first instead of assuming these routes are the supported path.

## Practical integration patterns

### Search-first assistant

1. Use `/api/search` to identify the right collection or route.
2. Follow the returned `url` field for user-facing handoff.
3. Fetch the page as markdown if the agent needs readable text.

### Public data sync

1. Start from `/.well-known/api-catalog`.
2. Read `/api/openapi.json`.
3. Pull only the collections you need.
4. Use `/api/export` if you want a single multi-collection snapshot.

### Browser help agent

1. Use WebMCP if the browser supports it.
2. Prefer `dzaleka.get_help_contacts` or `dzaleka.get_newcomer_guide` for safety and newcomer tasks.
3. Fall back to public page routes if WebMCP is unavailable.

## JavaScript example

```js
const response = await fetch(
  "https://services.dzaleka.com/api/search?q=clinic&collections=services&limit=5",
  {
    headers: {
      Accept: "application/json"
    }
  }
);

const result = await response.json();
console.log(result.results.services);
```

## Start here

- [API Docs](/api-docs) for the live endpoint reference
- [API Reference](/docs/api-reference) for the docs version
- [Get Help Now](/get-help-now) for urgent support routes
- [New to Dzaleka](/new-to-dzaleka) for newcomer guidance
- [Languages](/languages) for language support routes

If you are unsure which public route to trust first, start with `/api/status`, then `/.well-known/api-catalog`, then `/api/search`.

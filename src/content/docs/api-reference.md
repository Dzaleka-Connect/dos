---
title: Dzaleka Online Services API reference
description: Endpoint reference for the Dzaleka Online Services public API, including discovery documents, the MCP server, and the DZDK CLI
section: developers
lastUpdated: 2026-08-25
---

The public API exposes published collections, search, feeds, and selected action endpoints from Dzaleka Online Services.

Use this page when you need the stable routes and request patterns. Use the live reference at [API Docs](/api-docs) when you want the browsable endpoint list.

## Base URLs

- Site: `https://services.dzaleka.com`
- API base: `https://services.dzaleka.com/api`
- OpenAPI: `https://services.dzaleka.com/api/openapi.json`
- API catalog: `https://services.dzaleka.com/.well-known/api-catalog`
- MCP Server Card: `https://services.dzaleka.com/.well-known/mcp/server-card.json`
- Status: `https://services.dzaleka.com/api/status`
- Deprecation policy: `https://services.dzaleka.com/api/deprecation-policy`
- MCP server: `https://services.dzaleka.com/.well-known/mcp` (also at `/mcp`)

## Authentication and limits

- Read access is public. No key required.
- Collection, search and MCP endpoints are rate limited to 60 requests per minute per IP.
- Successful responses carry `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset` and `RateLimit-Policy`. A `429` adds `Retry-After`.
- The current API version is `1.0.0`, echoed on every response in the `API-Version` header. Send `API-Version` on a request to pin it.
- Errors are RFC 9457 problem documents served as `application/problem+json`, with a stable machine-readable `code`. See [Agent Access](/docs/agent-access-guide#error-responses).
- Deprecated endpoints return `Deprecation` (RFC 9745) and `Sunset` (RFC 8594) headers with at least six months of notice. The policy is machine-readable at `/api/deprecation-policy`.
- Most responses are JSON.
- `GET /api/rss` returns XML.

## Collection endpoints

The collection routes all follow the same basic pattern:

- `GET` returns published records
- `POST` returns the same records and can include export-style metadata flags
- `OPTIONS` is available for CORS preflight

Main collection routes:

- `/api/services`
- `/api/resources`
- `/api/events`
- `/api/photos`
- `/api/jobs`
- `/api/news`
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
- `/api/docs`
- `/api/pages`
- `/api/v1/spatial.json` (RFC 7946 GeoJSON FeatureCollection of 92+ spatial nodes)
- `/api/v1/spatial.csv` (Tabular CSV export for QGIS, GeoPandas, and Excel analysis)

`/api/pages` returns published markdown reference pages that are served through the site's catch-all page route.
`/api/v1/spatial.json` returns GeoJSON feature objects for Dzaleka spatial nodes, water boreholes, schools, and health facilities under CC BY-SA 4.0.

### Example

```bash
curl "https://services.dzaleka.com/api/services"
```

### Response shape

```json
{
  "status": "success",
  "count": 1,
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

## Search and feeds

### Search

`GET /api/search`

Query parameters:

- `q` required search query, minimum 2 characters
- `collections` optional comma-separated list such as `services,resources,docs`
- `limit` optional results per collection, default `10`

Example:

```bash
curl "https://services.dzaleka.com/api/search?q=education&collections=services,docs&limit=5"
```

### Search index

`GET /api/search-index.json`

Use this when you need the flat public search index instead of grouped search results.

### RSS

`GET /api/rss`

Returns the public news feed in XML.

## Data snapshot endpoints

These routes power public dashboards and utility pages:

- `/api/alerts`
- `/api/population`
- `/api/finance`
- `/api/weather`
- `/api/weather-alerts`
- `/api/geolocation`
- `/api/charts`
- `/api/analytics/pageviews`

Notes:

- `/api/weather` falls back to seasonal data when the upstream weather source fails.
- `/api/geolocation` returns coarse same-origin geolocation data or an unavailable response when the upstream lookup is blocked.

## Action endpoints

- `GET /api/export` describes supported export options
- `POST /api/export` exports multiple collections in one response

Example:

```bash
curl -X POST "https://services.dzaleka.com/api/export" \
  -H "Content-Type: application/json" \
  -d '{
    "collections": ["services", "resources", "events"],
    "options": {
      "includeMetadata": true,
      "includeStats": true
    }
  }'
```

Other public action routes:

- `POST /api/match-category`
- `POST /api/submit-voice`
- `POST /api/send-booking-confirmation`

These expect JSON request bodies and are tied to specific public workflows.

## Discovery and agents

For automated API discovery, use:

- `/llms.txt`
- `/.well-known/api-catalog`
- `/.well-known/mcp` (also at `/mcp`)
- `/api/deprecation-policy`
- `/.well-known/mcp/server-card.json`
- `/api/openapi.json`
- `/api/status`

Every operation in `/api/openapi.json` has a unique `operationId`, so the spec can be bound directly to a function-calling tool definition.

HTML pages also include `Link` response headers pointing to the catalog, OpenAPI document, docs page, and status endpoint.

Agents can also request markdown responses from HTML pages by sending:

```http
Accept: text/markdown
```

The browser default remains HTML.

### MCP server

`/.well-known/mcp` is a live Model Context Protocol server over Streamable HTTP, protocol version
`2025-06-18`. `GET` it for a discovery document; `POST` JSON-RPC 2.0 to use it. It is read-only and
unauthenticated, and exposes four tools: `search_dzaleka`, `list_dzaleka_collection`,
`search_dzaleka_encyclopedia`, and `get_dzaleka_encyclopedia_entry`. Full walkthrough in
[Agent Access](/docs/agent-access-guide#mcp-server).

### WebMCP

On supported browsers, the site also exposes read-only WebMCP tools for search, services search, weather summary, urgent help contacts, language support routes, and newcomer first steps.

The MCP Server Card describes that browser-side tool surface and is published at `/.well-known/mcp/server-card.json`.

## Related pages

- [API Docs](/api-docs)
- [DZDK CLI](/docs/dzdk-cli) - command-line client, `pip install dzdk`
- [Agent Access](/docs/agent-access-guide)
- [Platform Principles](/docs/platform-principles)
- [Documentation Roadmap](/docs/documentation-roadmap)

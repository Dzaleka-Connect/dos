---
title: API Documentation
description: Public API, discovery endpoints, and agent access notes for Dzaleka Online Services
section: developers
lastUpdated: 2026-04-19
---

# Dzaleka Online Services API

The public API exposes published collections, search, feeds, and selected action endpoints from Dzaleka Online Services.

Use this page when you need the stable routes and request patterns. Use the live reference at [API Docs](/api-docs) when you want the browsable endpoint list.

## Base URLs

- Site: `https://services.dzaleka.com`
- API base: `https://services.dzaleka.com/api`
- OpenAPI: `https://services.dzaleka.com/api/openapi.json`
- API catalog: `https://services.dzaleka.com/.well-known/api-catalog`
- MCP Server Card: `https://services.dzaleka.com/.well-known/mcp/server-card.json`
- Status: `https://services.dzaleka.com/api/status`

## Authentication and limits

- Read access is public.
- Collection and search endpoints are rate limited to 60 requests per minute per IP.
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

- `/.well-known/api-catalog`
- `/.well-known/mcp/server-card.json`
- `/api/openapi.json`
- `/api/status`

HTML pages also include `Link` response headers pointing to the catalog, OpenAPI document, docs page, and status endpoint.

Agents can also request markdown responses from HTML pages by sending:

```http
Accept: text/markdown
```

The browser default remains HTML.

On supported browsers, the site also exposes read-only WebMCP tools for search, services search, weather summary, urgent help contacts, language support routes, and newcomer first steps.

The MCP Server Card describes that browser-side tool surface and is published at `/.well-known/mcp/server-card.json`.

## Related pages

- [API Docs](/api-docs)
- [Agent Access](/docs/agent-access-guide)
- [Platform Principles](/docs/platform-principles)
- [Documentation Roadmap](/docs/documentation-roadmap)

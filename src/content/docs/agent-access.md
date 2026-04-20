---
title: Agent Access
slug: agent-access-guide
description: Builder guide for discovering the public API, requesting markdown, loading agent skills, and using browser tools
section: developers
lastUpdated: 2026-04-19
---

# Agent Access

If you are building a search client, assistant, integration, or browser agent on top of Dzaleka Online Services, start here.

This guide explains the public machine-readable surface, what is safe to build against, and what is only meant for site workflows.

## What you can build today

- Search across published services, resources, events, jobs, news, photos, and docs without scraping cards from the website.
- Fetch published content as JSON through the public API.
- Request markdown instead of HTML when an agent needs cleaner page text.
- Discover the API from well-known documents and `Link` response headers.
- Discover the browser-side WebMCP tool surface from an MCP Server Card.
- Load published agent skills from a machine-readable index.
- Use read-only WebMCP browser tools on supported browsers.

## What this is not

- This is not a general authenticated write API or CMS publishing API.
- `/api/pages` is not a full inventory of every Astro route on the site. It returns published markdown reference pages only.
- Workflow routes such as community voice submission or booking confirmation exist, but they are flow-specific endpoints, not a general ingestion layer for third-party apps.

## Start with discovery

Use the discovery documents first instead of hardcoding route assumptions:

- `/.well-known/api-catalog`
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

1. Call `/api/status` to confirm the service is reachable.
2. Read `/.well-known/api-catalog` for the published service relationships.
3. Load `/api/openapi.json` if you need the current machine-readable contract.
4. Use `/api-docs` or [API Reference](/docs/api-reference) for human-readable examples and caveats.

## Choose the right integration path

### Use the JSON API when you need structured content

Choose this path for backend integrations, search clients, scheduled sync jobs, and data exports.

### Use markdown negotiation when you need clean page text

Choose this path for RAG pipelines, citation-friendly crawlers, or agents that need page text without parsing HTML.

### Use the skills index when your agent supports Agent Skills

Choose this path when you want published instructions that help an agent route to the right pages, use the public API safely, or prioritize urgent support flows.

### Use the MCP Server Card when your runtime supports server discovery

Choose this path when the runtime wants to detect the site's read-only browser WebMCP surface before opening the page and registering tools.

### Use WebMCP when the agent is running inside the browser

Choose this path when a browser-based agent should interact with the live site through explicit tools instead of trying to guess actions from the UI.

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

Collection endpoints and `/api/search` currently apply rate limiting at `60` requests per minute per IP.

If the limit is exceeded, the API returns `429` with:

- `Retry-After`
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

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

---
title: API Documentation
description: Overview of the public Dzaleka Online Services API
section: developers
---

# Dzaleka Online Services API

The Dzaleka Online Services API provides public JSON access to published collections across the site. It is useful for dashboards, research, integrations, and lightweight public tools.

## Base URL

```text
https://services.dzaleka.com/api
```

## Authentication

Read access is currently public. If rate limits or protected endpoints are added later, they will be documented in [API Docs](/api-docs).

## Main endpoints

### Collection endpoints

Collection endpoints are available for published data such as:

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

These collection endpoints support `GET`, `POST`, and `OPTIONS`.

- `GET` returns the published collection
- `POST` returns the same collection and can include metadata or stats
- `OPTIONS` is available for CORS support

Some collections may return an empty result if nothing is currently published there. This is especially true for `/api/pages` if the pages collection is not populated.

### Search and feed endpoints

- `/api/search`
- `/api/search-index.json`
- `/api/rss`

### Data snapshot endpoints

- `/api/alerts`
- `/api/population`
- `/api/finance`
- `/api/weather`
- `/api/weather-alerts`
- `/api/geolocation`
- `/api/charts`
- `/api/analytics/pageviews`

### Action endpoints

- `/api/export`
- `/api/match-category`
- `/api/submit-voice`
- `/api/send-booking-confirmation`

## Common request patterns

### Get a collection

```bash
curl "https://services.dzaleka.com/api/services"
```

Use collection endpoints when you need one content type at a time.

### Search across collections

```bash
curl "https://services.dzaleka.com/api/search?q=education"
```

Optional query parameters:

- `q` for the search term
- `collections` for a comma-separated list such as `services,resources,news`
- `limit` for results per collection

### Export multiple collections

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

Use the export endpoint when you need several collections in one response.

## Other useful requests

### Get the search index

```bash
curl "https://services.dzaleka.com/api/search-index.json"
```

### Get the RSS feed

```bash
curl "https://services.dzaleka.com/api/rss"
```

### Get alerts or dashboard snapshots

```bash
curl "https://services.dzaleka.com/api/alerts"
curl "https://services.dzaleka.com/api/population"
curl "https://services.dzaleka.com/api/finance"
```

## Response format

Most endpoints return JSON with a success or status field plus the requested data. Search and export responses can also include metadata, counts, grouped results, or cache information depending on the endpoint.

RSS is the main exception and returns XML.

## Good uses for the API

- Building lightweight public dashboards
- Pulling published services or resources into another site
- Research and reporting workflows
- Testing integrations before building a larger tool

## Related pages

- [Live API documentation](/api-docs)
- [Open Data Platform](/open-data-platform)
- [Tools and Templates](/tools-and-templates)
- [Contact](/contact)

---
slug: "search-index"
title: Search Index
summary: Flat public search snapshot and grouped search surface for content discovery across the site.
description:
  - "This dataset exposes the search snapshot used for cross-site discovery on Dzaleka Online Services."
  - It is especially useful for clients that need a simple public index instead of fetching each collection independently.
theme: "Operations & monitoring"
publisher: Dzaleka Online Services
coverage: Published public content across the site
updateCadence: Updated with published site content
tags:
  - search
  - index
  - discovery
  - public API
highlights:
  - Flat search snapshot for indexing and reuse
  - "Cross-site grouped search endpoint also available"
  - "Useful for discovery tools, RAG preparation, and search clients"
  - Backed by published content only
distributions:
  - title: Search index JSON
    description: Flat public search index snapshot.
    href: "/api/search-index.json"
    format: JSON
    access: API
  - title: Grouped search API
    description: "Cross-site search endpoint that returns grouped results by collection."
    href: "/api/search?q=dzaleka"
    format: JSON
    access: API
  - title: Search page
    description: "Human-readable search experience for browsing the same public surface."
    href: /search
    format: HTML
    access: Page
recordMode: Build snapshot
lastUpdatedFallback: Published content index
sourceNote: Served as a public search snapshot and grouped search API for published site content.
---

## Maintainer notes

This dataset exposes the search snapshot used for cross-site discovery on Dzaleka Online Services.

It is especially useful for clients that need a simple public index instead of fetching each collection independently.

## Suggested uses

- Flat search snapshot for indexing and reuse
- Cross-site grouped search endpoint also available
- Useful for discovery tools, RAG preparation, and search clients
- Backed by published content only

## Source note

Served as a public search snapshot and grouped search API for published site content.

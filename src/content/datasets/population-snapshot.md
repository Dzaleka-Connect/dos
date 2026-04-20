---
slug: "population-snapshot"
title: Population Snapshot
summary: "Camp-level population totals and reference figures used by the public data views."
description:
  - "This dataset represents the public population snapshot served by the site for data pages, reference views, and quick statistics."
  - "It is best for current-reference use and public context rather than historical time-series analysis."
theme: "Operations & monitoring"
publisher: Dzaleka Online Services
coverage: "Dzaleka Refugee Camp, Malawi"
updateCadence: Updated when the public snapshot changes
featured: true
tags:
  - population
  - demographics
  - operations
  - reference
highlights:
  - Current public population figures
  - Useful for quick reference and dashboard summaries
  - "Pairs with the public data page for human-readable context"
  - Exposed as a lightweight JSON endpoint
distributions:
  - title: Population API
    description: Public JSON population snapshot used across the site.
    href: /api/population
    format: JSON
    access: API
  - title: Data hub
    description: "Human-readable data page with charts, context, and reference material."
    href: /data
    format: HTML
    access: Page
  - title: Open data platform
    description: "Landing page for public datasets, archive access, and data routes."
    href: "/open-data-platform"
    format: HTML
    access: Page
recordMode: Live API
lastUpdatedFallback: Live snapshot
sourceNote: Served as a live public endpoint used by the site’s data views and summaries.
---

## Maintainer notes

This dataset represents the public population snapshot served by the site for data pages, reference views, and quick statistics.

It is best for current-reference use and public context rather than historical time-series analysis.

## Suggested uses

- Current public population figures
- Useful for quick reference and dashboard summaries
- Pairs with the public data page for human-readable context
- Exposed as a lightweight JSON endpoint

## Source note

Served as a live public endpoint used by the site’s data views and summaries.

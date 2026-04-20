---
slug: "finance-snapshot"
title: Finance Snapshot
summary: Public funding and finance snapshot used in the site’s data dashboard and reference views.
description:
  - This dataset packages the public finance snapshot served by the site for data views and operational context.
  - "It is intended for reference use, public transparency, and lightweight integrations that need current summary figures."
theme: "Operations & monitoring"
publisher: Dzaleka Online Services
coverage: Public funding context linked to Dzaleka operations
updateCadence: Updated when the public finance snapshot changes
tags:
  - finance
  - funding
  - operations
  - dashboard
highlights:
  - Current public finance summary figures
  - Useful for dashboard modules and context pages
  - Exposed as a lightweight JSON endpoint
  - Can be paired with narrative and chart views on the data page
distributions:
  - title: Finance API
    description: Public JSON finance snapshot used by site widgets and data views.
    href: /api/finance
    format: JSON
    access: API
  - title: Data hub
    description: "Human-readable data page with related charts and contextual sections."
    href: /data
    format: HTML
    access: Page
  - title: API docs
    description: Reference page for public data routes and related discovery docs.
    href: "/api-docs"
    format: Docs
    access: Docs
recordMode: Live API
lastUpdatedFallback: Live snapshot
sourceNote: Served as a live public endpoint used by the public finance widget and data views.
---

## Maintainer notes

This dataset packages the public finance snapshot served by the site for data views and operational context.

It is intended for reference use, public transparency, and lightweight integrations that need current summary figures.

## Suggested uses

- Current public finance summary figures
- Useful for dashboard modules and context pages
- Exposed as a lightweight JSON endpoint
- Can be paired with narrative and chart views on the data page

## Source note

Served as a live public endpoint used by the public finance widget and data views.

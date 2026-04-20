---
slug: "documentation-pages"
title: Documentation Pages
summary: "Published help guides, builder reference pages, contribution docs, and technical notes served under the docs collection."
description:
  - This dataset exposes the docs collection that powers the documentation section on the site.
  - "It is useful for search, agent routing, and integrations that need durable public guidance pages alongside the API surface."
theme: "Legal & guidance"
publisher: Dzaleka Online Services
coverage: Public documentation for the platform
updateCadence: Updated when docs pages are added or revised
tags:
  - documentation
  - guides
  - reference
  - agents
highlights:
  - Published docs content served at stable routes
  - Useful for builder onboarding and help flows
  - Can be accessed as JSON or as rendered docs pages
  - Complements API docs and discovery endpoints
distributions:
  - title: Collection API
    description: JSON listing of published docs records.
    href: /api/docs
    format: JSON
    access: API
  - title: Docs index
    description: "Human-readable docs home page and guide navigation."
    href: /docs
    format: HTML
    access: Page
  - title: Agent access guide
    description: "Builder guide covering discovery docs, markdown responses, and WebMCP support."
    href: "/docs/agent-access-guide"
    format: Docs
    access: Docs
collection: docs
sourceNote: Built from the published docs collection and related technical reference pages.
---

## Maintainer notes

This dataset exposes the docs collection that powers the documentation section on the site.

It is useful for search, agent routing, and integrations that need durable public guidance pages alongside the API surface.

## Suggested uses

- Published docs content served at stable routes
- Useful for builder onboarding and help flows
- Can be accessed as JSON or as rendered docs pages
- Complements API docs and discovery endpoints

## Source note

Built from the published docs collection and related technical reference pages.

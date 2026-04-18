---
title: "Public API and Agent Access. No scraping required."
description: "Dzaleka Online Services now publishes a cleaner public API surface, discovery routes for agents, markdown responses for HTML pages, and browser tools for supported agent runtimes."
date: 2026-04-18
author: "Dzaleka Online Services"
category: "announcement"
featured: true
image: "/images/Inside Dzaleka/572571024_18312422752301354_5216432236785313120_n.jpg"
tags:
  - "api"
  - "docs"
  - "agents"
  - "webmcp"
  - "platform"
---

You can now build on Dzaleka Online Services without reverse-engineering the website.

Starting today, the public service publishes a clearer machine-readable surface for developers and agent runtimes: discovery documents, a cleaner API reference, markdown responses for HTML pages, a published skills index, and browser-side WebMCP tools for supported environments.

This update adds four practical improvements:

- a published discovery layer through `/.well-known/api-catalog`, `/api/openapi.json`, `/api/status`, and `Link` response headers on HTML pages
- a more accurate public API reference for collection endpoints, search, export, feeds, and data snapshots
- markdown negotiation for HTML pages when a client sends `Accept: text/markdown`
- read-only WebMCP browser tools for search, help contacts, weather, language support, and newcomer guidance

## Build on the public service, not the page chrome

If you are building a search client, assistant, sync job, or browser agent, the goal is simple: use a stable public surface instead of scraping cards or inferring structure from the UI.

That now starts with:

- [API Docs](/api-docs)
- [API Reference](/docs/api-reference)
- [Agent Access](/docs/agent-access-guide)

From there, you can discover the service, read the OpenAPI description, query published collections, or fetch page content as markdown when an agent needs cleaner text.

## What builders can use today

The public API now has a clearer entry point and clearer boundaries.

For structured content, use the collection and search routes:

- `/api/services`
- `/api/resources`
- `/api/events`
- `/api/news`
- `/api/docs`
- `/api/pages`
- `/api/search`
- `/api/export`

For discovery and machine-readable setup, use:

- `/.well-known/api-catalog`
- `/api/openapi.json`
- `/api/status`
- `/.well-known/agent-skills/index.json`

For browser agents on supported platforms, the site now publishes WebMCP tools that expose read-only access to common tasks instead of forcing the agent to guess from buttons and layout.

## Better support for agent and RAG workflows

This release is also about cleaner content access.

HTML pages can now return markdown when the request sends `Accept: text/markdown`. That makes it easier to work with guidance pages, service descriptions, and support routes in systems that need readable text instead of full HTML.

At the same time, the site now publishes an Agent Skills index so supporting runtimes can discover task-specific instructions for:

- urgent help and safety routing
- public API usage
- navigation across the site’s key public guidance pages

## Start here

If you are integrating with the service from code, start with [API Docs](/api-docs).

If you are building an agent experience, start with [Agent Access](/docs/agent-access-guide), then load `/.well-known/api-catalog` and `/.well-known/agent-skills/index.json`.

If you need human-facing guidance routes for support, language, or newcomer flows, use:

- [Get Help Now](/get-help-now)
- [New to Dzaleka](/new-to-dzaleka)
- [Languages](/languages)

This is the direction of the platform: clearer public interfaces, better discovery, and fewer reasons for either people or agents to guess.

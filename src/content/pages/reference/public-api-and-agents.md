---
title: Public API and browser agent access
description: Where to find the public API, discovery documents, markdown responses, and browser agent tools
featured: false
---

# Public API and browser agent access

Dzaleka Online Services exposes a public API and a small set of agent-friendly discovery routes.

## Start here

- [API Docs](/api-docs) is the main human-readable reference.
- [Docs: API Documentation](/docs/api-reference) gives the stable route overview in docs form.
- [Docs: Agent Access](/docs/agent-access-guide) explains machine-readable discovery and browser agent support.

## Discovery routes

- `/.well-known/api-catalog`
- `/.well-known/mcp/server-card.json`
- `/api/openapi.json`
- `/api/status`
- `/.well-known/agent-skills/index.json`

HTML pages also return `Link` response headers that point automated clients to the main discovery routes.

## Markdown responses for agents

Requests that send `Accept: text/markdown` can receive a markdown version of an HTML page instead of normal HTML.

That keeps the browser experience unchanged while giving automated readers a simpler text format when they ask for it.

## Browser agent tools

On supported browsers, the site publishes read-only WebMCP tools on page load. Those tools cover:

- site search
- services search
- weather summary
- urgent help contacts
- language support routes
- newcomer first steps

Use the API docs when you need stable route patterns. Use the normal public pages when a person needs the fastest human-readable answer.

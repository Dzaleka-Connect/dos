---
title: Platform Principles
description: The working principles behind public pages, open discovery, agent support, and documentation structure
section: developers
lastUpdated: 2026-04-19
---

# Platform Principles

These principles explain how Dzaleka Online Services is meant to work as a public information platform.

They help maintainers decide what to publish, how to document it, and what kinds of integrations the public surface should support.

## 1. Page-first for people

Human visitors should be able to reach the right help page without needing to understand the API, the internal collections, or the site's code structure.

This is why the platform keeps strong public front doors such as:

- [Get help now](/get-help-now)
- [New to Dzaleka](/new-to-dzaleka)
- [Languages](/languages)
- [Start Here](/start-here)

## 2. Structured data for builders

If information is public and stable enough to build against, it should be available through a documented machine-readable surface.

That includes:

- public JSON endpoints under `/api`
- discovery documents under `/.well-known`
- an OpenAPI document
- agent skills for published routing and usage guidance

## 3. Honest discovery over implied capability

Discovery documents should describe what the site actually supports, not what might exist later.

This means:

- do not advertise OAuth if the public APIs are not token-protected
- do not claim a generic HTTP MCP endpoint if the site only exposes browser-side WebMCP tools
- do not present flow-specific endpoints as a full public write API

## 4. Public by default, sensitive by design

The platform exists to improve access to practical information, but it should not expose private or risky data casually.

Use this principle when deciding what to publish:

- publish routes, guides, and organization details that help people act
- minimize sensitive personal data
- require care, consent, and dignity for stories, photos, and community submissions

## 5. One stable route per need

Each common user task should have a clear canonical route.

Examples:

- urgent support should point to `/get-help-now`
- service discovery should point to `/services` or `/search`
- builder reference should point to `/api-docs`, `/docs/api-reference`, and `/docs/agent-access-guide`

This keeps both navigation and agent routing predictable.

## 6. Progressive disclosure

Not every page needs to carry every detail.

The docs should:

- keep top-level pages short and decision-oriented
- move implementation details into reference pages
- let agents and developers discover deeper material only when they need it

## 7. Documentation is part of the product

Documentation is not a separate afterthought. It is part of how the platform is used.

Good docs should:

- help people find the right route faster
- help maintainers keep public behavior consistent
- help builders integrate without scraping or guesswork

## 8. Reference pages should match the live surface

When the docs and the live implementation diverge, the docs need to be corrected quickly.

Priority order:

1. fix the live route if it is broken
2. fix the docs if they describe something outdated
3. update discovery documents if the public contract changed

## 9. Keep builders and contributors in view

The platform serves readers, but it also depends on maintainers, editors, and partners.

That is why the docs need dedicated space for:

- contribution workflow
- technical reference
- agent access
- future documentation planning

## Related pages

- [Documentation Roadmap](/docs/documentation-roadmap)
- [Documentation Contributions](/docs/documentation-contributions)
- [API Documentation](/docs/api-reference)
- [Agent Access](/docs/agent-access-guide)


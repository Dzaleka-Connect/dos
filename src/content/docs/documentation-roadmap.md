---
title: Documentation Roadmap
description: A working plan for how the docs are organized now, what tracks exist, and what should be added next
section: developers
lastUpdated: 2026-04-19
---
This page turns the site's documentation strategy into a concrete plan.

The goal is to keep the docs useful for two very different audiences at the same time:

- people who need help finding services, support, events, and opportunities
- builders and maintainers who need stable technical reference, contribution workflow, and discovery guidance

## Documentation tracks

The docs now fit into five working tracks:

### 1. Getting started

Use this track for first-time orientation and broad platform understanding.

- [Getting Started](/docs/getting-started)
- [Platform Features](/docs/platform-features)
- [About Dzaleka Online Services](/docs/about)

### 2. Community and public use

Use this track for people looking for stories, events, jobs, resources, or ways to participate.

- community guides
- service access guides
- search and support help

### 3. Platform and builders

Use this track for developers, researchers, agent builders, and technical partners.

- [Platform Principles](/docs/platform-principles)
- [API Documentation](/docs/api-reference)
- [Agent Access](/docs/agent-access-guide)
- [DZDK CLI](/docs/dzdk-cli)

### 4. Policies and contribution

Use this track for privacy rules, publishing expectations, and update workflow.

- [Privacy Terms](/docs/privacy-terms)
- [Privacy Guidelines](/docs/privacy-guidelines)
- [How to Contribute](/docs/contribute)
- [Documentation Contributions](/docs/documentation-contributions)

### 5. Reference pages

Use this track for stable supporting material that is useful across the site.

- photo gallery guidance
- source notes and credits
- public API and agent reference pages
- site map style pages

## What changed in this pass

This docs pass adds three pieces that were missing:

- a roadmap page so the documentation structure is explicit instead of implied
- a platform principles page so the public API, page guidance, and discovery work have a shared rationale
- a documentation contributions page so maintainers know where docs live and how to update them safely

## Immediate priorities

These should stay visible and up to date because they are the main front doors for technical users:

- `/api-docs`
- [API Documentation](/docs/api-reference)
- [Agent Access](/docs/agent-access-guide)
- `/.well-known/api-catalog`
- `/.well-known/agent-skills/index.json`
- `/.well-known/mcp/server-card.json`

## Next pages to add

The next useful additions are:

- an API changes or versioning page that explains compatibility expectations
- an API errors and response behavior page with common failure patterns
- an editorial standards page for tone, titles, dates, attribution, and source quality

## Maintenance rules

- Keep one clear purpose per page.
- Prefer short pages that link to each other over one page that tries to explain everything.
- Treat public user guidance and builder guidance as separate tracks.
- Keep examples honest to the current implementation. Do not document routes or auth flows that do not exist.
- Update related links when a new page becomes a canonical starting point.

## Where to start

- Start with [Getting Started](/docs/getting-started) if you are learning the platform.
- Start with [Platform Principles](/docs/platform-principles) if you are shaping the docs or public architecture.
- Start with [Documentation Contributions](/docs/documentation-contributions) if you are updating this documentation set.


---
title: Documentation Contributions
description: Where documentation lives in the repo, how to update it safely, and what to check before publishing changes
section: developers
lastUpdated: 2026-04-19
---

# Documentation Contributions

This page is for maintainers and contributors who are updating the documentation itself.

If you want to submit a public story, event, service, or resource, use [How to Contribute](/docs/contribute) instead.

## Where the docs live

The main documentation surfaces are split across a few places in the repo:

- `src/content/docs/` for the documentation collection served at `/docs/*`
- `src/content/pages/reference/` for reference-style content outside the main docs collection
- `src/data/docsNavigation.ts` for docs grouping and sidebar order
- `src/pages/api-docs.astro` for the live browsable API reference page
- `src/content/docs/api-reference.md` and `src/content/docs/agent-access.md` for durable technical guides

## When to add a new page

Add a new page when:

- the topic has a clear audience and purpose
- the content would otherwise make an existing page too broad
- the page can become the stable reference for a recurring question

Do not add a new page when a short section or related-links update would solve the problem more cleanly.

## Frontmatter expectations

Docs pages should include:

- `title`
- `description`
- `section`
- `lastUpdated` when the page is technical, policy-oriented, or likely to change over time

Use short, descriptive titles that match what someone would search for.

## Writing guidelines

- Start with what the page is for.
- Keep the opening paragraph direct and plain.
- Prefer route-based guidance over vague direction.
- Link to canonical pages instead of repeating the same explanation everywhere.
- Use examples when a builder or maintainer might otherwise guess wrong.
- Keep claims aligned with the live implementation.

## Update workflow

1. Decide whether the change belongs in an existing page or a new page.
2. Update the markdown file in `src/content/docs/` or the relevant reference page.
3. If the page should appear in docs navigation, update `src/data/docsNavigation.ts`.
4. Add or refresh related links from nearby docs so the new page is discoverable.
5. Run the site build and fix any frontmatter, link, or content errors before publishing.

## Common documentation buckets

Use these rough buckets to keep the docs coherent:

- public onboarding and support guidance
- community and contribution guidance
- service and opportunity guidance
- technical and builder reference
- policies, privacy, and editorial maintenance

## Good signals that a docs page is healthy

- it has one clear audience
- it points to the next correct action
- it does not duplicate a stronger canonical page
- its links resolve to current routes
- its examples match the current API or page behavior

## Related pages

- [Documentation Roadmap](/docs/documentation-roadmap)
- [Platform Principles](/docs/platform-principles)
- [How to Contribute](/docs/contribute)
- [API Documentation](/docs/api-reference)

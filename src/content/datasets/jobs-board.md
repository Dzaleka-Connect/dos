---
slug: "jobs-board"
title: Jobs Board
summary: "Published job opportunities, roles, and calls for participation shared on Dzaleka Online Services."
description:
  - "This dataset exposes the public jobs collection used on the site. It is useful for opportunity boards, alert digests, and lightweight labor-market snapshots."
  - "Records include public metadata such as organisation, role type, deadline, and route path."
theme: "Livelihoods & opportunity"
publisher: Dzaleka Online Services
coverage: Jobs and opportunities relevant to Dzaleka and nearby partners
updateCadence: "Updated when job posts are added, edited, or removed"
tags:
  - jobs
  - opportunities
  - employment
  - listings
highlights:
  - Public job postings and deadlines
  - Organisation and role metadata
  - Useful for job alerts and opportunity indexes
  - Links back to detailed job pages
distributions:
  - title: Collection API
    description: JSON listing of published job records.
    href: /api/jobs
    format: JSON
    access: API
  - title: Jobs pages
    description: "Human-readable jobs board and detail pages."
    href: /jobs
    format: HTML
    access: Page
  - title: Search endpoint
    description: "Cross-site search for opportunity-focused queries across the jobs collection."
    href: "/api/search?q=jobs&collections=jobs"
    format: JSON
    access: API
collection: jobs
sourceNote: Built from the public jobs collection maintained on the site.
---

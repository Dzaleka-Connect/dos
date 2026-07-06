---
slug: "events-calendar"
title: Events Calendar
summary: "Public record of upcoming and past events, community gatherings, workshops, and cultural programming."
description:
  - This dataset exposes published event records that power the public events pages on the site.
  - "It is suitable for calendar views, discovery tools, partner digests, and community programming summaries."
theme: "Community & culture"
publisher: Dzaleka Online Services
coverage: Dzaleka community events and related programming
updateCadence: "Updated when event listings are published, revised, or archived"
tags:
  - events
  - calendar
  - community
  - culture
highlights:
  - Upcoming and past event records
  - "Public event titles, dates, locations, and categories"
  - Structured data for event discovery and digests
  - "Links back to human-readable event pages"
distributions:
  - title: Collection API
    description: JSON listing of published event records.
    href: /api/events
    format: JSON
    access: API
  - title: Events pages
    description: Public event listings for browsing by visitors and partners.
    href: /events
    format: HTML
    access: Page
  - title: Search endpoint
    description: "Cross-site search that can be narrowed to the events collection."
    href: "/api/search?q=event&collections=events"
    format: JSON
    access: API
collection: events
sourceNote: Built from the site’s published event listings and the matching public API endpoint.
---

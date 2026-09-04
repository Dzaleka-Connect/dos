---
slug: "services-directory"
title: Services Directory
summary: "Published directory of service providers, NGOs, schools, clinics, and support organisations connected to Dzaleka."
description:
  - "This dataset packages the public services catalog maintained on Dzaleka Online Services. It is designed for search, referral handoff, service discovery, and lightweight mapping work."
  - "Records point back to human-readable service pages while also staying available as structured JSON through the public API."
theme: "Services & support"
publisher: Dzaleka Online Services
coverage: Dzaleka and related refugee support context in Malawi
updateCadence: Updated when service listings are published or revised
featured: true
tags:
  - services
  - directory
  - support
  - organisations
highlights:
  - "Public-facing service titles and summaries"
  - Category and listing metadata where published
  - "Stable route paths for human-readable pages"
  - "Useful for referrals, service maps, and search tools"
distributions:
  - title: Collection API
    description: JSON listing of published service records.
    href: /api/services
    format: JSON
    access: API
  - title: Public directory
    description: "Human-readable service directory for browsing and referral handoff."
    href: /services
    format: HTML
    access: Page
  - title: API documentation
    description: Reference page covering the public API surface and discovery routes.
    href: "/api-docs"
    format: Docs
    access: Docs
collection: services
sourceNote: Built from the published services collection exposed on the site and through the public API.
---

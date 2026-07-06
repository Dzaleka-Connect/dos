---
slug: "learning-courses"
title: Learning Courses
summary: "Published course and learning entries exposed through the site’s e-learning catalog."
description:
  - "This dataset exposes the courses collection used by the public e-learning experience."
  - "It can support browsing, discovery, and lightweight learning program summaries for public users and partners."
theme: "Livelihoods & opportunity"
publisher: Dzaleka Online Services
coverage: Public learning and course entries connected to Dzaleka
updateCadence: Updated when course entries are published or revised
tags:
  - courses
  - learning
  - education
  - training
highlights:
  - Course titles and public summaries
  - Useful for learning directories and partner handoff
  - Structured JSON for browse and search interfaces
  - "Links back to the e-learning catalog"
distributions:
  - title: Collection API
    description: JSON listing of published course entries.
    href: /api/courses
    format: JSON
    access: API
  - title: "E-learning pages"
    description: "Human-readable learning catalog and course pages."
    href: "/e-learning"
    format: HTML
    access: Page
  - title: Search endpoint
    description: "Cross-site search that can be narrowed to course content."
    href: "/api/search?q=learning&collections=courses"
    format: JSON
    access: API
collection: courses
sourceNote: "Built from the courses collection used on the public e-learning section."
---

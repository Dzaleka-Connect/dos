---
title: "Announcing Dzaleka Metadata Standard (DMS) v1.1.0"
description: "DMS v1.1.0 is now available with schema files, CLI workflows, a local web UI, and linked-data export for Dzaleka heritage records."
date: 2026-04-17
author: "Bakari Mustafa"
category: "announcement"
featured: true
image: "/images/tumaini-festival-2017-matt-smith/18.JPG"
tags: ["metadata", "heritage", "linked-data", "dms", "open-source"]
---

DMS v1.1.0 is now available.

Released publicly in April 2026, **Dzaleka Metadata Standard (DMS) v1.1.0** packages the archive standard as both a specification and a working toolkit. The goal is simple: make Dzaleka heritage records easier to describe consistently, validate, search, and export.

For the Dzaleka Heritage Archive, that means a stronger base for working with stories, photos, documents, audio, events, maps, artworks, sites, and poems without relying on ad hoc field names or one-off templates.

## What ships in v1.1.0

### Schema files in multiple formats

The current public package includes the DMS schema in:

- **JSON Schema**
- **YAML**
- **JSON-LD**

That gives the project a format for validation, a format for documentation and editing, and a format for linked-data export.

### A CLI for archive workflows

The documented command-line workflows include:

- `dms init` for creating a record
- `dms validate` for checking records against the schema
- `dms search` and `dms stats` for reviewing collections
- `dms report` for generating a browsable HTML catalogue
- `dms export` for producing JSON-LD
- `dms convert csv2json` for spreadsheet-based ingestion
- `dms diff` for comparing record versions

This is the biggest difference between a metadata document and a metadata toolkit: the standard can be used directly in day-to-day work.

### A local web UI and taxonomy service

The package also documents **DMS Vault**, a local web UI started with:

```bash
dms web --port 8080 --dir records/
```

That local interface is paired with a taxonomy API for term lookups, deprecations, change logs, and semantic serializations. In practice, that gives collections work a browser-based entry point instead of forcing everything through raw JSON files.

### Linked-data export

The linked-data side of DMS is one of the clearest parts of the current documentation. The project describes mappings to:

- **Dublin Core**
- **FOAF**
- **BIBO**
- **Schema.org**
- **W3C Geo**
- **SKOS**

That does not automatically create interoperability on its own, but it does make DMS records easier to reuse in catalogues, repositories, and other metadata-aware systems.

## Supported record types

The current schema overview lists 10 core record types:

- story
- photo
- document
- audio
- video
- event
- map
- artwork
- site
- poem

For Dzaleka, that matters because one standard can cover oral history, community photography, documentary material, public art, and site records without flattening them into a single generic form.

## Why this matters for the archive

The strongest case for DMS is consistency. As the archive grows across multiple contributors, collections, and platforms, a shared schema helps keep titles, creators, locations, rights, formats, and relationships readable and reusable.

It also gives the project a clearer path for validation, reporting, and structured export instead of leaving metadata buried in prose or scattered across inconsistent spreadsheets.

## Try it

- **GitHub repository**: [Dzaleka-Connect/Dzaleka-Metadata-Standard](https://github.com/Dzaleka-Connect/Dzaleka-Metadata-Standard)
- **PyPI package**: [dzaleka-metadata-standard](https://pypi.org/project/dzaleka-metadata-standard/)
- **Linked-data guide**: [Linked Data Export](https://dms.dzaleka.com/guides/linked-data-export)

If you want to explore the release as a working tool instead of just reading about it, the CLI and local web UI are the best places to start.

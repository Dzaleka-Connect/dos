---
title: DZDK CLI for Dzaleka Online Services
description: Install and use the DZDK command-line client for the public Dzaleka Online Services API
section: developers
lastUpdated: 2026-08-25
---
The DZDK CLI is a community-maintained command-line tool for working with public Dzaleka Online Services data from a terminal or script.

## Install

The CLI is published on PyPI and needs Python 3.8 or newer:

```bash
pip install dzdk
```

Check it is working:

```bash
dzdk health
```

That reports the status and response time of each public endpoint.

## What it is for

Use the CLI when you want to:

- inspect public collections quickly
- test API responses from the terminal
- export data for reporting or analysis
- script repeatable checks against the public API

## Commands

| Command | What it does |
| --- | --- |
| `dzdk health` | Check the status and response time of each public endpoint |
| `dzdk search --query "<text>"` | Search across services, events, photos, and resources |
| `dzdk services list` | List published services, 12 per page |
| `dzdk services get <id>` | Show one service in full |
| `dzdk events` | Browse published events |
| `dzdk resources` | Browse published resources |
| `dzdk photos` | List and upload photos |
| `dzdk population` | Access population data |
| `dzdk stats` | View statistics and analytics |
| `dzdk export csv` | Export data to CSV |
| `dzdk export report` | Generate a markdown report |
| `dzdk batch` | Batch operations for resources and photos |
| `dzdk shell` | Start an interactive shell |
| `dzdk config` | Configure the API URL and request timeout |
| `dzdk show-config` | Print the current configuration |

Run `dzdk <command> --help` for the options on any command.

## Examples

Search for a service and limit the results:

```bash
dzdk search --query "legal aid" --type services --limit 5
```

List services, then inspect one:

```bash
dzdk services list
dzdk services get <id>
```

Export a collection for analysis:

```bash
dzdk export csv
```

## API base URL

The CLI connects to the same public API used by the site:

```text
https://services.dzaleka.com/api
```

Point it somewhere else, or change the request timeout, with:

```bash
dzdk config --url "https://services.dzaleka.com/api" --timeout 30
```

## Source and releases

The CLI is maintained separately from this website:

- [DZDK CLI repository](https://github.com/Dzaleka-Connect/dzdk-cli)
- [dzdk on PyPI](https://pypi.org/project/dzdk/)

## If you only need the data

If you do not need the CLI itself, you can work directly with:

- [API Documentation](/api-docs)
- [Agent Access](/docs/agent-access-guide) for agent and MCP integration
- [Open Data Platform](/open-data-platform)

## Need help?

- [API Documentation](/api-docs)
- [Contact](/contact)
- [Help Desk](/help-desk)

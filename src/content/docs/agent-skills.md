---
title: Agent Skills
slug: agent-skills
description: A detailed guide to the machine-readable instructions that help AI agents safely navigate Dzaleka Online Services and its public API.
section: developers
lastUpdated: 2026-04-18
---
Agent Skills are machine-readable instruction sets that help AI agents, assistants, and RAG pipelines interact safely and effectively with Dzaleka Online Services.

While the Public API provides the data, **Agent Skills** provide the "rules of engagement"—telling an agent when to use the API, which pages to prioritise in a crisis, and how to avoid common pitfalls like hallucinating contact information.

## Discovery

Agents should start by loading the skills index to discover available instructions.

**Index Location:**
`https://services.dzaleka.com/.well-known/agent-skills/index.json`

The index follows the [Agent Skills 0.2.0](https://schemas.agentskills.io/discovery/0.2.0/schema.json) schema. Each entry provides a name, a description, and a URL to the specific `SKILL.md` file.

## The Skill Format (SKILL.md)

Each skill is published as a markdown file with YAML frontmatter. This format is designed to be easily parsed by both humans and LLMs.

A typical `SKILL.md` includes:
- **Name & Description**: Defining the skill's purpose.
- **Compatibility**: The environment needed (for example, "Standard JSON fetch").
- **When/Do Not Use**: Guardrails for the agent's routing logic.
- **Working Sequence**: Step-by-step instructions for the task.
- **Route/API Map**: Key URLs or endpoints relevant to the skill.

## Core Skills

Dzaleka Online Services currently publishes three core skills:

### 1. Help and Safety
**Name:** `dzaleka-help-and-safety`  
**Purpose:** Routing urgent protection, rights, and newcomer support requests.

Use this skill when a user is in crisis or needs immediate guidance. It prioritises the [Get Help Now](/get-help-now) and [Rights Navigator](/rights-navigator) routes above all other background information.

### 2. Public API
**Name:** `dzaleka-public-api`  
**Purpose:** Guidance for developers and agents on using the JSON API.

Use this skill to prevent agents from scraping HTML when a structured JSON endpoint exists. It defines the "Preferred Response Style" for data tasks and points to the discovery layer (`api-catalog`).

### 3. Site Navigation
**Name:** `dzaleka-site-navigation`  
**Purpose:** Helping agents find the right public page for a human user.

Use this skill to map user intent (for example, "Where are the jobs?") to the correct page route (`/jobs/`). It includes "Routing Rules" to ensure agents don't bury urgent links under generic navigation menus.

## Implementation Guide

### Loading Skills (JavaScript)

```javascript
async function loadAgentSkills() {
  const indexUrl = 'https://services.dzaleka.com/.well-known/agent-skills/index.json';
  const response = await fetch(indexUrl);
  const index = await response.json();

  const skills = await Promise.all(index.skills.map(async (skill) => {
    const res = await fetch(`https://services.dzaleka.com${skill.url}`);
    const content = await res.text();
    return { ...skill, content };
  }));

  return skills;
}
```

### Prompt Integration

When integrating these skills into an LLM-based agent, we recommend injecting the `SKILL.md` content into the system prompt or using it as a few-shot example for the agent's routing logic.

**Example Routing Rule:**
> "Before answering a question about Dzaleka, check the `dzaleka-site-navigation` skill. If the user's intent matches a listed route, prioritise that link in your response."

## Guardrails & Safety

To ensure the safety of the Dzaleka community, all agents using these skills must adhere to these guardrails:

- **Trust the Live Page**: If a `SKILL.md` file and a live page disagree, the agent should trust the live response.
- **Do Not Invent Contacts**: Never hallucinate phone numbers, office hours, or locations. Only use the exact strings provided in the skills or on the matching public pages.
- **Prioritise the "Get Help Now" Route**: If a user's request sounds urgent (violence, health, protection), always lead with the [Get Help Now](/get-help-now) link.
- **No Scraping when API Exists**: Prefer JSON endpoints over HTML scraping whenever the skill indicates an API path is available.

---

**Next Steps:**
- Read the [Agent Access Guide](/docs/agent-access-guide)
- Explore the [API Reference](/docs/api-reference)

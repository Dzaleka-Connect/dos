---
title: "Introducing Dzaleka Online Services Skills"
description: "Empower your AI Agents to access, search, and understand Dzaleka community data."
date: 2026-02-01
author: "Bakari Mustafa"
category: "announcement"
featured: true
image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiaidP0Wx8FRCPyeLo4KB-GwxP4AU4cSyQq96Dk9DqfTuFxCsi8doQPSng4bwxXut0Rq1UFGl8Hdm2tGkSPh3-b7_b_BARIrKSY9NzJIxT7kX4dUp93Rx2sx7MZfF2nxPOnJe3tVjF81E4/s1600/malawi_education_hp_image.jpg__1600x900_q85_crop_subsampling-2.jpg"
tags: ["ai agents", "api", "skills", "technology", "developer"]
---

AI agents are becoming a core part of how we interact with digital services. To get the most out of them, they need direct access to accurate, up-to-date local information.

[Agent skills](https://agentskills.io) are a new open standard for providing this expertise to agents. Today, we're releasing the **Dzaleka Online Services API Skill**.

### What are Agent Skills?

Agent Skills are modular capabilities that extend what an agent can do using the context window. They package expert knowledge—instructions, metadata, and resources—that tell an agent *how* to perform a specific task effectively.

Think of them as "plugins" for AI reasoning. Instead of relying on generic training data, a skill provides precise, up-to-date methods for interacting with a specific system (like Dzaleka Online Services).

When you install the Dzaleka API Skill, you're not just giving an agent access to an API; you're giving it the expert knowledge on how to *use* that API correctly to find local information.

For example, the [Dzaleka Online Services API Skill](https://github.com/Dzaleka-Connect/dzaleka-api-skills/tree/main/dzaleka-online-services-api) includes:

```
dzaleka-online-services-api/
├── SKILL.md         # Instructions for the agent
└── references/
    ├── endpoints.md # List of verified API endpoints
    ├── schemas.md   # Data structures for resources
    └── errors.md    # Error handling and status codes
```

This structure ensures the agent knows exactly what endpoints are available and how to handle the data it receives.

### Dzaleka Online Services API Skill

This skill gives agents the context they need to find services, events, jobs, and news directly from the Dzaleka Online Services platform.

[Dzaleka Online Services API Skill — Access live community data.](https://github.com/Dzaleka-Connect/dzaleka-api-skills)

To install the skill, run:

```bash
npx skills add Dzaleka-Connect/dzaleka-api-skills
```

**What it enables:**
- **Service Discovery:** Find clinics, NGOs, and education centers with current operating hours.
- **Event Awareness:** Query upcoming community events and cultural activities.
- **Job Search:** Match user skills with active job postings in the camp.
- **Real-time News:** Access the latest updates and stories from the community.

### Agent experience (AX) is Community Experience

Just as Developer Experience (DX) matters for APIs, Agent Experience (AX) matters for AI. By formalizing this skill, we ensure that every AI agent—whether it's Claude, ChatGPT, or a custom bot—understands the *structure* of Dzaleka's data. They don't just guess; they query.

This means more accurate answers for residents, better resource discovery for newcomers, and a more connected digital ecosystem.

### Get started

Install the skill and start building:

```bash
npx skills add Dzaleka-Connect/dzaleka-api-skills
```

This skill is a living document, and we'll be updating it as the Dzaleka API evolves. As you use it, let us know how it can be improved so we can make it even better.

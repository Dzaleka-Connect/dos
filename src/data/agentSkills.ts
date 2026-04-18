import { createHash } from 'node:crypto';
import { SITE_URL } from './agentDiscovery';

export const AGENT_SKILLS_SCHEMA_URL = 'https://schemas.agentskills.io/discovery/0.2.0/schema.json';
export const AGENT_SKILLS_INDEX_PATH = '/.well-known/agent-skills/index.json';
export const AGENT_SKILLS_CACHE_CONTROL = 'public, max-age=3600';

type AgentSkillSource = {
  name: string;
  description: string;
  compatibility?: string;
  body: string;
};

export type PublishedAgentSkill = {
  name: string;
  type: 'skill-md';
  description: string;
  url: string;
  digest: string;
  content: string;
};

function quoteYaml(value: string) {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function buildSkillMarkdown(source: AgentSkillSource) {
  return [
    '---',
    `name: ${quoteYaml(source.name)}`,
    `description: ${quoteYaml(source.description)}`,
    ...(source.compatibility ? [`compatibility: ${quoteYaml(source.compatibility)}`] : []),
    '---',
    '',
    source.body.trim(),
    '',
  ].join('\n');
}

function buildSkill(source: AgentSkillSource): PublishedAgentSkill {
  const content = buildSkillMarkdown(source);
  const digest = `sha256:${createHash('sha256').update(content, 'utf8').digest('hex')}`;

  return {
    name: source.name,
    type: 'skill-md',
    description: source.description,
    url: `/.well-known/agent-skills/${source.name}/SKILL.md`,
    digest,
    content,
  };
}

const skillSources: AgentSkillSource[] = [
  {
    name: 'dzaleka-help-and-safety',
    description:
      'Route urgent help, protection, rights, and newcomer support requests to the right Dzaleka pages and verified public contacts.',
    compatibility:
      'HTTPS access to services.dzaleka.com. Designed for public web agents and assistants handling safety or support questions.',
    body: `
# Dzaleka Help And Safety

Use this skill when a user needs urgent help, safety guidance, support contacts, rights reporting, or first-step guidance after arriving in Dzaleka.

## When To Use This Skill

- Use this skill when the user says the problem is urgent, unsafe, or cannot wait.
- Use this skill when the user asks about violence, abuse, trafficking, child risk, arrest, detention, legal trouble, urgent medical care, or missing support contacts.
- Use this skill when a newcomer needs the safest first step, not a long explanation.

## Do Not Use This Skill

- Do not use this skill for general site browsing or for non-urgent content discovery.
- Do not use this skill when the user wants structured API data.
- Do not improvise legal or medical advice beyond routing and page-based guidance.

## Response Order

1. If there is immediate danger, lead with ${SITE_URL}/get-help-now/ and the fastest available hotline or emergency route from that page.
2. If the issue involves protection, abuse, trafficking, threats, or rights violations, use ${SITE_URL}/rights-navigator/ and the reporting routes under it.
3. If the issue involves arrest, detention, documents, or refugee status follow-up, route to the legal aid pages or UNHCR follow-up pages before giving background.
4. If the issue is medical, route to the clinic or health page first.
5. If the user is new and the situation is not an active crisis, add ${SITE_URL}/new-to-dzaleka/ as the next page.

## Route Map

- Immediate crisis or urgent help: ${SITE_URL}/get-help-now/
- Rights guidance and reporting: ${SITE_URL}/rights-navigator/
- Report a rights violation: ${SITE_URL}/rights-navigator/incident-report/
- Protection hotlines: ${SITE_URL}/rights-navigator/protection-hotlines
- Legal aid directory: ${SITE_URL}/rights-navigator/legal-aid-directory
- Non-urgent support follow-up: ${SITE_URL}/help-desk/
- First-week guidance for new arrivals: ${SITE_URL}/new-to-dzaleka/
- Simpler wording for support information: ${SITE_URL}/easy-read/getting-help/
- Language support: ${SITE_URL}/languages/

## Response Style

- Give the fastest safe next step first.
- Keep the answer short and operational.
- If you include a phone number or office contact, copy it exactly from the live page, not memory.
- If the user sounds overwhelmed, offer one primary route and one backup route only.

## Guardrails

- Do not invent phone numbers, office hours, or eligibility rules.
- Do not promise that a listed organisation will respond immediately.
- Do not bury the urgent route under extra context.
- If the page and your memory disagree, trust the page.
`,
  },
  {
    name: 'dzaleka-public-api',
    description:
      'Discover and use the Dzaleka public JSON API, status endpoint, and API documentation instead of scraping public HTML pages.',
    compatibility:
      'HTTPS access to services.dzaleka.com with standard JSON and markdown fetch support. No authentication required for public endpoints.',
    body: `
# Dzaleka Public API

Use this skill when you need structured data from services.dzaleka.com instead of scraping cards, lists, or article pages.

## When To Use This Skill

- Use this skill when the user needs JSON records, endpoint discovery, or machine-readable status.
- Use this skill when the task is better served by a public API response than by reading HTML.
- Use this skill when you need to verify what the site exposes before scraping or indexing it.

## Do Not Use This Skill

- Do not use this skill when the user simply needs a public page to click and read.
- Do not describe undocumented filters, pagination, or fields as if they are guaranteed.
- Do not scrape HTML when a matching API endpoint already exists.

## Working Sequence

1. Check ${SITE_URL}/api/status if the task depends on live API availability.
2. Use ${SITE_URL}/.well-known/api-catalog to discover the service description, service docs, and status endpoint.
3. Read ${SITE_URL}/api/openapi.json or ${SITE_URL}/api-docs/ before claiming an endpoint shape.
4. Choose the narrowest matching endpoint.
5. Use ${SITE_URL}/api/search when the user does not yet know which collection they need.

## Core Endpoints

- Services directory: ${SITE_URL}/api/services
- Resources and downloads: ${SITE_URL}/api/resources
- Events: ${SITE_URL}/api/events
- Photos: ${SITE_URL}/api/photos
- Jobs: ${SITE_URL}/api/jobs
- News: ${SITE_URL}/api/news
- Courses: ${SITE_URL}/api/courses
- Rights guidance: ${SITE_URL}/api/rights
- Search across collections: ${SITE_URL}/api/search?q=education&collections=services,events&limit=5
- Search index snapshot: ${SITE_URL}/api/search-index.json
- Bulk export: ${SITE_URL}/api/export

## Response Style

- Name the exact endpoint you used.
- If the user asked for data, summarise the result and keep the endpoint available as a reference.
- If the API is not the best interface for the user, route them back to the matching public page.

## Guardrails

- Prefer JSON endpoints over HTML scraping whenever the API already exposes the data.
- Use only documented query parameters and fields.
- Use ${SITE_URL}/api/pages only for published markdown reference pages, not as an inventory of every Astro route.
- If the API docs and the live response disagree, trust the live response and note the mismatch.
`,
  },
  {
    name: 'dzaleka-site-navigation',
    description:
      'Find the right public Dzaleka page for services, stories, weather, updates, language access, and Easy Read guidance.',
    compatibility:
      'Public web browsing on services.dzaleka.com. Best for agents helping users reach the right human-facing page quickly.',
    body: `
# Dzaleka Site Navigation

Use this skill when the user needs to reach the right public page quickly and the correct route is more important than a long explanation.

## When To Use This Skill

- Use this skill when the user asks where to find something on the site.
- Use this skill when the best answer is a route recommendation, not a detailed explanation.
- Use this skill when the user is new, needs simpler wording, or does not know which section to open.

## Do Not Use This Skill

- Do not use this skill when the user explicitly needs API output or structured records.
- Do not answer an urgent safety question with a broad navigation menu.
- Do not claim a page is translated unless the page itself says so.

## Intent Map

- General orientation: ${SITE_URL}/start-here/
- First days in Dzaleka: ${SITE_URL}/new-to-dzaleka/
- Urgent support: ${SITE_URL}/get-help-now/
- Service directory: ${SITE_URL}/services/
- Rights guidance or reporting: ${SITE_URL}/rights-navigator/
- Easier English: ${SITE_URL}/easy-read/
- Language support: ${SITE_URL}/languages/
- Weather and alerts fallback: ${SITE_URL}/weather/
- Community stories and photo essays: ${SITE_URL}/stories/
- Site and product updates: ${SITE_URL}/updates/
- If the section is still unclear: ${SITE_URL}/search/

## Routing Rules

- If the request sounds urgent, always lead with ${SITE_URL}/get-help-now/.
- If the user is new to the camp or new to the site, start with ${SITE_URL}/new-to-dzaleka/ or ${SITE_URL}/start-here/.
- If the user struggles with long or complex wording, pair the main route with ${SITE_URL}/easy-read/.
- If the user asks for services, give ${SITE_URL}/services/ before suggesting search.
- Use ${SITE_URL}/search/ only when a more direct section is not obvious.

## Response Style

- Lead with one best page and one sentence explaining why it fits.
- Add one backup page only if it genuinely helps.
- Keep route names plain and user-facing.

## Guardrails

- Prefer one strong route recommendation over a long menu.
- Do not send the user to the API when they need a readable page.
- Do not overload the answer with every section on the site.
`,
  },
];

export const publishedAgentSkills = skillSources.map(buildSkill);

export const publishedAgentSkillsByName = new Map(
  publishedAgentSkills.map((skill) => [skill.name, skill])
);

export const agentSkillsIndexDocument = {
  $schema: AGENT_SKILLS_SCHEMA_URL,
  skills: publishedAgentSkills.map(({ content, ...skill }) => skill),
};

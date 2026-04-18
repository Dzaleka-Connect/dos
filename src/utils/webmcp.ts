type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
type JsonObject = Record<string, JsonValue>;

type ModelContextClient = {
  requestUserInteraction?: <T>(callback: () => Promise<T> | T) => Promise<T>;
};

type ModelContextTool = {
  name: string;
  title?: string;
  description: string;
  inputSchema?: JsonObject;
  annotations?: {
    readOnlyHint?: boolean;
  };
  execute: (input: Record<string, unknown>, client: ModelContextClient) => Promise<unknown> | unknown;
};

type ModelContextProvider = {
  provideContext?: (context: { tools: ModelContextTool[] }) => void;
  registerTool?: (tool: ModelContextTool, options?: { signal?: AbortSignal }) => void;
  unregisterTool?: (name: string) => void;
};

declare global {
  interface Navigator {
    modelContext?: ModelContextProvider;
  }

  interface Window {
    __dzalekaWebMcpAbortController?: AbortController;
  }
}

const DEFAULT_SEARCH_COLLECTIONS = ['services', 'resources', 'events', 'news', 'photos', 'jobs', 'docs'];
const SEARCH_COLLECTION_ENUM = ['services', 'resources', 'events', 'news', 'photos', 'jobs', 'docs'];
const MAX_SEARCH_LIMIT = 10;
const DEFAULT_WEATHER_ALERT_LIMIT = 3;

const URGENT_HELP_HOTLINES = [
  {
    title: 'Gender-based violence, trafficking, or forced marriage',
    value: '5600',
    availability: '24 hours',
    detail: 'Tithandizane GBV crisis line. Free to call from Malawian mobile networks.',
  },
  {
    title: 'Child protection',
    value: '116',
    availability: '24 hours',
    detail: 'Use this if a child is being abused, exploited, neglected, or is in danger.',
  },
  {
    title: 'Youth support and sexual health information',
    value: '393',
    availability: '24 hours',
    detail: 'Confidential support for young people who need advice or referrals.',
  },
];

const URGENT_HELP_OFFICE_CONTACTS = [
  {
    title: 'UNHCR Malawi office',
    value: '+265 177 2155',
    availability: 'Mon-Thu 7:30-17:00, Fri 7:30-13:30',
    detail: 'For protection, documentation, or status issues that need UNHCR follow-up.',
  },
  {
    title: 'UNHCR protection email',
    value: 'mlwli@unhcr.org',
    availability: 'Email',
    detail: 'Useful when you need to send written details or documents.',
  },
];

const URGENT_HELP_ROUTES = [
  {
    title: 'Safety or protection help',
    description:
      'Use this for violence, abuse, trafficking, threats, exploitation, or another protection concern.',
    links: [
      { label: 'Protection hotlines', href: '/rights-navigator/protection-hotlines' },
      { label: 'Report a rights violation', href: '/rights-navigator/incident-report' },
      { label: 'Rights Navigator', href: '/rights-navigator' },
    ],
  },
  {
    title: 'Legal help or arrest support',
    description:
      'Use this for legal advice, refugee status issues, arrest, detention, or other rights problems.',
    links: [
      { label: 'Legal aid directory', href: '/rights-navigator/legal-aid-directory' },
      { label: 'UNHCR Malawi', href: '/services/unhcr-malawi' },
      { label: 'Rights Navigator', href: '/rights-navigator' },
    ],
  },
  {
    title: 'Medical help',
    description:
      'Use this if you are sick, injured, pregnant, need treatment, or need urgent health support.',
    links: [
      { label: 'Dzaleka Health Centre', href: '/services/dzaleka-health-centre' },
      { label: 'Browse services', href: '/services' },
      { label: 'Help Desk', href: '/help-desk' },
    ],
  },
  {
    title: 'Food, shelter, or essential support',
    description:
      'Use this if the need is urgent and you need to reach emergency relief or general support routes.',
    links: [
      { label: 'Emergency relief application', href: '/applications/internal/emergency' },
      { label: 'Help Desk', href: '/help-desk' },
      { label: 'Start Here', href: '/start-here' },
    ],
  },
];

const LANGUAGE_SUPPORT_ROUTES = [
  {
    title: 'Easier English',
    description: 'Start with Easy Read if you want shorter sentences and simpler guidance.',
    links: [
      { label: 'Open Easy Read', href: '/easy-read' },
      { label: 'Open New to Dzaleka', href: '/new-to-dzaleka' },
    ],
  },
  {
    title: 'Urgent help in a crisis',
    description: 'Use the urgent help page first and tell the person helping you what language you need.',
    links: [{ label: 'Open Get help now', href: '/get-help-now' }],
  },
  {
    title: 'Spoken news and community information',
    description:
      'Yetu Radio is the main multilingual route linked on this site and broadcasts in Chichewa, English, French, Swahili, and Kinyarwanda.',
    links: [{ label: 'Open Yetu Radio', href: '/yetu-radio' }],
  },
  {
    title: 'Non-urgent questions',
    description: 'The Help Desk can reply in English, French, and Swahili.',
    links: [{ label: 'Open Help Desk', href: '/help-desk' }],
  },
];

const NEWCOMER_STEPS = [
  {
    title: 'Start with urgent help if the problem cannot wait',
    description:
      'If someone is at risk or needs immediate support, go to the urgent help route before anything else.',
    href: '/get-help-now',
  },
  {
    title: 'Keep documents and key numbers together',
    description:
      'Keep identity papers, registration papers, referrals, and important contact numbers in one safe place.',
    href: '/services/unhcr-malawi',
  },
  {
    title: 'Learn where to ask for health help',
    description:
      'The Dzaleka Health Centre is the main clinic route surfaced on this site for treatment, maternal care, and urgent health support.',
    href: '/services/dzaleka-health-centre',
  },
  {
    title: 'Say what language you need early',
    description:
      'If you need help in another language, say that as early as you can and use the language page or Yetu Radio next.',
    href: '/languages',
  },
];

function getSiteOrigin() {
  return window.location.origin;
}

function toAbsoluteUrl(path: string) {
  return new URL(path, getSiteOrigin()).toString();
}

function parseString(input: unknown, fieldName: string) {
  if (typeof input !== 'string' || input.trim().length === 0) {
    throw new Error(`${fieldName} must be a non-empty string.`);
  }

  return input.trim();
}

function parseInteger(input: unknown, fallback: number, min: number, max: number) {
  if (typeof input !== 'number' || !Number.isFinite(input)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.round(input)));
}

function parseCollections(input: unknown) {
  if (!Array.isArray(input) || input.length === 0) {
    return DEFAULT_SEARCH_COLLECTIONS;
  }

  const collections = input
    .filter((value): value is string => typeof value === 'string')
    .map((value) => value.trim())
    .filter((value) => SEARCH_COLLECTION_ENUM.includes(value));

  return collections.length > 0 ? collections : DEFAULT_SEARCH_COLLECTIONS;
}

function buildTextResult(text: string, data: Record<string, unknown> = {}) {
  return {
    content: [
      {
        type: 'text',
        text,
      },
    ],
    data,
  };
}

async function fetchJson<T>(path: string) {
  const response = await fetch(path, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status} for ${path}`);
  }

  return (await response.json()) as T;
}

type SearchApiResult = {
  status: string;
  query: string;
  totalResults: number;
  results?: Record<
    string,
    Array<{
      slug: string;
      title: string;
      description?: string;
      category?: string;
      collection: string;
      url: string;
      image?: string;
      featured?: boolean;
    }>
  >;
};

type WeatherApiResult = {
  location: string;
  date: string;
  forecast?: {
    current?: {
      temperature?: string;
      minTemperature?: string;
      maxTemp?: string;
      condition?: string;
      time?: string;
      rainfall?: string;
      windSpeed?: string;
      windDirection?: string;
    };
    hourly?: Array<{
      time?: string;
      condition?: string;
      maxTemp?: string;
      minTemperature?: string;
      rainfall?: string;
      windSpeed?: string;
      windDirection?: string;
    }>;
  };
  source?: string;
  sourceLabel?: string;
  sourceNote?: string;
  stale?: boolean;
  lastUpdated?: string;
};

type WeatherAlert = {
  title: string;
  description: string;
  type: string;
  publishedAt?: string;
};

function buildTools(): ModelContextTool[] {
  return [
    {
      name: 'dzaleka.search_site',
      title: 'Search site content',
      description:
        'Search public Dzaleka site content across services, resources, events, news, jobs, docs, and photos. Use this before scraping page cards.',
      annotations: { readOnlyHint: true },
      inputSchema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          query: {
            type: 'string',
            description: 'Keywords to search for, such as education, legal aid, or health clinic.',
            minLength: 2,
          },
          collections: {
            type: 'array',
            description: 'Optional collections to narrow the search.',
            items: {
              type: 'string',
              enum: SEARCH_COLLECTION_ENUM,
            },
          },
          limit: {
            type: 'integer',
            description: `Maximum results per collection. Defaults to 5 and is capped at ${MAX_SEARCH_LIMIT}.`,
            minimum: 1,
            maximum: MAX_SEARCH_LIMIT,
          },
        },
        required: ['query'],
      },
      async execute(input) {
        const query = parseString(input.query, 'query');
        const collections = parseCollections(input.collections);
        const limit = parseInteger(input.limit, 5, 1, MAX_SEARCH_LIMIT);
        const params = new URLSearchParams({
          q: query,
          collections: collections.join(','),
          limit: String(limit),
        });
        const data = await fetchJson<SearchApiResult>(`/api/search?${params.toString()}`);
        const resultsByCollection = data.results ?? {};
        const topMatches = Object.values(resultsByCollection)
          .flat()
          .slice(0, limit * Math.min(collections.length, 2))
          .map((item) => ({
            title: item.title,
            collection: item.collection,
            url: toAbsoluteUrl(item.url),
            description: item.description ?? '',
            category: item.category ?? '',
          }));

        return buildTextResult(
          `Found ${data.totalResults} site matches for "${query}" across ${collections.join(', ')}.`,
          {
            query,
            totalResults: data.totalResults,
            collections,
            topMatches,
            resultsByCollection,
          }
        );
      },
    },
    {
      name: 'dzaleka.search_services',
      title: 'Search services directory',
      description:
        'Search the Dzaleka services directory for organisations, clinics, schools, NGOs, and community support listings.',
      annotations: { readOnlyHint: true },
      inputSchema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          query: {
            type: 'string',
            description: 'Service keywords such as clinic, school, legal aid, youth, or livelihood.',
            minLength: 2,
          },
          limit: {
            type: 'integer',
            description: `Maximum number of matching services to return. Defaults to 6 and is capped at ${MAX_SEARCH_LIMIT}.`,
            minimum: 1,
            maximum: MAX_SEARCH_LIMIT,
          },
        },
        required: ['query'],
      },
      async execute(input) {
        const query = parseString(input.query, 'query');
        const limit = parseInteger(input.limit, 6, 1, MAX_SEARCH_LIMIT);
        const params = new URLSearchParams({
          q: query,
          collections: 'services',
          limit: String(limit),
        });
        const data = await fetchJson<SearchApiResult>(`/api/search?${params.toString()}`);
        const services = (data.results?.services ?? []).map((item) => ({
          title: item.title,
          description: item.description ?? '',
          category: item.category ?? '',
          url: toAbsoluteUrl(item.url),
          featured: Boolean(item.featured),
        }));

        return buildTextResult(`Found ${services.length} service matches for "${query}".`, {
          query,
          count: services.length,
          services,
        });
      },
    },
    {
      name: 'dzaleka.get_weather_summary',
      title: 'Get weather summary',
      description:
        'Get the current Dowa and Dzaleka weather summary with forecast details and any active weather alerts.',
      annotations: { readOnlyHint: true },
      inputSchema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          alertLimit: {
            type: 'integer',
            description: `How many weather alerts to return. Defaults to ${DEFAULT_WEATHER_ALERT_LIMIT}.`,
            minimum: 1,
            maximum: 5,
          },
        },
      },
      async execute(input) {
        const alertLimit = parseInteger(input.alertLimit, DEFAULT_WEATHER_ALERT_LIMIT, 1, 5);
        const [weather, alerts] = await Promise.all([
          fetchJson<WeatherApiResult>('/api/weather'),
          fetchJson<WeatherAlert[]>('/api/weather-alerts'),
        ]);

        const current = weather.forecast?.current ?? {};
        const topAlerts = alerts.slice(0, alertLimit);

        return buildTextResult(
          `Weather for ${weather.location} on ${weather.date}: ${current.condition || 'Unknown conditions'}, ${current.temperature || current.maxTemp || 'no temperature available'}°C. ${topAlerts.length > 0 ? `${topAlerts.length} alert(s) available.` : 'No weather alerts returned.'}`,
          {
            location: weather.location,
            date: weather.date,
            source: weather.sourceLabel ?? weather.source ?? 'site',
            stale: Boolean(weather.stale),
            current,
            hourly: (weather.forecast?.hourly ?? []).slice(0, 4),
            alerts: topAlerts,
            lastUpdated: weather.lastUpdated ?? null,
            weatherPage: toAbsoluteUrl('/weather'),
          }
        );
      },
    },
    {
      name: 'dzaleka.get_help_contacts',
      title: 'Get urgent help contacts',
      description:
        'Return the urgent help hotlines, UNHCR contacts, and the main support routes for protection, legal, health, and emergency needs.',
      annotations: { readOnlyHint: true },
      inputSchema: {
        type: 'object',
        additionalProperties: false,
        properties: {},
      },
      execute() {
        return buildTextResult(
          'Returned the current urgent help hotlines, UNHCR follow-up contacts, and key routes for protection, legal, health, and emergency support.',
          {
            page: toAbsoluteUrl('/get-help-now'),
            hotlines: URGENT_HELP_HOTLINES,
            officeContacts: URGENT_HELP_OFFICE_CONTACTS,
            routes: URGENT_HELP_ROUTES.map((route) => ({
              ...route,
              links: route.links.map((link) => ({
                ...link,
                url: toAbsoluteUrl(link.href),
              })),
            })),
          }
        );
      },
    },
    {
      name: 'dzaleka.get_language_support',
      title: 'Get language support routes',
      description:
        'Return the current language support options on the Dzaleka site, including Easy Read, Yetu Radio, and help desk language guidance.',
      annotations: { readOnlyHint: true },
      inputSchema: {
        type: 'object',
        additionalProperties: false,
        properties: {},
      },
      execute() {
        return buildTextResult(
          'Returned the current language support routes, including Easy Read, Yetu Radio, and Help Desk guidance.',
          {
            page: toAbsoluteUrl('/languages'),
            routes: LANGUAGE_SUPPORT_ROUTES.map((route) => ({
              ...route,
              links: route.links.map((link) => ({
                ...link,
                url: toAbsoluteUrl(link.href),
              })),
            })),
          }
        );
      },
    },
    {
      name: 'dzaleka.get_newcomer_guide',
      title: 'Get newcomer first steps',
      description:
        'Return the first-step routes for people who are new to Dzaleka, including urgent help, documents, clinic information, and language support.',
      annotations: { readOnlyHint: true },
      inputSchema: {
        type: 'object',
        additionalProperties: false,
        properties: {},
      },
      execute() {
        return buildTextResult(
          'Returned the newcomer first steps for urgent help, documents, health, and language support.',
          {
            page: toAbsoluteUrl('/new-to-dzaleka'),
            steps: NEWCOMER_STEPS.map((step) => ({
              ...step,
              url: toAbsoluteUrl(step.href),
            })),
          }
        );
      },
    },
  ];
}

export function initializeWebMcp() {
  if (!window.isSecureContext || window.top !== window) {
    return false;
  }

  const modelContext = navigator.modelContext;

  if (!modelContext) {
    return false;
  }

  const tools = buildTools();
  const toolNames = tools.map((tool) => tool.name);

  // Support both the earlier `provideContext()` proposal and the current
  // `registerTool()` draft so the site stays useful across previews/polyfills.
  if (typeof modelContext.provideContext === 'function') {
    modelContext.provideContext({ tools });
    return true;
  }

  if (typeof modelContext.registerTool === 'function') {
    window.__dzalekaWebMcpAbortController?.abort();

    const controller = new AbortController();
    window.__dzalekaWebMcpAbortController = controller;

    for (const tool of tools) {
      modelContext.registerTool(tool, { signal: controller.signal });
    }

    window.addEventListener(
      'pagehide',
      () => {
        controller.abort();

        if (typeof modelContext.unregisterTool === 'function') {
          for (const toolName of toolNames) {
            modelContext.unregisterTool(toolName);
          }
        }
      },
      { once: true }
    );

    return true;
  }

  return false;
}

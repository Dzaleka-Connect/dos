import { getCollection, type CollectionEntry } from 'astro:content';

const SITE_URL = 'https://services.dzaleka.com';

const collectionLoaders = {
  services: () => getCollection('services'),
  resources: () => getCollection('resources'),
  events: () => getCollection('events'),
  jobs: () => getCollection('jobs'),
  'community-voices': () => getCollection('community-voices'),
  artworks: () => getCollection('artworks'),
  marketplace: () => getCollection('marketplace'),
  rights: () => getCollection('rights'),
  docs: () => getCollection('docs'),
  courses: () => getCollection('courses'),
} as const;

export type DatasetCollectionKey = keyof typeof collectionLoaders;

export interface DatasetDistribution {
  title: string;
  description: string;
  href: string;
  format: string;
  access: 'API' | 'Page' | 'Docs' | 'Download' | 'External';
}

export interface DatasetReference {
  title: string;
  href: string;
  note?: string;
}

export interface DatasetEntry {
  slug: string;
  title: string;
  summary: string;
  description: string[];
  theme: string;
  publisher: string;
  coverage: string;
  updateCadence: string;
  featured?: boolean;
  tags: string[];
  highlights: string[];
  distributions: DatasetDistribution[];
  collection?: DatasetCollectionKey;
  recordMode?: string;
  lastUpdatedFallback?: string;
  sourceNote: string;
  license?: string;
  maintainer?: string;
  sourceUrl?: string;
  temporalCoverage?: string;
  methodology?: string[];
  references?: DatasetReference[];
  researchStatus?: 'draft' | 'reviewed' | 'monitored';
  contentSource: 'markdown';
  contentEntry: CollectionEntry<'datasets'>;
  recordCount: number | null;
  recordDisplay: string;
  recordLabel: string;
  distributionCount: number;
  lastUpdated: Date | null;
  lastUpdatedDisplay: string;
  searchText: string;
  canonicalUrl: string;
}

type CollectionStats = {
  count: number;
  latestDate: Date | null;
};

const collectionStatsCache = new Map<DatasetCollectionKey, Promise<CollectionStats>>();

function toDate(value: unknown): Date | null {
  if (!value) return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  return null;
}

function getLatestDate(entries: Array<{ data: Record<string, unknown> }>): Date | null {
  let latest: Date | null = null;

  for (const entry of entries) {
    const data = entry.data;
    const candidate =
      toDate(data.lastUpdated) ||
      toDate(data.updated) ||
      toDate(data.date) ||
      toDate(data.posted) ||
      toDate(data.deadline);

    if (candidate && (!latest || candidate > latest)) {
      latest = candidate;
    }
  }

  return latest;
}

function formatDate(date: Date | null): string {
  if (!date) return 'Published dataset';

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function formatCount(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

async function getCollectionStats(collection: DatasetCollectionKey): Promise<CollectionStats> {
  const cached = collectionStatsCache.get(collection);
  if (cached) {
    return cached;
  }

  const promise = collectionLoaders[collection]().then((entries) => ({
    count: entries.length,
    latestDate: getLatestDate(entries as Array<{ data: Record<string, unknown> }>),
  }));

  collectionStatsCache.set(collection, promise);
  return promise;
}

function buildSearchText(dataset: {
  title: string;
  summary: string;
  theme: string;
  publisher: string;
  coverage: string;
  tags: string[];
  highlights: string[];
  description?: string[];
  methodology?: string[];
  references?: DatasetReference[];
  bodyText?: string;
}): string {
  return [
    dataset.title,
    dataset.summary,
    dataset.theme,
    dataset.publisher,
    dataset.coverage,
    dataset.tags.join(' '),
    dataset.highlights.join(' '),
    dataset.description?.join(' ') ?? '',
    dataset.methodology?.join(' ') ?? '',
    dataset.references?.map((reference) => `${reference.title} ${reference.note || ''}`).join(' ') ?? '',
    dataset.bodyText ?? '',
  ]
    .join(' ')
    .toLowerCase();
}

function toAbsoluteUrl(href: string): string {
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return href;
  }

  return new URL(href, SITE_URL).toString();
}

function sortDatasets(left: DatasetEntry, right: DatasetEntry) {
  if (left.featured && !right.featured) return -1;
  if (!left.featured && right.featured) return 1;

  if (left.lastUpdated && right.lastUpdated) {
    return right.lastUpdated.getTime() - left.lastUpdated.getTime();
  }

  if (left.lastUpdated && !right.lastUpdated) return -1;
  if (!left.lastUpdated && right.lastUpdated) return 1;

  return left.title.localeCompare(right.title);
}

export async function getDatasetCatalog(): Promise<DatasetEntry[]> {
  const entries = await getCollection('datasets');

  const datasets = await Promise.all(
    entries.map(async (entry) => {
      const data = entry.data;
      const slug = data.slug || entry.slug || entry.id.replace(/\.md$/, '');
      const stats = data.collection ? await getCollectionStats(data.collection) : undefined;

      const recordCount = data.recordCount ?? stats?.count ?? null;
      const recordDisplay = recordCount !== null ? formatCount(recordCount) : data.recordMode || 'Published dataset';
      const recordLabel = recordCount !== null ? 'Records' : 'Mode';
      const lastUpdated = data.lastUpdated ?? stats?.latestDate ?? null;
      const lastUpdatedDisplay = lastUpdated
        ? formatDate(lastUpdated)
        : data.lastUpdatedFallback || 'Published dataset';

      return {
        slug,
        title: data.title,
        summary: data.summary,
        description: data.description ?? [],
        theme: data.theme,
        publisher: data.publisher,
        coverage: data.coverage,
        updateCadence: data.updateCadence,
        featured: data.featured,
        tags: data.tags,
        highlights: data.highlights,
        distributions: data.distributions,
        collection: data.collection,
        recordMode: data.recordMode,
        lastUpdatedFallback: data.lastUpdatedFallback,
        sourceNote: data.sourceNote,
        license: data.license,
        maintainer: data.maintainer,
        sourceUrl: data.sourceUrl,
        temporalCoverage: data.temporalCoverage,
        methodology: data.methodology,
        references: data.references,
        researchStatus: data.researchStatus,
        contentSource: 'markdown' as const,
        contentEntry: entry,
        recordCount,
        recordDisplay,
        recordLabel,
        distributionCount: data.distributions.length,
        lastUpdated,
        lastUpdatedDisplay,
        searchText: buildSearchText({
          title: data.title,
          summary: data.summary,
          theme: data.theme,
          publisher: data.publisher,
          coverage: data.coverage,
          tags: data.tags,
          highlights: data.highlights,
          description: data.description,
          methodology: data.methodology,
          references: data.references,
          bodyText: entry.body,
        }),
        canonicalUrl: `${SITE_URL}/datasets/${slug}`,
      };
    }),
  );

  return datasets.sort(sortDatasets);
}

export async function getDatasetBySlug(slug: string): Promise<DatasetEntry | undefined> {
  const catalog = await getDatasetCatalog();
  return catalog.find((entry) => entry.slug === slug);
}

export async function getRelatedDatasets(dataset: DatasetEntry, limit = 3): Promise<DatasetEntry[]> {
  const catalog = await getDatasetCatalog();
  return catalog
    .filter((entry) => entry.slug !== dataset.slug && entry.theme === dataset.theme)
    .slice(0, limit);
}

export function getDatasetThemes(datasets: DatasetEntry[]): string[] {
  return [...new Set(datasets.map((dataset) => dataset.theme))];
}

export function getDatasetStats(datasets: DatasetEntry[]) {
  return {
    totalDatasets: datasets.length,
    featuredDatasets: datasets.filter((dataset) => dataset.featured).length,
    themes: getDatasetThemes(datasets).length,
    apiDistributions: datasets.reduce(
      (total, dataset) =>
        total + dataset.distributions.filter((distribution) => distribution.access === 'API').length,
      0,
    ),
  };
}

export function getDatasetDistributionUrl(distribution: DatasetDistribution): string {
  return toAbsoluteUrl(distribution.href);
}

import type { CollectionEntry } from 'astro:content';
import { corsHeaders } from './api-utils';

export const ENCYCLOPEDIA_URL = 'https://services.dzaleka.com/encyclopedia';

export const encyclopediaHeaders = {
  ...corsHeaders,
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'public, max-age=300, s-maxage=900',
};

export function jsonResponse(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { ...encyclopediaHeaders, ...headers },
  });
}

export function serializeEncyclopediaEntry(
  entry: CollectionEntry<'encyclopedia'>,
  includeBody = false
) {
  return {
    id: entry.id,
    collection: 'encyclopedia',
    url: `${ENCYCLOPEDIA_URL}/${entry.id}`,
    ...entry.data,
    datePublished: entry.data.datePublished?.toISOString(),
    lastReviewed: entry.data.lastReviewed.toISOString(),
    ...(includeBody ? { body: entry.body } : {}),
  };
}

export function encyclopediaJsonLd(entry: CollectionEntry<'encyclopedia'>) {
  const data = entry.data;
  const url = `${ENCYCLOPEDIA_URL}/${entry.id}`;
  const configuredType = data.schemaType || (
    data.entryType === 'person' ? 'Person'
      : data.entryType === 'organization' ? 'Organization'
        : data.entryType === 'event' ? 'EventSeries'
          : data.entryType === 'film' ? 'Movie'
            : data.entryType === 'book' ? 'Book'
              : data.entryType === 'place' || data.entryType === 'overview' ? 'Place'
                : 'DefinedTerm'
  );
  const type = configuredType === 'Article' ? 'DefinedTerm' : configuredType === 'Event' ? 'EventSeries' : configuredType;

  const factProperties = (data.facts || []).map((fact) => ({
    '@type': 'PropertyValue',
    name: fact.label,
    value: fact.value,
  }));

  const mentions = (data.relatedEntries || []).map((relatedId) => ({
    '@type': 'Thing',
    '@id': `${ENCYCLOPEDIA_URL}/${relatedId}#entity`,
    url: `${ENCYCLOPEDIA_URL}/${relatedId}`,
  }));

  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${url}#entity`,
    url: data.officialWebsite || url,
    mainEntityOfPage: url,
    name: data.title,
    alternateName: data.aliases,
    description: data.summary,
    image: data.image ? (data.image.startsWith('http') ? data.image : `https://services.dzaleka.com${data.image}`) : undefined,
    sameAs: data.sameAs,
    keywords: [data.category, data.entryType, ...(data.aliases || [])].join(', '),
    dateModified: data.lastReviewed.toISOString(),
    additionalProperty: factProperties.length ? factProperties : undefined,
    mentions: mentions.length ? mentions : undefined,
    citation: data.sources?.map((source) => ({
      '@type': 'CreativeWork',
      name: source.title,
      publisher: { '@type': 'Organization', name: source.publisher },
      url: source.url,
    })),
    ...(data.geo ? {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: data.geo.latitude,
        longitude: data.geo.longitude,
      },
    } : {}),
    ...(data.entryType === 'film' ? {
      genre: 'Documentary',
      datePublished: data.film?.releaseDate,
      duration: data.film?.runtime,
      director: data.film?.directors?.map((name) => ({ '@type': 'Person', name })),
      productionCompany: data.film?.productionCompanies?.map((name) => ({ '@type': 'Organization', name })),
      actor: data.film?.featuredPeople?.map((name) => ({ '@type': 'Person', name })),
      locationCreated: { '@id': `${ENCYCLOPEDIA_URL}/dzaleka-refugee-camp#entity` },
    } : {}),
    ...(data.entryType === 'book' ? {
      author: data.book?.authors.map((name) => ({ '@type': 'Person', name })),
      contributor: data.book?.contributors?.map((contributor) => ({
        '@type': 'Person',
        name: contributor.name,
        description: contributor.role,
      })),
      genre: data.book?.genres,
      inLanguage: data.book?.originalLanguage,
      about: { '@id': `${ENCYCLOPEDIA_URL}/dzaleka-refugee-camp#entity` },
      workExample: data.book?.editions?.map((edition) => ({
        '@type': 'Book',
        name: edition.name || data.title,
        isbn: edition.isbn13 || edition.isbn10,
        publisher: edition.publisher ? { '@type': 'Organization', name: edition.publisher } : undefined,
        datePublished: edition.publicationDate,
        bookFormat: edition.format,
        numberOfPages: edition.pages,
        inLanguage: edition.language,
      })),
    } : {}),
  };
}

export function searchableText(entry: CollectionEntry<'encyclopedia'>) {
  return [
    entry.data.title,
    entry.data.sortName,
    entry.data.summary,
    entry.data.category,
    entry.data.entryType,
    ...(entry.data.aliases || []),
    ...(entry.data.book?.authors || []),
    ...(entry.data.book?.contributors?.flatMap((contributor) => [contributor.name, contributor.role]) || []),
    ...(entry.data.book?.genres || []),
    ...(entry.data.book?.editions?.flatMap((edition) => [
      edition.name,
      edition.isbn10,
      edition.isbn13,
      edition.publisher,
      edition.publicationDate,
      edition.format,
      edition.language,
    ]) || []),
    entry.body,
  ].filter(Boolean).join(' ').toLowerCase();
}

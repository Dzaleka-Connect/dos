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
            : data.entryType === 'place' || data.entryType === 'overview' ? 'Place'
              : 'DefinedTerm'
  );
  const type = configuredType === 'Article' ? 'DefinedTerm' : configuredType === 'Event' ? 'EventSeries' : configuredType;

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
    dateModified: data.lastReviewed.toISOString(),
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
    entry.body,
  ].filter(Boolean).join(' ').toLowerCase();
}

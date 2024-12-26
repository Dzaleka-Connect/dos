import MiniSearch from 'minisearch';
import type { CollectionEntry } from 'astro:content';

export type Service = CollectionEntry<'services'>;

// Configure MiniSearch options
const searchOptions = {
  idField: 'slug',
  fields: ['title', 'description', 'category'], // fields to index for full-text search
  storeFields: ['title', 'description', 'category', 'featured', 'slug'], // fields to return with search results
  searchOptions: {
    boost: { title: 2, description: 1.5 }, // boost title and description matches
    fuzzy: 0.2, // fuzzy matching
    prefix: true, // prefix matching
    combineWith: 'OR', // match any field
  }
};

// Create and populate search index
let searchIndex: MiniSearch<any>;

export async function initializeSearch(services: Service[]) {
  searchIndex = new MiniSearch(searchOptions);
  
  // Transform services to flatten data structure
  const documents = services.map(service => ({
    slug: service.slug,
    title: service.data.title,
    description: service.data.description,
    category: service.data.category,
    featured: service.data.featured
  }));

  console.log('Indexing documents:', documents.length); // Debug log
  searchIndex.addAll(documents);
  return searchIndex;
}

export function searchServices(query: string, services: Service[]) {
  if (!query.trim()) {
    return services;
  }

  if (!searchIndex) {
    console.warn('Search index not initialized');
    return services;
  }

  const searchResults = searchIndex.search(query, {
    ...searchOptions.searchOptions,
    filter: (result) => result.score > 0.1 // Only return relevant results
  });

  console.log('Search query:', query); // Debug log
  console.log('Search results:', searchResults); // Debug log

  if (!searchResults.length) {
    return [];
  }

  // Map search results back to services
  const resultSlugs = new Set(searchResults.map(result => result.slug));
  return services.filter(service => resultSlugs.has(service.slug));
}
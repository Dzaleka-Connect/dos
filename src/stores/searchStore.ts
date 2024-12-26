import { atom } from 'nanostores';

export const searchQuery = atom('');
export const searchCategory = atom('');

export function updateSearch(query: string) {
  searchQuery.set(query);
}

export function updateCategory(category: string) {
  searchCategory.set(category);
}
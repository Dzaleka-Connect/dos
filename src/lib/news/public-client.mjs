import { AsyncLocalStorage } from 'node:async_hooks';
import { parseHTML } from 'linkedom';
import { cmsOrigin, publicPrefix, rewriteMediaUrl } from './public-contract.mjs';

const requests = new AsyncLocalStorage();
export const withNewsRequest = callback => requests.run(new Map(), callback);
export class NewsUnavailable extends Error {}

async function read(path) {
  try {
    const response = await fetch(`${cmsOrigin}${publicPrefix}${path}`, {
      headers: { Accept: path.endsWith('.json') ? 'application/json' : 'text/html' },
      redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(15000),
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`CMS returned ${response.status}`);
    return response;
  } catch { throw new NewsUnavailable('Published news is temporarily unavailable.'); }
}

// Date fields per collection: the first is required, the rest optional.
const dateFields = { news: ['date', 'updated'], events: ['date', 'endDate'], jobs: ['posted', 'deadline'] };
const unavailable = collection => new NewsUnavailable(`Published ${collection} are temporarily unavailable.`);

async function load(collection) {
  const fields = dateFields[collection];
  if (!fields) throw unavailable(collection);
  const response = await read(`${collection}.json`);
  if (!response) throw unavailable(collection);
  try {
    const payload = await response.json();
    if (payload.version !== 1 || !Array.isArray(payload.entries)) throw new Error('Invalid feed');
    return payload.entries.map(entry => {
      const [required, ...optional] = fields;
      if (typeof entry.id !== 'string' || typeof entry.data?.title !== 'string' || !Number.isFinite(Date.parse(entry.data[required]))) throw new Error('Invalid entry');
      const data = { ...entry.data, [required]: new Date(entry.data[required]) };
      for (const field of optional) data[field] = entry.data[field] ? new Date(entry.data[field]) : undefined;
      if (collection === 'events' && data.registration?.deadline) data.registration = { ...data.registration, deadline: new Date(data.registration.deadline) };
      return { ...entry, data };
    });
  } catch { throw unavailable(collection); }
}

export function getEntries(collection) {
  const cache = requests.getStore();
  if (!cache) return load(collection);
  if (!cache.has(collection)) cache.set(collection, load(collection));
  return cache.get(collection);
}

export const getNews = () => getEntries('news');

export function articleFragment(html) {
  const { document } = parseHTML(html);
  const article = document.querySelector('[data-dos-article]');
  if (!article) throw new NewsUnavailable('Published article is temporarily unavailable.');
  // Article components ship their own styles on the CMS host.
  for (const element of document.querySelectorAll('[src], [href], [poster]')) {
    for (const attribute of ['src', 'href', 'poster']) {
      const value = element.getAttribute(attribute);
      if (!value) continue;
      element.setAttribute(attribute, value.startsWith('/_astro/') ? `${cmsOrigin}${value}` : rewriteMediaUrl(value));
    }
  }
  return [...document.head.querySelectorAll('link[rel="stylesheet"], style')].map(node => node.outerHTML).join('') + article.innerHTML;
}

export async function getEntry(collection, slug) {
  const entry = (await getEntries(collection)).find(item => item.id === slug);
  if (!entry) return { entry: undefined, isPreview: false };
  const response = await read(`${collection}/${encodeURIComponent(slug)}`);
  if (!response) return { entry: undefined, isPreview: false };
  return { entry: { ...entry, html: articleFragment(await response.text()) }, isPreview: false };
}

export const getNewsEntry = slug => getEntry('news', slug);

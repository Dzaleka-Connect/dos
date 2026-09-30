import { AsyncLocalStorage } from 'node:async_hooks';
import { parseHTML } from 'linkedom';
import { cmsOrigin, publicPrefix, rewriteMediaUrl } from './public-contract.mjs';

const requests = new AsyncLocalStorage();
export const withNewsRequest = callback => requests.run(new Map(), callback);
export class NewsUnavailable extends Error {}

async function read(path) {
  try {
    const response = await fetch(`${cmsOrigin}${publicPrefix}${path}`, {
      headers: { Accept: path === 'news.json' ? 'application/json' : 'text/html' },
      redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(15000),
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`CMS returned ${response.status}`);
    return response;
  } catch { throw new NewsUnavailable('Published news is temporarily unavailable.'); }
}

async function loadNews() {
  const response = await read('news.json');
  if (!response) throw new NewsUnavailable('Published news is temporarily unavailable.');
  try {
    const payload = await response.json();
    if (payload.version !== 1 || !Array.isArray(payload.entries)) throw new Error('Invalid news feed');
    return payload.entries.map(entry => {
      if (typeof entry.id !== 'string' || typeof entry.data?.title !== 'string' || !Number.isFinite(Date.parse(entry.data.date))) throw new Error('Invalid article');
      return { ...entry, data: { ...entry.data, date: new Date(entry.data.date), updated: entry.data.updated ? new Date(entry.data.updated) : undefined } };
    });
  } catch { throw new NewsUnavailable('Published news is temporarily unavailable.'); }
}

export function getNews() {
  const cache = requests.getStore();
  if (!cache) return loadNews();
  if (!cache.has('news')) cache.set('news', loadNews());
  return cache.get('news');
}

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

export async function getNewsEntry(slug) {
  const entry = (await getNews()).find(item => item.id === slug);
  if (!entry) return { entry: undefined, isPreview: false };
  const response = await read(`news/${encodeURIComponent(slug)}`);
  if (!response) return { entry: undefined, isPreview: false };
  return { entry: { ...entry, html: articleFragment(await response.text()) }, isPreview: false };
}

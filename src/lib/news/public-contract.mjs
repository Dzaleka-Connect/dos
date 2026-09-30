export const cmsOrigin = 'https://cms.dzaleka.com';
export const publicPrefix = '/_dos/public/';
const internalMediaPrefix = '/_emdash/api/media/file/';

export function isPublicRead(request) {
  const path = new URL(request.url).pathname;
  return ['GET', 'HEAD'].includes(request.method) &&
    (path === `${publicPrefix}news.json` || path.startsWith(`${publicPrefix}news/`) || path.startsWith(`${publicPrefix}media/`));
}

export function safeMediaKey(key) {
  return typeof key === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9._/-]*$/.test(key) &&
    key.split('/').every(part => part && part !== '.' && part !== '..') &&
    !/^(backups|transfers?|staging)(\/|$)/i.test(key);
}

export function publicMediaUrl(key) {
  return safeMediaKey(key) ? `${cmsOrigin}${publicPrefix}media/${key.split('/').map(encodeURIComponent).join('/')}` : undefined;
}

export function rewriteMediaUrl(value) {
  if (typeof value !== 'string') return value;
  const path = value.startsWith(cmsOrigin) ? value.slice(cmsOrigin.length) : value;
  if (!path.startsWith(internalMediaPrefix)) return value;
  try { return publicMediaUrl(decodeURIComponent(path.slice(internalMediaPrefix.length))) || ''; }
  catch { return ''; }
}

// Only media explicitly referenced by a live article can leave the private bucket.
export function referencedMediaKeys(value, keys = new Set()) {
  if (!value || typeof value !== 'object') return keys;
  if (typeof value.meta?.storageKey === 'string' && (!value.provider || value.provider === 'local')) keys.add(value.meta.storageKey);
  if ((!value.provider || value.provider === 'local') && typeof value.id === 'string') keys.add(value.id);
  if ((!value.provider || value.provider === 'local') && typeof value._ref === 'string') keys.add(value._ref);
  for (const child of Object.values(value)) {
    if (typeof child === 'string') {
      const path = child.startsWith(cmsOrigin) ? child.slice(cmsOrigin.length) : child;
      if (path.startsWith(internalMediaPrefix)) {
        try { keys.add(decodeURIComponent(path.slice(internalMediaPrefix.length))); } catch { /* Invalid URL is not public. */ }
      }
    } else referencedMediaKeys(child, keys);
  }
  return new Set([...keys].filter(safeMediaKey));
}

function articleText(value) {
  if (Array.isArray(value)) return value.map(articleText).filter(Boolean).join(' ');
  if (!value || typeof value !== 'object') return '';
  return [typeof value.text === 'string' ? value.text : '', ...Object.values(value).filter(child => child && typeof child === 'object').map(articleText)].filter(Boolean).join(' ');
}

export function newsMetadata(item) {
  const d = item.data;
  const media = d.image;
  const image = media && typeof media === 'object'
    ? media.provider === 'external' ? rewriteMediaUrl(media.src) : publicMediaUrl(media.meta?.storageKey || media.id)
    : undefined;
  return {
    id: item.slug || item.id, collection: 'news', body: articleText(d.content),
    seo: item.seo ? { title: item.seo.title, description: item.seo.description, noIndex: item.seo.noIndex } : undefined,
    data: {
      title: d.title, description: d.description, date: d.date, updated: d.updated || undefined,
      category: d.category, featured: Boolean(d.featured), author: d.author || undefined,
      tags: Array.isArray(d.tags) ? d.tags : [], image, imageAlt: media?.alt,
      businessName: d.business_name || undefined, businessOwner: d.business_owner || undefined,
      contactInfo: d.contact_info || undefined,
    },
  };
}

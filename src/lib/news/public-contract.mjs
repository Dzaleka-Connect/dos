import { eventStatus } from './event-status.mjs';
import { cmsCollections } from './live-collections.mjs';

export const cmsOrigin = 'https://cms.dzaleka.com';
export const publicPrefix = '/_dos/public/';
const internalMediaPrefix = '/_emdash/api/media/file/';

export function isPublicRead(request) {
  const path = new URL(request.url).pathname;
  return ['GET', 'HEAD'].includes(request.method) && (path === `${publicPrefix}site.json` || path.startsWith(`${publicPrefix}media/`) ||
    cmsCollections.some(name => path === `${publicPrefix}${name}.json` || path.startsWith(`${publicPrefix}${name}/`)));
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

function imageUrl(media) {
  return media && typeof media === 'object'
    ? media.provider === 'external' ? rewriteMediaUrl(media.src) : publicMediaUrl(media.meta?.storageKey || media.id)
    : undefined;
}

const text = value => (typeof value === 'string' && value.trim() ? value : undefined);
const list = value => (Array.isArray(value) ? value.filter(item => typeof item === 'string') : []);
const object = value => (value && typeof value === 'object' && !Array.isArray(value) ? value : undefined);

export function seoImageUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  const image = value.trim();
  if (!image.startsWith('/') && !/^https?:\/\//i.test(image)) return publicMediaUrl(image);
  const rewritten = rewriteMediaUrl(image);
  if (!rewritten) return undefined;
  try {
    const url = new URL(rewritten, 'https://services.dzaleka.com/');
    return ['https:', 'http:'].includes(url.protocol) ? url.href : undefined;
  } catch { return undefined; }
}

export function seoMetadata(seo) {
  return seo ? { title: seo.title, description: seo.description,
    image: seoImageUrl(seo.image), canonical: seo.canonical, noIndex: seo.noIndex } : undefined;
}

export function newsMetadata(item) {
  const d = item.data;
  const media = d.image;
  const image = imageUrl(media);
  return {
    id: item.slug || item.id, collection: 'news', body: articleText(d.content),
    seo: seoMetadata(item.seo),
    data: {
      title: d.title, description: d.description, date: d.date, updated: d.updated || undefined,
      category: d.category, featured: Boolean(d.featured), author: d.author || undefined,
      tags: Array.isArray(d.tags) ? d.tags : [], image, imageAlt: media?.alt,
      businessName: d.business_name || undefined, businessOwner: d.business_owner || undefined,
      contactInfo: d.contact_info || undefined,
    },
  };
}

export function eventMetadata(item) {
  const d = item.data;
  const contact = object(d.contact);
  const registration = object(d.registration);
  return {
    id: item.slug || item.id, collection: 'events', body: articleText(d.content),
    seo: seoMetadata(item.seo),
    data: {
      title: d.title, description: d.description, date: d.date, endDate: d.end_date || undefined,
      location: d.location, category: d.category, featured: Boolean(d.featured),
      image: imageUrl(d.image), imageAlt: d.image?.alt, organizer: d.organizer, organizerUrl: text(d.organizer_url), capacity: d.capacity ?? undefined, host: object(d.host),
      status: eventStatus(d), tags: list(d.tags),
      contact: contact && { email: text(contact.email), phone: text(contact.phone), whatsapp: text(contact.whatsapp) },
      registration: registration && { required: Boolean(registration.required), url: text(registration.url), deadline: text(registration.deadline) },
      panelists: Array.isArray(d.panelists) ? d.panelists.filter(person => typeof person?.name === 'string').map(person => ({
        name: person.name, role: text(person.role), bio: text(person.bio), image: text(person.image),
        organization: text(person.organization), socialMedia: object(person.socialMedia),
      })) : undefined,
    },
  };
}

export function jobMetadata(item) {
  const d = item.data;
  const contact = object(d.contact) || {};
  return {
    id: item.slug || item.id, collection: 'jobs', body: articleText(d.content),
    seo: seoMetadata(item.seo),
    data: {
      title: d.title, organization: d.organization, location: d.location, type: d.type, category: d.category,
      salary: text(d.salary), deadline: d.deadline || undefined, posted: d.posted,
      status: d.job_status || 'open', featured: Boolean(d.featured), skills: list(d.skills), requirements: list(d.requirements),
      contact: { email: text(contact.email), phone: text(contact.phone), website: text(contact.website), salary: text(contact.salary) },
      description: d.description,
    },
  };
}

export function serviceMetadata(item) {
  const d = item.data;
  const present = value => Object.values(value).some(value => value !== undefined) ? value : undefined;
  return {
    id: item.slug || item.id, collection: 'services', body: articleText(d.content),
    seo: seoMetadata(item.seo),
    data: {
      title: d.title, description: d.description, category: d.category,
      status: d.listing_status === 'inactive' ? 'inactive' : 'active',
      featured: Boolean(d.featured), verified: Boolean(d.verified), tags: list(d.tags),
      logo: imageUrl(d.logo), image: imageUrl(d.image), lastUpdated: d.last_updated || undefined, date: d.date || undefined,
      contact: present({ email: text(d.contact_email), phone: text(d.contact_phone), whatsapp: text(d.contact_whatsapp), hours: text(d.contact_hours) }),
      location: d.address || d.city ? {
        address: d.address || '', city: d.city || '', state: text(d.state),
        coordinates: typeof d.latitude === 'number' && typeof d.longitude === 'number' ? { lat: d.latitude, lng: d.longitude } : undefined,
      } : undefined,
      socialMedia: present(Object.fromEntries(['website', 'facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok'].map(key => [key, text(d[key])]))),
      access: present({
        ...Object.fromEntries(['eligibility', 'fees', 'documents', 'appointment', 'accessibility'].map(key => [key, text(d[`access_${key}`])])),
        languages: text(d.access_languages)?.split('\n').map(value => value.trim()).filter(Boolean),
      }),
      providerConfirmation: d.confirmation_by && d.confirmation_date ? {
        by: d.confirmation_by, date: d.confirmation_date, sourceUrl: text(d.confirmation_source),
      } : undefined,
      businessHours: Array.isArray(d.business_hours) ? d.business_hours.filter(hours => hours && typeof hours.day === 'string' && typeof hours.open === 'string' && typeof hours.close === 'string').map(hours => ({
        day: hours.day, open: hours.open, close: hours.close, closed: hours.closed,
      })) : undefined,
    },
  };
}

export const publicMetadata = { news: newsMetadata, events: eventMetadata, jobs: jobMetadata, services: serviceMetadata };

// Fields that may hold uploaded media, per collection.
export function entryMedia(collection, data, seo) {
  const image = seoImageUrl(seo?.image);
  let seoMedia;
  if (image?.startsWith(`${cmsOrigin}${publicPrefix}media/`)) {
    try {
      const key = decodeURIComponent(image.slice(`${cmsOrigin}${publicPrefix}media/`.length));
      if (safeMediaKey(key)) seoMedia = { id: key };
    } catch { /* A malformed SEO URL must not interrupt unrelated media delivery. */ }
  }
  if (collection === 'services') return { logo: data.logo, image: data.image, content: data.content, seoMedia };
  if (collection === 'events') return { image: data.image, panelists: data.panelists, content: data.content, seoMedia };
  if (collection === 'jobs') return { content: data.content, seoMedia };
  return { image: data.image, content: data.content, seoMedia };
}

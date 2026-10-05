import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import matter from 'gray-matter';
import { slug } from 'github-slugger';
import { validateSeed } from 'emdash/seed';
import { importMarkdown } from './markdown.mjs';
import { serviceEntry, serviceFields } from './services.mjs';

export const categories = ['news', 'business-spotlight', 'announcement', 'success-story', 'business-guide', 'education'];
export const jobTypes = ['full-time', 'part-time', 'contract', 'volunteer', 'internship'];
export const jobCategories = ['education', 'healthcare', 'technology', 'community', 'business', 'arts', 'services', 'other'];
const field = (slug, label, type, extra = {}) => ({ slug, label, type, ...extra });
const iso = (value) => (value ? new Date(value).toISOString() : null);
const externalImage = (src, alt) => (src ? { provider: 'external', id: '', src, alt } : null);
const clean = (value) => (value && typeof value === 'object'
  ? JSON.parse(JSON.stringify(value, (_key, item) => (item instanceof Date ? item.toISOString() : item)))
  : value ?? null);

async function readFolder(folder) {
  const directory = new URL(`../../src/content/${folder}/`, import.meta.url);
  const files = [];
  for (const name of (await readdir(directory)).filter((name) => name.endsWith('.md')).sort()) {
    const { data, content: markdown } = matter(await readFile(new URL(name, directory), 'utf8'));
    files.push({ name, data, markdown, slug: data.slug || slug(name.replace(/\.md$/, '')) });
  }
  return files;
}

async function eventEntries() {
  return (await readFolder('events')).map(({ name, data, markdown, slug }) => ({
    id: `events:${name}`, slug, status: 'published', data: {
      title: data.title, description: data.description, date: iso(data.date), end_date: iso(data.endDate),
      location: data.location, category: data.category, featured: data.featured ?? false,
      image: externalImage(data.image, data.title), organizer: data.organizer,
      event_status: 'auto', organizer_url: data.organizerUrl ?? null, capacity: data.capacity ?? null, host: clean(data.host),
      contact: clean(data.contact), registration: clean(data.registration),
      panelists: clean(data.panelists), tags: data.tags ?? [], content: importMarkdown(markdown),
    },
  }));
}

async function jobEntries() {
  return (await readFolder('jobs')).map(({ name, data, markdown, slug }) => ({
    id: `jobs:${name}`, slug, status: data.status === 'draft' ? 'draft' : 'published', data: {
      title: data.title, organization: data.organization, location: data.location, type: data.type,
      category: data.category, salary: data.salary ?? null, deadline: iso(data.deadline), posted: iso(data.posted),
      job_status: ['open', 'closed', 'draft'].includes(data.status) ? data.status : 'open',
      featured: data.featured ?? false, skills: data.skills ?? [], contact: clean(data.contact),
      description: data.description, requirements: data.requirements ?? [], content: importMarkdown(markdown),
    },
  }));
}

/** Keep only the collections (and their content) that are not already in the CMS. */
export function newCollectionsOnly(seed, existing) {
  const collections = seed.collections.filter((collection) => !existing.has(collection.slug));
  const names = new Set(collections.map((collection) => collection.slug));
  return { ...seed, collections, content: Object.fromEntries(Object.entries(seed.content).filter(([name]) => names.has(name))) };
}

export async function buildSeed({ fullTextSearch = true } = {}) {
  const directory = new URL('../../src/content/news/', import.meta.url);
  const content = [];
  for (const name of (await readdir(directory)).filter((name) => name.endsWith('.md')).sort()) {
    const { data, content: markdown } = matter(await readFile(new URL(name, directory), 'utf8'));
    content.push({ id: `news:${name}`, slug: data.slug || slug(name.replace(/\.md$/, '')), status: 'published', data: {
      title: data.title, description: data.description, date: new Date(data.date).toISOString(),
      updated: data.updated ? new Date(data.updated).toISOString() : null,
      category: data.category, featured: data.featured ?? false,
      image: data.image ? { provider: 'external', id: '', src: data.image, alt: data.title } : null,
      author: data.author ?? null, tags: data.tags ?? [],
      business_name: data.businessName ?? null, business_owner: data.businessOwner ?? null,
      contact_info: data.contactInfo ?? null, content: importMarkdown(markdown),
    } });
  }
  const seed = {
    version: '1', meta: { name: 'Dzaleka Online Services CMS' },
    collections: [{ slug: 'news', label: 'News', labelSingular: 'Article',
      supports: ['drafts', 'revisions', 'preview', 'scheduling', ...(fullTextSearch ? ['search'] : []), 'seo'],
      urlPattern: '/news/{slug}', routable: true, titleField: 'title', dateField: 'date',
      commentsEnabled: false, fields: [
        field('title', 'Title', 'string', { required: true, searchable: true }),
        field('description', 'Summary', 'text', { required: true, searchable: true }),
        field('date', 'Publication date', 'datetime', { required: true, indexed: true }),
        field('updated', 'Updated date', 'datetime'),
        field('category', 'Category', 'select', { required: true, validation: { options: categories } }),
        field('featured', 'Featured story', 'boolean'), field('image', 'Cover image', 'image'),
        field('author', 'Author', 'string'), field('tags', 'Tags', 'json'),
        field('content', 'Article', 'portableText', { required: true, searchable: true }),
        field('business_name', 'Business name', 'string'), field('business_owner', 'Business owner', 'string'),
        field('contact_info', 'Business contact details', 'json'),
      ],
    }, { slug: 'events', label: 'Events', labelSingular: 'Event',
      supports: ['drafts', 'revisions', 'preview', 'scheduling', ...(fullTextSearch ? ['search'] : []), 'seo'],
      urlPattern: '/events/{slug}', routable: true, titleField: 'title', dateField: 'date',
      commentsEnabled: false, fields: [
        field('title', 'Title', 'string', { required: true, searchable: true }),
        field('description', 'Summary', 'text', { required: true, searchable: true }),
        field('date', 'Start date and time', 'datetime', { required: true, indexed: true }),
        field('end_date', 'End date and time', 'datetime'),
        field('location', 'Location', 'string', { required: true }),
        field('category', 'Category', 'string', { required: true }),
        field('organizer', 'Organiser', 'string', { required: true }),
        field('event_status', 'Status (automatic or override)', 'select', { required: true, validation: { options: ['auto', 'upcoming', 'past'] } }),
        field('organizer_url', 'Organiser website', 'string'), field('capacity', 'Capacity', 'number'), field('host', 'Host details', 'json'),
        field('featured', 'Featured event', 'boolean'), field('image', 'Cover image', 'image'),
        field('content', 'Event details', 'portableText', { searchable: true }),
        field('contact', 'Contact details', 'json'), field('registration', 'Registration', 'json'),
        field('panelists', 'Panelists', 'json'), field('tags', 'Tags', 'json'),
      ],
    }, { slug: 'jobs', label: 'Jobs', labelSingular: 'Job',
      supports: ['drafts', 'revisions', 'preview', 'scheduling', ...(fullTextSearch ? ['search'] : []), 'seo'],
      urlPattern: '/jobs/{slug}', routable: true, titleField: 'title', dateField: 'posted',
      commentsEnabled: false, fields: [
        field('title', 'Job title', 'string', { required: true, searchable: true }),
        field('organization', 'Organisation', 'string', { required: true, searchable: true }),
        field('location', 'Location', 'string', { required: true }),
        field('type', 'Job type', 'select', { required: true, validation: { options: jobTypes } }),
        field('category', 'Category', 'select', { required: true, validation: { options: jobCategories } }),
        field('description', 'Summary', 'text', { required: true, searchable: true }),
        field('posted', 'Date posted', 'datetime', { required: true, indexed: true }),
        field('deadline', 'Closing date', 'datetime', { indexed: true }),
        field('job_status', 'Listing status', 'select', { required: true, validation: { options: ['open', 'closed', 'draft'] } }),
        field('salary', 'Salary', 'string'), field('featured', 'Featured job', 'boolean'),
        field('content', 'Job details', 'portableText', { searchable: true }),
        field('requirements', 'Requirements', 'json'), field('skills', 'Skills', 'json'), field('contact', 'How to apply (contact details)', 'json'),
      ],
    }, { slug: 'services', label: 'Services', labelSingular: 'Service',
      supports: ['drafts', 'revisions', 'preview', 'scheduling', ...(fullTextSearch ? ['search'] : []), 'seo'],
      urlPattern: '/services/{slug}', routable: true, titleField: 'title',
      commentsEnabled: false, fields: serviceFields,
    }], content: { news: content, events: await eventEntries(), jobs: await jobEntries(), services: (await readFolder('services')).map(serviceEntry) },
  };
  const validation = validateSeed(seed);
  if (!validation.valid) throw new Error(validation.errors.join('\n'));
  return seed;
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const seed = await buildSeed();
  await mkdir('.emdash-pilot', { recursive: true });
  await writeFile('.emdash-pilot/seed.json', JSON.stringify(seed, null, 2) + '\n');
  console.log(`Prepared ${seed.content.news.length} articles, ${seed.content.events.length} events, ${seed.content.jobs.length} jobs and ${seed.content.services.length} services; source Markdown is unchanged.`);
}

import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import matter from 'gray-matter';
import { slug } from 'github-slugger';
import { validateSeed } from 'emdash/seed';
import { importMarkdown } from './markdown.mjs';

export const categories = ['news', 'business-spotlight', 'announcement', 'success-story', 'business-guide', 'education'];
const field = (slug, label, type, extra = {}) => ({ slug, label, type, ...extra });
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
    version: '1', meta: { name: 'Dzaleka News pilot' },
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
    }], content: { news: content },
  };
  const validation = validateSeed(seed);
  if (!validation.valid) throw new Error(validation.errors.join('\n'));
  return seed;
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const seed = await buildSeed();
  await mkdir('.emdash-pilot', { recursive: true });
  await writeFile('.emdash-pilot/seed.json', JSON.stringify(seed, null, 2) + '\n');
  console.log(`Prepared ${seed.content.news.length} articles; source Markdown is unchanged.`);
}

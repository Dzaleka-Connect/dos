import { getEmDashCollection, getEmDashEntry, type ContentEntry, type MediaValue, type PortableTextBlock } from 'emdash';
import { getMediaProvider } from 'emdash/runtime';
import type { CollectionEntry } from 'astro:content';

type CmsNews = Omit<CollectionEntry<'news'>['data'], 'date' | 'updated' | 'image'> & {
  slug: string | null;
  date: string;
  updated?: string | null;
  image?: MediaValue | null;
  content: PortableTextBlock[];
  business_name?: string;
  business_owner?: string;
  contact_info?: CollectionEntry<'news'>['data']['contactInfo'];
  seo?: { title?: string; description?: string; noIndex?: boolean };
};

async function adapt(entry: ContentEntry<CmsNews> | null) {
  if (!entry) return undefined;
  const data = entry.data;
  const media = data.image;
  let image: string | undefined;
  if (media && typeof media === 'object') {
    if (!media.provider || media.provider === 'local') {
      const key = typeof media.meta?.storageKey === 'string' ? media.meta.storageKey : media.id;
      image = key ? `/_emdash/api/media/file/${key.split('/').map(encodeURIComponent).join('/')}` : undefined;
    } else if (media.provider === 'external') {
      image = media.src;
    } else {
      const provider = await getMediaProvider(media.provider);
      const embed = await provider?.getEmbed(media);
      image = embed?.type === 'image' ? embed.src : undefined;
    }
  }
  return {
    id: String(data.slug || entry.id), collection: 'news' as const,
    content: data.content, seo: data.seo,
    data: {
      ...data, date: new Date(data.date), updated: data.updated ? new Date(data.updated) : undefined,
      image, imageAlt: media?.alt, businessName: data.business_name,
      businessOwner: data.business_owner, contactInfo: data.contact_info,
    },
  };
}

export async function getNews() {
  const entries = [];
  let cursor: string | undefined;
  do {
    const result = await getEmDashCollection<'news', CmsNews>('news', { status: 'published', limit: 100, cursor });
    if (result.error) throw result.error;
    entries.push(...await Promise.all(result.entries.map(adapt)));
    cursor = result.hasMore ? result.nextCursor : undefined;
  } while (cursor);
  return entries.filter((entry) => entry !== undefined);
}

export async function getNewsEntry(slug: string) {
  const result = await getEmDashEntry<'news', CmsNews>('news', slug);
  if (result.error) throw result.error;
  return { entry: await adapt(result.entry), isPreview: result.isPreview ?? false };
}

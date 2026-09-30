import { getEmDashCollection, getEmDashEntry, type ContentEntry, type MediaValue, type PortableTextBlock } from 'emdash';
import { getMediaProvider } from 'emdash/runtime';

type CmsData = Record<string, unknown> & {
  slug?: string | null;
  image?: MediaValue | null;
  content?: PortableTextBlock[];
  seo?: { title?: string; description?: string; noIndex?: boolean };
};

async function mediaUrl(media: MediaValue | null | undefined) {
  if (!media || typeof media !== 'object') return undefined;
  if (!media.provider || media.provider === 'local') {
    const key = typeof media.meta?.storageKey === 'string' ? media.meta.storageKey : media.id;
    return key ? `/_emdash/api/media/file/${key.split('/').map(encodeURIComponent).join('/')}` : undefined;
  }
  if (media.provider === 'external') return media.src;
  const provider = await getMediaProvider(media.provider);
  const embed = await provider?.getEmbed(media);
  return embed?.type === 'image' ? embed.src : undefined;
}

const date = (value: unknown) => (value ? new Date(value as string) : undefined);

// Shape CMS rows like the Markdown collections, so pages work with either source.
async function adapt(collection: string, entry: ContentEntry<CmsData> | null) {
  if (!entry) return undefined;
  const d = entry.data;
  const base = { id: String(d.slug || entry.id), collection, content: d.content, seo: d.seo };
  if (collection === 'events') {
    return { ...base, data: {
      ...d, date: date(d.date), endDate: date(d.end_date), image: await mediaUrl(d.image), imageAlt: d.image?.alt,
      status: d.event_status || 'past', tags: d.tags ?? [],
      registration: d.registration && typeof d.registration === 'object'
        ? { ...(d.registration as object), deadline: date((d.registration as { deadline?: string }).deadline) } : undefined,
    } };
  }
  if (collection === 'jobs') {
    return { ...base, data: { ...d, posted: date(d.posted), deadline: date(d.deadline), status: d.job_status || 'open', skills: d.skills ?? [] } };
  }
  return { ...base, data: {
    ...d, date: date(d.date), updated: date(d.updated), image: await mediaUrl(d.image), imageAlt: d.image?.alt,
    businessName: d.business_name, businessOwner: d.business_owner, contactInfo: d.contact_info,
  } };
}

export async function getEntries(collection: string) {
  const entries = [];
  let cursor: string | undefined;
  do {
    const result = await getEmDashCollection<string, CmsData>(collection, { status: 'published', limit: 100, cursor });
    if (result.error) throw result.error;
    entries.push(...await Promise.all(result.entries.map(entry => adapt(collection, entry))));
    cursor = result.hasMore ? result.nextCursor : undefined;
  } while (cursor);
  return entries.filter((entry) => entry !== undefined);
}

export async function getEntry(collection: string, slug: string) {
  const result = await getEmDashEntry<string, CmsData>(collection, slug);
  if (result.error) throw result.error;
  return { entry: await adapt(collection, result.entry), isPreview: result.isPreview ?? false };
}

export const getNews = () => getEntries('news');
export const getNewsEntry = (slug: string) => getEntry('news', slug);

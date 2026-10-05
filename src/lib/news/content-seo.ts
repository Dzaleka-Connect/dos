import { z } from 'zod';

const seoSchema = z.object({
  title: z.string().nullish(),
  description: z.string().nullish(),
  image: z.string().nullish(),
  canonical: z.string().nullish(),
  noIndex: z.boolean().optional(),
});

export function publicUrl(value: string | null | undefined) {
  if (!value?.trim()) return undefined;
  try {
    const url = new URL(value.trim(), 'https://services.dzaleka.com/');
    return ['http:', 'https:'].includes(url.protocol) ? url.href : undefined;
  } catch { return undefined; }
}

export function contentSeo(value: unknown) {
  const parsed = seoSchema.safeParse(value);
  const seo = parsed.success ? parsed.data : {};
  return {
    title: seo.title?.trim() || undefined,
    description: seo.description?.trim() || undefined,
    image: publicUrl(seo.image),
    canonical: publicUrl(seo.canonical),
    noIndex: seo.noIndex === true,
  };
}

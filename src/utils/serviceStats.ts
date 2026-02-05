import type { CollectionEntry } from 'astro:content';

export interface ServiceStats {
  total: number;
  featured: number;
  verified: number;
  active: number;
  categories: number;
}

export function calculateServiceStats(services: CollectionEntry<'services'>[]): ServiceStats {
  if (!services || !Array.isArray(services)) {
    return {
      total: 0,
      featured: 0,
      verified: 0,
      active: 0,
      categories: 0
    };
  }

  return {
    total: services.length,
    featured: services.filter(s => s?.data?.featured).length,
    verified: services.filter(s => s?.data?.verified).length,
    active: services.filter(s => s?.data?.status !== 'inactive').length,
    categories: new Set(services.map(s => s?.data?.category).filter(Boolean)).size
  };
}

export interface ContactStats {
  total: number;
  withEmail: number;
  withPhone: number;
  withWhatsApp: number;
  withSocialMedia: number;
  withWebsite: number;
}

export interface SocialBreakdown {
  facebook: number;
  instagram: number;
  twitter: number;
  linkedin: number;
  youtube: number;
}

export function calculateContactStats(items: any[]): ContactStats {
  if (!items || !Array.isArray(items)) return { total: 0, withEmail: 0, withPhone: 0, withWhatsApp: 0, withSocialMedia: 0, withWebsite: 0 };

  return {
    total: items.length,
    withEmail: items.filter(i => i.data?.contact?.email || i.data?.email).length,
    withPhone: items.filter(i => i.data?.contact?.phone || i.data?.phone).length,
    withWhatsApp: items.filter(i => i.data?.contact?.whatsapp || i.data?.whatsapp).length,
    withSocialMedia: items.filter(i => i.data?.socialMedia || i.data?.socials).length,
    withWebsite: items.filter(i => i.data?.socialMedia?.website || i.data?.website).length
  };
}

export function calculateSocialBreakdown(items: any[]): SocialBreakdown {
  const breakdown = { facebook: 0, instagram: 0, twitter: 0, linkedin: 0, youtube: 0 };

  items.forEach(item => {
    const socials = item.data?.socialMedia || item.data?.socials;
    if (socials) {
      if (socials.facebook) breakdown.facebook++;
      if (socials.instagram) breakdown.instagram++;
      if (socials.twitter || socials.x) breakdown.twitter++;
      if (socials.linkedin) breakdown.linkedin++;
      if (socials.youtube) breakdown.youtube++;
    }
  });

  return breakdown;
}

export function calculateFeaturedStats(collections: Record<string, any[]>): Record<string, number> {
  const featuredCounts: Record<string, number> = {};

  Object.entries(collections).forEach(([name, items]) => {
    if (Array.isArray(items)) {
      featuredCounts[name] = items.filter(i => i.data?.featured).length;
    }
  });

  return featuredCounts;
}


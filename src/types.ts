import { z } from 'astro:content';

export const ServiceCategoryEnum = z.enum([
  'Cultural',
  'Education',
  'Youth',
  'Entrepreneurship',
  'Health',
  'Humanitarian Aid',
  'Advocacy'
]);

export type ServiceCategory = z.infer<typeof ServiceCategoryEnum>;

export interface ServiceStats {
  totalServices: number;
  activeServices: number;
  categoryCounts: Record<ServiceCategory, number>;
  featuredCount: number;
  withSocialMedia: number;
  withContact: number;
}

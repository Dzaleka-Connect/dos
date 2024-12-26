import { z } from 'zod';

export const ServiceCategoryEnum = z.enum([
  'Humanitarian Aid',
  'Education',
  'Advocacy',
  'Entrepreneurship',
  'Health',
  'Cultural',
  'Youth'
]);

export const ServiceProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: ServiceCategoryEnum,
  description: z.string(),
  services: z.array(z.string()),
  contact: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    website: z.string().url().optional(),
    location: z.object({
      address: z.string(),
      coordinates: z.object({
        lat: z.number(),
        lng: z.number()
      })
    })
  }),
  logo: z.string().url()
});

export type ServiceCategory = z.infer<typeof ServiceCategoryEnum>;
export type ServiceProvider = z.infer<typeof ServiceProviderSchema>;
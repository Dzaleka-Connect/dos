import { importMarkdown } from './markdown.mjs';

const field = (slug, label, type = 'string', extra = {}) => ({ slug, label, type, ...extra });
export const serviceFields = [
  field('title', 'Service name', 'string', { required: true, searchable: true }),
  field('description', 'Summary', 'text', { required: true, searchable: true }),
  field('category', 'Category', 'string', { required: true, searchable: true }),
  field('listing_status', 'Listing status', 'select', { required: true, validation: { options: ['active', 'inactive'] } }),
  field('featured', 'Featured service', 'boolean'), field('verified', 'Legacy verification flag', 'boolean'),
  field('logo', 'Organisation logo', 'image'), field('image', 'Cover image', 'image'),
  field('last_updated', 'Listing updated', 'datetime'), field('date', 'Original listing date', 'datetime'),
  field('content', 'Service details', 'portableText', { searchable: true }),
  field('contact_email', 'Public email'), field('contact_phone', 'Public phone'),
  field('contact_whatsapp', 'WhatsApp'), field('contact_hours', 'Opening hours', 'text'),
  field('address', 'Street or camp address'), field('city', 'City or district'), field('state', 'State or region'),
  field('latitude', 'Latitude', 'number'), field('longitude', 'Longitude', 'number'),
  ...['website', 'facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok'].map(name => field(name, name === 'twitter' ? 'X / Twitter URL' : `${name[0].toUpperCase()}${name.slice(1)} URL`)),
  field('access_eligibility', 'Who can use this service', 'text'), field('access_fees', 'Cost', 'text'),
  field('access_documents', 'What to bring', 'text'), field('access_appointment', 'Appointments and referrals', 'text'),
  field('access_languages', 'Languages offered (one per line)', 'text'), field('access_accessibility', 'Access needs', 'text'),
  field('confirmation_by', 'Provider confirmation: confirmed by'), field('confirmation_date', 'Provider confirmation: date', 'datetime'),
  field('confirmation_source', 'Provider confirmation: source URL'),
  field('business_hours', 'Structured business hours', 'json'), field('tags', 'Tags', 'json'),
];

export function serviceEntry({ name, data, markdown, slug }) {
  const image = src => src ? { provider: 'external', id: '', src, alt: data.title } : null;
  const iso = value => value ? new Date(value).toISOString() : null;
  return { id: `services:${name}`, slug, status: 'published', data: {
    title: data.title, description: data.description, category: data.category,
    listing_status: data.status || 'active', featured: data.featured ?? false, verified: data.verified ?? data.verifed ?? false,
    logo: image(data.logo), image: image(data.image), last_updated: iso(data.lastUpdated), date: iso(data.date),
    content: importMarkdown(markdown),
    contact_email: data.contact?.email ?? null, contact_phone: data.contact?.phone ?? null,
    contact_whatsapp: data.contact?.whatsapp ?? null, contact_hours: data.contact?.hours ?? null,
    address: data.location?.address ?? null, city: data.location?.city ?? null, state: data.location?.state ?? null,
    latitude: data.location?.coordinates?.lat ?? null, longitude: data.location?.coordinates?.lng ?? null,
    ...Object.fromEntries(['website', 'facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok'].map(key => [key, (key === 'tiktok' ? data.socialMedia?.tiktok ?? data.socialMedia?.Tiktok : data.socialMedia?.[key]) ?? null])),
    ...Object.fromEntries(['eligibility', 'fees', 'documents', 'appointment', 'accessibility'].map(key => [`access_${key}`, data.access?.[key] ?? null])),
    access_languages: data.access?.languages?.join('\n') ?? null,
    confirmation_by: data.providerConfirmation?.by ?? null, confirmation_date: iso(data.providerConfirmation?.date),
    confirmation_source: data.providerConfirmation?.sourceUrl ?? null,
    business_hours: data.businessHours ?? null, tags: data.tags ?? [],
  } };
}

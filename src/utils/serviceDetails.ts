import { z } from 'astro:content';
import type { infer as SchemaOutput } from 'astro/zod';

const suppliedText = z.string().trim().min(1);
export const serviceAccessSchema = z.object({
  eligibility: suppliedText.optional(),
  fees: suppliedText.optional(),
  documents: suppliedText.optional(),
  appointment: suppliedText.optional(),
  languages: z.array(suppliedText).optional(),
  accessibility: suppliedText.optional(),
});
export const providerConfirmationSchema = z.object({
  by: suppliedText,
  date: z.coerce.date(),
  sourceUrl: z.string().url().optional(),
});

export function serviceAccessRows(access?: SchemaOutput<typeof serviceAccessSchema>) {
  if (!access) return [];
  return [
    { label: 'Who can use this service', value: access.eligibility },
    { label: 'Cost', value: access.fees },
    { label: 'What to bring', value: access.documents },
    { label: 'Appointments and referrals', value: access.appointment },
    { label: 'Languages offered', value: access.languages?.join(', ') },
    { label: 'Access needs', value: access.accessibility },
  ].filter(row => row.value);
}

export function providerConfirmation(confirmation: SchemaOutput<typeof providerConfirmationSchema> | undefined, now = new Date()) {
  if (!confirmation || confirmation.date.getTime() > now.getTime()) return undefined;
  return { ...confirmation, reviewDue: now.getTime() - confirmation.date.getTime() > 180 * 86400000 };
}

export function contactLanguages(access?: SchemaOutput<typeof serviceAccessSchema>) {
  return access?.languages?.length ? access.languages : undefined;
}

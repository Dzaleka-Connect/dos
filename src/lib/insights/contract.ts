import { z } from 'zod';

export const publicOrigin = 'https://services.dzaleka.com';
export const pluginPath = '/_emdash/api/plugins/dos-insights/';
export const campaignField = z.string().trim().max(80).regex(/^[a-zA-Z0-9 _.-]*$/).default('');
export const slugField = z.string().min(1).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export function destinationUrl(value: string) {
  const url = new URL(value);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || (url.port && !['80', '443'].includes(url.port))) throw new Error('Use a public HTTP or HTTPS destination without credentials or a custom port.');
  const host = url.hostname.toLowerCase();
  if (!host.includes('.') || /^[\d.]+$/.test(host) || host.includes(':') || /(?:^|\.)(?:localhost|local|internal|test|invalid)$/.test(host)) throw new Error('Use a public website destination.');
  if ([new URL(publicOrigin).hostname, 'cms.dzaleka.com'].includes(host) && /^\/(?:go|_emdash|api)(?:\/|$)/.test(url.pathname)) throw new Error('Short links cannot point to another short link or an internal endpoint.');
  return url.href;
}
export const linkSchema = z.object({
  slug: slugField, title: z.string().trim().min(1).max(160),
  destination: z.string().max(2048).transform((value, ctx) => { try { return destinationUrl(value); } catch (e) { ctx.addIssue({ code: 'custom', message: (e as Error).message }); return z.NEVER; } }),
  enabled: z.boolean().default(true), tags: campaignField,
  source: campaignField, medium: campaignField, campaign: campaignField,
  expires_at: z.union([z.literal(''), z.string().datetime()]).default(''),
});
export type LinkInput = z.infer<typeof linkSchema>;
export const eventNames = ['pageview', 'outbound', 'phone', 'email', 'whatsapp', 'application', 'registration', 'download', 'form_start', 'link_click', 'submission'] as const;
export const browserEventSchema = z.object({
  id: z.string().uuid(), name: z.enum(eventNames.filter(n => n !== 'link_click' && n !== 'submission') as ['pageview', ...string[]]),
  path: z.string().min(1).max(400).regex(/^\/[a-zA-Z0-9/_\-.%]*$/),
  referrer: z.string().max(2048).default(''), target: z.string().max(253).default(''),
  source: campaignField, medium: campaignField, campaign: campaignField,
}).strict();
export type BrowserEvent = z.infer<typeof browserEventSchema>;
export function canonicalPath(path: string) { return path.replace(/\/+$/, '') || '/'; }
export function excludedPath(path: string) { return /^\/(?:_|(?:api|go|analytics|admin|submissions)(?:\/|$))/.test(path); }
export function botAgent(agent: string) { return !agent || /bot|crawler|spider|preview|headless|lighthouse|curl|wget|facebookexternalhit|slack|telegram|whatsapp/i.test(agent); }
export function referrerHost(value: string) {
  try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) && url.origin !== publicOrigin ? url.hostname.slice(0, 253) : ''; } catch { return ''; }
}
export function deviceFor(agent: string) { return /ipad|tablet/i.test(agent) ? 'Tablet' : /mobile|android|iphone/i.test(agent) ? 'Mobile' : 'Desktop'; }
export function browserFor(agent: string) { return /edg\//i.test(agent) ? 'Edge' : /firefox\//i.test(agent) ? 'Firefox' : /chrome\//i.test(agent) ? 'Chrome' : /safari\//i.test(agent) ? 'Safari' : 'Other'; }
export function trackedDestination(link: LinkInput) {
  const url = new URL(link.destination);
  for (const key of ['source', 'medium', 'campaign'] as const) if (link[key]) url.searchParams.set(`utm_${key}`, link[key]);
  return url.href;
}
export function csv(rows: Record<string, unknown>[], columns: string[]) {
  const cell = (value: unknown) => { let s = String(value ?? ''); if (/^[\s]*[=+@-]/.test(s)) s = `'${s}`; return `"${s.replaceAll('"', '""')}"`; };
  return '\uFEFF' + [columns, ...rows.map(row => columns.map(key => row[key]))].map(row => row.map(cell).join(',')).join('\r\n');
}

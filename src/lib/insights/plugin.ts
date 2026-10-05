import { definePlugin } from 'emdash';
import { getDb } from 'emdash/runtime';
import { z } from 'zod';
import { validSignature } from '../submissions/contract';
import { eventNames, linkSchema, slugField } from './contract';
import { insightsDb, recordEvent, resolveLink, saveLink } from './store';
import { report, reportSchema } from './report';
import { checkLinks } from './health';

const eventSchema = z.object({ id: z.string().uuid(), at: z.string().datetime(), day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), visitor: z.string().regex(/^[a-f0-9]{64}$/), name: z.enum(eventNames), path: z.string().max(400), target: z.string().max(253), referrer: z.string().max(253), source: z.string().max(80), medium: z.string().max(80), campaign: z.string().max(80), device: z.string().max(20), browser: z.string().max(20), link_id: z.string().max(80) }).strict();
const receiveSchema = z.object({ domain: z.literal('dos-insights-v1'), input: z.discriminatedUnion('operation', [
  z.object({ operation: z.literal('event'), event: eventSchema }),
  z.object({ operation: z.literal('resolve'), slug: slugField, event: eventSchema.optional() }),
]) });
const listSchema = z.object({ search: z.string().max(160).default(''), offset: z.coerce.number().int().min(0).max(1000000).default(0) });
export function createPlugin() {
  return definePlugin({ id: 'dos-insights', version: '1.0.0',
    admin: { pages: [{ path: '/links', label: 'Links', icon: 'link' }, { path: '/statistics', label: 'Statistics', icon: 'chart-bar' }], widgets: [{ id: 'overview', title: 'Site statistics', size: 'full' }] },
    routes: {
      receive: { public: true, methods: ['POST'], request: { body: 'text', maxBytes: 8192 }, handler: async ctx => {
        if (typeof ctx.input !== 'string' || !validSignature(ctx.input, process.env.DOS_SUBMISSION_SECRET, ctx.request.headers.get('x-dos-timestamp'), ctx.request.headers.get('x-dos-signature'))) return { ok: false };
        const parsed = receiveSchema.safeParse(JSON.parse(ctx.input)); if (!parsed.success) return { ok: false };
        const input = parsed.data.input, db = await getDb();
        if (input.operation === 'event') {
          if (['submission', 'link_click'].includes(input.event.name)) return { ok: false };
          return { ok: true, recorded: await recordEvent(db, input.event) };
        }
        const resolved = await resolveLink(db, input.slug);
        if (resolved.status !== 302) return { ok: true, status: resolved.status };
        if (input.event) {
          try { await recordEvent(db, { ...input.event, name: 'link_click', path: `/go/${input.slug}`, link_id: resolved.link.id, target: new URL(resolved.destination).hostname,
            source: resolved.link.source, medium: resolved.link.medium, campaign: resolved.link.campaign }); }
          catch { console.error('[DOS insights] Link click could not be stored.'); }
        }
        return { ok: true, status: 302, destination: resolved.destination };
      } },
      links: { permission: 'content:publish_any', methods: ['GET'], handler: async ctx => {
        const f = listSchema.parse(ctx.input), db = insightsDb(await getDb());
        let query = db.selectFrom('_dos_links').selectAll();
        if (f.search) query = query.where(eb => eb.or([eb('title', 'like', `%${f.search}%`), eb('slug', 'like', `%${f.search}%`), eb('tags', 'like', `%${f.search}%`)]));
        const rows = await query.orderBy('created_at', 'desc').orderBy('id').offset(f.offset).limit(51).execute();
        return { rows: rows.slice(0, 50).map(row => ({ ...row, enabled: !!row.enabled })), more: rows.length > 50 };
      } },
      save: { permission: 'content:publish_any', methods: ['POST'], request: { body: 'json', maxBytes: 8192 }, handler: async ctx => {
        const parsed = z.object({ link: linkSchema, id: z.string().uuid().optional(), revision: z.number().int().positive().optional() }).safeParse(ctx.input);
        if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message || 'Check the link fields.' };
        try { return { ok: true, link: await saveLink(await getDb(), parsed.data.link, parsed.data.id, parsed.data.revision) }; }
        catch (error) { const message = error instanceof Error ? error.message : ''; return { ok: false, error: /^(This link|The short|That short)/.test(message) ? message : 'The link could not be saved. Please try again.' }; }
      } },
      health: { permission: 'content:publish_any', methods: ['POST'], request: { body: 'json', maxBytes: 1024 }, handler: async ctx => {
        const { id } = z.object({ id: z.string().uuid() }).parse(ctx.input); await checkLinks(await getDb(), id); return { ok: true };
      } },
      report: { permission: 'content:publish_any', methods: ['GET'], handler: async ctx => { const parsed = reportSchema.safeParse(ctx.input); return parsed.success ? report(await getDb(), parsed.data) : { ok: false, error: parsed.error.issues[0]?.message || 'Check the report filters.' }; } },
      settings: { permission: 'content:publish_any', methods: ['GET'], handler: async () => insightsDb(await getDb()).selectFrom('_dos_insights_settings').selectAll().where('id', '=', 'site').executeTakeFirstOrThrow() },
      configure: { permission: 'plugins:manage', methods: ['POST'], request: { body: 'json', maxBytes: 1024 }, handler: async ctx => {
        const data = z.object({ enabled: z.boolean(), retention: z.union([z.literal(30), z.literal(90), z.literal(180), z.literal(365)]) }).parse(ctx.input);
        await insightsDb(await getDb()).updateTable('_dos_insights_settings').set({ enabled: Number(data.enabled), retention: data.retention }).where('id', '=', 'site').execute();
        return { ok: true };
      } },
    },
  });
}

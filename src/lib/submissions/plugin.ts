import { definePlugin, ContentRepository } from 'emdash';
import { getDb } from 'emdash/runtime';
import { z } from 'zod';
import type { BlockResponse, Block } from '@emdash-cms/blocks';
import { submissionSchema, validSignature } from './contract';
import { saveSubmission, deliverSubmissions, submissionDb } from './store';

const interactionSchema = z.object({ type: z.string(), action_id: z.string().optional(), value: z.string().optional() });
export function createPlugin() {
  return definePlugin({
    id: 'dos-submissions', version: '1.0.0', capabilities: ['content:write'],
    admin: { pages: [{ path: '/inbox', label: 'Submissions', icon: 'inbox' }], widgets: [{ id: 'submissions', title: 'New submissions', size: 'full' }] },
    routes: {
      receive: {
        public: true, methods: ['POST'], request: { body: 'text', maxBytes: 65536 },
        handler: async ctx => {
          if (typeof ctx.input !== 'string' || !validSignature(ctx.input, process.env.DOS_SUBMISSION_SECRET,
            ctx.request.headers.get('x-dos-timestamp'), ctx.request.headers.get('x-dos-signature'))) return { accepted: false };
          const input = submissionSchema.parse(JSON.parse(ctx.input));
          const db = await getDb();
          const row = await saveSubmission(db, input);
          await deliverSubmissions(db, row.id);
          return { accepted: true, id: row.id };
        },
      },
      admin: {
        permission: 'content:publish_any',
        handler: async ctx => {
          const db = await getDb();
          const database = submissionDb(db);
          const interaction = interactionSchema.safeParse(ctx.input);
          const selected = interaction.success ? interaction.data : undefined;
          if ((selected?.action_id === 'reviewed' || selected?.action_id === 'reopen') && selected.value) {
            await database.updateTable('_dos_submissions').set({ reviewed_at: selected.action_id === 'reopen' ? null : new Date().toISOString() }).where('id', '=', selected.value).execute();
          }
          const counts = await database.selectFrom('_dos_submissions').select(({ fn }) => fn.countAll<number>().as('count')).where('reviewed_at', 'is', null).executeTakeFirstOrThrow();
          const pendingDelivery = await database.selectFrom('_dos_submissions').select(({ fn }) => fn.countAll<number>().as('count')).where('delivery', '=', 'pending').executeTakeFirstOrThrow();
          const blocks: Block[] = [
            { type: 'stats', items: [{ label: 'Awaiting review', value: String(counts.count) }, { label: 'Awaiting Formspree delivery', value: String(pendingDelivery.count) }] },
            { type: 'section', text: 'Service, event and job submissions are saved as drafts. Corrections stay in this inbox until an editor updates the listing. Nothing is published automatically.' },
          ];
          if (selected?.action_id === 'open' && selected.value) {
            const row = await database.selectFrom('_dos_submissions').selectAll().where('id', '=', selected.value).executeTakeFirst();
            if (row) {
              blocks.push({ type: 'header', text: row.title }, { type: 'context', text: `${row.form} · ${row.created_at} · Formspree: ${row.delivery}` });
              const fields = JSON.parse(row.payload);
              blocks.push({ type: 'code', code: JSON.stringify(fields, null, 2), language: 'jsonc' });
              if (row.content_id && row.content_collection) blocks.push({ type: 'actions', elements: [{ type: 'link', label: 'Open draft', target: { kind: 'content', collection: row.content_collection, id: row.content_id } }] });
              let url: URL | undefined;
              try { if (typeof fields.listingUrl === 'string') url = new URL(fields.listingUrl, 'https://services.dzaleka.com'); } catch { /* Invalid submitted links stay plain text. */ }
              if (url?.origin === 'https://services.dzaleka.com' && url.pathname.startsWith('/services/')) {
                const item = await new ContentRepository(db).findBySlug('services', url.pathname.slice('/services/'.length).replace(/\/$/, ''));
                if (item) blocks.push({ type: 'actions', elements: [{ type: 'link', label: 'Open existing listing', target: { kind: 'content', collection: 'services', id: item.id } }] });
              }
              blocks.push({ type: 'actions', elements: [{ type: 'button', label: row.reviewed_at ? 'Reopen submission' : 'Mark reviewed', action_id: row.reviewed_at ? 'reopen' : 'reviewed', value: row.id }, { type: 'button', label: 'Back to inbox', action_id: 'refresh' }] });
            }
          } else {
            const archived = selected?.action_id === 'archive';
            const offset = Math.max(0, Math.min(100000, Number(selected?.value) || 0));
            const rows = await database.selectFrom('_dos_submissions').selectAll().where('reviewed_at', archived ? 'is not' : 'is', null).orderBy('created_at', 'desc').orderBy('id', 'desc').offset(offset).limit(51).execute();
            blocks.push({ type: 'actions', elements: [{ type: 'button', label: 'Awaiting review', action_id: 'refresh' }, { type: 'button', label: 'Reviewed submissions', action_id: 'archive' }] });
            blocks.push({ type: 'table', columns: [{ key: 'title', label: 'Submission' }, { key: 'form', label: 'Form' }, { key: 'created', label: 'Received', format: 'relative_time' }, { key: 'open', label: 'Review', format: 'element' }],
              rows: rows.slice(0, 50).map(row => ({ title: row.title, form: row.form, created: row.created_at, open: { type: 'button', label: 'Review', action_id: 'open', value: row.id } })), page_action_id: archived ? 'archive' : 'refresh', next_cursor: rows.length > 50 ? String(offset + 50) : undefined, empty_text: 'No submissions in this view.' });
          }
          return { blocks } satisfies BlockResponse;
        },
      },
    },
  });
}

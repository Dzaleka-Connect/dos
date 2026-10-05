import { Button, Input, LayerCard, Table, Checkbox, Banner } from '@dos/emdash-ui';
import React, { useEffect, useRef, useState } from 'react';
import { type ContentEditorPanelContext } from '@emdash-cms/admin';
import QRCode from 'qrcode';
import { csv, publicOrigin, type LinkInput } from './contract';
import type { LinkRow } from './store';
import { Statistics } from './statistics';
import './admin.css';

type LinkList = { rows: LinkRow[]; more: boolean };
import { api, download, message } from './admin-api';
const emptyLink: LinkInput = { title: '', slug: '', destination: '', enabled: true, tags: '', source: '', medium: '', campaign: '', expires_at: '' };
function Links() {
  const [data, setData] = useState<LinkList>(), [search, setSearch] = useState(''), [offset, setOffset] = useState(0);
  const [editing, setEditing] = useState<(LinkInput & { id?: string; revision?: number }) | null>(null);
  const [error, setError] = useState(''), [notice, setNotice] = useState(''), [busy, setBusy] = useState(false), [qr, setQr] = useState<{ src: string; slug: string }>();
  const sequence = useRef(0);
  const load = async () => { const id = ++sequence.current; try { const result = await api<LinkList>(`links?${new URLSearchParams({ search, offset: String(offset) })}`); if (id === sequence.current) { setData(result); setError(''); } } catch (e) { if (id === sequence.current) setError(message(e)); } };
  useEffect(() => { setData(undefined); void load(); return () => { sequence.current++; }; }, [search, offset]);
  const run = async (action: () => Promise<void>) => { setBusy(true); setError(''); setNotice(''); try { await action(); } catch (e) { setError(message(e)); } finally { setBusy(false); } };
  const save = (event: React.FormEvent) => { event.preventDefault(); if (!editing) return; void run(async () => {
    const { id, revision, ...link } = editing; await api('save', { id, revision, link }); setEditing(null); setNotice('Link saved. The public destination updates immediately.'); await load();
  }); };
  const exportLinks = () => run(async () => {
    const rows: LinkRow[] = []; let start = 0;
    while (true) { const result = await api<LinkList>(`links?${new URLSearchParams({ search, offset: String(start) })}`); rows.push(...result.rows); if (!result.more) break; start += 50; }
    download(csv(rows.map(row => ({ ...row, short_url: `${publicOrigin}/go/${row.slug}` })), ['title', 'short_url', 'destination', 'enabled', 'tags', 'source', 'medium', 'campaign', 'expires_at', 'health', 'checked_at']), 'dzaleka-links.csv');
  });
  return <main className="dos-insights dos-links"><header><h1>Links</h1><p>Create permanent shareable addresses with destinations you can update. Short links use temporary redirects so browsers follow later edits.</p></header>
    {error && <Banner variant="error" role="alert" description={error} />}{notice && <Banner variant="secondary" role="status" description={notice} />}
    <div className="dos-toolbar"><label>Search links or tags<Input value={search} onChange={e => { setSearch(e.target.value); setOffset(0); }} /></label><Button variant="primary" disabled={busy} onClick={() => { setEditing({ ...emptyLink }); setQr(undefined); }}>Create link</Button><Button disabled={busy} onClick={() => void exportLinks()}>Export matching links</Button><Button disabled={busy} onClick={() => void load()}>Refresh</Button></div>
    {editing && <form className="dos-panel" onSubmit={save}><h2>{editing.id ? 'Edit link' : 'Create link'}</h2><div className="dos-fields">
      {(['title', 'slug', 'destination', 'tags', 'source', 'medium', 'campaign'] as const).map(key => <label key={key}>{({ title: 'Title', slug: 'Short URL slug', destination: 'Destination URL', tags: 'Tags', source: 'Campaign source (e.g. whatsapp)', medium: 'Campaign medium (e.g. social or qr)', campaign: 'Campaign name' })[key]}<Input required={['title', 'slug', 'destination'].includes(key)} type={key === 'destination' ? 'url' : 'text'} disabled={key === 'slug' && !!editing.id} maxLength={key === 'destination' ? 2048 : key === 'title' ? 160 : 80} pattern={key === 'slug' ? '[a-z0-9]+(-[a-z0-9]+)*' : undefined} value={editing[key]} onChange={e => setEditing({ ...editing, [key]: e.target.value })} /></label>)}
      <label>Expires at (your local time; optional)<Input type="datetime-local" value={editing.expires_at ? new Date(Date.parse(editing.expires_at) - new Date(editing.expires_at).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''} onChange={e => setEditing({ ...editing, expires_at: e.target.value ? new Date(e.target.value).toISOString() : '' })} /></label>
      <label className="dos-check"><Checkbox aria-label="Enabled" checked={editing.enabled} onCheckedChange={checked => setEditing({ ...editing, enabled: checked })} />Enabled</label>
    </div><p>Short URL: {publicOrigin}/go/{editing.slug || 'your-slug'}</p><p>Use a separate slug for each campaign channel. QR images contain this short URL, so they keep working after destination edits. Disabled or expired links return “no longer available”.</p><div className="dos-toolbar"><Button variant="primary" disabled={busy} type="submit">{busy ? 'Saving…' : 'Save link'}</Button><Button type="button" disabled={busy} onClick={() => setEditing(null)}>Cancel</Button></div></form>}
    {qr && <section className="dos-panel"><h2>QR code: {qr.slug}</h2><img width="240" height="240" src={qr.src} alt={`QR code for ${publicOrigin}/go/${qr.slug}`} /><a href={qr.src} download={`${qr.slug}.png`}>Download PNG</a><Button onClick={() => setQr(undefined)}>Close QR code</Button></section>}
    {!data ? <p role="status">{error ? 'Links could not be loaded.' : 'Loading links…'}</p> : <><LayerCard className="dos-table"><Table><Table.Header><Table.Row>{['Link', 'Destination', 'Status', 'Health', 'Actions'].map(x => <Table.Head key={x}>{x}</Table.Head>)}</Table.Row></Table.Header><Table.Body>{data.rows.map(row => <Table.Row key={row.id}><Table.Cell><strong>{row.title}</strong><br /><code>/go/{row.slug}</code><br /><small>{row.tags}</small></Table.Cell><Table.Cell><a href={row.destination} target="_blank" rel="noopener noreferrer">{row.destination}</a>{row.campaign && <p>{row.campaign} · {row.source} · {row.medium}</p>}</Table.Cell><Table.Cell>{!row.enabled ? 'Disabled' : row.expires_at && Date.parse(row.expires_at) <= Date.now() ? 'Expired' : 'Active'}{row.expires_at && <p>{new Date(row.expires_at).toLocaleString()}</p>}</Table.Cell><Table.Cell>{row.health}{row.checked_at && <p><small>{new Date(row.checked_at).toLocaleString()}</small></p>}</Table.Cell><Table.Cell><div className="dos-row-actions">
      <Button disabled={busy} onClick={() => { setEditing(row); setError(''); }}>Edit</Button>
      <Button disabled={busy} onClick={() => void run(async () => { await navigator.clipboard.writeText(`${publicOrigin}/go/${row.slug}`); setNotice('Short URL copied.'); })}>Copy URL</Button>
      <Button disabled={busy} onClick={() => void run(async () => setQr({ src: await QRCode.toDataURL(`${publicOrigin}/go/${row.slug}`, { width: 768, margin: 4, errorCorrectionLevel: 'M' }), slug: row.slug }))}>QR code</Button>
      <Button disabled={busy} onClick={() => void run(async () => { await api('health', { id: row.id }); await load(); setNotice('Destination checked. A missing destination is marked broken only after two checks.'); })}>Check destination</Button>
      <a href={`/_emdash/admin/plugins/dos-insights/statistics?link_id=${encodeURIComponent(row.id)}`}>Statistics</a>
    </div></Table.Cell></Table.Row>)}</Table.Body></Table></LayerCard>{data.rows.length === 0 && <p>No links match this search.</p>}<div className="dos-toolbar"><Button disabled={offset === 0 || busy} onClick={() => setOffset(Math.max(0, offset - 50))}>Previous</Button><span>Page {offset / 50 + 1}</span><Button disabled={!data.more || busy} onClick={() => setOffset(offset + 50)}>Next</Button></div></>}
    <p className="dos-muted">Known bots and link previews are excluded from click reports. Health checks run automatically in small batches; blocked or inconclusive checks are shown separately from broken destinations.</p>
  </main>;
}
function EntryStatistics({ collection, entry }: ContentEditorPanelContext) { return <Statistics path={`/${collection}/${entry.slug}`} compact />; }
function Overview() { return <Statistics compact />; }
export const pages = { '/links': Links, '/statistics': Statistics };
export const widgets = { overview: Overview };
export const contentEditorPanels = [{ id: 'statistics', title: 'Public-site statistics', collections: ['news', 'events', 'jobs', 'services'], minRole: 40, component: EntryStatistics }];

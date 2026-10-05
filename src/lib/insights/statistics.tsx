import { Button, Input, LayerCard, Table, Checkbox, Select, Tabs, Banner } from '@dos/emdash-ui';
import { useEffect, useState } from 'react';
import { useCurrentUser } from '@emdash-cms/admin';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { api, download, message } from './admin-api';
import { csv, publicOrigin } from './contract';
import type { report } from './report';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);
type Report = Awaited<ReturnType<typeof report>>;
type Settings = { enabled: number; retention: number };
type Tab = 'Overview' | 'Content' | 'Acquisition' | 'Audience' | 'Actions';
const tabs: Tab[] = ['Overview', 'Content', 'Acquisition', 'Audience', 'Actions'];
const dimensions = { path: 'Pages', name: 'Actions', referrer: 'Referring websites', source: 'Campaign sources', medium: 'Campaign media', campaign: 'Campaign names', device: 'Devices', browser: 'Browsers', link_id: 'Short links' };
const actionNames: Record<string, string> = { pageview: 'Page views', outbound: 'Outbound clicks', phone: 'Phone clicks', email: 'Email clicks', whatsapp: 'WhatsApp clicks', application: 'Application clicks', registration: 'Registration clicks', download: 'Downloads', form_start: 'Form starts', link_click: 'Short-link clicks', submission: 'Saved submissions' };
const contactActions = ['outbound', 'phone', 'email', 'whatsapp', 'application', 'registration', 'download'];
const day = (offset = 0) => new Date(Date.now() + 7200000 + offset * 86400000).toISOString().slice(0, 10);
const shift = (value: string, days: number) => new Date(Date.parse(value) + days * 86400000).toISOString().slice(0, 10);
const number = (value: number | string) => Number(value).toLocaleString();
const dateLabel = (value: string) => new Date(`${value}T12:00:00Z`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'Africa/Blantyre' });
const count = (counts: Report['counts'], name: string) => Number(counts.find(row => row.name === name)?.count || 0);
const displayValue = (value: string, dimension: string) => value ? (dimension === 'name' ? actionNames[value] || value : value) : ['source', 'medium', 'campaign'].includes(dimension) ? 'Untagged' : dimension === 'referrer' ? 'Direct / unknown' : 'Not applicable';

function Metric({ label, value, previous, help, compact }: { label: string; value: number; previous: number; help: string; compact: boolean }) {
  const change = previous ? (value - previous) / previous * 100 : null;
  const contents = <><strong>{number(value)}</strong><div className="dos-comparison">
    <span className={change === null || change === 0 ? 'dos-delta' : change > 0 ? 'dos-delta dos-up' : 'dos-delta dos-down'}>
      {change === null ? '—' : `${change > 0 ? '↑ ' : change < 0 ? '↓ ' : ''}${Math.abs(change).toLocaleString(undefined, { maximumFractionDigits: 1 })}%`}
    </span><small>{previous ? `vs ${number(previous)}` : 'No prior activity'}</small>
  </div></>;
  if (compact) return <div className="dos-metric" title={help}><h2>{label}</h2>{contents}</div>;
  return <LayerCard className="dos-metric" title={help}>
    <LayerCard.Secondary><h2>{label}</h2></LayerCard.Secondary><LayerCard.Primary>{contents}</LayerCard.Primary>
  </LayerCard>;
}

function TrafficChart({ data, compare, compact }: { data: Report; compare: boolean; compact: boolean }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const update = () => setDark(document.documentElement.dataset.mode === 'dark');
    update(); const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] });
    return () => observer.disconnect();
  }, []);
  const axisColor = dark ? '#a3a3a3' : '#737373';
  const points = data.hourly || data.daily;
  const previousPoints = data.previous.hourly || data.previous.daily;
  const series = [
    { label: 'Page views', data: points.map(p => Number(p.views)), borderColor: '#3185dd', backgroundColor: 'rgba(49,133,221,.08)', fill: true, borderWidth: 2, pointRadius: points.length === 1 ? 4 : 0, pointHitRadius: 12 },
    { label: 'Visitor-days', data: points.map(p => Number(p.visitors)), borderColor: '#20a184', backgroundColor: '#20a184', borderWidth: 2, pointRadius: points.length === 1 ? 4 : 0, pointHitRadius: 12 },
    ...(compare ? [{ label: 'Previous page views', data: previousPoints.map(p => Number(p.views)), borderColor: '#9cbde0', backgroundColor: '#9cbde0', borderDash: [5, 5], borderWidth: 1.5, pointRadius: points.length === 1 ? 3 : 0, pointHitRadius: 12 }] : []),
  ];
  return <div className={`dos-chart ${compact ? 'dos-chart-compact' : ''}`}>
    <Line data={{ labels: points.map(p => data.hourly ? p.day : dateLabel(p.day)), datasets: series }} options={{
      responsive: true, maintainAspectRatio: false, animation: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 7, boxHeight: 7, padding: 22, color: axisColor, font: { size: 12 } } }, tooltip: { padding: 12, callbacks: { title: items => {
        const i = items[0]?.dataIndex || 0;
        return [data.hourly ? `${data.filters.from} ${points[i].day}` : points[i].day, ...(compare ? [`Previous: ${data.hourly ? data.previous.from + " " : ""}${previousPoints[i].day}`] : [])];
      } } } },
      scales: { x: { grid: { display: false }, border: { display: false }, ticks: { maxTicksLimit: compact ? 5 : 9, maxRotation: 0, color: axisColor, font: { size: 11 } } }, y: { beginAtZero: true, border: { display: false }, grid: { color: dark ? 'rgba(163,163,163,.2)' : 'rgba(115,115,115,.12)' }, ticks: { precision: 0, maxTicksLimit: 5, color: axisColor, font: { size: 11 } } } },
    }} role="img" aria-label={`${data.hourly ? 'Hourly' : 'Daily'} page views and visitor-days, ${data.filters.from} to ${data.filters.to}. Daily values are available below.`} />
  </div>;
}

function Ranking({ title, rows, total, dimension, open, filter }: { title: string; rows: { value: string; views: number }[]; total: number; dimension: string; open: () => void; filter?: (value: string) => void }) {
  return <LayerCard className="dos-ranking">
    <LayerCard.Secondary><header><h2>{title}</h2><span>Views</span></header></LayerCard.Secondary><LayerCard.Primary>
    <div className="dos-ranking-rows">{rows.length ? rows.map(row => {
      const share = total ? Number(row.views) / total * 100 : 0;
      return <div className="dos-rank" key={row.value}>
        <div className="dos-rank-bar" style={{ width: `${share}%` }} />
        <div className="dos-rank-label" title={displayValue(row.value, dimension)}>{filter && row.value ? <Button variant="ghost" className="dos-rank-link" onClick={() => filter(row.value)}>{displayValue(row.value, dimension)}</Button> : displayValue(row.value, dimension)}</div>
        <strong>{number(row.views)}</strong><span>{Math.round(share)}%</span>
      </div>;
    }) : <div className="dos-empty">No page views in this period.</div>}</div>
    <Button variant="ghost" onClick={open}>View report <span aria-hidden="true">→</span></Button>
  </LayerCard.Primary></LayerCard>;
}

export function Statistics({ path = '', compact = false }: { path?: string; compact?: boolean }) {
  const [filters, setFilters] = useState(() => ({ from: day(-29), to: day(), dimension: 'path', path: path || (typeof location !== 'undefined' ? new URLSearchParams(location.search).get('path') || '' : ''), campaign: '', collection: '', link_id: typeof location !== 'undefined' ? new URLSearchParams(location.search).get('link_id') || '' : '', offset: '0' }));
  const [applied, setApplied] = useState(filters), [data, setData] = useState<Report>(), [error, setError] = useState('');
  const [loading, setLoading] = useState(true), [busy, setBusy] = useState(false), [notice, setNotice] = useState('');
  const [settings, setSettings] = useState<Settings>(), [tab, setTab] = useState<Tab>('Overview'), [preset, setPreset] = useState('30');
  const [compare, setCompare] = useState(true), [showFilters, setShowFilters] = useState(false), [showReport, setShowReport] = useState(false), [updated, setUpdated] = useState('');
  const { data: user } = useCurrentUser();
  useEffect(() => {
    let active = true; setLoading(true); setError('');
    api<Report>(`report?${new URLSearchParams(applied)}`).then(result => { if (active) { setData(result); setUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); } }).catch(e => { if (active) setError(message(e)); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [applied]);
  useEffect(() => { let active = true; api<Settings>('settings').then(value => { if (active) setSettings(value); }).catch(e => { if (active) setError(message(e)); }); return () => { active = false; }; }, []);
  function apply(next: typeof filters) { setFilters(next); setApplied({ ...next, offset: '0' }); }
  function choosePreset(value: string) {
    setPreset(value);
    if (value === 'custom') { setShowFilters(true); return; }
    apply({ ...filters, from: value === 'yesterday' ? day(-1) : day(1 - Number(value)), to: value === 'yesterday' ? day(-1) : day() });
  }
  function changePeriod(direction: number) {
    const days = Math.round((Date.parse(applied.to) - Date.parse(applied.from)) / 86400000) + 1;
    setPreset('custom'); apply({ ...applied, from: shift(applied.from, days * direction), to: shift(applied.to, days * direction) });
  }
  function openReport(dimension: string) { setShowReport(true); apply({ ...applied, dimension }); }
  const exportReport = async () => {
    setBusy(true); setError('');
    try {
      const rows: Record<string, unknown>[] = []; let offset = 0;
      while (true) { const page = await api<Report>(`report?${new URLSearchParams({ ...applied, offset: String(offset) })}`); rows.push(...page.rows); if (!page.more) break; offset += 100; }
      download(csv(rows, ['value', 'events', 'visitorDays']), `dzaleka-${applied.dimension}-${applied.from}-${applied.to}.csv`);
    } catch (e) { setError(message(e)); } finally { setBusy(false); }
  };
  const views = data ? count(data.counts, 'pageview') : 0;
  const metricRows = data ? [
    { label: 'Page views', value: views, previous: count(data.previous.counts, 'pageview'), help: 'Recorded public page loads.' },
    { label: 'Visitor-days', value: Number(data.totals.visitorDays), previous: Number(data.previous.totals.visitorDays), help: 'Estimated visitors counted once per Malawi day, across all recorded activity. Not unique people across the whole period.' },
    { label: 'Contact & outbound', value: contactActions.reduce((n, key) => n + count(data.counts, key), 0), previous: contactActions.reduce((n, key) => n + count(data.previous.counts, key), 0), help: 'Contact, application, registration, download and external link clicks. Does not confirm external conversions.' },
    { label: 'Short-link clicks', value: count(data.counts, 'link_click'), previous: count(data.previous.counts, 'link_click'), help: 'Eligible requests to branded /go/ links, excluding known bots and previews.' },
    { label: 'Form starts', value: count(data.counts, 'form_start'), previous: count(data.previous.counts, 'form_start'), help: 'First input in a supported form on a page visit.' },
    { label: 'Saved submissions', value: count(data.counts, 'submission'), previous: count(data.previous.counts, 'submission'), help: 'Successful submissions confirmed by the CMS server.' },
  ] : [];
  const groups = tab === 'Acquisition' ? ['referrer', 'source', 'campaign'] as const : tab === 'Audience' ? ['device', 'browser'] as const : tab === 'Content' ? ['path'] as const : ['path', 'referrer', 'device', 'browser', 'source', 'campaign'] as const;
  return <section className={`dos-insights dos-statistics ${compact ? 'dos-compact' : ''}`} aria-busy={loading}>
    <header className="dos-stat-header">
      <div>{!compact && <h1>Statistics</h1>}<div className="dos-site-name">{path || 'services.dzaleka.com'}{data && <span className="dos-live"><i />{number(data.active)} active <span className="dos-live-detail">· last 5 min, site-wide</span></span>}</div></div>
      {!compact && <Button onClick={() => setApplied({ ...applied })} disabled={loading}>{loading ? 'Refreshing…' : 'Refresh'}</Button>}
    </header>
    {error && <Banner variant="error" role="alert" description={error} />}{notice && <Banner variant="secondary" role="status" description={notice} />}
    {settings && !settings.enabled && <Banner variant="secondary" description="Collection is paused. Previously recorded statistics are still available." />}
    {!compact && <div className="dos-report-controls">
      <Tabs tabs={tabs.map(value => ({ value, label: value }))} value={tab} onValueChange={value => { setTab(value as Tab); setShowReport(false); }} className="dos-section-tabs" />
      <div className="dos-date-controls"><Button aria-expanded={showFilters} onClick={() => setShowFilters(!showFilters)}>Filters{applied.path || applied.campaign || applied.link_id || applied.collection ? ' •' : ''}</Button>
        <Select aria-label="Date range" value={preset} onValueChange={value => { if (value) choosePreset(value); }} items={[{ value: '1', label: 'Today' }, { value: 'yesterday', label: 'Yesterday' }, { value: '7', label: 'Last 7 days' }, { value: '30', label: 'Last 30 days' }, { value: '90', label: 'Last 90 days' }, { value: 'custom', label: 'Custom dates' }]} />
        <div className="dos-period-arrows"><Button shape="square" aria-label="Previous period" onClick={() => changePeriod(-1)}>‹</Button><Button shape="square" aria-label="Next period" disabled={applied.to >= day()} onClick={() => changePeriod(1)}>›</Button></div>
      </div>
    </div>}
    {!compact && showFilters && <form className="dos-filter-panel" onSubmit={e => { e.preventDefault(); setPreset('custom'); apply(filters); }}>
      <label>From<Input required type="date" value={filters.from} onChange={e => setFilters({ ...filters, from: e.target.value })} /></label>
      <label>To<Input required type="date" value={filters.to} onChange={e => setFilters({ ...filters, to: e.target.value })} /></label>
      <label>Exact page path<Input placeholder="/services/example" value={filters.path} onChange={e => setFilters({ ...filters, path: e.target.value })} /></label>
      <label>Campaign<Input value={filters.campaign} onChange={e => setFilters({ ...filters, campaign: e.target.value })} /></label>
      <Select label="Content type" value={filters.collection} onValueChange={value => setFilters({ ...filters, collection: value || '' })} items={{ '': 'All content', services: 'Services', events: 'Events', jobs: 'Jobs', news: 'News' }} />
      <Button variant="primary" type="submit">Apply filters / refresh</Button><Button type="button" onClick={() => apply({ ...applied, path: '', campaign: '', collection: '', link_id: '' })}>Clear filters</Button>
    </form>}
    {(applied.path || applied.campaign || applied.link_id || applied.collection) && <div className="dos-filter-chips">{[['Page', applied.path], ['Campaign', applied.campaign], ['Content', applied.collection], ['Short link', applied.link_id ? 'Selected link' : '']].filter(([, value]) => value).map(([label, value]) => <span key={label}>{label}: {value}</span>)}</div>}
    {!data ? <div className="dos-empty" role="status">{error ? 'Statistics could not be loaded. Use Refresh to try again.' : 'Loading statistics…'}</div> : <div className={loading ? 'dos-report-loading' : ''}>
      <div className="dos-period-caption"><span>{dateLabel(data.filters.from)} – {dateLabel(data.filters.to)}, {data.filters.to.slice(0, 4)} <span className="dos-muted">· Malawi time</span></span><span className="dos-muted">Compared with {dateLabel(data.previous.from)} – {dateLabel(data.previous.to)}</span></div>
      <div className="dos-metrics">{metricRows.slice(0, compact ? 3 : 6).map(metric => <Metric key={metric.label} {...metric} compact={compact} />)}</div>
      {compact ? <><h2>Traffic over time</h2><TrafficChart data={data} compare={compare} compact /></> : <LayerCard className="dos-traffic"><LayerCard.Secondary><div className="dos-section-heading"><h2>Traffic over time</h2>{!compact && <Checkbox label="Previous period" checked={compare} onCheckedChange={setCompare} />}</div></LayerCard.Secondary><LayerCard.Primary><TrafficChart data={data} compare={compare} compact={false} /></LayerCard.Primary></LayerCard>}
      {compact ? <a className="dos-full-report" href={`/_emdash/admin/plugins/dos-insights/statistics${path ? `?path=${encodeURIComponent(path)}` : ''}`}>Open full statistics →</a> : <>
        {data.hourly && <details className="dos-daily-values"><summary>Hourly values and CSV export</summary><Button onClick={() => download(csv(data.hourly!, ['day', 'views', 'visitors']), `dzaleka-hourly-${applied.from}.csv`)}>Export hourly values</Button><div className="dos-table"><Table><Table.Header><Table.Row><Table.Head>Hour (Malawi)</Table.Head><Table.Head>Views</Table.Head><Table.Head>Visitor-days</Table.Head></Table.Row></Table.Header><Table.Body>{data.hourly.map(row => <Table.Row key={row.day}><Table.Cell>{row.day}</Table.Cell><Table.Cell>{number(row.views)}</Table.Cell><Table.Cell>{number(row.visitors)}</Table.Cell></Table.Row>)}</Table.Body></Table></div></details>}
        <details className="dos-daily-values"><summary>Daily values and CSV export</summary><Button onClick={() => download(csv(data.daily, ['day', 'views', 'visitors']), `dzaleka-daily-${applied.from}-${applied.to}.csv`)}>Export daily values</Button><div className="dos-table"><Table><Table.Header><Table.Row><Table.Head>Date</Table.Head><Table.Head>Page views</Table.Head><Table.Head>Visitor-days</Table.Head></Table.Row></Table.Header><Table.Body>{data.daily.map(row => <Table.Row key={row.day}><Table.Cell>{row.day}</Table.Cell><Table.Cell>{number(row.views)}</Table.Cell><Table.Cell>{number(row.visitors)}</Table.Cell></Table.Row>)}</Table.Body></Table></div></details>
        {tab === 'Content' && <Tabs className="dos-collection-tabs" tabs={['', 'services', 'events', 'jobs', 'news'].map(value => ({ value, label: value ? value[0].toUpperCase() + value.slice(1) : 'All content' }))} value={applied.collection} onValueChange={value => apply({ ...applied, collection: value })} />}
        {tab !== 'Actions' && <div className="dos-rankings">{groups.map(dimension => <Ranking key={dimension} title={dimensions[dimension]} dimension={dimension} rows={data.top[dimension]} total={views} open={() => openReport(dimension)} filter={dimension === 'path' ? value => apply({ ...applied, path: value }) : dimension === 'campaign' ? value => apply({ ...applied, campaign: value }) : undefined} />)}</div>}
        {tab === 'Actions' && <LayerCard className="dos-ranking dos-action-report"><header><h2>Actions and submissions</h2><span>Events</span></header>{data.counts.filter(row => row.name !== 'pageview').map(row => <div className="dos-rank" key={row.name}><div className="dos-rank-label">{actionNames[row.name] || row.name}</div><strong>{number(row.count)}</strong></div>)}{data.counts.every(row => row.name === 'pageview') && <div className="dos-empty">No actions recorded in this period.</div>}<p className="dos-muted">Saved submissions are confirmed by the server. Clicks do not confirm completed external applications. Form starts and submissions may occur on different days or devices.</p><Button variant="ghost" className="dos-text-button" onClick={() => openReport('name')}>View action report →</Button><Button variant="ghost" className="dos-text-button" onClick={() => openReport('link_id')}>View short-link report →</Button></LayerCard>}
        <section className="dos-detailed-report"><div className="dos-section-heading"><h2>Detailed report</h2><Button aria-expanded={showReport} onClick={() => setShowReport(!showReport)}>{showReport ? 'Hide report' : 'Browse & export'}</Button></div>
          {showReport && <><div className="dos-toolbar"><Select label="Group by" value={applied.dimension} onValueChange={value => { if (value) openReport(value); }} items={dimensions} /><Button disabled={busy || loading} onClick={() => void exportReport()}>{busy ? 'Preparing export…' : 'Export all matching rows'}</Button></div>
          <p className="dos-muted">This detailed report counts all event types. Overview rankings above count page views only.</p>
          <div className="dos-table"><Table><Table.Header><Table.Row><Table.Head>{dimensions[applied.dimension as keyof typeof dimensions]}</Table.Head><Table.Head>Events</Table.Head><Table.Head>Visitor-days</Table.Head></Table.Row></Table.Header><Table.Body>{data.rows.map(row => <Table.Row key={row.value}><Table.Cell>{displayValue(row.value, applied.dimension)}</Table.Cell><Table.Cell>{number(row.events)}</Table.Cell><Table.Cell>{number(row.visitorDays)}</Table.Cell></Table.Row>)}</Table.Body></Table></div>{!data.rows.length && <div className="dos-empty">No matching activity yet.</div>}
          <div className="dos-pagination"><Button disabled={loading || Number(applied.offset) === 0} onClick={() => setApplied({ ...applied, offset: String(Math.max(0, Number(applied.offset) - 100)) })}>Previous</Button><span>Page {Number(applied.offset) / 100 + 1}</span><Button disabled={loading || !data.more} onClick={() => setApplied({ ...applied, offset: String(Number(applied.offset) + 100) })}>Next</Button></div></>}
        </section>
      </>}
    </div>}
    {!compact && <footer className="dos-stat-footer"><p>Visitor-days estimate visitors once per day, not unique people across the whole period. Collection began when this plugin was enabled; earlier or expired data is unavailable.</p><span>{updated ? `Updated ${updated}` : ''}</span></footer>}
    {!compact && settings && <details className="dos-settings"><summary>Collection and retention settings</summary><p>Do Not Track and Global Privacy Control are respected. Raw IP addresses, form values and full referrer URLs are not stored.</p>
      <div className="dos-toolbar"><Checkbox label="Collect statistics" disabled={(user?.role || 0) < 50} checked={!!settings.enabled} onCheckedChange={checked => setSettings({ ...settings, enabled: Number(checked) })} /><Select label="Retain events for" disabled={(user?.role || 0) < 50} value={String(settings.retention)} onValueChange={value => { if (value) setSettings({ ...settings, retention: Number(value) }); }} items={{ '30': '30 days', '90': '90 days', '180': '180 days', '365': '365 days' }} /><Button disabled={busy || (user?.role || 0) < 50} onClick={async () => { setBusy(true); setError(''); try { await api('configure', { ...settings, enabled: !!settings.enabled }); setNotice('Settings saved. Maintenance applies retention within 15 minutes.'); } catch (e) { setError(message(e)); } finally { setBusy(false); } }}>Save settings</Button></div>
      <p>Lowering retention permanently removes older records on the next maintenance run. Link definitions remain available.</p><p>Exclude your own visits using a preference cookie on the public site.</p><form action={`${publicOrigin}/api/analytics/preferences`} method="GET" target="_blank" className="dos-toolbar"><Button type="submit" name="exclude" value="1">Exclude this browser</Button><Button type="submit" name="exclude" value="0">Include this browser again</Button></form>
    </details>}
  </section>;
}

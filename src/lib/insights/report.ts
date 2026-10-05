import { z } from 'zod';
import type { Database } from 'emdash';
import { sql, type Kysely } from 'kysely';
import { canonicalPath } from './contract';
import { insightsDb } from './store';

export const dimensions = ['path', 'name', 'referrer', 'source', 'medium', 'campaign', 'device', 'browser', 'link_id'] as const;
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v => Number.isFinite(Date.parse(`${v}T00:00:00Z`)) && new Date(`${v}T00:00:00Z`).toISOString().slice(0, 10) === v, 'Invalid date');
export const reportSchema = z.object({
  from: date, to: date, dimension: z.enum(dimensions).default('path'), offset: z.coerce.number().int().min(0).max(1000000).default(0),
  collection: z.enum(['', 'services', 'events', 'jobs', 'news']).default(''),
  path: z.string().max(400).default(''), link_id: z.string().max(80).default(''), campaign: z.string().max(80).default(''),
}).refine(v => v.from <= v.to && Date.parse(v.to) - Date.parse(v.from) < 366 * 86400000, 'Choose a date range of up to 366 days.');
export async function report(db: Kysely<Database>, input: unknown) {
  const f = reportSchema.parse(input), database = insightsDb(db);
  if (f.path) f.path = canonicalPath(f.path);
  // Reports use Malawi calendar days, matching public event dates.
  const start = Date.parse(`${f.from}T00:00:00+02:00`), end = Date.parse(`${f.to}T00:00:00+02:00`) + 86400000;
  let filtered = database.selectFrom('_dos_events');
  for (const key of ['path', 'link_id', 'campaign'] as const) if (f[key]) filtered = filtered.where(key, '=', f[key]);
  if (f.collection) filtered = filtered.where('path', 'like', `/${f.collection}/%`);
  const base = filtered.where('at', '>=', new Date(start).toISOString()).where('at', '<', new Date(end).toISOString());
  const previousBase = filtered.where('at', '>=', new Date(start - (end - start)).toISOString()).where('at', '<', new Date(start).toISOString());
  const totals = await base.select(({ fn }) => [fn.countAll<number>().as('events'), fn.count<number>('visitor').distinct().as('visitorDays')]).executeTakeFirstOrThrow();
  const counts = await base.select(['name']).select(({ fn }) => fn.countAll<number>().as('count')).groupBy('name').execute();
  const daily = await base.where('name', '=', 'pageview').select('day').select(({ fn }) => [fn.countAll<number>().as('views'), fn.count<number>('visitor').distinct().as('visitors')]).groupBy('day').orderBy('day').execute();
  const grouped = f.dimension === 'link_id' ? base.where('name', '=', 'link_click') : base;
  const rows = await grouped.select(`${f.dimension} as value`).select(({ fn }) => [fn.countAll<number>().as('events'), fn.count<number>('visitor').distinct().as('visitorDays')])
    .groupBy(f.dimension).orderBy('events', 'desc').orderBy(f.dimension).offset(f.offset).limit(101).execute();
  if (f.dimension === 'link_id' && rows.length) {
    const links = await database.selectFrom('_dos_links').select(['id', 'slug']).where('id', 'in', rows.map(row => row.value)).execute();
    const names = new Map(links.map(link => [link.id, `/go/${link.slug}`]));
    for (const row of rows) row.value = names.get(row.value) || row.value;
  }
  const recent = await database.selectFrom('_dos_events').where('name', '=', 'pageview').where('at', '>=', new Date(Date.now() - 300000).toISOString()).select(({ fn }) => fn.count<number>('visitor').distinct().as('count')).executeTakeFirstOrThrow();
  const dailyMap = new Map(daily.map(row => [row.day, row]));
  const filledDaily = [];
  for (let time = Date.parse(f.from); time <= Date.parse(f.to); time += 86400000) {
    const key = new Date(time).toISOString().slice(0, 10); filledDaily.push(dailyMap.get(key) || { day: key, views: 0, visitors: 0 });
  }
  const previousCounts = await previousBase.select('name').select(({ fn }) => fn.countAll<number>().as('count')).groupBy('name').execute();
  const previousTotals = await previousBase.select(({ fn }) => [fn.countAll<number>().as('events'), fn.count<number>('visitor').distinct().as('visitorDays')]).executeTakeFirstOrThrow();
  const previousDaily = await previousBase.where('name', '=', 'pageview').select('day').select(({ fn }) => [fn.countAll<number>().as('views'), fn.count<number>('visitor').distinct().as('visitors')]).groupBy('day').orderBy('day').execute();
  const previousMap = new Map(previousDaily.map(row => [row.day, row]));
  const previousFrom = new Date(start - (end - start) + 7200000).toISOString().slice(0, 10);
  const previousTo = new Date(start - 86400000 + 7200000).toISOString().slice(0, 10);
  const previousSeries = filledDaily.map((_, i) => {
    const key = new Date(Date.parse(previousFrom) + i * 86400000).toISOString().slice(0, 10);
    return previousMap.get(key) || { day: key, views: 0, visitors: 0 };
  });
  const hourlySeries = async (query: typeof base) => {
    const hour = sql<number>`(cast(substr(at, 12, 2) as integer) + 2) % 24`;
    const rows = await query.where('name', '=', 'pageview').select(hour.as('hour'))
      .select(({ fn }) => [fn.countAll<number>().as('views'), fn.count<number>('visitor').distinct().as('visitors')]).groupBy(hour).execute();
    return Array.from({ length: 24 }, (_, i) => {
      const row = rows.find(row => Number(row.hour) === i);
      return { day: `${String(i).padStart(2, '0')}:00`, views: Number(row?.views || 0), visitors: Number(row?.visitors || 0) };
    });
  };
  const [hourly, previousHourly] = f.from === f.to ? await Promise.all([hourlySeries(base), hourlySeries(previousBase)]) : [null, null];
  // Overview traffic panels count page views, keeping actions out of page popularity.
  const topDimensions = ['path', 'referrer', 'device', 'browser', 'campaign', 'source'] as const;
  const topRows = await Promise.all(topDimensions.map(dimension => base.where('name', '=', 'pageview')
    .select(`${dimension} as value`).select(({ fn }) => fn.countAll<number>().as('views'))
    .groupBy(dimension).orderBy('views', 'desc').orderBy(dimension).limit(8).execute()));
  const top = Object.fromEntries(topDimensions.map((dimension, i) => [dimension, topRows[i]])) as Record<typeof topDimensions[number], typeof topRows[number]>;
  return { top, hourly, previous: { hourly: previousHourly, totals: previousTotals, counts: previousCounts, daily: previousSeries, from: previousFrom, to: previousTo }, totals, counts, daily: filledDaily, rows: rows.slice(0, 100), more: rows.length > 100, active: Number(recent.count), filters: f };
}

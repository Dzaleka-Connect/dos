/**
 * Sourced statistical series for the Dzaleka Encyclopedia.
 *
 * Every encyclopedia entry must cite its sources, so every data point here
 * carries a `sourceId` resolving to a citation, and every series declares its
 * geographic `scope`. That distinction matters: UNHCR reports both Malawi-wide
 * and Dzaleka-specific figures, and the population entry warns explicitly that
 * the two must not be compared without checking date, category, and scope.
 *
 * These series are deliberately sparse. A point exists only where a cited
 * source reports one; nothing is interpolated to make a line look smooth.
 *
 * NOTE: /api/population and /api/charts carry their own hardcoded figures that
 * disagree with each other and with the cited record (see docs/ or the change
 * summary). Those power the /data dashboard and are left untouched here. This
 * module is the citable source for encyclopedia entries.
 */

export type StatScope = 'dzaleka' | 'malawi';

export interface StatSource {
  id: string;
  title: string;
  publisher: string;
  url: string;
  date: string;
}

export interface StatPoint {
  /** Axis label, usually a year or month. */
  label: string;
  value: number;
  /** Citation for this specific point. */
  sourceId: string;
  /** True when the source says "more than" or "over" rather than an exact count. */
  atLeast?: boolean;
  note?: string;
}

export interface StatBand {
  label: string;
  min: number;
  max: number;
  sourceId: string;
}

export interface StatSeries {
  id: string;
  title: string;
  /** One sentence on what the series shows and why it matters. */
  description: string;
  unit: string;
  scope: StatScope;
  chartType: 'line' | 'bar' | 'doughnut';
  points: StatPoint[];
  /** Optional reference band, e.g. the camp's planned capacity. */
  band?: StatBand;
  /** Caveat shown with the chart. Required where scope is easy to misread. */
  caveat?: string;
  sourceIds: string[];
}

export const STAT_SOURCES: Record<string, StatSource> = {
  'unhcr-malawi-overview': {
    id: 'unhcr-malawi-overview',
    title: 'Malawi country overview',
    publisher: 'UNHCR',
    url: 'https://www.unhcr.org/us/where-we-work/countries/malawi',
    date: 'End-December 2024 data',
  },
  'unhcr-factsheet-aug-2024': {
    id: 'unhcr-factsheet-aug-2024',
    title: 'Malawi Fact Sheet, August 2024',
    publisher: 'UNHCR',
    url: 'https://www.unhcr.org/sites/default/files/2024-11/Fact%20Sheet_Malawi_August%202024.pdf',
    date: 'August 2024',
  },
  'un-malawi-2019': {
    id: 'un-malawi-2019',
    title: 'UNHCR registers over 41,000 people in congested Dzaleka Refugee Camp',
    publisher: 'United Nations Malawi',
    url: 'https://malawi.un.org/en/40891-unhcr-registers-over-41000-people-congested-dzaleka-refugee-camp',
    date: '25 November 2019',
  },
  'wfp-ration-cut': {
    id: 'wfp-ration-cut',
    title:
      'Funding crunch forces WFP to halve food rations for refugees amidst worsening hunger in Malawi',
    publisher: 'World Food Programme',
    url: 'https://www.wfp.org/news/funding-crunch-forces-wfp-halve-food-rations-refugees-amidst-worsening-hunger-malawi',
    date: '2023',
  },
};

const SERIES: StatSeries[] = [
  {
    id: 'population-vs-capacity',
    title: 'Camp population against planned capacity',
    description:
      'Dzaleka was planned for 10,000 to 12,000 people. Reported population has been several times that figure for years, which is the underlying cause of the housing, water, and sanitation pressures described across these entries.',
    unit: 'people',
    scope: 'dzaleka',
    chartType: 'line',
    band: {
      label: 'Planned capacity (10,000-12,000)',
      min: 10000,
      max: 12000,
      sourceId: 'unhcr-malawi-overview',
    },
    points: [
      {
        label: '1994',
        value: 11000,
        sourceId: 'unhcr-malawi-overview',
        note: 'Site opened; planned for roughly 10,000 to 12,000 people. Plotted at the midpoint of that range.',
      },
      {
        label: '2019',
        value: 41000,
        sourceId: 'un-malawi-2019',
        atLeast: true,
        note: 'UNHCR registered over 41,000 people in Dzaleka.',
      },
      {
        label: '2024',
        value: 52000,
        sourceId: 'unhcr-malawi-overview',
        atLeast: true,
        note: 'More than 52,000 residents reported at the end of December 2024.',
      },
    ],
    caveat:
      'Points are plotted only where a cited source reports a figure, so the line is sparse and the segments between points are not measurements. The 1994 value is the midpoint of the planned capacity range, not a recorded population.',
    sourceIds: ['unhcr-malawi-overview', 'un-malawi-2019'],
  },
  {
    id: 'nationalities-2024',
    title: 'Registered population by country of origin',
    description:
      'Country-of-origin breakdown from the August 2024 UNHCR fact sheet. The majority of this population lives in Dzaleka.',
    unit: 'people',
    scope: 'malawi',
    chartType: 'doughnut',
    points: [
      { label: 'DR Congo', value: 35952, sourceId: 'unhcr-factsheet-aug-2024' },
      { label: 'Burundi', value: 12113, sourceId: 'unhcr-factsheet-aug-2024' },
      { label: 'Rwanda', value: 6960, sourceId: 'unhcr-factsheet-aug-2024' },
      {
        label: 'Other',
        value: 400,
        sourceId: 'unhcr-factsheet-aug-2024',
        note: 'Smaller groups including Somalia and Ethiopia, derived from the reported total of 55,425.',
      },
    ],
    caveat:
      'This is a Malawi-wide count of registered refugees and asylum-seekers (55,425 in August 2024), not a Dzaleka-only count. Do not compare it directly with the camp population figures without checking date and scope.',
    sourceIds: ['unhcr-factsheet-aug-2024'],
  },
  {
    id: 'food-ration-level',
    title: 'General food assistance as a share of the planned ration',
    description:
      'Funding shortfalls cut the general food assistance ration; it was partially restored in August 2024.',
    unit: '% of planned ration',
    scope: 'dzaleka',
    chartType: 'bar',
    points: [
      {
        label: 'Before the cut',
        value: 100,
        sourceId: 'wfp-ration-cut',
        note: 'The planned general assistance level.',
      },
      {
        label: '2023 funding crunch',
        value: 50,
        sourceId: 'wfp-ration-cut',
        note: 'WFP halved rations amid a funding shortfall.',
      },
      {
        label: 'August 2024',
        value: 75,
        sourceId: 'unhcr-factsheet-aug-2024',
        note: 'Ration raised from 50% to 75% of the planned level.',
      },
    ],
    caveat:
      'Assistance levels change with funding and assessed need. These are dated reference points, not a current distribution amount. Confirm current levels with WFP or UNHCR.',
    sourceIds: ['wfp-ration-cut', 'unhcr-factsheet-aug-2024'],
  },
];

const seriesById = new Map(SERIES.map((s) => [s.id, s]));

export const statSeries = SERIES;
export const statSeriesIds = SERIES.map((s) => s.id);

/** Look up one series by id. Returns undefined for an unknown id. */
export function getStatSeries(id: string): StatSeries | undefined {
  return seriesById.get(id);
}

/** Resolve a list of series ids, silently skipping ids that do not exist. */
export function resolveStatSeries(ids: readonly string[] | undefined): StatSeries[] {
  if (!ids?.length) return [];
  return ids.map((id) => seriesById.get(id)).filter((s): s is StatSeries => Boolean(s));
}

/** The citations a series depends on, in declaration order. */
export function sourcesForSeries(series: StatSeries): StatSource[] {
  return series.sourceIds
    .map((id) => STAT_SOURCES[id])
    .filter((s): s is StatSource => Boolean(s));
}

/** Human-readable scope label used in chart captions. */
export function scopeLabel(scope: StatScope): string {
  return scope === 'dzaleka' ? 'Dzaleka Refugee Camp' : 'Malawi (nationwide)';
}

/** Format a value for the data table, marking "at least" figures. */
export function formatPoint(point: StatPoint, unit: string): string {
  const n = point.value.toLocaleString('en-GB');
  const prefix = point.atLeast ? 'More than ' : '';
  return unit.startsWith('%') ? `${prefix}${point.value}%` : `${prefix}${n}`;
}

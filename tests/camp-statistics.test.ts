import { describe, it, expect } from 'vitest';
import {
  STAT_SOURCES,
  formatPoint,
  getStatSeries,
  resolveStatSeries,
  scopeLabel,
  sourcesForSeries,
  statSeries,
  statSeriesIds,
} from '../src/data/campStatistics';

describe('statistical series integrity', () => {
  it('publishes at least one series', () => {
    expect(statSeries.length).toBeGreaterThan(0);
  });

  it('gives every series a unique id', () => {
    expect(new Set(statSeriesIds).size).toBe(statSeriesIds.length);
  });

  /**
   * The encyclopedia requires a citation for every claim. A data point with no
   * resolvable source would put an uncited figure into a cited entry.
   */
  it('cites a real source for every single data point', () => {
    for (const series of statSeries) {
      expect(series.points.length, series.id).toBeGreaterThan(0);
      for (const point of series.points) {
        expect(
          STAT_SOURCES[point.sourceId],
          `${series.id} / ${point.label} cites unknown source "${point.sourceId}"`
        ).toBeDefined();
      }
    }
  });

  it('resolves every series-level source id', () => {
    for (const series of statSeries) {
      expect(series.sourceIds.length, series.id).toBeGreaterThan(0);
      expect(sourcesForSeries(series).length).toBe(series.sourceIds.length);
    }
  });

  it('gives every source a title, publisher, date and absolute URL', () => {
    for (const [id, source] of Object.entries(STAT_SOURCES)) {
      expect(source.id, id).toBe(id);
      expect(source.title.length, id).toBeGreaterThan(0);
      expect(source.publisher.length, id).toBeGreaterThan(0);
      expect(source.date.length, id).toBeGreaterThan(0);
      expect(source.url, id).toMatch(/^https:\/\//);
    }
  });

  it('declares an explicit geographic scope on every series', () => {
    for (const series of statSeries) {
      expect(['dzaleka', 'malawi'], series.id).toContain(series.scope);
    }
  });

  /**
   * UNHCR publishes both Malawi-wide and Dzaleka-only figures and the
   * population entry warns they must not be compared. A Malawi-scoped series
   * must say so, or a reader will take it for a camp figure.
   */
  it('carries a caveat on every Malawi-wide series', () => {
    for (const series of statSeries.filter((s) => s.scope === 'malawi')) {
      expect(series.caveat, series.id).toBeTruthy();
      expect(series.caveat!.toLowerCase(), series.id).toContain('malawi');
    }
  });

  it('uses only chart types the renderer implements', () => {
    for (const series of statSeries) {
      expect(['line', 'bar', 'doughnut'], series.id).toContain(series.chartType);
    }
  });

  it('states a unit for every series', () => {
    for (const series of statSeries) {
      expect(series.unit.length, series.id).toBeGreaterThan(0);
    }
  });
});

describe('the overcrowding series', () => {
  const series = getStatSeries('population-vs-capacity')!;

  it('exists and is scoped to the camp', () => {
    expect(series).toBeDefined();
    expect(series.scope).toBe('dzaleka');
  });

  it('carries the planned capacity band that makes overcrowding legible', () => {
    expect(series.band).toBeDefined();
    expect(series.band!.min).toBe(10000);
    expect(series.band!.max).toBe(12000);
  });

  it('shows a population far above planned capacity', () => {
    const latest = series.points[series.points.length - 1];
    expect(latest.value).toBeGreaterThan(series.band!.max * 4);
  });

  it('marks figures the source reports as "more than" rather than exact', () => {
    const approximate = series.points.filter((p) => p.atLeast);
    expect(approximate.length).toBeGreaterThan(0);
  });

  it('warns that the line is sparse rather than measured continuously', () => {
    expect(series.caveat).toBeTruthy();
    expect(series.caveat!.toLowerCase()).toContain('sparse');
  });
});

describe('resolveStatSeries', () => {
  it('resolves known ids in order', () => {
    const resolved = resolveStatSeries(['food-ration-level', 'population-vs-capacity']);
    expect(resolved.map((s) => s.id)).toEqual(['food-ration-level', 'population-vs-capacity']);
  });

  it('skips unknown ids instead of throwing, so a typo cannot break a page', () => {
    expect(resolveStatSeries(['nope', 'population-vs-capacity']).map((s) => s.id)).toEqual([
      'population-vs-capacity',
    ]);
  });

  it('returns an empty list for undefined or empty input', () => {
    expect(resolveStatSeries(undefined)).toEqual([]);
    expect(resolveStatSeries([])).toEqual([]);
  });
});

describe('presentation helpers', () => {
  it('labels scope in plain language', () => {
    expect(scopeLabel('dzaleka')).toContain('Dzaleka');
    expect(scopeLabel('malawi')).toContain('Malawi');
  });

  it('formats counts with thousands separators', () => {
    expect(formatPoint({ label: '2024', value: 52000, sourceId: 'x' }, 'people')).toBe('52,000');
  });

  it('marks "at least" figures so an estimate is not read as exact', () => {
    expect(
      formatPoint({ label: '2024', value: 52000, sourceId: 'x', atLeast: true }, 'people')
    ).toBe('More than 52,000');
  });

  it('formats percentages without a separator', () => {
    expect(formatPoint({ label: '2024', value: 75, sourceId: 'x' }, '% of planned ration')).toBe(
      '75%'
    );
  });
});

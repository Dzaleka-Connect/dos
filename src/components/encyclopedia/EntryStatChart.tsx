import { Line, Bar, Doughnut } from 'react-chartjs-2';
import '../data/chartConfig';
import type { StatSeries } from '../../data/campStatistics';

/**
 * Chart.js rendering of one sourced statistical series.
 *
 * This is a progressive enhancement only: EntryDataPanel.astro already renders
 * the same figures as a server-rendered table, so the data is present with
 * JavaScript disabled and for crawlers. Nothing here is the sole source of any
 * number on the page.
 */

const PALETTE = ['#2563eb', '#16a34a', '#9333ea', '#f59e0b', '#dc2626', '#64748b'];
const GRID = 'rgba(148, 163, 184, 0.25)';
const TICK = '#475569';

function baseOptions(series: StatSeries) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: series.chartType === 'doughnut', position: 'bottom' as const },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const point = series.points[ctx.dataIndex];
            const raw = ctx.parsed?.y ?? ctx.parsed;
            const value = series.unit.startsWith('%')
              ? `${raw}%`
              : Number(raw).toLocaleString('en-GB');
            const prefix = point?.atLeast ? 'More than ' : '';
            return `${prefix}${value}${series.unit.startsWith('%') ? '' : ` ${series.unit}`}`;
          },
          afterLabel: (ctx: any) => series.points[ctx.dataIndex]?.note ?? '',
        },
      },
    },
  };
}

function cartesianScales(series: StatSeries) {
  return {
    y: {
      beginAtZero: true,
      grid: { color: GRID },
      ticks: {
        color: TICK,
        callback: (v: any) =>
          series.unit.startsWith('%') ? `${v}%` : Number(v).toLocaleString('en-GB'),
      },
    },
    x: { grid: { display: false }, ticks: { color: TICK } },
  };
}

export function EntryStatChart({ series }: { series: StatSeries }) {
  const labels = series.points.map((p) => p.label);
  const values = series.points.map((p) => p.value);

  if (series.chartType === 'doughnut') {
    return (
      <div style={{ height: 280 }}>
        <Doughnut
          data={{
            labels,
            datasets: [
              {
                data: values,
                backgroundColor: PALETTE,
                borderColor: '#ffffff',
                borderWidth: 2,
              },
            ],
          }}
          options={baseOptions(series) as any}
        />
      </div>
    );
  }

  if (series.chartType === 'bar') {
    return (
      <div style={{ height: 280 }}>
        <Bar
          data={{
            labels,
            datasets: [
              { label: series.title, data: values, backgroundColor: PALETTE[0], borderRadius: 4 },
            ],
          }}
          options={{ ...baseOptions(series), scales: cartesianScales(series) } as any}
        />
      </div>
    );
  }

  // Line, optionally with the planned-capacity band drawn as a flat reference.
  const datasets: any[] = [
    {
      label: series.title,
      data: values,
      borderColor: PALETTE[0],
      backgroundColor: 'rgba(37, 99, 235, 0.12)',
      fill: true,
      tension: 0.25,
      pointRadius: 5,
      pointBackgroundColor: PALETTE[0],
    },
  ];

  if (series.band) {
    datasets.push({
      label: series.band.label,
      data: labels.map(() => series.band!.max),
      borderColor: PALETTE[4],
      borderDash: [6, 4],
      borderWidth: 2,
      pointRadius: 0,
      fill: false,
      tension: 0,
    });
  }

  return (
    <div style={{ height: 280 }}>
      <Line
        data={{ labels, datasets }}
        options={
          {
            ...baseOptions(series),
            plugins: {
              ...baseOptions(series).plugins,
              legend: { display: Boolean(series.band), position: 'bottom' as const },
            },
            scales: cartesianScales(series),
          } as any
        }
      />
    </div>
  );
}

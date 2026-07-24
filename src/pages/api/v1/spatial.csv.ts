import type { APIRoute } from 'astro';
import { KEEPING_PLACE_DATASET } from '../../../data/keepingPlaceDataset';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const categoryParam = url.searchParams.get('category');
  const zoneParam = url.searchParams.get('zone');

  let filtered = [...KEEPING_PLACE_DATASET];

  if (categoryParam && categoryParam !== 'all') {
    filtered = filtered.filter((r) => r.category.toLowerCase() === categoryParam.toLowerCase());
  }

  if (zoneParam && zoneParam !== 'all') {
    filtered = filtered.filter((r) => r.zone.toLowerCase().includes(zoneParam.toLowerCase()));
  }

  const escapeCSV = (str: string | undefined | null) => {
    if (!str) return '""';
    const cleanStr = String(str).replace(/"/g, '""');
    return `"${cleanStr}"`;
  };

  const headers = [
    "id",
    "referenceId",
    "name",
    "category",
    "categoryLabel",
    "protocol",
    "latitude",
    "longitude",
    "zone",
    "custodian",
    "surveyDate",
    "capacityOrStats",
    "summary"
  ];

  const rows = filtered.map((r) => [
    escapeCSV(r.id),
    escapeCSV(r.referenceId),
    escapeCSV(r.name),
    escapeCSV(r.category),
    escapeCSV(r.categoryLabel),
    escapeCSV(r.protocol),
    r.lat,
    r.lng,
    escapeCSV(r.zone),
    escapeCSV(r.custodian),
    escapeCSV(r.surveyDate),
    escapeCSV(r.capacityOrStats),
    escapeCSV(r.summary)
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');

  return new Response(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="dzaleka-spatial-records.csv"',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};

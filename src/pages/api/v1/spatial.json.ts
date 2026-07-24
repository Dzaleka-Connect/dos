import type { APIRoute } from 'astro';
import { KEEPING_PLACE_DATASET } from '../../../data/keepingPlaceDataset';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const categoryParam = url.searchParams.get('category');
  const zoneParam = url.searchParams.get('zone');
  const protocolParam = url.searchParams.get('protocol');
  const formatParam = url.searchParams.get('format');

  let filtered = [...KEEPING_PLACE_DATASET];

  if (categoryParam && categoryParam !== 'all') {
    filtered = filtered.filter((r) => r.category.toLowerCase() === categoryParam.toLowerCase());
  }

  if (zoneParam && zoneParam !== 'all') {
    filtered = filtered.filter((r) => r.zone.toLowerCase().includes(zoneParam.toLowerCase()));
  }

  if (protocolParam && protocolParam !== 'all') {
    filtered = filtered.filter((r) => r.protocol.toLowerCase() === protocolParam.toLowerCase());
  }

  if (formatParam === 'json') {
    return new Response(JSON.stringify({
      count: filtered.length,
      license: "Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)",
      attribution: "Dzaleka Online Services & OpenStreetMap Community",
      records: filtered
    }, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }

  // RFC 7946 GeoJSON FeatureCollection Format
  const geojson = {
    type: "FeatureCollection",
    license: "Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)",
    attribution: "Dzaleka Online Services & OpenStreetMap Community",
    totalFeatures: filtered.length,
    features: filtered.map((rec) => ({
      type: "Feature",
      id: rec.id,
      geometry: {
        type: "Point",
        coordinates: [rec.lng, rec.lat]
      },
      properties: {
        id: rec.id,
        referenceId: rec.referenceId || null,
        name: rec.name,
        category: rec.category,
        categoryLabel: rec.categoryLabel,
        protocol: rec.protocol,
        zone: rec.zone,
        custodian: rec.custodian,
        surveyDate: rec.surveyDate,
        capacityOrStats: rec.capacityOrStats || null,
        summary: rec.summary,
        detailedDescription: rec.detailedDescription,
        siteRegisterSlug: rec.siteRegisterSlug || null,
        encyclopediaSlug: rec.encyclopediaSlug || null,
        tags: rec.tags
      }
    }))
  };

  return new Response(JSON.stringify(geojson, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/geo+json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};

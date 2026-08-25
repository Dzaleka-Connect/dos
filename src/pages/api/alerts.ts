import type { APIRoute } from 'astro';
import { apiHeaders } from '../../utils/api-utils';

// Server-rendered: prerendering emits an extension-less static file, which is
// served as application/octet-stream and carries none of the API headers.
export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const alerts = [
    {
      id: 1,
      type: "critical",
      title: "Food Aid Reduced to 60% Rations",
      message: "WFP has cut food and cash-based assistance due to severe funding gaps. Over 60,000 residents are affected. WFP warns $11M in additional funding is needed to avoid further reductions or suspension of food aid.",
      date: "2026-01-15T00:00:00Z"
    },
    {
      id: 2,
      type: "severe",
      title: "UNHCR Budget Cut by 90%",
      message: "UNHCR Malawi faces a 90% budget reduction, forcing the scaling down of essential services. Multiple NGO partners have departed and the UNHCR field office at the camp was temporarily closed in late 2025.",
      date: "2025-12-01T00:00:00Z"
    },
    {
      id: 3,
      type: "critical",
      title: "Cholera Outbreak — Malawi",
      message: "Malawi declared a cholera outbreak on 30 December 2025 at onset of the rainy season. Dzaleka faces high transmission risk due to overcrowding, poor sanitation, and limited clean water access.",
      date: "2025-12-30T00:00:00Z"
    },
    {
      id: 4,
      type: "warning",
      title: "Flood & Infrastructure Risk",
      message: "Seasonal rainfall and poor drainage threaten makeshift housing and increase waterborne disease risk across the camp. Extension sites at Katubza, Woodlot, and Dzaleka Hills are particularly vulnerable.",
      date: "2026-01-10T00:00:00Z"
    }
  ];

  return new Response(JSON.stringify(alerts), {
    status: 200,
    headers: apiHeaders(request)
  });
}

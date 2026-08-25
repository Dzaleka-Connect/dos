import type { APIRoute } from 'astro';
import { apiHeaders } from '../../utils/api-utils';

// Server-rendered: prerendering emits an extension-less static file, which is
// served as application/octet-stream and carries none of the API headers.
export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const chartData = {
    population: {
      historical: {
        labels: ['1994', '2000', '2010', '2020', '2024'],
        values: [12000, 25000, 35000, 50000, 60000],
        title: 'Camp Population Growth'
      },
      demographics: {
        labels: ['Democratic Republic of Congo', 'Burundi', 'Rwanda', 'Somalia', 'Ethiopia', 'Other Nationalities'],
        values: [64.9, 21.9, 12.6, 0.3, 0.3, 0.1],
        title: 'Population by Nationality (%)'
      },
      incidents: {
        labels: ['Nov 2022', 'Dec 2022', 'May 2023', 'Jul 2024', 'Oct 2024'],
        events: [
          'Aid distribution unrest',
          'Grenade attack incident',
          'Forced urban relocation',
          'MDF security raid',
          'Second security raid'
        ],
        title: 'Major Incidents Timeline'
      },
      challenges: {
        labels: ['Overcrowding', 'Limited Resources', 'Movement Restrictions', 'Security Issues', 'Healthcare Access'],
        values: [95, 85, 80, 75, 70],
        title: 'Camp Challenges Impact Score'
      },
      services: {
        labels: ['Education', 'Healthcare', 'Water', 'Food', 'Shelter'],
        capacity: [45, 35, 60, 75, 50],
        title: 'Service Capacity vs Demand (%)'
      }
    }
  };

  return new Response(JSON.stringify(chartData), {
    status: 200,
    headers: apiHeaders(request)
  });
}

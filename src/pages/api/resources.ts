import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const resources = [
    {
      id: 1,
      type: 'health',
      name: 'Healthcare Services',
      status: 'Limited',
      lastUpdated: new Date().toISOString(),
      details: 'One clinic operated by Ministry of Health serving over 70,000 people. Limited medical staff and resources. Some refugee-owned private pharmacies available.'
    },
    {
      id: 2,
      type: 'education',
      name: 'Education Facilities',
      status: 'Limited',
      lastUpdated: new Date().toISOString(),
      details: 'Overcrowded and under-resourced schools. Shortage of secondary education opportunities. Limited higher education access with some scholarships available.'
    },
    {
      id: 3,
      type: 'food',
      name: 'Food Distribution',
      status: 'Active',
      lastUpdated: new Date().toISOString(),
      details: 'Monthly food distribution ongoing. Local agriculture partnerships with Malawian landowners in Dowa District for tomato, soya, and groundnut farming.'
    },
    {
      id: 4,
      type: 'water',
      name: 'Water Supply',
      status: 'Limited',
      lastUpdated: new Date().toISOString(),
      details: 'Water conservation measures in place. Additional water points being installed to meet growing demand.'
    },
    {
      id: 5,
      type: 'economic',
      name: 'Economic Activities',
      status: 'Active',
      lastUpdated: new Date().toISOString(),
      details: 'Refugee-led shops and businesses contributing to local economy. Creating jobs for thousands of Malawians. Skills transfer in teaching and commerce.'
    }
  ];

  return new Response(JSON.stringify(resources), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

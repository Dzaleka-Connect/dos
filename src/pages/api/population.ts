import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const populationData = {
    total: 55425,
    newArrivals: 304,
    demographics: {
      women: 45,
      children: 48,
      men: 7
    },
    nationalities: {
      DRC: 64.9,
      Burundi: 21.9,
      Rwanda: 12.6,
      Somalia: 0.3,
      Ethiopia: 0.3,
      Other: 0.1
    },
    trends: {
      labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
      values: [40000, 45000, 48000, 50000, 52258, 55425]
    }
  };

  return new Response(JSON.stringify(populationData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const populationData = {
    total: 53000,
    newArrivals: 300,
    demographics: {
      women: 45,
      children: 48,
      men: 7
    },
    nationalities: {
      DRC: 62,
      Burundi: 19,
      Rwanda: 7,
      Other: 12
    },
    trends: {
      labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
      values: [40000, 45000, 48000, 50000, 52258, 53000]
    }
  };

  return new Response(JSON.stringify(populationData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

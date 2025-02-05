import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const alerts = [
    {
      id: 1,
      type: "warning",
      title: "Healthcare Access",
      message: "Limited medical staff and resources at camp clinic. Seeking additional healthcare support.",
      date: new Date().toISOString()
    },
    {
      id: 2,
      type: "critical",
      title: "Education Resources",
      message: "Schools experiencing overcrowding. Urgent need for additional educational resources and facilities.",
      date: new Date().toISOString()
    },
    {
      id: 3,
      type: "info",
      title: "Economic Initiatives",
      message: "New partnerships forming between refugees and local landowners for agricultural projects. Contact office for details.",
      date: new Date().toISOString()
    },
    {
      id: 4,
      type: "warning",
      title: "Water Conservation",
      message: "Water conservation measures in effect. New water points being installed to address growing demand.",
      date: new Date().toISOString()
    }
  ];

  return new Response(JSON.stringify(alerts), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

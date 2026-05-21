import type { APIRoute } from 'astro';

const document = {
  applinks: {
    apps: [],
    details: [
      {
        appIDs: ["CUV78PLLP3.com.dzaleka.online"],
        components: [
          {
            "/": "/open/article",
            comment: "Opens article links natively through the Dzaleka Online bridge."
          }
        ]
      }
    ]
  }
};

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(document, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });

export const HEAD: APIRoute = async () =>
  new Response(null, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });

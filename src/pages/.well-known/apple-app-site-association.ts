import type { APIRoute } from 'astro';

const document = {
  applinks: {
    apps: [],
    details: [
      {
        appIDs: ["CUV78PLLP3.com.dzaleka.online"],
        components: [
          {
            "/": "/open/article*",
            comment: "Opens article links natively through the Dzaleka Online bridge."
          },
          {
            "/": "/open/events*",
            comment: "Opens community event links natively in Dzaleka Online."
          },
          {
            "/": "/open/jobs*",
            comment: "Opens job links natively in Dzaleka Online."
          },
          {
            "/": "/open/services*",
            comment: "Opens service links natively in Dzaleka Online."
          },
          {
            "/": "/open/watch*",
            comment: "Opens Watch links natively in Dzaleka Online."
          },
          {
            "/": "/open/latest*",
            comment: "Opens the latest news feed natively in Dzaleka Online."
          }
        ],
        paths: [
          "/open/article*",
          "/open/events*",
          "/open/jobs*",
          "/open/services*",
          "/open/watch*",
          "/open/latest*"
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

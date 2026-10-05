import type { APIRoute } from 'astro';
import { getSiteSettings } from 'emdash';
import { onRequest as emdashRedirect } from 'emdash/internal/middleware/redirect';
import { seoImageUrl } from './public-contract.mjs';

export const GET: APIRoute = async (context) => {
  const settings = await getSiteSettings();
  const path = context.url.searchParams.get('path');
  let redirect;
  if (path && path.startsWith('/') && !path.startsWith('//') && !/[\\\r\n]/.test(path) && path.length <= 2048) {
    const url = new URL(path, 'https://services.dzaleka.com');
    if (!url.pathname.startsWith('/_') && !url.pathname.startsWith('/api/')) {
      const redirectContext = new Proxy(context, { get: (target, key, receiver) => key === 'url' ? url : Reflect.get(target, key, receiver) });
      const result = await emdashRedirect(redirectContext, async () => new Response(null, { status: 204 }));
      if (result instanceof Response && [301, 302, 303, 307, 308, 410, 451].includes(result.status)) {
        redirect = { status: result.status, location: result.headers.get('location') };
      }
    }
  }
  return Response.json({ version: 1, redirect, settings: {
    title: settings.title,
    titleSeparator: settings.seo?.titleSeparator,
    defaultOgImage: seoImageUrl(settings.seo?.defaultOgImage?.url),
    googleVerification: settings.seo?.googleVerification,
    bingVerification: settings.seo?.bingVerification,
    robotsTxt: settings.seo?.robotsTxt,
  } });
};

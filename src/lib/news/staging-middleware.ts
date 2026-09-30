import { isPublicRead } from './public-contract.mjs';
import { defineMiddleware } from 'astro:middleware';
import { runScheduledTasks } from 'emdash/middleware';
import { authorizeStaging, maintenancePath, stagingResponse } from './staging-access.mjs';

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.isPrerendered) return next();
  if (isPublicRead(context.request)) {
    try {
      const response = stagingResponse(await next());
      if (context.url.pathname.startsWith('/_dos/public/media/')) response.headers.delete('X-Robots-Tag');
      return response;
    }
    catch {
      console.error('[DOS CMS] Published content request failed.');
      return stagingResponse(new Response('Published content unavailable', { status: 503 }));
    }
  }
  const denied = authorizeStaging(context.request);
  if (denied) return stagingResponse(denied);
  if (context.url.pathname.replace(/\/$/, '') === maintenancePath) {
    try {
      const result = await runScheduledTasks();
      return stagingResponse(Response.json({ published: result.published.length }));
    } catch {
      console.error('[DOS staging] EmDash maintenance failed; inspect the CMS scheduler logs.');
      return stagingResponse(Response.json({ error: 'Maintenance failed' }, { status: 500 }));
    }
  }
  return stagingResponse(await next());
});

import { isPublicRead } from './public-contract.mjs';
import { defineMiddleware } from 'astro:middleware';
import { getDb } from 'emdash/runtime';
import { deliverSubmissions } from '../submissions/store';
import { withDeferredTasks } from './netlify-deferred.mjs';
import { runScheduledTasks } from 'emdash/middleware';
import { authorizeStaging, maintenancePath, needsEditorSession, signInResponse, stagingResponse } from './staging-access.mjs';

export const onRequest = defineMiddleware((context, next) => withDeferredTasks(async () => {
  if (context.isPrerendered) return next();
  const path = context.url.pathname.replace(/\/$/, '');
  if (!path) return stagingResponse(context.redirect('/_emdash/admin/', 302));
  if (isPublicRead(context.request)) {
    try {
      const response = await next();
      return stagingResponse(response, path.startsWith('/_dos/public/media/') && response.status === 200);
    }
    catch {
      console.error('[DOS CMS] Published content request failed.');
      return stagingResponse(new Response('Published content unavailable', { status: 503 }));
    }
  }
  if (path === maintenancePath || path.startsWith('/_emdash/api/setup') || path.startsWith('/_emdash/admin/setup')) {
    const denied = authorizeStaging(context.request);
    if (denied) return stagingResponse(denied);
  }
  if (path === maintenancePath) {
    try {
      const result = await runScheduledTasks();
      await deliverSubmissions(await getDb());
      return stagingResponse(Response.json({ published: result.published.length }));
    } catch {
      console.error('[DOS staging] EmDash maintenance failed; inspect the CMS scheduler logs.');
      return stagingResponse(Response.json({ error: 'Maintenance failed' }, { status: 500 }));
    }
  }
  // Reject anonymous readers before opening the database; a cookie alone never
  // grants access — the post middleware verifies it against the session store.
  if (needsEditorSession(context.url.pathname) && !context.cookies.has('astro-session') && authorizeStaging(context.request)) {
    return stagingResponse(signInResponse(context.request));
  }
  return stagingResponse(await next());
}));

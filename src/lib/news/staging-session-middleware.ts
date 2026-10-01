import { defineMiddleware } from 'astro:middleware';
import { createKyselyAdapter } from '@emdash-cms/auth/adapters/kysely';
import { isPublicRead } from './public-contract.mjs';
import { authorizeStaging, hasEditorSession, needsEditorSession, signInResponse } from './staging-access.mjs';

// EmDash's raw media endpoint is public by default. Only editors may use it here;
// the separate published-media endpoint checks live article references.
export const onRequest = defineMiddleware(async (context, next) => {
  if (context.isPrerendered || isPublicRead(context.request) ||
      !needsEditorSession(context.url.pathname) || !authorizeStaging(context.request)) return next();
  const db = context.locals.emdash?.db;
  if (!db || !await hasEditorSession(context.session, id => createKyselyAdapter(db).getUserById(id))) {
    return signInResponse(context.request);
  }
  return next();
});

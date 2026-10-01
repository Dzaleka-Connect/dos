import { createHash, timingSafeEqual } from 'node:crypto';

export const maintenancePath = '/_emdash/api/dos-maintenance';

function matches(actual, expected) {
  if (!expected || expected.length < 32) return false;
  const hash = (value) => createHash('sha256').update(value).digest();
  return timingSafeEqual(hash(actual), hash(expected));
}

export function authorizeStaging(request, env = process.env) {
  const path = new URL(request.url).pathname.replace(/\/$/, '');
  const authorization = request.headers.get('authorization') || '';
  if (path === maintenancePath) {
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
    return matches(authorization.replace(/^Bearer /, ''), env.EMDASH_CRON_SECRET) && authorization.startsWith('Bearer ')
      ? null : new Response('Unauthorized', { status: 401 });
  }
  if (!env.DOS_STAGING_PASSWORD || env.DOS_STAGING_PASSWORD.length < 32) {
    return new Response('Staging access is not configured', { status: 503 });
  }
  const decoded = authorization.startsWith('Basic ') ? Buffer.from(authorization.slice(6), 'base64').toString('utf8') : '';
  const split = decoded.indexOf(':');
  if (decoded.slice(0, split) === 'staging' && matches(decoded.slice(split + 1), env.DOS_STAGING_PASSWORD)) return null;
  return new Response('Sign in to the CMS to continue.', { status: 401 });
}

export function needsEditorSession(path) {
  return !path.startsWith('/_emdash/') || path.startsWith('/_emdash/api/media/file/');
}

export function signInResponse(request) {
  const url = new URL(request.url);
  if (!['GET', 'HEAD'].includes(request.method) || url.pathname.startsWith('/api/') ||
      url.pathname.startsWith('/_emdash/api/') || /\.(json|xml)$/.test(url.pathname)) {
    return new Response('Sign in to the CMS to continue.', { status: 401 });
  }
  return new Response(null, { status: 302, headers: {
    Location: '/_emdash/admin/login?redirect=' + encodeURIComponent(url.pathname + url.search),
  } });
}

export async function hasEditorSession(session, getUser, timeoutMs = 3000) {
  let timer;
  try {
    const verified = (async () => {
      const saved = await session?.get('user');
      if (!saved?.id) return false;
      const user = await getUser(saved.id);
      return Boolean(user && !user.disabled && user.role >= 20);
    })().catch(() => false);
    return await Promise.race([verified, new Promise(resolve => {
      timer = setTimeout(resolve, timeoutMs, false);
    })]);
  } finally { clearTimeout(timer); }
}

export function stagingResponse(response) {
  const headers = new Headers(response.headers);
  headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  headers.set('Cache-Control', 'private, no-store');
  headers.set('Netlify-CDN-Cache-Control', 'no-store');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

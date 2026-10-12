import { protectedSubmission } from '../../lib/submissions/api-guard';
import type { APIRoute } from 'astro';
import { relayForms } from '../../lib/submissions/targets';
import { guardFailure } from '../../lib/submissions/guard';
export const prerender = false;
const receive: APIRoute = async ({ request, url }) => {
  const form = url.searchParams.get('form') || '';
  if (!Object.hasOwn(relayForms, form)) return guardFailure('Unknown form.', 400);
  try {
    const json = request.headers.get('content-type')?.includes('application/json');
    const data = json ? await request.json() : await request.formData();
    const next = json ? data._next : data.get('_next');
    const clean = (key: string) => !key.startsWith('_') && !['cf-turnstile-response', 'g-recaptcha-response'].includes(key);
    let body: FormData | string;
    if (json) body = JSON.stringify({ ...Object.fromEntries(Object.entries(data).filter(([key]) => clean(key))), 'form-name': form });
    else {
      body = new FormData();
      for (const [key, value] of data.entries()) if (clean(key)) body.append(key, value);
      body.set('form-name', form);
    }
    const destination = relayForms[form] === 'formcarry' ? 'https://formcarry.com/s/w40iBX_iU0b' : 'https://formspree.io/f/xqaaajae';
    const response = await fetch(destination, { method: 'POST', body, redirect: 'error', signal: AbortSignal.timeout(25000), headers: { Accept: 'application/json', Origin: 'https://services.dzaleka.com', Referer: 'https://services.dzaleka.com/', ...(json ? { 'Content-Type': 'application/json' } : {}) } });
    if (!response.ok) return guardFailure('Your submission could not be delivered. Please try again.', 503);
    let location = '/submissions/received';
    if (typeof next === 'string') { const dest = new URL(next, url.origin); if (dest.origin === url.origin) location = dest.pathname + dest.search; }
    if (request.headers.get('accept')?.includes('application/json')) return Response.json({ ok: true, success: true, redirect: location }, { headers: { 'Cache-Control': 'no-store' } });
    return new Response(null, { status: 303, headers: { Location: location, 'Cache-Control': 'no-store' } });
  } catch { return guardFailure('Your submission could not be delivered. Please try again.', 503); }
};

export const POST = protectedSubmission(receive);

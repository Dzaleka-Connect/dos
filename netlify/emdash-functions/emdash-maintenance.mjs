import { stagingOrigin } from '../../scripts/emdash/staging-env.mjs';

export const config = { schedule: '* * * * *' };

export default async function () {
  const origin = stagingOrigin();
  const secret = process.env.EMDASH_CRON_SECRET;
  if (!secret || secret.length < 32) throw new Error('Configure EMDASH_CRON_SECRET for staging maintenance.');
  const response = await fetch(new URL('/_emdash/api/dos-maintenance', origin), {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret}`, Origin: origin, 'Content-Type': 'application/json' },
    redirect: 'error',
    signal: AbortSignal.timeout(25000),
  });
  if (!response.ok) throw new Error(`EmDash maintenance returned HTTP ${response.status}.`);
  return new Response(null, { status: 204 });
}

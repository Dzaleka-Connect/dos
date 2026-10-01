import { stagingOrigin } from '../../scripts/emdash/staging-env.mjs';

// Every 15 minutes: scheduled posts go live within 15 minutes of their time.
// Running every minute cost about 86,000 function calls a month on its own
// (this function plus the maintenance route it calls).
export const config = { schedule: '*/15 * * * *' };

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

import { postgresConnectionOptions } from './postgres-config.mjs';

export function stagingOrigin(env = process.env) {
  if (env.DOS_EMDASH_STAGING !== '1') throw new Error('Set DOS_EMDASH_STAGING=1 on the separate staging site.');
  let origin;
  try { origin = new URL(env.EMDASH_STAGING_ORIGIN); } catch { throw new Error('Set EMDASH_STAGING_ORIGIN to the staging site HTTPS origin.'); }
  const dedicatedCmsHost = origin.hostname === 'cms.dzaleka.com' || origin.hostname.endsWith('.netlify.app');
  if (origin.protocol !== 'https:' || !dedicatedCmsHost ||
      origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash || origin.port) {
    throw new Error('EMDASH_STAGING_ORIGIN must be https://cms.dzaleka.com or a dedicated https://<site>.netlify.app origin.');
  }
  if (env.NETLIFY === 'true' && (!env.SITE_ID || env.SITE_ID !== env.EMDASH_STAGING_SITE_ID)) {
    throw new Error('SITE_ID must match EMDASH_STAGING_SITE_ID. This build is for the separate staging site only.');
  }
  if (env.NETLIFY === 'true' && env.URL && new URL(env.URL).origin !== origin.origin) {
    throw new Error('The Netlify site URL must match EMDASH_STAGING_ORIGIN.');
  }
  return origin.origin;
}

export function validateStagingRuntime(env = process.env) {
  stagingOrigin(env);
  for (const key of ['DATABASE_URL', 'S3_ENDPOINT', 'S3_BUCKET', 'S3_REGION', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY', 'EMDASH_ENCRYPTION_KEY']) {
    if (!env[key]?.trim()) throw new Error(`Missing staging environment variable: ${key}`);
  }
  for (const key of ['DOS_STAGING_PASSWORD', 'EMDASH_CRON_SECRET']) {
    if (!env[key] || env[key].length < 32) throw new Error(`${key} must contain at least 32 characters.`);
  }
  postgresConnectionOptions(env);
  let endpoint;
  try { endpoint = new URL(env.S3_ENDPOINT); }
  catch { throw new Error('S3_ENDPOINT must be a valid HTTPS URL.'); }
  if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password) throw new Error('S3_ENDPOINT must use HTTPS without embedded credentials.');
  if (endpoint.hostname.endsWith('.supabase.co')) {
    if (endpoint.pathname.replace(/\/$/, '') !== '/storage/v1/s3' || endpoint.search || endpoint.hash) {
      throw new Error('Use the Supabase S3 endpoint ending in /storage/v1/s3.');
    }
    if (env.S3_REGION === 'auto' || env.S3_REGION === 'YOUR-SUPABASE-PROJECT-REGION') {
      throw new Error('Set S3_REGION to the actual Supabase project region from Storage settings.');
    }
  }
  if (env.S3_PUBLIC_URL) throw new Error('Keep the staging bucket private; leave S3_PUBLIC_URL unset.');
}

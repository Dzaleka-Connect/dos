import { describe, expect, it, vi, afterEach } from 'vitest';
import { authorizeStaging, stagingResponse, maintenancePath } from '../src/lib/news/staging-access.mjs';
import { stagingOrigin, validateStagingRuntime } from '../scripts/emdash/staging-env.mjs';
import maintenance from '../netlify/emdash-functions/emdash-maintenance.mjs';
import { rootCertificates } from 'node:tls';
import pg from 'pg';
import { postgresConnectionOptions } from '../scripts/emdash/postgres-config.mjs';

const env = {
  DOS_EMDASH_STAGING: '1', EMDASH_STAGING_ORIGIN: 'https://dos-test-staging.netlify.app',
  DOS_STAGING_PASSWORD: 'p'.repeat(40), EMDASH_CRON_SECRET: 's'.repeat(40),
  DATABASE_URL: 'postgresql://postgres.project:password@aws-0-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=verify-full',
  DATABASE_CA_CERT_BASE64: Buffer.from(rootCertificates[0]).toString('base64'),
  S3_ENDPOINT: 'https://project.storage.supabase.co/storage/v1/s3', S3_BUCKET: 'staging', S3_REGION: 'eu-west-1',
  S3_ACCESS_KEY_ID: 'test-key', S3_SECRET_ACCESS_KEY: 'test-secret', EMDASH_ENCRYPTION_KEY: 'test-key',
};
const request = (path: string, authorization = '', method = 'GET') => new Request(env.EMDASH_STAGING_ORIGIN + path, { method, headers: { authorization } });
const basic = (password: string) => `Basic ${Buffer.from(`staging:${password}`).toString('base64')}`;

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe('Netlify CMS staging boundaries', () => {
  it('rejects live domains, accidental sites and missing opt-in', () => {
    expect(stagingOrigin(env)).toBe(env.EMDASH_STAGING_ORIGIN);
    for (const origin of ['https://services.dzaleka.com', 'http://dos.netlify.app', 'https://dos.netlify.app.evil.com', 'https://dos.netlify.app/path', 'https://cms.dzaleka.com.evil.com', 'http://cms.dzaleka.com', 'https://cms.dzaleka.com/path', 'https://dzaleka.com']) {
      expect(() => stagingOrigin({ ...env, EMDASH_STAGING_ORIGIN: origin })).toThrow();
    }
    expect(() => stagingOrigin({ ...env, DOS_EMDASH_STAGING: '' })).toThrow();
    expect(() => stagingOrigin({ ...env, NETLIFY: 'true', SITE_ID: 'live', EMDASH_STAGING_SITE_ID: 'staging' })).toThrow();
    expect(stagingOrigin({ ...env, NETLIFY: 'true', SITE_ID: 'staging', EMDASH_STAGING_SITE_ID: 'staging', URL: env.EMDASH_STAGING_ORIGIN })).toBe(env.EMDASH_STAGING_ORIGIN);
  });

  it('allows the dedicated CMS domain only on the configured CMS project', () => {
    const cms = { ...env, EMDASH_STAGING_ORIGIN: 'https://cms.dzaleka.com',
      NETLIFY: 'true', SITE_ID: 'cms-project', EMDASH_STAGING_SITE_ID: 'cms-project', URL: 'https://cms.dzaleka.com' };
    expect(stagingOrigin(cms)).toBe('https://cms.dzaleka.com');
    expect(() => validateStagingRuntime(cms)).not.toThrow();
    expect(() => stagingOrigin({ ...cms, SITE_ID: 'public-project' })).toThrow('SITE_ID');
    expect(() => stagingOrigin({ ...cms, URL: 'https://services.dzaleka.com' })).toThrow('site URL');
  });

  it('requires remote verified TLS storage and never exposes credential values in errors', () => {
    expect(() => validateStagingRuntime(env)).not.toThrow();
    expect(() => validateStagingRuntime({ ...env, DATABASE_URL: 'file:./news.db' })).toThrow('PostgreSQL');
    expect(() => validateStagingRuntime({ ...env, DATABASE_URL: 'postgresql://user:password@db/news?sslmode=disable' })).toThrow('sslmode');
    expect(() => validateStagingRuntime({ ...env, S3_PUBLIC_URL: 'https://public.example.com' })).toThrow('private');
    expect(() => validateStagingRuntime({ ...env, DOS_STAGING_PASSWORD: 'short' })).toThrow('32');
    expect(() => validateStagingRuntime({ ...env, DATABASE_URL: 'not-a-url-super-secret' })).toThrow('valid PostgreSQL');
  });

  it('protects initial setup, admin, signed previews and reader pages before CMS initialization', () => {
    for (const path of ['/_emdash/admin/setup', '/_emdash/api/setup', '/news/test?preview=abc', '/api/search-index.json']) {
      expect(authorizeStaging(request(path), env)?.status).toBe(401);
      expect(authorizeStaging(request(path, basic('wrong')), env)?.status).toBe(401);
      expect(authorizeStaging(request(path, basic(env.DOS_STAGING_PASSWORD)), env)).toBeNull();
    }
    expect(authorizeStaging(request('/news'), {})?.status).toBe(503);
  });

  it('preserves the trusted CA in pg and rejects TLS overrides or missing certificates', () => {
    const client = new pg.Client(postgresConnectionOptions(env));
    expect(client.ssl).toEqual({ ca: rootCertificates[0], rejectUnauthorized: true });
    expect(client.connectionParameters.options).toBe('-c search_path=emdash_staging');
    for (const extra of ['&ssl=false', '&sslrootcert=/tmp/other.pem', '&sslcert=/tmp/client.pem']) {
      expect(() => postgresConnectionOptions({ ...env, DATABASE_URL: env.DATABASE_URL + extra })).toThrow('Configure database TLS');
    }
    expect(() => postgresConnectionOptions({ ...env, DATABASE_CA_CERT_BASE64: '' })).toThrow('Supabase CA');
    expect(() => postgresConnectionOptions({ ...env, DATABASE_CA_CERT_BASE64: 'not-a-certificate' })).toThrow('valid, unexpired CA');
    expect(() => postgresConnectionOptions({ ...env, DATABASE_URL: env.DATABASE_URL.replace('verify-full', 'verify-ca') })).toThrow('verify-full');
  });

  it('requires separate session migrations when runtime uses transaction pooling', () => {
    const pooled = { ...env, DATABASE_URL: env.DATABASE_URL.replace(':5432/', ':6543/'), DIRECT_URL: env.DATABASE_URL };
    expect(() => validateStagingRuntime(pooled)).toThrow('EMDASH_MIGRATIONS_MODE=check');
    const runtime = { ...pooled, EMDASH_MIGRATIONS_MODE: 'check' };
    expect(() => validateStagingRuntime(runtime)).not.toThrow();
    const connection = new pg.Client(postgresConnectionOptions(runtime));
    expect(connection.connectionParameters.port).toBe(6543);
    expect(connection.connectionParameters.options).toBe('-c search_path=emdash_staging');
    expect(new pg.Client(postgresConnectionOptions(runtime, { migration: true })).connectionParameters.port).toBe(5432);
    expect(() => postgresConnectionOptions({ ...runtime, DIRECT_URL: runtime.DATABASE_URL }, { migration: true })).toThrow('Session pooler');
    expect(() => postgresConnectionOptions(runtime, { migration: true })).not.toThrow();
  });

  it('requires the Supabase S3 API endpoint and a real project region', () => {
    expect(() => validateStagingRuntime({ ...env, S3_ENDPOINT: 'https://project.supabase.co' })).toThrow('/storage/v1/s3');
    expect(() => validateStagingRuntime({ ...env, S3_REGION: 'auto' })).toThrow('actual Supabase project region');
    expect(() => validateStagingRuntime({ ...env, S3_REGION: '' })).toThrow('S3_REGION');
    expect(() => validateStagingRuntime({ ...env, S3_ENDPOINT: 'https://project.supabase.co/storage/v1/s3' })).not.toThrow();
  });

  it('allows only POST with the separate cron secret to run maintenance', () => {
    expect(authorizeStaging(request(maintenancePath), env)?.status).toBe(405);
    expect(authorizeStaging(request(maintenancePath, basic(env.DOS_STAGING_PASSWORD), 'POST'), env)?.status).toBe(401);
    expect(authorizeStaging(request(maintenancePath, 'Bearer wrong', 'POST'), env)?.status).toBe(401);
    expect(authorizeStaging(request(maintenancePath, `Bearer ${env.EMDASH_CRON_SECRET}`, 'POST'), env)).toBeNull();
    expect(authorizeStaging(request(maintenancePath + '/', `Bearer ${env.EMDASH_CRON_SECRET}`, 'POST'), env)).toBeNull();
    expect(authorizeStaging(request(maintenancePath, 'Bearer ', 'POST'), {})?.status).toBe(401);
  });

  it('prevents intermediary caching and indexing without discarding cookies or status', () => {
    const response = stagingResponse(new Response(null, { status: 302, headers: { Location: '/news', 'Set-Cookie': 'session=test', 'Cache-Control': 'public, max-age=3600' } }));
    expect(response.status).toBe(302);
    expect(response.headers.get('Set-Cookie')).toBe('session=test');
    expect(response.headers.get('Cache-Control')).toBe('private, no-store');
    expect(response.headers.get('Netlify-CDN-Cache-Control')).toBe('no-store');
    expect(response.headers.get('X-Robots-Tag')).toContain('noindex');
  });

  it.each([
    { name: 'local', NETLIFY: undefined, SITE_ID: undefined, EMDASH_STAGING_SITE_ID: undefined, URL: undefined },
    { name: 'Netlify', NETLIFY: 'true', SITE_ID: 'test-cms', EMDASH_STAGING_SITE_ID: 'test-cms', URL: env.EMDASH_STAGING_ORIGIN },
  ])('sends maintenance only to the fixed staging origin in $name and reports non-successful responses', async ({ name: _name, ...hosting }) => {
    // Own every hosting variable read by stagingOrigin, including on the public site's CI runner.
    for (const [key, value] of Object.entries({ ...env, ...hosting })) vi.stubEnv(key, value);
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    expect((await maintenance()).status).toBe(204);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url.toString()).toBe(env.EMDASH_STAGING_ORIGIN + maintenancePath);
    expect(options.method).toBe('POST');
    expect(options.redirect).toBe('error');
    expect(options.headers.Authorization).toBe(`Bearer ${env.EMDASH_CRON_SECRET}`);
    expect(options.headers.Origin).toBe(env.EMDASH_STAGING_ORIGIN);
    fetchMock.mockResolvedValue(new Response(null, { status: 503 }));
    await expect(maintenance()).rejects.toThrow('HTTP 503');
  });
});

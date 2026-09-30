import { X509Certificate } from 'node:crypto';

export const stagingSchema = 'emdash_staging';

export function postgresConnectionOptions(env = process.env, { migration = false } = {}) {
  const key = migration ? 'DIRECT_URL' : 'DATABASE_URL';
  let database;
  try { database = new URL(env[key]); }
  catch { throw new Error(`${key} must be a valid PostgreSQL connection URL.`); }
  if (!['postgres:', 'postgresql:'].includes(database.protocol) ||
      database.searchParams.get('sslmode') !== 'verify-full') {
    throw new Error(`${key} must use PostgreSQL with sslmode=verify-full.`);
  }
  const supabase = database.hostname.endsWith('.pooler.supabase.com') || database.hostname.endsWith('.supabase.co');
  if (supabase && database.port === '6543') {
    if (migration) throw new Error('DIRECT_URL must use the Session pooler on port 5432 for migrations.');
    if (env.EMDASH_MIGRATIONS_MODE !== 'check') throw new Error('Transaction pooling requires EMDASH_MIGRATIONS_MODE=check; run migrations separately with DIRECT_URL.');
  }
  for (const key of database.searchParams.keys()) {
    if (key.startsWith('ssl') && key !== 'sslmode') {
      throw new Error('Configure database TLS with sslmode=verify-full and DATABASE_CA_CERT_BASE64 only.');
    }
  }
  if (supabase && !env.DATABASE_CA_CERT_BASE64) {
    throw new Error('Set DATABASE_CA_CERT_BASE64 to the Supabase CA certificate from Database Settings.');
  }
  const ssl = { rejectUnauthorized: true };
  if (env.DATABASE_CA_CERT_BASE64) {
    try {
      const encoded = env.DATABASE_CA_CERT_BASE64;
      if (!/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) throw new Error();
      const ca = Buffer.from(encoded, 'base64').toString('utf8');
      const certificate = new X509Certificate(ca);
      if (!certificate.ca || Date.parse(certificate.validFrom) > Date.now() || Date.parse(certificate.validTo) <= Date.now()) throw new Error();
      ssl.ca = ca;
    } catch { throw new Error('DATABASE_CA_CERT_BASE64 must contain a valid, unexpired CA certificate encoded as base64.'); }
  }
  // pg replaces an explicit SSL object when sslmode is present in the URL.
  database.searchParams.delete('sslmode');
  database.searchParams.set('options', `-c search_path=${stagingSchema}`);
  return { connectionString: database.toString(), ssl };
}

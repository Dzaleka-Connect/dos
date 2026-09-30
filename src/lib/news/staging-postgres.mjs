import { createDialect as postgresDialect } from 'emdash/db/postgres';
import { validateStagingRuntime } from '../../../scripts/emdash/staging-env.mjs';
import { postgresConnectionOptions } from '../../../scripts/emdash/postgres-config.mjs';

function dialect(migration) {
  validateStagingRuntime();
  return postgresDialect({
    // Web requests use transaction pooling; migration commands retain a session connection.
    ...postgresConnectionOptions(process.env, { migration }),
    pool: { min: 0, max: 1, connectionTimeoutMillis: 8000, idleTimeoutMillis: 1000 },
  });
}

export function createDialect() { return dialect(false); }
export function createMigrationDialect() { return dialect(true); }

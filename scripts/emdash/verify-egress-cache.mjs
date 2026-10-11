import assert from 'node:assert/strict';
import pg from 'pg';
import { Kysely, PostgresDialect, sql } from 'kysely';
import { postgresConnectionOptions } from './postgres-config.mjs';
import { createPublishedCache, publishedRevision } from '../../src/lib/news/published-cache.mjs';
import { cmsCollections } from '../../src/lib/news/live-collections.mjs';

// Read-only measurement. It prints counts and byte totals, never content or credentials.
const pool = new pg.Pool({ ...postgresConnectionOptions(), max: 1, statement_timeout: 10000 });
const db = new Kysely({ dialect: new PostgresDialect({ pool }) });
const read = createPublishedCache();
let connection;
pool.on('connect', client => { connection = client.connection.stream; });
try {
  await sql`SELECT 1`.execute(db);
  for (const collection of cmsCollections) {
    let downloads = 0;
    const revision = () => publishedRevision(db, collection);
    const load = async () => {
      downloads++;
      return db.selectFrom(`ec_${collection}`).selectAll().where('status', '=', 'published').where('deleted_at', 'is', null).execute();
    };
    let before = connection.bytesRead;
    const first = await read(collection, revision, load);
    const coldBytes = connection.bytesRead - before;
    before = connection.bytesRead;
    const second = await read(collection, revision, load);
    const warmBytes = connection.bytesRead - before;
    assert.equal(first, second);
    assert.equal(downloads, 1);
    assert.ok(warmBytes < coldBytes / 10, 'Unchanged collection must avoid bulk egress');
    console.log(JSON.stringify({ collection, entries: first.length, coldBytes, warmBytes, reductionPercent: +(100 * (1 - warmBytes / coldBytes)).toFixed(2) }));
  }
} finally { await db.destroy(); }

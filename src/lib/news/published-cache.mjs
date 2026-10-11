import { sql } from 'kysely';
import { isCmsCollection } from './live-collections.mjs';

// Compute the fingerprint in Postgres: unchanged collections return two hashes,
// rather than sending every article body across the Supabase connection again.
export async function publishedRevision(db, collection) {
  if (!isCmsCollection(collection)) throw new Error('Unknown public collection');
  const result = await sql`
    SELECT
      (SELECT md5(coalesce(string_agg(md5(row_to_json(c)::text), '' ORDER BY c.id), ''))
       FROM ${sql.table(`ec_${collection}`)} c WHERE c.status = 'published' AND c.deleted_at IS NULL) AS content,
      (SELECT md5(coalesce(string_agg(md5(row_to_json(s)::text), '' ORDER BY s.content_id), ''))
       FROM _emdash_seo s WHERE s.collection = ${collection}) AS seo,
      (SELECT has_seo FROM _emdash_collections WHERE slug = ${collection}) AS enabled
  `.execute(db);
  return JSON.stringify(result.rows[0]);
}

export function createPublishedCache() {
  const values = new Map(), pending = new Map();
  return async function read(collection, revision, load) {
    if (!isCmsCollection(collection)) throw new Error('Unknown public collection');
    if (pending.has(collection)) return pending.get(collection);
    const task = (async () => {
      const version = await revision();
      const saved = values.get(collection);
      if (saved?.version === version) return saved.items;
      const items = await load();
      // Do not retain a snapshot if publication changed while the rows loaded.
      if (version === await revision()) values.set(collection, { version, items });
      else values.delete(collection);
      return items;
    })();
    pending.set(collection, task);
    try { return await task; }
    finally { pending.delete(collection); }
  };
}

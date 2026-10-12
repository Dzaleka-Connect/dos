import { sql, type Kysely } from 'kysely';
import type { Database } from 'emdash';
import type { Claim } from './proof';
interface GuardRow { id: string; count: number; expires: number }
const database = (db: Kysely<Database>) => db as unknown as Kysely<{ _dos_form_guard: GuardRow }>;
export async function ensureGuardTable(db: Kysely<Database>) {
  await database(db).schema.createTable('_dos_form_guard').ifNotExists().addColumn('id', 'text', c => c.primaryKey()).addColumn('count', 'integer', c => c.notNull()).addColumn('expires', 'bigint', c => c.notNull()).execute();
  await database(db).schema.createIndex('dos_form_guard_expiry').ifNotExists().on('_dos_form_guard').column('expires').execute();
}
export async function claimSubmission(db: Kysely<Database>, claim: Claim, now = Date.now()) {
  // Conditional upserts serialize concurrent requests across all server instances.
  try {
    await database(db).transaction().execute(async trx => {
      await trx.deleteFrom('_dos_form_guard').where('expires', '<', now).execute();
      const nonce = await trx.insertInto('_dos_form_guard').values({ id: 'nonce:' + claim.nonce, count: 1, expires: claim.expires }).onConflict(c => c.column('id').doNothing()).returning('id').executeTakeFirst();
      if (!nonce) throw new Error('replay');
      for (const [key, limit] of [['browser:' + claim.client, 12], ['network:' + claim.ip, 120]] as const) {
        const bucket = Math.floor(now / 3600000);
        const row = await trx.insertInto('_dos_form_guard').values({ id: key + ':' + bucket, count: 1, expires: (bucket + 1) * 3600000 }).onConflict(c => c.column('id').doUpdateSet({ count: sql<number>`${sql.ref("_dos_form_guard.count")} + 1` }).where('_dos_form_guard.count', '<', limit)).returning('count').executeTakeFirst();
        if (!row) throw new Error('rate');
      }
    });
    return { accepted: true };
  } catch (error) {
    if (error instanceof Error && ['replay', 'rate'].includes(error.message)) return { accepted: false, reason: error.message };
    throw error;
  }
}

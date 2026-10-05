import { lookup } from 'node:dns/promises';
import { request as httpsRequest } from 'node:https';
import { request as httpRequest } from 'node:http';
import { isIP } from 'node:net';
import type { Database } from 'emdash';
import type { Kysely } from 'kysely';
import { destinationUrl } from './contract';
import { insightsDb } from './store';

export function publicAddress(address: string) {
  if (isIP(address) === 6) return /^2[0-9a-f]{3}:/i.test(address) && !/^2002:/i.test(address) && !/^2001:(?:db8|0|10|20):/i.test(address);
  if (isIP(address) !== 4) return false;
  const [a, b] = address.split('.').map(Number);
  return !(a === 0 || a === 10 || a === 127 || a >= 224 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && [0, 168].includes(b)) || (a === 198 && [18, 19, 51].includes(b)) || (a === 203 && b === 0));
}
export async function checkDestination(destination: string): Promise<string> {
  try {
    let current = destination;
    for (let hop = 0; hop < 4; hop++) {
      const url = new URL(destinationUrl(current));
      const addresses = await lookup(url.hostname, { all: true });
      if (!addresses.length || addresses.some(a => !publicAddress(a.address))) return 'blocked';
      const address = addresses[0];
      const response = await new Promise<{ status: number; location?: string }>((resolve, reject) => {
        const req = (url.protocol === 'https:' ? httpsRequest : httpRequest)(url, { method: 'GET', headers: { 'User-Agent': 'Dzaleka-Link-Check/1.0', Range: 'bytes=0-0' },
          lookup: ((_host: string, options: { all?: boolean }, callback: Function) => options.all ? callback(null, [address]) : callback(null, address.address, address.family)) as never,
        }, res => { resolve({ status: res.statusCode || 0, location: res.headers.location }); res.destroy(); });
        const timer = setTimeout(() => req.destroy(new Error('Timeout')), 4000);
        req.on('close', () => clearTimeout(timer)); req.on('error', reject); req.end();
      });
      if ([301, 302, 303, 307, 308].includes(response.status) && response.location) { current = new URL(response.location, url).href; continue; }
      if ([404, 410].includes(response.status)) return 'missing';
      return response.status >= 200 && response.status < 300 ? 'healthy' : 'unconfirmed';
    }
    return 'redirect-loop';
  } catch { return 'unconfirmed'; }
}
export async function checkLinks(db: Kysely<Database>, id?: string, check = checkDestination) {
  const database = insightsDb(db);
  let query = database.selectFrom('_dos_links').selectAll().where('enabled', '=', 1);
  query = id ? query.where('id', '=', id) : query.where(eb => eb.or([eb('checked_at', 'is', null), eb('checked_at', '<', new Date(Date.now() - 86400000).toISOString())]));
  const links = await query.orderBy('checked_at', 'asc').limit(3).execute();
  await Promise.all(links.map(async link => {
    const result = await check(link.destination), failures = result === 'missing' ? link.failures + 1 : 0;
    await database.updateTable('_dos_links').set({ health: result === 'missing' ? (failures >= 2 ? 'broken' : 'suspected-missing') : result, failures, checked_at: new Date().toISOString() })
      .where('id', '=', link.id).where('revision', '=', link.revision).execute();
  }));
}

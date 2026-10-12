import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
export type Claim = { nonce: string; target: string; ip: string; client: string; expires: number };
export const clientHash = (ip: string, secret: string) => createHmac('sha256', secret).update('form-ip:' + ip).digest('hex');
const signature = (payload: string, secret: string) => createHmac('sha256', secret).update('form-proof-v1:' + payload).digest('hex');
export function makeChallenge(target: string, ip: string, client: string, secret: string, now = Date.now()) {
  const claim: Claim = { nonce: randomBytes(24).toString('hex'), target, ip: clientHash(ip, secret), client, expires: now + 600000 };
  const payload = Buffer.from(JSON.stringify(claim)).toString('base64url');
  return { token: payload + '.' + signature(payload, secret), difficulty: 16, expires: claim.expires };
}
export function verifyProof(token: string, work: string, target: string, ip: string, secret: string, now = Date.now()): Claim | null {
  if (token.length > 2000 || !/^\d{1,9}$/.test(work)) return null;
  const [payload, sig, extra] = token.split('.');
  if (extra || !payload || !/^[a-f0-9]{64}$/.test(sig || '') || !timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(signature(payload, secret), 'hex'))) return null;
  try {
    const claim: Claim = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (claim.target !== target || claim.ip !== clientHash(ip, secret) || !/^[a-f0-9]{48}$/.test(claim.nonce) || !/^[a-f0-9]{32}$/.test(claim.client) || !Number.isFinite(claim.expires) || claim.expires < now || claim.expires > now + 600000) return null;
    const hash = createHash('sha256').update(token + ':' + work).digest();
    return hash[0] === 0 && hash[1] === 0 ? claim : null;
  } catch { return null; }
}

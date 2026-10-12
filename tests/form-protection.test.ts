import { describe, expect, it, vi } from 'vitest';
import { createHash } from 'node:crypto';
import { Kysely } from 'kysely';
import { createDialect } from 'emdash/db/sqlite';
import type { Database } from 'emdash';
import { makeChallenge, verifyProof } from '../src/lib/submissions/proof';
import { checkSubmission } from '../src/lib/submissions/guard';
import { claimSubmission, ensureGuardTable } from '../src/lib/submissions/guard-store';
import { correctionError, spamError } from '../src/lib/submissions/spam';
import { submissionPaths, relayForms } from '../src/lib/submissions/targets';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const secret = 'test-secret-for-submission-protection'.repeat(2);
const target = '/api/form-relay?form=contactform';
const ip = '192.0.2.10';
const browser = 'a'.repeat(32);
function solve(token: string) { for (let i = 0; ; i++) { const hash = createHash('sha256').update(token + ':' + i).digest(); if (hash[0] === 0 && hash[1] === 0) return String(i); } }
const challenge = makeChallenge(target, ip, browser, secret);
const work = solve(challenge.token);
function request(fields: unknown, proof = challenge.token, solution = work, route = target) {
  return new Request('https://services.dzaleka.com' + route, { method: 'POST', headers: { Origin: 'https://services.dzaleka.com', 'Content-Type': 'application/json', 'x-dos-proof': proof, 'x-dos-work': solution }, body: JSON.stringify(fields) });
}
describe('public form spam protection', () => {
  it('binds expiring proof to a target and connection and rejects tampering', () => {
    expect(verifyProof(challenge.token, work, target, ip, secret)?.client).toBe(browser);
    expect(verifyProof(challenge.token, work, '/api/map-submission', ip, secret)).toBeNull();
    expect(verifyProof(challenge.token, work, target, '192.0.2.11', secret)).toBeNull();
    expect(verifyProof(challenge.token + 'a', work, target, ip, secret)).toBeNull();
    expect(verifyProof(challenge.token, work, target, ip, secret, challenge.expires + 1)).toBeNull();
    expect(verifyProof(challenge.token, 'invalid', target, ip, secret)).toBeNull();
  });
  it('rejects the reported gibberish across forms without rejecting multilingual names or sentences', () => {
    expect(spamError({ name: 'ObDRwMuHTqzPQzPOTCgtbKD', title: 'AExJZhLAbddEAiAzkwLfU', description: 'EcpEwuwbLboLnOOTkPE', category: 'eVbZZrqZQgQcVdSMWZbCwaY' })).toBeTruthy();
    expect(spamError({ name: 'Nguyễn Thị Mai', title: 'École communautaire', description: 'Tunahitaji kurekebisha nambari ya simu.' })).toBeNull();
    expect(spamError({ name: 'MacDonald', _gotcha: 'bot' })).toBeTruthy();
    expect(correctionError({ listingUrl: 'https://yntdwmvd.com', notes: 'Update phone' })).toBeTruthy();
    expect(correctionError({ listingUrl: 'https://services.dzaleka.com/services/test-service', notes: 'The office opens at 9 am.' })).toBeNull();
    expect(correctionError({ listingUrl: 'https://services.dzaleka.com/services/2', notes: 'Change' })).toBeTruthy();
    expect(correctionError({ listingUrl: 'https://services.dzaleka.com/services/test-service' })).toBeTruthy();
  });
  it('requires verification on every protected route before a provider is contacted', async () => {
    const send = vi.fn<typeof fetch>();
    for (const route of submissionPaths) {
      const path = route === '/api/form-relay' ? target : route;
      expect((await checkSubmission(request({ name: 'Visitor', message: 'Please help with the website.' }, '', '', path), ip, secret, send))?.status).toBe(403);
    }
    expect(send).not.toHaveBeenCalled();
  });
  it('fails closed on service outages, rejects replay, and accepts a valid verified submission', async () => {
    const send = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ data: { accepted: true } }));
    expect(await checkSubmission(request({ name: 'Visitor', message: 'Please help with the website.' }), ip, secret, send)).toBeNull();
    send.mockResolvedValue(Response.json({ data: { accepted: false, reason: 'replay' } }));
    expect((await checkSubmission(request({ name: 'Visitor' }), ip, secret, send))?.status).toBe(403);
    send.mockResolvedValue(Response.json({}, { status: 503 }));
    expect((await checkSubmission(request({ name: 'Visitor' }), ip, secret, send))?.status).toBe(503);
  });
  it('uses database-backed atomic replay and rate limits and cleans expired entries', async () => {
    const db = new Kysely<Database>({ dialect: createDialect({ url: ':memory:' }) });
    try {
      await ensureGuardTable(db);
      const claim = verifyProof(challenge.token, work, target, ip, secret)!;
      const results = await Promise.all([claimSubmission(db, claim), claimSubmission(db, claim)]);
      expect(results.filter(r => r.accepted)).toHaveLength(1);
      expect(results.find(r => !r.accepted)?.reason).toBe('replay');
      for (let i = 1; i < 12; i++) expect((await claimSubmission(db, { ...claim, nonce: String(i).padStart(48, '0') })).accepted).toBe(true);
      expect(await claimSubmission(db, { ...claim, nonce: 'b'.repeat(48) })).toEqual({ accepted: false, reason: 'rate' });
      expect((await claimSubmission(db, { ...claim, nonce: 'c'.repeat(48), client: 'c'.repeat(32) })).accepted).toBe(true);
      expect((await claimSubmission(db, { ...claim, nonce: 'd'.repeat(48), expires: Date.now() + 7200000 }, Date.now() + 3600001)).accepted).toBe(true);
    } finally { await db.destroy(); }
  });
  it('keeps external delivery addresses out of browser forms and covers all Netlify email functions', () => {
    const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
    for (const file of walk('src').filter(f => /\.(astro|tsx)$/.test(f))) expect(readFileSync(file, 'utf8'), file).not.toMatch(/https:\/\/(formspree\.io\/f\/|formcarry\.com\/s\/)/);
    for (const file of walk('netlify/functions').filter(f => f.endsWith('.ts'))) {
      const source = readFileSync(file, 'utf8');
      if (source.includes('resend.emails.send')) expect(source, file).toContain('await checkNetlifySubmission(event)');
    }
    for (const name of ['submissions', 'form-relay', 'map-submission', 'submit-voice', 'send-booking-confirmation']) {
      expect(readFileSync('src/pages/api/' + name + '.ts', 'utf8')).toContain('export const POST = protectedSubmission(receive)');
    }
    expect(Object.keys(relayForms)).toHaveLength(29);
  });
});

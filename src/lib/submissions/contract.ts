import { z } from 'zod';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const fieldsSchema = z.record(z.union([z.string().max(16000), z.array(z.string().max(4000)).max(50)]))
  .refine(fields => Object.keys(fields).length <= 100);
export const submissionSchema = z.object({
  form: z.string().regex(/^[a-z][a-z0-9-]{0,100}$/),
  fields: fieldsSchema,
  sourcePath: z.string().max(300),
  clientHash: z.string().regex(/^[a-f0-9]{64}$/),
  test: z.boolean().default(false),
});
export type Submission = z.infer<typeof submissionSchema>;
export const value = (fields: Submission['fields'], key: string) => {
  const field = fields[key];
  return typeof field === 'string' ? field.trim() : field?.join(', ').trim() || '';
};
export function submissionId(input: Submission, day = new Date().toISOString().slice(0, 10)) {
  const fields = Object.fromEntries(Object.entries(input.fields).sort(([a], [b]) => a.localeCompare(b)));
  return createHash('sha256').update(JSON.stringify([day, input.form, fields, input.test])).digest('hex');
}
export function signSubmission(body: string, secret: string, timestamp: string) {
  return createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex');
}
export function validSignature(body: string, secret: string | undefined, timestamp: string | null, signature: string | null) {
  if (!secret || secret.length < 32 || !timestamp || !signature || !/^\d+$/.test(timestamp) || !/^[a-f0-9]{64}$/.test(signature)) return false;
  if (Math.abs(Date.now() - Number(timestamp)) > 300000) return false;
  return timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(signSubmission(body, secret, timestamp), 'hex'));
}

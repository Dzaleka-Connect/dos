import { describe, expect, it } from 'vitest';
import { serviceAccessSchema, providerConfirmationSchema, serviceAccessRows, providerConfirmation, contactLanguages } from '../src/utils/serviceDetails';

describe('service information and confirmations', () => {
  it('shows only supplied access information and does not assume languages', () => {
    expect(serviceAccessRows()).toEqual([]);
    expect(contactLanguages()).toBeUndefined();
    expect(contactLanguages({ languages: [] })).toBeUndefined();
    expect(serviceAccessRows({ eligibility: 'Residents', languages: ['French', 'Swahili'] })).toEqual([
      { label: 'Who can use this service', value: 'Residents' },
      { label: 'Languages offered', value: 'French, Swahili' },
    ]);
  });
  it('requires non-empty evidence fields and a real confirmation date', () => {
    expect(providerConfirmationSchema.safeParse({ by: '', date: '2026-09-28' }).success).toBe(false);
    expect(providerConfirmationSchema.safeParse({ by: 'Organisation', date: 'invalid' }).success).toBe(false);
    expect(serviceAccessSchema.safeParse({ fees: ' ' }).success).toBe(false);
    expect(serviceAccessSchema.parse({ fees: ' Free ' }).fees).toBe('Free');
  });
  it('does not publish a confirmation in the future or infer one from an absent record', () => {
    const now = new Date('2026-09-28T12:00:00Z');
    expect(providerConfirmation(undefined, now)).toBeUndefined();
    expect(providerConfirmation({ by: 'Provider', date: new Date('2027-01-01') }, now)).toBeUndefined();
    expect(providerConfirmation({ by: 'Provider', date: new Date('2026-09-27') }, now)?.reviewDue).toBe(false);
    expect(providerConfirmation({ by: 'Provider', date: new Date('2025-01-01') }, now)?.reviewDue).toBe(true);
  });
});

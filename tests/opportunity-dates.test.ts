import { describe, expect, it } from 'vitest';
import { externalOpportunityStatus, formatOpportunityDate, opportunityStatus } from '../src/utils/opportunityDates';
import { curatedGrantsPrograms, externalOpportunities } from '../src/data/grantsPrograms';
import { papitaKhasuResidency } from '../src/data/papitaKhasuResidency';

describe('opportunity deadlines in Malawi', () => {
  it('opens the residency at midnight in Malawi rather than the server timezone', () => {
    expect(opportunityStatus(papitaKhasuResidency, new Date('2026-09-20T21:59:59Z'))).toBe('opening soon');
    expect(opportunityStatus(papitaKhasuResidency, new Date('2026-09-20T22:00:00Z'))).toBe('open');
  });
  it('keeps the final application minute open and closes at midnight', () => {
    expect(opportunityStatus(papitaKhasuResidency, new Date('2026-10-18T21:59:30Z'))).toBe('open');
    expect(opportunityStatus(papitaKhasuResidency, new Date('2026-10-18T22:00:00Z'))).toBe('closed');
  });
  it('includes the full day for date-only deadlines', () => {
    const item = { status: 'open now' as const, deadline: '2026-10-18' };
    expect(externalOpportunityStatus(item, new Date('2026-10-18T21:59:59Z'))).toBe('open now');
    expect(externalOpportunityStatus(item, new Date('2026-10-18T22:00:00Z'))).toBe('closed');
  });
  it('does not advertise past external calls as open', () => {
    const pastCalls = externalOpportunities.filter(item => item.deadline && item.deadline < '2026-09-21');
    expect(pastCalls.length).toBeGreaterThan(0);
    for (const item of pastCalls) expect(externalOpportunityStatus(item, new Date('2026-09-21'))).toBe('closed');
  });
  it('preserves ongoing and explicitly closed listings', () => {
    expect(opportunityStatus({ status: 'ongoing' })).toBe('ongoing');
    expect(opportunityStatus({ status: 'closed', opensAt: '2025-01-01T00:00:00+02:00' })).toBe('closed');
    expect(externalOpportunityStatus({ status: 'watchlist' })).toBe('watchlist');
  });
  it('formats dates in Malawi, including the closing time', () => {
    expect(formatOpportunityDate('2026-09-20T22:00:00Z')).toBe('21 September 2026');
    expect(formatOpportunityDate(papitaKhasuResidency.deadline!, true)).toBe('18 October 2026 at 23:59 Malawi time (CAT)');
  });
});

describe('Papita Khasu listing', () => {
  it('publishes one record with an award fully accounted for by its payment schedule', () => {
    expect(curatedGrantsPrograms.filter(item => item.slug === papitaKhasuResidency.slug)).toHaveLength(1);
    expect(papitaKhasuResidency.payments!.reduce((sum, item) => sum + item.amount, 0)).toBe(papitaKhasuResidency.award!.amount);
  });
});

import { describe, expect, it } from 'vitest';
import { formatDateInCAT } from '../src/utils/eventDate';
describe('Malawi event dates', () => {
  it('shows the supplied CAT time without adding the server timezone', () => {
    const date = new Date('2025-11-27T15:00:00+02:00');
    expect(formatDateInCAT(date, 'MMM d, yyyy')).toBe('Nov 27, 2025');
    expect(formatDateInCAT(date, 'h:mm a')).toBe('3:00 PM');
  });
  it('uses the Malawi date across midnight rather than the UTC calendar day', () => {
    expect(formatDateInCAT(new Date('2026-09-20T22:30:00Z'), 'yyyy-MM-dd')).toBe('2026-09-21');
    expect(formatDateInCAT(new Date('2026-09-21T22:30:00+02:00'), 'MMMM d, yyyy')).toBe('September 21, 2026');
  });
});

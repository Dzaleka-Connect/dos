import { describe, expect, it } from 'vitest';
import { formatDateInCAT } from '../src/utils/eventDate';
describe('Malawi event dates', () => {
  it.each([
    ['2026-09-30T14:30:00+02:00', '2:30pm'],
    ['2026-09-30T14:00:00+02:00', '2pm'],
    ['2026-09-30T12:00:00+02:00', 'midday'],
    ['2026-09-30T00:00:00+02:00', 'midnight'],
    ['2026-09-30T00:05:00+02:00', '12:05am'],
  ])('uses house time style for %s', (instant, expected) => {
    expect(formatDateInCAT(new Date(instant), 'h:mm a')).toBe(expected);
  });
  it('shows the supplied CAT time without adding the server timezone', () => {
    const date = new Date('2025-11-27T15:00:00+02:00');
    expect(formatDateInCAT(date, 'MMM d, yyyy')).toBe('27 Nov 2025');
    expect(formatDateInCAT(date, 'h:mm a')).toBe('3pm');
  });
  it('uses the Malawi date across midnight rather than the UTC calendar day', () => {
    expect(formatDateInCAT(new Date('2026-09-20T22:30:00Z'), 'yyyy-MM-dd')).toBe('2026-09-21');
    expect(formatDateInCAT(new Date('2026-09-21T22:30:00+02:00'), 'MMMM d, yyyy')).toBe('21 September 2026');
  });
});

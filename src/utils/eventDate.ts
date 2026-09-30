const timeZone = 'Africa/Blantyre';
// Pattern names are historical; output is British order (27 Nov 2025) and house time style (3pm).
type DatePattern = 'MMM d, yyyy' | 'MMMM d, yyyy' | 'yyyy-MM-dd' | 'h:mm a';

/** Format the actual instant in Malawi, independent of the build/server timezone. */
export function formatDateInCAT(date: Date, pattern: DatePattern): string {
  if (pattern === 'yyyy-MM-dd') {
    const parts = new Intl.DateTimeFormat('en', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
    const value = (type: string) => parts.find(part => part.type === type)?.value;
    return `${value('year')}-${value('month')}-${value('day')}`;
  }
  if (pattern === 'h:mm a') {
    // House style: 9am, 2:30pm, midday (no space, lower case, no :00).
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone, hour: 'numeric', minute: '2-digit', hour12: true }).formatToParts(date);
    const value = (type: string) => parts.find(part => part.type === type)?.value ?? '';
    const hour = value('hour');
    const minute = value('minute');
    const period = value('dayPeriod').toLowerCase().replace(/\./g, '');
    if (hour === '12' && minute === '00') return period === 'pm' ? 'midday' : 'midnight';
    return `${hour}${minute === '00' ? '' : `:${minute}`}${period}`;
  }
  return new Intl.DateTimeFormat('en-GB', { timeZone, month: pattern === 'MMMM d, yyyy' ? 'long' : 'short', day: 'numeric', year: 'numeric' }).format(date);
}

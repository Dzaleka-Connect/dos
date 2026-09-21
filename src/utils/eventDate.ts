const timeZone = 'Africa/Blantyre';
type DatePattern = 'MMM d, yyyy' | 'MMMM d, yyyy' | 'yyyy-MM-dd' | 'h:mm a';

/** Format the actual instant in Malawi, independent of the build/server timezone. */
export function formatDateInCAT(date: Date, pattern: DatePattern): string {
  if (pattern === 'yyyy-MM-dd') {
    const parts = new Intl.DateTimeFormat('en', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
    const value = (type: string) => parts.find(part => part.type === type)?.value;
    return `${value('year')}-${value('month')}-${value('day')}`;
  }
  if (pattern === 'h:mm a') return new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', minute: '2-digit', hour12: true }).format(date);
  return new Intl.DateTimeFormat('en-US', { timeZone, month: pattern === 'MMMM d, yyyy' ? 'long' : 'short', day: 'numeric', year: 'numeric' }).format(date);
}

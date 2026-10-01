/** House style for a 24-hour clock value: "08:00" -> "8am", "13:30" -> "1:30pm", "12:00" -> "midday". */
export function formatClockTime(value?: string): string {
  const match = value?.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return value?.trim() ?? '';
  const hours = Number(match[1]);
  const minutes = match[2];
  if (minutes === '00' && hours === 12) return 'midday';
  if (minutes === '00' && (hours === 0 || hours === 24)) return 'midnight';
  const hour12 = hours % 12 || 12;
  return `${hour12}${minutes === '00' ? '' : `:${minutes}`}${hours < 12 ? 'am' : 'pm'}`;
}

/** An opening-hours span in house style, for example "8am to 6pm". */
export const formatOpeningHours = (open?: string, close?: string) =>
  [formatClockTime(open), formatClockTime(close)].filter(Boolean).join(' to ');

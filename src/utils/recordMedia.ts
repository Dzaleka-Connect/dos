const origin = 'https://services.dzaleka.com';

export function recordImageUrl(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  try {
    const url = new URL(value.trim(), origin);
    if (!['http:', 'https:'].includes(url.protocol)) return undefined;
    return url.origin === origin ? `${url.pathname}${url.search}${url.hash}` : url.href;
  } catch { return undefined; }
}

export function recordImages(...groups: unknown[]): string[] {
  return [...new Set(groups.flat().map(recordImageUrl).filter((url): url is string => Boolean(url)))];
}

export function formatRecordDate(value: unknown): string {
  if (value === undefined || value === null || value === '') return '';
  const text = String(value);
  if (/^\d{4}$/.test(text)) return text;
  if (/^\d{4}-(0[1-9]|1[0-2])$/.test(text)) return new Date(`${text}-01T00:00:00Z`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  if (value instanceof Date || /^\d{4}-\d{2}-\d{2}(T.*)?$/.test(text)) {
    const date = value instanceof Date ? value : new Date(text);
    if (Number.isFinite(date.getTime())) return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  }
  return text;
}

export function recordCoordinates(lat: unknown, lng: unknown): { lat: number; lng: number } | null {
  if (lat === '' || lng === '' || lat == null || lng == null) return null;
  const latitude = Number(lat), longitude = Number(lng);
  return Number.isFinite(latitude) && Number.isFinite(longitude) && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180 ? { lat: latitude, lng: longitude } : null;
}

export function sameRecordValue(a: unknown, b: unknown): boolean {
  return typeof a === 'string' && typeof b === 'string' && Boolean(a.trim()) && a.trim().toLowerCase() === b.trim().toLowerCase();
}

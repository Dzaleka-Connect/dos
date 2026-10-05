export function eventStatus(data, now = new Date()) {
  const override = data.event_status ?? data.status;
  if (override === 'upcoming' || override === 'past') return override;
  if (data.isTBA || /\btba\b/i.test(data.title || '')) return 'upcoming';
  const end = new Date(data.end_date || data.endDate || data.date);
  if (!Number.isFinite(end.getTime())) return 'past';
  const day = date => new Date(date.getTime() + 2 * 3600000).toISOString().slice(0, 10);
  return day(end) >= day(now) ? 'upcoming' : 'past';
}

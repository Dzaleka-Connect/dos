import type { CuratedOpportunity, ExternalOpportunity, ExternalOpportunityStatus, OpportunityStatus } from '../data/grantsPrograms';

// Date-only deadlines include the whole day in Malawi, irrespective of the server timezone.
function deadlineTime(value: string) {
  return Date.parse(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T23:59:59.999+02:00` : value);
}

export function opportunityStatus(item: Pick<CuratedOpportunity, 'status' | 'opensAt' | 'deadline'>, now = new Date()): OpportunityStatus {
  if (item.deadline && now.getTime() > deadlineTime(item.deadline)) return 'closed';
  if (item.status === 'closed') return 'closed';
  if (item.opensAt) return now.getTime() < Date.parse(item.opensAt) ? 'opening soon' : 'open';
  return item.status;
}

export function externalOpportunityStatus(item: Pick<ExternalOpportunity, 'status' | 'deadline'>, now = new Date()): ExternalOpportunityStatus {
  return item.deadline && now.getTime() > deadlineTime(item.deadline) ? 'closed' : item.status;
}

export function formatOpportunityDate(value: string, includeTime = false) {
  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00+02:00` : value);
  if (!Number.isFinite(date.getTime())) return value;
  const formatted = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Blantyre', day: 'numeric', month: 'long', year: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' as const } : {}),
  }).format(date);
  return includeTime ? `${formatted} Malawi time (CAT)` : formatted;
}

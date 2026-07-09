export function formatDate(date?: string | Date): string {
  if (!date) return 'Ongoing';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Ongoing';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(d);
}

export function isJobExpired(deadline?: string | Date): boolean {
  if (!deadline) return false;
  const deadlineDate = new Date(deadline);
  const currentDate = new Date();
  return deadlineDate < currentDate;
}

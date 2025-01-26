export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(d);
}

export function isJobExpired(deadline: string | Date): boolean {
  const deadlineDate = new Date(deadline);
  const currentDate = new Date();
  return deadlineDate < currentDate;
}

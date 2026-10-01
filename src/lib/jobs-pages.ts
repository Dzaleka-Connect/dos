import { isJobExpired } from '../utils/dateHelpers';

export const jobsPageSize = 6;

const isOpen = (job: any) => job.data.status === 'open' && !isJobExpired(job.data.deadline);

export type JobsSort = 'recent' | 'deadline';
export const jobsSort = (value: string | null): JobsSort => (value === 'deadline' ? 'deadline' : 'recent');

const time = (value: unknown, missing: number) => (value ? new Date(value as string).getTime() : missing);

// Open listings first, closed after. Within each, most recent first, or soonest closing date first.
export const sortJobsForListing = (jobs: any[], sort: JobsSort = 'recent') => [...jobs].sort((a, b) => {
  if (isOpen(a) !== isOpen(b)) return isOpen(a) ? -1 : 1;
  if (sort === 'deadline') return time(a.data.deadline, Infinity) - time(b.data.deadline, Infinity);
  return time(b.data.posted, 0) - time(a.data.posted, 0);
});

/** Build the pagination object Astro's paginate() would give, for pages rendered on request. */
export function jobsPage(jobs: any[], currentPage: number, sort: JobsSort = 'recent') {
  const sorted = sortJobsForListing(jobs, sort);
  const lastPage = Math.max(1, Math.ceil(sorted.length / jobsPageSize));
  if (!Number.isInteger(currentPage) || currentPage < 1 || currentPage > lastPage) return null;
  const start = (currentPage - 1) * jobsPageSize;
  const query = sort === 'deadline' ? '?sort=deadline' : '';
  const pageUrl = (n: number) => (n === 1 ? '/jobs' : `/jobs/${n}`) + query;
  return {
    data: sorted.slice(start, start + jobsPageSize), start, end: Math.min(start + jobsPageSize, sorted.length) - 1,
    total: sorted.length, currentPage, lastPage, size: jobsPageSize,
    url: {
      current: pageUrl(currentPage),
      prev: currentPage > 1 ? pageUrl(currentPage - 1) : undefined,
      next: currentPage < lastPage ? pageUrl(currentPage + 1) : undefined,
    },
  };
}

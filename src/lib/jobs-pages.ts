import { isJobExpired } from '../utils/dateHelpers';

export const jobsPageSize = 6;

const isOpen = (job: any) => job.data.status === 'open' && !isJobExpired(job.data.deadline);

// Open listings first, closed after, each by most recent.
export const sortJobsForListing = (jobs: any[]) => [...jobs].sort((a, b) => {
  if (isOpen(a) !== isOpen(b)) return isOpen(a) ? -1 : 1;
  return new Date(b.data.posted).getTime() - new Date(a.data.posted).getTime();
});

/** Build the pagination object Astro's paginate() would give, for pages rendered on request. */
export function jobsPage(jobs: any[], currentPage: number) {
  const sorted = sortJobsForListing(jobs);
  const lastPage = Math.max(1, Math.ceil(sorted.length / jobsPageSize));
  if (!Number.isInteger(currentPage) || currentPage < 1 || currentPage > lastPage) return null;
  const start = (currentPage - 1) * jobsPageSize;
  const pageUrl = (n: number) => (n === 1 ? '/jobs' : `/jobs/${n}`);
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

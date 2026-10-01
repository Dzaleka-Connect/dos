import { describe, expect, it } from 'vitest';
import { jobsPage, jobsSort, sortJobsForListing } from '../src/lib/jobs-pages';

const job = (id: string, posted: string, deadline?: string, status = 'open') => ({ id, data: { status, posted, deadline } });
const jobs = [
  job('old-soon', '2099-01-01', '2099-02-01'),
  job('new-late', '2099-03-01', '2099-12-01'),
  job('no-deadline', '2099-02-01'),
  job('closed', '2099-04-01', '2099-05-01', 'closed'),
  job('mid', '2099-01-15', '2099-06-01'),
  job('a', '2098-01-01', '2099-07-01'), job('b', '2098-01-02', '2099-08-01'), job('c', '2098-01-03', '2099-09-01'),
];

describe('Job board order', () => {
  it('lists open jobs first, by most recent or by soonest closing date', () => {
    expect(sortJobsForListing(jobs).map(j => j.id).slice(0, 3)).toEqual(['new-late', 'no-deadline', 'mid']);
    expect(sortJobsForListing(jobs, 'deadline').map(j => j.id)).toEqual(['old-soon', 'mid', 'a', 'b', 'c', 'new-late', 'no-deadline', 'closed']);
  });

  it('sorts the whole list before splitting it into pages, and keeps the order in page links', () => {
    const first = jobsPage(jobs, 1, 'deadline')!;
    expect(first.data[0].id).toBe('old-soon');
    expect(first.url.next).toBe('/jobs/2?sort=deadline');
    expect(jobsPage(jobs, 2, 'deadline')!.url.prev).toBe('/jobs?sort=deadline');
    expect(jobsPage(jobs, 2)!.url.prev).toBe('/jobs');
  });

  it('ignores unknown sort values', () => {
    expect(jobsSort('deadline')).toBe('deadline');
    expect(jobsSort('<script>')).toBe('recent');
    expect(jobsSort(null)).toBe('recent');
  });
});

/**
 * Calculate pagination data for a given set of items
 * @param currentPage - Current page number (1-indexed)
 * @param totalItems - Total number of items to paginate
 * @param itemsPerPage - Number of items to display per page
 * @returns Pagination data including current page, total pages, indices, and navigation flags
 */
export function getPaginationData(
  currentPage: number,
  totalItems: number,
  itemsPerPage: number
) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return {
    currentPage: validCurrentPage,
    totalPages,
    startIndex,
    endIndex,
    hasNextPage: validCurrentPage < totalPages,
    hasPrevPage: validCurrentPage > 1
  };
}

/**
 * Build a windowed list of page numbers with '...' gaps for pagination UIs,
 * e.g. [1, '...', 4, 5, 6, '...', 12]
 * @param current - Current page number (1-indexed)
 * @param total - Total number of pages
 */
export function getPaginationRange(current: number, total: number): (number | string)[] {
  const delta = 2;
  const range: number[] = [];
  const rangeWithDots: (number | string)[] = [];
  let previous: number | undefined;

  range.push(1);

  if (total <= 1) return range;

  for (let i = current - delta; i <= current + delta; i++) {
    if (i < total && i > 1) {
      range.push(i);
    }
  }

  range.push(total);

  for (const item of range) {
    if (previous) {
      if (item - previous === 2) {
        rangeWithDots.push(previous + 1);
      } else if (item - previous !== 1) {
        rangeWithDots.push('...');
      }
    }

    rangeWithDots.push(item);
    previous = item;
  }

  return rangeWithDots;
}
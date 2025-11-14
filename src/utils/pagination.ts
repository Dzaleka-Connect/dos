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
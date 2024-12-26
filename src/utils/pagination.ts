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
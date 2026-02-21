// TablePagination component for data tables
// Features: Page navigation, page size selection, item count display

import React from 'react'

export interface TablePaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  pageSizeOptions?: number[]
  showPageSizeSelector?: boolean
  showItemCount?: boolean
  compact?: boolean
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSizeSelector = true,
  showItemCount = true,
  compact = false,
}) => {
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const handleFirst = () => {
    onPageChange(1)
  }

  const handleLast = () => {
    onPageChange(totalPages)
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = compact ? 3 : 5
    const halfVisible = Math.floor(maxVisible / 2)

    if (totalPages <= maxVisible + 2) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      let start = Math.max(2, currentPage - halfVisible)
      let end = Math.min(totalPages - 1, currentPage + halfVisible)

      // Adjust if near start or end
      if (currentPage <= halfVisible + 1) {
        end = maxVisible
      } else if (currentPage >= totalPages - halfVisible) {
        start = totalPages - maxVisible + 1
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push('...')
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push('...')
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  const buttonClass = (disabled: boolean) =>
    `px-3 py-1.5 rounded-md font-medium transition-colors ${
      disabled
        ? 'text-gray-400 cursor-not-allowed'
        : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
    } ${compact ? 'text-sm' : 'text-base'}`

  const pageButtonClass = (isActive: boolean) =>
    `px-3 py-1.5 rounded-md font-medium transition-colors ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
    } ${compact ? 'text-sm' : 'text-base'}`

  return (
    <div className={`flex items-center justify-between ${compact ? 'py-2' : 'py-4'} px-4 bg-white border-t border-gray-200`}>
      {/* Left side - Page size selector and item count */}
      <div className="flex items-center space-x-4">
        {showPageSizeSelector && (
          <div className="flex items-center space-x-2">
            <label
              htmlFor="page-size"
              className={`text-gray-700 font-medium ${compact ? 'text-sm' : 'text-base'}`}
            >
              Rows per page:
            </label>
            <select
              id="page-size"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className={`border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                compact ? 'px-2 py-1 text-sm' : 'px-3 py-1.5 text-base'
              }`}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {showItemCount && (
          <span className={`text-gray-600 ${compact ? 'text-sm' : 'text-base'}`}>
            {totalItems === 0 ? (
              'No items'
            ) : (
              <>
                Showing {startItem}-{endItem} of {totalItems}
              </>
            )}
          </span>
        )}
      </div>

      {/* Right side - Page navigation */}
      <div className="flex items-center space-x-1">
        {/* First page button */}
        {!compact && (
          <button
            onClick={handleFirst}
            disabled={currentPage === 1}
            className={buttonClass(currentPage === 1)}
            aria-label="First page"
          >
            ««
          </button>
        )}

        {/* Previous page button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={buttonClass(currentPage === 1)}
          aria-label="Previous page"
        >
          {compact ? '‹' : '‹ Previous'}
        </button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className={`px-2 text-gray-500 ${compact ? 'text-sm' : 'text-base'}`}
                >
                  ...
                </span>
              )
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={pageButtonClass(currentPage === page)}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )
          })}
        </div>

        {/* Next page button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={buttonClass(currentPage === totalPages)}
          aria-label="Next page"
        >
          {compact ? '›' : 'Next ›'}
        </button>

        {/* Last page button */}
        {!compact && (
          <button
            onClick={handleLast}
            disabled={currentPage === totalPages}
            className={buttonClass(currentPage === totalPages)}
            aria-label="Last page"
          >
            »»
          </button>
        )}
      </div>
    </div>
  )
}

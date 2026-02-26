import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const visiblePages = 5;
  const pages: number[] = [];

  const start = Math.max(1, currentPage - Math.floor(visiblePages / 2));
  const end = Math.min(totalPages, start + visiblePages - 1);

  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex justify-center gap-2 mt-4">
      <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
        Prev
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)}>1</button>
          {start > 2 && <span>...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          className={currentPage === page ? "font-bold underline" : ""}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span>...</span>}
          <button onClick={() => onPageChange(totalPages)}>{totalPages}</button>
        </>
      )}

      <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
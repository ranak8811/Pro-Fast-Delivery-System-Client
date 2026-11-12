import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (newSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  className = "",
}) => {
  if (totalItems === 0) return null;

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  // Generate page numbers with ellipsis window
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (page >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  const pages = getPageNumbers();

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border-t border-slate-100 text-sm text-slate-600 select-none ${className}`}
    >
      {/* Left side: Item count info & page size selector */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-800">{startItem}</span> to{" "}
          <span className="font-semibold text-slate-800">{endItem}</span> of{" "}
          <span className="font-semibold text-slate-800">{totalItems}</span> entries
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="select select-xs select-bordered bg-slate-50 border-slate-200 text-slate-700 font-medium rounded-lg focus:outline-none focus:border-[#20363A]"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <span>per page</span>
          </div>
        )}
      </div>

      {/* Right side: Page navigation */}
      <div className="flex items-center gap-1">
        {/* Prev button */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          aria-label="Previous page"
        >
          <FaChevronLeft className="text-xs" />
        </button>

        {/* Page buttons */}
        {pages.map((p, idx) => {
          if (p === "...") {
            return (
              <span key={`dots-${idx}`} className="w-8 h-8 flex items-center justify-center text-slate-400">
                ...
              </span>
            );
          }

          const pageNum = Number(p);
          const isActive = pageNum === page;

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "bg-[#20363A] text-white shadow-sm shadow-[#20363A]/30 scale-105"
                  : "border border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next button */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          aria-label="Next page"
        >
          <FaChevronRight className="text-xs" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;

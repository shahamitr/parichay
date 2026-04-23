'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  showInfo?: boolean;
  showPageSize?: boolean;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  siblingCount?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'simple';
}

// =============================================================================
// PAGINATION COMPONENT
// =============================================================================
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize = 10,
  showInfo = true,
  showPageSize = false,
  pageSizeOptions = [10, 25, 50, 100],
  onPageSizeChange,
  siblingCount = 1,
  className,
  size = 'md',
  variant = 'default',
}: PaginationProps) {
  // Generate page numbers to show
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const totalNumbers = siblingCount * 2 + 3; // siblings + current + first + last
    const totalBlocks = totalNumbers + 2; // + 2 for ellipsis

    if (totalPages <= totalBlocks) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

      const showLeftEllipsis = leftSiblingIndex > 2;
      const showRightEllipsis = rightSiblingIndex < totalPages - 1;

      if (!showLeftEllipsis && showRightEllipsis) {
        // Show more pages on the left
        const leftItemCount = 3 + 2 * siblingCount;
        for (let i = 1; i <= leftItemCount; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (showLeftEllipsis && !showRightEllipsis) {
        // Show more pages on the right
        pages.push(1);
        pages.push('ellipsis');
        const rightItemCount = 3 + 2 * siblingCount;
        for (let i = totalPages - rightItemCount + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else if (showLeftEllipsis && showRightEllipsis) {
        // Show ellipsis on both sides
        pages.push(1);
        pages.push('ellipsis');
        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const sizeStyles = {
    sm: {
      button: 'w-7 h-7 text-xs',
      icon: 'w-3 h-3',
      text: 'text-xs',
    },
    md: {
      button: 'w-9 h-9 text-sm',
      icon: 'w-4 h-4',
      text: 'text-sm',
    },
    lg: {
      button: 'w-11 h-11 text-base',
      icon: 'w-5 h-5',
      text: 'text-base',
    },
  };

  const styles = sizeStyles[size];

  // Calculate info text
  const startItem = totalItems ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = totalItems ? Math.min(currentPage * pageSize, totalItems) : 0;

  // Minimal variant - just prev/next with page info
  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center justify-between gap-4', className)}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 rounded-lg text-neutral-600 dark:text-neutral-400',
            'hover:bg-neutral-100 dark:hover:bg-neutral-700',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            styles.text
          )}
        >
          <ChevronLeft className={styles.icon} />
          Previous
        </button>
        <span className={cn('text-neutral-600 dark:text-neutral-400', styles.text)}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 rounded-lg text-neutral-600 dark:text-neutral-400',
            'hover:bg-neutral-100 dark:hover:bg-neutral-700',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            styles.text
          )}
        >
          Next
          <ChevronRight className={styles.icon} />
        </button>
      </div>
    );
  }

  // Simple variant - prev/next buttons only
  if (variant === 'simple') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'flex items-center justify-center rounded-lg border border-neutral-300 dark:border-neutral-600',
            'text-neutral-600 dark:text-neutral-400',
            'hover:bg-neutral-100 dark:hover:bg-neutral-700',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            styles.button
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className={styles.icon} />
        </button>
        <span className={cn('px-3 text-neutral-600 dark:text-neutral-400', styles.text)}>
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'flex items-center justify-center rounded-lg border border-neutral-300 dark:border-neutral-600',
            'text-neutral-600 dark:text-neutral-400',
            'hover:bg-neutral-100 dark:hover:bg-neutral-700',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            styles.button
          )}
          aria-label="Next page"
        >
          <ChevronRight className={styles.icon} />
        </button>
      </div>
    );
  }

  // Default variant - full pagination
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-4',
        className
      )}
    >
      {/* Info text */}
      {showInfo && totalItems !== undefined && (
        <div className={cn('text-neutral-600 dark:text-neutral-400', styles.text)}>
          Showing <span className="font-medium">{startItem}</span> to{' '}
          <span className="font-medium">{endItem}</span> of{' '}
          <span className="font-medium">{totalItems}</span> results
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* Page size selector */}
        {showPageSize && onPageSizeChange && (
          <div className={cn('flex items-center gap-2', styles.text)}>
            <span className="text-neutral-600 dark:text-neutral-400">Show</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className={cn(
                'px-2 py-1 border border-neutral-300 dark:border-neutral-600 rounded-lg',
                'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100',
                'focus:outline-none focus:ring-2 focus:ring-primary-500',
                styles.text
              )}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Navigation buttons */}
        <nav className="flex items-center gap-1" aria-label="Pagination">
          {/* First page */}
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={cn(
              'flex items-center justify-center rounded-lg',
              'text-neutral-600 dark:text-neutral-400',
              'hover:bg-neutral-100 dark:hover:bg-neutral-700',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              styles.button
            )}
            aria-label="Go to first page"
          >
            <ChevronsLeft className={styles.icon} />
          </button>

          {/* Previous page */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={cn(
              'flex items-center justify-center rounded-lg',
              'text-neutral-600 dark:text-neutral-400',
              'hover:bg-neutral-100 dark:hover:bg-neutral-700',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              styles.button
            )}
            aria-label="Go to previous page"
          >
            <ChevronLeft className={styles.icon} />
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => {
              if (page === 'ellipsis') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className={cn(
                      'flex items-center justify-center text-neutral-400',
                      styles.button
                    )}
                  >
                    <MoreHorizontal className={styles.icon} />
                  </span>
                );
              }

              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={cn(
                    'flex items-center justify-center rounded-lg font-medium transition-colors',
                    styles.button,
                    currentPage === page
                      ? 'bg-primary-600 text-white'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  )}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Next page */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={cn(
              'flex items-center justify-center rounded-lg',
              'text-neutral-600 dark:text-neutral-400',
              'hover:bg-neutral-100 dark:hover:bg-neutral-700',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              styles.button
            )}
            aria-label="Go to next page"
          >
            <ChevronRight className={styles.icon} />
          </button>

          {/* Last page */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={cn(
              'flex items-center justify-center rounded-lg',
              'text-neutral-600 dark:text-neutral-400',
              'hover:bg-neutral-100 dark:hover:bg-neutral-700',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              styles.button
            )}
            aria-label="Go to last page"
          >
            <ChevronsRight className={styles.icon} />
          </button>
        </nav>
      </div>
    </div>
  );
}

// =============================================================================
// PAGINATION HOOK
// =============================================================================
interface UsePaginationOptions {
  totalItems: number;
  initialPage?: number;
  initialPageSize?: number;
}

export function usePagination({
  totalItems,
  initialPage = 1,
  initialPageSize = 10,
}: UsePaginationOptions) {
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const [pageSize, setPageSize] = React.useState(initialPageSize);

  const totalPages = Math.ceil(totalItems / pageSize);

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const changePageSize = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page
  };

  // Calculate slice indices
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  return {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    changePageSize,
  };
}

export default Pagination;

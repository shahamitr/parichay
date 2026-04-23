'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Check,
  MoreHorizontal,
  Search,
  Filter,
  X,
  Download,
  Trash2,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Checkbox } from './FormField';
import { Skeleton } from './Loading';

// =============================================================================
// TYPES
// =============================================================================
type SortDirection = 'asc' | 'desc' | null;

export interface Column<T> {
  id?: string;
  key?: string; // Alias for id
  header: string | React.ReactNode;
  accessorKey?: keyof T;
  accessorFn?: (row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  minWidth?: string;
  align?: 'left' | 'center' | 'right';
  cell?: (row: T, index: number) => React.ReactNode;
  render?: (row: T, index: number) => React.ReactNode; // Alias for cell
  headerClassName?: string;
  cellClassName?: string;
}

export interface BulkAction<T> {
  id?: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (selectedRows: T[]) => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;

  // Selection
  selectable?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (rows: T[]) => void;

  // Sorting
  sortable?: boolean;
  defaultSort?: { column: string; direction: SortDirection };
  onSort?: (column: string, direction: SortDirection) => void;

  // Pagination
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  currentPage?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;

  // Search & Filter
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;

  // Bulk Actions
  bulkActions?: BulkAction<T>[];

  // Row Actions
  rowActions?: (row: T) => React.ReactNode;
  onRowClick?: (row: T) => void;

  // States
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;

  // Styling
  className?: string;
  compact?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
}

// =============================================================================
// DATATABLE COMPONENT
// =============================================================================
export function DataTable<T extends object>({
  data,
  columns,
  keyField,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  sortable = true,
  defaultSort,
  onSort,
  pagination = true,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  currentPage: controlledPage,
  totalItems,
  onPageChange,
  onPageSizeChange,
  searchable = true,
  searchPlaceholder = 'Search...',
  onSearch,
  bulkActions = [],
  rowActions,
  onRowClick,
  loading = false,
  emptyMessage = 'No data found',
  emptyIcon,
  className,
  compact = false,
  striped = true,
  hoverable = true,
  bordered = false,
}: DataTableProps<T>) {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    column: string;
    direction: SortDirection;
  }>(defaultSort || { column: '', direction: null });
  const [internalPage, setInternalPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(initialPageSize);

  const page = controlledPage ?? internalPage;
  const pageSize = internalPageSize;

  // Selection handlers
  const isAllSelected = useMemo(
    () => data.length > 0 && selectedRows.length === data.length,
    [data.length, selectedRows.length]
  );

  const isIndeterminate = useMemo(
    () => selectedRows.length > 0 && selectedRows.length < data.length,
    [selectedRows.length, data.length]
  );

  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      onSelectionChange?.([]);
    } else {
      onSelectionChange?.(data);
    }
  }, [isAllSelected, data, onSelectionChange]);

  const handleSelectRow = useCallback(
    (row: T) => {
      const isSelected = selectedRows.some(
        (r) => r[keyField] === row[keyField]
      );
      if (isSelected) {
        onSelectionChange?.(
          selectedRows.filter((r) => r[keyField] !== row[keyField])
        );
      } else {
        onSelectionChange?.([...selectedRows, row]);
      }
    },
    [selectedRows, keyField, onSelectionChange]
  );

  const isRowSelected = useCallback(
    (row: T) => selectedRows.some((r) => r[keyField] === row[keyField]),
    [selectedRows, keyField]
  );

  // Sort handler
  const handleSort = useCallback(
    (columnId: string) => {
      let direction: SortDirection = 'asc';
      if (sortConfig.column === columnId) {
        if (sortConfig.direction === 'asc') direction = 'desc';
        else if (sortConfig.direction === 'desc') direction = null;
      }
      setSortConfig({ column: columnId, direction });
      onSort?.(columnId, direction);
    },
    [sortConfig, onSort]
  );

  // Search handler
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      onSearch?.(query);
      if (!controlledPage) setInternalPage(1);
    },
    [onSearch, controlledPage]
  );

  // Pagination handlers
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (controlledPage !== undefined) {
        onPageChange?.(newPage);
      } else {
        setInternalPage(newPage);
      }
    },
    [controlledPage, onPageChange]
  );

  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      setInternalPageSize(newSize);
      onPageSizeChange?.(newSize);
      if (!controlledPage) setInternalPage(1);
    },
    [onPageSizeChange, controlledPage]
  );

  // Calculate pagination
  const total = totalItems ?? data.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);

  // Get cell value
  const getCellValue = (row: T, column: Column<T>, index: number = 0): React.ReactNode => {
    if (column.cell) return column.cell(row, index);
    if (column.render) return column.render(row, index); // Alias support
    if (column.accessorFn) return column.accessorFn(row);
    if (column.accessorKey) return row[column.accessorKey] as React.ReactNode;
    return null;
  };

  // Get column id
  const getColumnId = (column: Column<T>): string => column.id || column.key || '';

  // Render sort icon
  const renderSortIcon = (columnId: string) => {
    if (sortConfig.column !== columnId) {
      return <ChevronsUpDown className="w-4 h-4 text-neutral-400" />;
    }
    if (sortConfig.direction === 'asc') {
      return <ChevronUp className="w-4 h-4 text-primary-600" />;
    }
    if (sortConfig.direction === 'desc') {
      return <ChevronDown className="w-4 h-4 text-primary-600" />;
    }
    return <ChevronsUpDown className="w-4 h-4 text-neutral-400" />;
  };

  return (
    <div className={cn('bg-white dark:bg-neutral-800 rounded-xl shadow-sm overflow-hidden', className)}>
      {/* Toolbar */}
      <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          {/* Search */}
          {searchable && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Bulk Actions */}
          {selectedRows.length > 0 && bulkActions.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {selectedRows.length} selected
              </span>
              <div className="flex items-center gap-1">
                {bulkActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => action.onClick(selectedRows)}
                    disabled={action.disabled}
                    className={cn(
                      'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5',
                      action.variant === 'danger'
                        ? 'text-error-600 hover:bg-error-50 dark:hover:bg-error-900/20'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700',
                      action.disabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {action.icon}
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-900/50">
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <Checkbox
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={getColumnId(column)}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider',
                    column.headerClassName,
                    column.sortable !== false && sortable && 'cursor-pointer select-none hover:bg-neutral-100 dark:hover:bg-neutral-800',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right'
                  )}
                  style={{ width: column.width, minWidth: column.minWidth }}
                  onClick={() =>
                    column.sortable !== false && sortable && handleSort(getColumnId(column))
                  }
                >
                  <div className="flex items-center gap-1.5">
                    {column.header}
                    {column.sortable !== false && sortable && renderSortIcon(getColumnId(column))}
                  </div>
                </th>
              ))}
              {rowActions && <th className="w-12 px-4 py-3" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {loading ? (
              // Loading skeleton
              Array.from({ length: pageSize }).map((_, i) => (
                <tr key={i}>
                  {selectable && (
                    <td className="px-4 py-3">
                      <Skeleton className="w-5 h-5" />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={getColumnId(column)} className="px-4 py-3">
                      <Skeleton className="h-4 w-3/4" />
                    </td>
                  ))}
                  {rowActions && (
                    <td className="px-4 py-3">
                      <Skeleton className="w-8 h-8" />
                    </td>
                  )}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty state
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)}
                  className="px-4 py-12 text-center"
                >
                  <div className="flex flex-col items-center">
                    {emptyIcon || (
                      <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-neutral-400" />
                      </div>
                    )}
                    <p className="text-neutral-500 dark:text-neutral-400">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Data rows
              data.map((row, rowIndex) => (
                <tr
                  key={String(row[keyField])}
                  className={cn(
                    'transition-colors',
                    striped && rowIndex % 2 === 1 && 'bg-neutral-50/50 dark:bg-neutral-900/30',
                    hoverable && 'hover:bg-neutral-50 dark:hover:bg-neutral-900/50',
                    isRowSelected(row) && 'bg-primary-50 dark:bg-primary-900/20',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={isRowSelected(row)}
                        onChange={() => handleSelectRow(row)}
                        aria-label={`Select row ${rowIndex + 1}`}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={getColumnId(column)}
                      className={cn(
                        compact ? 'px-4 py-2' : 'px-4 py-3',
                        'text-sm text-neutral-900 dark:text-neutral-100',
                        column.cellClassName,
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right'
                      )}
                    >
                      {getCellValue(row, column)}
                    </td>
                  ))}
                  {rowActions && (
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {rowActions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && !loading && data.length > 0 && (
        <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
            {/* Page size selector */}
            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="px-2 py-1 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span>entries</span>
            </div>

            {/* Info */}
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              Showing {startIndex + 1} to {endIndex} of {total} entries
            </div>

            {/* Page buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(1)}
                disabled={page === 1}
                className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="First page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={cn(
                      'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                      page === pageNum
                        ? 'bg-primary-600 text-white'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={page === totalPages}
                className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Last page"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// ROW ACTIONS DROPDOWN
// =============================================================================
interface RowAction {
  id?: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'default' | 'danger' | 'warning';
  disabled?: boolean;
}

interface RowActionsDropdownProps {
  actions: RowAction[];
}

export function RowActionsDropdown({ actions }: RowActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-700"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 z-20 py-1">
            {actions.map((action, index) => {
              const className = cn(
                'w-full px-4 py-2 text-sm text-left flex items-center gap-2 transition-colors',
                action.variant === 'danger'
                  ? 'text-error-600 hover:bg-error-50 dark:hover:bg-error-900/20'
                  : action.variant === 'warning'
                  ? 'text-warning-600 hover:bg-warning-50 dark:hover:bg-warning-900/20'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700',
                action.disabled && 'opacity-50 cursor-not-allowed'
              );

              if (action.href) {
                return (
                  <a
                    key={action.id || index}
                    href={action.href}
                    className={className}
                    onClick={() => setIsOpen(false)}
                  >
                    {action.icon}
                    {action.label}
                  </a>
                );
              }

              return (
                <button
                  key={action.id || index}
                  onClick={() => {
                    action.onClick?.();
                    setIsOpen(false);
                  }}
                  disabled={action.disabled}
                  className={className}
                >
                  {action.icon}
                  {action.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// =============================================================================
// STATUS BADGE HELPER
// =============================================================================
interface StatusBadgeProps {
  status: 'default' | 'success' | 'warning' | 'error' | 'info';
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export function StatusBadge({ status, label, variant }: StatusBadgeProps) {
  const effectiveVariant = variant || status;
  const variants = {
    default: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300',
    success: 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400',
    warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400',
    error: 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-400',
    info: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[effectiveVariant]
      )}
    >
      {label}
    </span>
  );
}

export default DataTable;

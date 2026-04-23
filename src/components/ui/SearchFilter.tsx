'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  Calendar,
  Check,
  SlidersHorizontal,
} from 'lucide-react';

// =============================================================================
// SEARCH INPUT
// =============================================================================
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounce?: number;
  autoFocus?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClear?: () => void;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className,
  debounce = 300,
  autoFocus = false,
  size = 'md',
  onClear,
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        onChange(newValue);
      }, debounce);
    },
    [onChange, debounce]
  );

  const handleClear = useCallback(() => {
    setLocalValue('');
    onChange('');
    onClear?.();
  }, [onChange, onClear]);

  const sizeStyles = {
    sm: 'h-8 text-sm pl-8 pr-8',
    md: 'h-10 text-sm pl-10 pr-10',
    lg: 'h-12 text-base pl-12 pr-12',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const iconLeft = {
    sm: 'left-2.5',
    md: 'left-3',
    lg: 'left-4',
  };

  const iconRight = {
    sm: 'right-2.5',
    md: 'right-3',
    lg: 'right-4',
  };

  return (
    <div className={cn('relative', className)}>
      <Search
        className={cn(
          'absolute top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500',
          iconSizes[size],
          iconLeft[size]
        )}
      />
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          'w-full rounded-lg border border-neutral-300 dark:border-neutral-600',
          'bg-white dark:bg-neutral-800',
          'text-neutral-900 dark:text-neutral-100 placeholder-neutral-400',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'transition-colors',
          sizeStyles[size]
        )}
      />
      {localValue && (
        <button
          onClick={handleClear}
          className={cn(
            'absolute top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300',
            iconRight[size]
          )}
        >
          <X className={iconSizes[size]} />
        </button>
      )}
    </div>
  );
}

// =============================================================================
// FILTER DROPDOWN
// =============================================================================
interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export function FilterDropdown({
  label,
  options,
  value,
  onChange,
  multiple = false,
  className,
  icon,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
  const hasSelection = selectedValues.length > 0;

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange(newValues);
    } else {
      onChange(optionValue === value ? '' : optionValue);
      setIsOpen(false);
    }
  };

  const getDisplayText = () => {
    if (!hasSelection) return label;
    if (selectedValues.length === 1) {
      return options.find((o) => o.value === selectedValues[0])?.label || label;
    }
    return `${label} (${selectedValues.length})`;
  };

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors',
          hasSelection
            ? 'bg-primary-50 border-primary-300 text-primary-700 dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-400'
            : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300',
          'hover:bg-neutral-50 dark:hover:bg-neutral-700'
        )}
      >
        {icon || <Filter className="w-4 h-4" />}
        <span>{getDisplayText()}</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 transition-transform',
            isOpen && 'transform rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 z-50 py-1 max-h-64 overflow-auto">
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  'w-full px-3 py-2 text-sm text-left flex items-center justify-between',
                  'hover:bg-neutral-100 dark:hover:bg-neutral-700',
                  isSelected && 'bg-primary-50 dark:bg-primary-900/20'
                )}
              >
                <span
                  className={cn(
                    isSelected
                      ? 'text-primary-700 dark:text-primary-400 font-medium'
                      : 'text-neutral-700 dark:text-neutral-300'
                  )}
                >
                  {option.label}
                </span>
                <div className="flex items-center gap-2">
                  {option.count !== undefined && (
                    <span className="text-xs text-neutral-400">{option.count}</span>
                  )}
                  {isSelected && <Check className="w-4 h-4 text-primary-600" />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// DATE RANGE PICKER
// =============================================================================
interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
  className?: string;
  presets?: { label: string; start: string; end: string }[];
}

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  className,
  presets,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const displayText = startDate && endDate
    ? `${formatDate(startDate)} - ${formatDate(endDate)}`
    : 'Select dates';

  const defaultPresets = [
    {
      label: 'Today',
      start: new Date().toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
    },
    {
      label: 'Last 7 days',
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
    },
    {
      label: 'Last 30 days',
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
    },
    {
      label: 'Last 90 days',
      start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
    },
    {
      label: 'This month',
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
    },
    {
      label: 'Last month',
      start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().split('T')[0],
      end: new Date(new Date().getFullYear(), new Date().getMonth(), 0).toISOString().split('T')[0],
    },
  ];

  const datePresets = presets || defaultPresets;

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors',
          'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600',
          'text-neutral-700 dark:text-neutral-300',
          'hover:bg-neutral-50 dark:hover:bg-neutral-700'
        )}
      >
        <Calendar className="w-4 h-4" />
        <span>{displayText}</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 transition-transform',
            isOpen && 'transform rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 z-50 p-4 min-w-[320px]">
          {/* Presets */}
          <div className="mb-4">
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
              Quick Select
            </p>
            <div className="flex flex-wrap gap-2">
              {datePresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    onChange(preset.start, preset.end);
                    setIsOpen(false);
                  }}
                  className="px-2.5 py-1 text-xs rounded-md bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom dates */}
          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
              Custom Range
            </p>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => onChange(e.target.value, endDate)}
                className="flex-1 px-2 py-1.5 text-sm border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-neutral-400">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onChange(startDate, e.target.value)}
                className="flex-1 px-2 py-1.5 text-sm border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Apply button */}
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => {
                onChange('', '');
                setIsOpen(false);
              }}
              className="px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md"
            >
              Clear
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// FILTER BAR
// =============================================================================
interface FilterBarProps {
  children: React.ReactNode;
  className?: string;
  onClearAll?: () => void;
  activeFilters?: number;
}

export function FilterBar({
  children,
  className,
  onClearAll,
  activeFilters = 0,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg',
        className
      )}
    >
      <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
        <SlidersHorizontal className="w-4 h-4" />
        <span>Filters</span>
        {activeFilters > 0 && (
          <span className="px-1.5 py-0.5 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full">
            {activeFilters}
          </span>
        )}
      </div>
      <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-600" />
      <div className="flex flex-wrap items-center gap-2">{children}</div>
      {activeFilters > 0 && onClearAll && (
        <>
          <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-600" />
          <button
            onClick={onClearAll}
            className="text-sm text-error-600 dark:text-error-400 hover:underline"
          >
            Clear all
          </button>
        </>
      )}
    </div>
  );
}

// =============================================================================
// ACTIVE FILTER TAGS
// =============================================================================
interface ActiveFilterTagsProps {
  filters: { key: string; label: string; value: string }[];
  onRemove: (key: string) => void;
  className?: string;
}

export function ActiveFilterTags({
  filters,
  onRemove,
  className,
}: ActiveFilterTagsProps) {
  if (filters.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {filters.map((filter) => (
        <span
          key={filter.key}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full"
        >
          <span className="text-primary-500">{filter.label}:</span>
          <span className="font-medium">{filter.value}</span>
          <button
            onClick={() => onRemove(filter.key)}
            className="ml-0.5 hover:text-primary-900 dark:hover:text-primary-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      ))}
    </div>
  );
}

// =============================================================================
// USE FILTERS HOOK
// =============================================================================
interface FilterState {
  [key: string]: string | string[] | undefined;
}

export function useFilters<T extends FilterState>(initialFilters: T) {
  const [filters, setFilters] = useState<T>(initialFilters);

  const setFilter = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const clearFilter = useCallback(<K extends keyof T>(key: K) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)
  ).length;

  return {
    filters,
    setFilter,
    clearFilter,
    clearAllFilters,
    activeFilterCount,
  };
}

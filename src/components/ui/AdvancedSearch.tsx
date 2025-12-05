'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Filter, X, Calendar, Tag, User, Building, MapPin, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchFilter {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between';
  value: string | string[];
  label: string;
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilter[]) => void;
  placeholder?: string;
  filterOptions?: {
    field: string;
    label: string;
    type: 'text' | 'select' | 'date' | 'number';
    options?: { value: string; label: string }[];
  }[];
  className?: string;
}

export default function AdvancedSearch({
  onSearch,
  placeholder = 'Search...',
  filterOptions = [],
  className,
}: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilter[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilterField, setActiveFilterField] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Default filter options if none provided
  const defaultFilterOptions = [
    { field: 'name', label: 'Name', type: 'text' as const },
    { field: 'email', label: 'Email', type: 'text' as const },
    { field: 'status', label: 'Status', type: 'select' as const, options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' },
    ]},
    { field: 'createdAt', label: 'Created Date', type: 'date' as const },
    { field: 'company', label: 'Company', type: 'text' as const },
    { field: 'location', label: 'Location', type: 'text' as const },
  ];

  const options = filterOptions.length > 0 ? filterOptions : defaultFilterOptions;

  // Add filter
  const addFilter = (field: string) => {
    const option = options.find(opt => opt.field === field);
    if (!option) return;

    const newFilter: SearchFilter = {
      field,
      operator: 'contains',
      value: '',
      label: option.label,
    };

    setFilters([...filters, newFilter]);
    setActiveFilterField(field);
  };

  // Update filter
  const updateFilter = (index: number, updates: Partial<SearchFilter>) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], ...updates };
    setFilters(newFilters);
  };

  // Remove filter
  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters([]);
    setQuery('');
  };

  // Execute search
  const executeSearch = () => {
    onSearch(query, filters);
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  // Close filters on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-search on filter change
  useEffect(() => {
    if (filters.length > 0 || query) {
      const debounce = setTimeout(() => {
        executeSearch();
      }, 500);
      return () => clearTimeout(debounce);
    }
  }, [query, filters]);

  return (
    <div ref={searchRef} className={cn('relative', className)}>
      {/* Main Search Bar */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex items-center gap-2 px-4 py-3 rounded-xl border transition-all',
            showFilters || filters.length > 0
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          )}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="hidden sm:inline">Filters</span>
          {filters.length > 0 && (
            <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
              {filters.length}
            </span>
          )}
        </button>
      </div>

      {/* Active Filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filters.map((filter, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm"
            >
              <span className="font-medium text-blue-700 dark:text-blue-300">
                {filter.label}:
              </span>
              <span className="text-blue-600 dark:text-blue-400">
                {Array.isArray(filter.value) ? filter.value.join(', ') : filter.value}
              </span>
              <button
                onClick={() => removeFilter(index)}
                className="p-0.5 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full transition-colors"
              >
                <X className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              </button>
            </div>
          ))}
          <button
            onClick={clearAllFilters}
            className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Add Filters</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {options.map((option) => {
              const isActive = filters.some(f => f.field === option.field);
              return (
                <button
                  key={option.field}
                  onClick={() => !isActive && addFilter(option.field)}
                  disabled={isActive}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all',
                    isActive
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300'
                  )}
                >
                  {option.type === 'date' && <Calendar className="w-4 h-4" />}
                  {option.type === 'select' && <Tag className="w-4 h-4" />}
                  {option.field === 'name' && <User className="w-4 h-4" />}
                  {option.field === 'company' && <Building className="w-4 h-4" />}
                  {option.field === 'location' && <MapPin className="w-4 h-4" />}
                  {option.type === 'text' && !['name', 'company', 'location'].includes(option.field) && <Filter className="w-4 h-4" />}
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>

          {/* Filter Value Inputs */}
          {filters.map((filter, index) => {
            const option = options.find(opt => opt.field === filter.field);
            if (!option) return null;

            return (
              <div key={index} className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {option.label}
                  </label>
                  <button
                    onClick={() => removeFilter(index)}
                    className="text-xs text-red-600 dark:text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                </div>

                {option.type === 'select' && option.options ? (
                  <select
                    value={filter.value as string}
                    onChange={(e) => updateFilter(index, { value: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select...</option>
                    {option.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={option.type}
                    value={filter.value as string}
                    onChange={(e) => updateFilter(index, { value: e.target.value })}
                    placeholder={`Enter ${option.label.toLowerCase()}...`}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

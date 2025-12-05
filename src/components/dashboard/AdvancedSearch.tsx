'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, Calendar, Tag, User, Building, MapPin, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchFilter {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between';
  value: string | string[];
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilter[]) => void;
  placeholder?: string;
  availableFilters?: {
    field: string;
    label: string;
    type: 'text' | 'date' | 'select' | 'number';
    options?: { value: string; label: string }[];
  }[];
}

export default function AdvancedSearch({
  onSearch,
  placeholder = 'Search...',
  availableFilters = [],
}: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilter[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilterField, setActiveFilterField] = useState<string | null>(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query, filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, filters, onSearch]);

  const addFilter = (field: string) => {
    const newFilter: SearchFilter = {
      field,
      operator: 'contains',
      value: '',
    };
    setFilters([...filters, newFilter]);
    setActiveFilterField(field);
  };

  const updateFilter = (index: number, updates: Partial<SearchFilter>) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], ...updates };
    setFilters(newFilters);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setQuery('');
    setFilters([]);
  };

  return (
    <div className="w-full space-y-3">
      {/* Main Search Bar */}
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 rounded-lg border transition-all',
              showFilters || filters.length > 0
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            )}
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
            {filters.length > 0 && (
              <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                {filters.length}
              </span>
            )}
          </button>

          {(query || filters.length > 0) && (
            <button
              onClick={clearAll}
              className="px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter, index) => {
            const filterConfig = availableFilters.find((f) => f.field === filter.field);
            return (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm"
              >
                <span className="font-medium text-blue-700 dark:text-blue-300">
                  {filterConfig?.label || filter.field}
                </span>
                <span className="text-blue-600 dark:text-blue-400">{filter.operator}</span>
                <span className="text-blue-900 dark:text-blue-100">
                  {Array.isArray(filter.value) ? filter.value.join(', ') : filter.value}
                </span>
                <button
                  onClick={() => removeFilter(index)}
                  className="p-0.5 hover:bg-blue-100 dark:hover:bg-blue-800 rounded"
                >
                  <X className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Advanced Filters</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Available Filters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {availableFilters.map((filter) => (
              <button
                key={filter.field}
                onClick={() => addFilter(filter.field)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-sm transition-colors"
              >
                {filter.field === 'date' && <Calendar className="w-4 h-4" />}
                {filter.field === 'user' && <User className="w-4 h-4" />}
                {filter.field === 'brand' && <Building className="w-4 h-4" />}
                {filter.field === 'location' && <MapPin className="w-4 h-4" />}
                {filter.field === 'tag' && <Tag className="w-4 h-4" />}
                <span>{filter.label}</span>
              </button>
            ))}
          </div>

          {/* Filter Inputs */}
          {filters.map((filter, index) => {
            const filterConfig = availableFilters.find((f) => f.field === filter.field);
            if (!filterConfig) return null;

            return (
              <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <select
                  value={filter.operator}
                  onChange={(e) =>
                    updateFilter(index, { operator: e.target.value as SearchFilter['operator'] })
                  }
                  className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                >
                  <option value="equals">Equals</option>
                  <option value="contains">Contains</option>
                  <option value="startsWith">Starts with</option>
                  <option value="endsWith">Ends with</option>
                  {filterConfig.type === 'number' && (
                    <>
                      <option value="greaterThan">Greater than</option>
                      <option value="lessThan">Less than</option>
                    </>
                  )}
                </select>

                {filterConfig.type === 'select' && filterConfig.options ? (
                  <select
                    value={filter.value as string}
                    onChange={(e) => updateFilter(index, { value: e.target.value })}
                    className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                  >
                    <option value="">Select...</option>
                    {filterConfig.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={filterConfig.type}
                    value={filter.value as string}
                    onChange={(e) => updateFilter(index, { value: e.target.value })}
                    placeholder={`Enter ${filterConfig.label.toLowerCase()}...`}
                    className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                  />
                )}

                <button
                  onClick={() => removeFilter(index)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

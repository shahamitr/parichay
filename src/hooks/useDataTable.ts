import { useState, useEffect, useCallback } from 'react';

interface UseDataTableProps {
  apiEndpoint: string;
  initialLimit?: number;
  initialSort?: { field: string; order: 'asc' | 'desc' };
  initialFilters?: Record<string, string>;
}

interface UseDataTableReturn<T = any> {
  data: T[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
  };
  search: {
    query: string;
    onSearch: (query: string) => void;
  };
  sorting: {
    field: string;
    order: 'asc' | 'desc';
    onSort: (field: string, order: 'asc' | 'desc') => void;
  };
  filters: {
    values: Record<string, string>;
    setFilter: (key: string, value: string) => void;
    clearFilters: () => void;
  };
  refetch: () => Promise<void>;
}

export function useDataTable<T = any>({
  apiEndpoint,
  initialLimit = 10,
  initialSort,
  initialFilters = {},
}: UseDataTableProps): UseDataTableReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState(initialSort?.field || '');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSort?.order || 'asc');
  const [filterValues, setFilterValues] = useState<Record<string, string>>(initialFilters);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(sortField && { sortBy: sortField, sortOrder }),
      });

      // Add active filters to params
      for (const [key, value] of Object.entries(filterValues)) {
        if (value) params.set(key, value);
      }

      const response = await fetch(`${apiEndpoint}?${params}`, {
        credentials: 'include', // Use HTTP-only cookies for auth
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Session expired. Please log in again.');
          setData([]);
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed (${response.status})`);
      }

      const result = await response.json();
      setData(result.data || result.items || result.users || []);
      setTotal(result.total || result.count || 0);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(message);
      console.error('useDataTable fetch error:', message);
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint, page, limit, search, sortField, sortOrder, filterValues]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleLimitChange = (newLimit: number) => { setLimit(newLimit); setPage(1); };
  const handleSearch = (query: string) => { setSearch(query); setPage(1); };
  const handleSort = (field: string, order: 'asc' | 'desc') => {
    setSortField(field);
    setSortOrder(order);
    setPage(1);
  };
  const setFilter = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };
  const clearFilters = () => { setFilterValues({}); setPage(1); };

  return {
    data,
    loading,
    error,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      onPageChange: handlePageChange,
      onLimitChange: handleLimitChange,
    },
    search: { query: search, onSearch: handleSearch },
    sorting: { field: sortField, order: sortOrder, onSort: handleSort },
    filters: { values: filterValues, setFilter, clearFilters },
    refetch: fetchData,
  };
}

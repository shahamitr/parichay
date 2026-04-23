import { useState, useEffect, useCallback } from 'react';

interface UseDataTableProps {
  apiEndpoint: string;
  initialLimit?: number;
  initialSort?: { field: string; order: 'asc' | 'desc' };
}

export function useDataTable({ apiEndpoint, initialLimit = 10, initialSort }: UseDataTableProps) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState(initialSort?.field || '');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSort?.order || 'asc');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(sortField && { sortBy: sortField, sortOrder }),
      });

      const token = localStorage.getItem('token');
      const response = await fetch(`${apiEndpoint}?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const result = await response.json();
        setData(result.data || result.items || []);
        setTotal(result.total || result.count || 0);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint, page, limit, search, sortField, sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSearch = (query: string) => {
    setSearch(query);
    setPage(1);
  };

  const handleSort = (field: string, order: 'asc' | 'desc') => {
    setSortField(field);
    setSortOrder(order);
    setPage(1);
  };

  return {
    data,
    loading,
    pagination: {
      page,
      limit,
      total,
      onPageChange: handlePageChange,
      onLimitChange: handleLimitChange,
    },
    search: {
      query: search,
      onSearch: handleSearch,
    },
    sorting: {
      field: sortField,
      order: sortOrder,
      onSort: handleSort,
    },
    refetch: fetchData,
  };
}
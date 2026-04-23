'use client';

import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth-context';
import { formatDate, generateMicrositeUrl } from '@/lib/utils';
import Link from 'next/link';
import { DataTable, type Column, StatusBadge, RowActionsDropdown } from '@/components/ui/DataTable';
import { SkeletonTable } from '@/components/ui/Loading';
import { SearchInput, FilterDropdown } from '@/components/ui/SearchFilter';
import {
  MapPin,
  Phone,
  Mail,
  Building2,
  ExternalLink,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Eye,
  Users,
} from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contact: {
    phone: string;
    whatsapp?: string;
    email: string;
  };
  brand: {
    id: string;
    name: string;
    slug: string;
    colorTheme: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
  _count: {
    leads: number;
  };
}

interface BranchListProps {
  brandId: string | null;
  onEditBranch: (branch: Branch) => void;
}

// API functions
async function fetchBranches(brandId: string | null): Promise<Branch[]> {
  const token = localStorage.getItem('token');
  const url = brandId ? `/api/branches?brandId=${brandId}` : '/api/branches';

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch branches');
  }

  const data = await response.json();
  return Array.isArray(data) ? data : (data.branches || []);
}

async function deleteBranch(branchId: string): Promise<void> {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/branches/${branchId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete branch');
  }
}

async function toggleBranchStatus(branchId: string, isActive: boolean): Promise<void> {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/branches/${branchId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ isActive: !isActive }),
  });

  if (!response.ok) {
    throw new Error('Failed to update branch status');
  }
}

export default function BranchList({ brandId, onEditBranch }: BranchListProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBranches, setSelectedBranches] = useState<Branch[]>([]);

  // React Query for fetching branches
  const {
    data: branches = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['branches', brandId],
    queryFn: () => fetchBranches(brandId),
    enabled: !!brandId || user?.role === 'BRANCH_ADMIN',
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  // Toggle status mutation
  const toggleMutation = useMutation({
    mutationFn: ({ branchId, isActive }: { branchId: string; isActive: boolean }) =>
      toggleBranchStatus(branchId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  // Filter branches based on search and status
  const filteredBranches = useMemo(() => {
    return branches.filter((branch) => {
      const matchesSearch =
        searchQuery === '' ||
        branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        branch.address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        branch.address.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        branch.contact.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && branch.isActive) ||
        (statusFilter === 'inactive' && !branch.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [branches, searchQuery, statusFilter]);

  // Handle delete with confirmation
  const handleDelete = useCallback((branchId: string) => {
    if (confirm('Are you sure you want to delete this branch? This action cannot be undone.')) {
      deleteMutation.mutate(branchId);
    }
  }, [deleteMutation]);

  // Handle toggle status
  const handleToggleStatus = useCallback((branchId: string, isActive: boolean) => {
    toggleMutation.mutate({ branchId, isActive });
  }, [toggleMutation]);

  // Handle bulk delete
  const handleBulkDelete = useCallback(() => {
    if (selectedBranches.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedBranches.length} branches?`)) {
      selectedBranches.forEach((branch) => deleteMutation.mutate(branch.id));
      setSelectedBranches([]);
    }
  }, [selectedBranches, deleteMutation]);

  // Table columns definition
  const columns: Column<Branch>[] = useMemo(() => [
    {
      key: 'name',
      header: 'Branch',
      sortable: true,
      render: (branch) => (
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-medium text-sm flex-shrink-0"
            style={{ backgroundColor: branch.brand?.colorTheme?.primary || '#3B82F6' }}
          >
            {branch.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-neutral-900 dark:text-white truncate">
              {branch.name}
            </div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {branch.address.city}, {branch.address.state}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'brand',
      header: 'Brand',
      sortable: true,
      render: (branch) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
          <span className="text-neutral-700 dark:text-neutral-300">{branch.brand.name}</span>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (branch) => (
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
            <Phone className="w-3 h-3" />
            {branch.contact.phone}
          </div>
          <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
            <Mail className="w-3 h-3" />
            <span className="truncate max-w-[150px]">{branch.contact.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'leads',
      header: 'Leads',
      sortable: true,
      render: (branch) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
          <span className="font-medium text-neutral-900 dark:text-white">
            {branch._count.leads}
          </span>
        </div>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      sortable: true,
      render: (branch) => (
        <StatusBadge
          status={branch.isActive ? 'success' : 'error'}
          label={branch.isActive ? 'Active' : 'Inactive'}
        />
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      sortable: true,
      render: (branch) => (
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          {formatDate(branch.createdAt)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (branch) => (
        <RowActionsDropdown
          actions={[
            {
              label: 'View Microsite',
              icon: <ExternalLink className="w-4 h-4" />,
              onClick: () => window.open(generateMicrositeUrl(branch.brand.slug, branch.slug), '_blank'),
            },
            {
              label: 'Manage Microsite',
              icon: <Eye className="w-4 h-4" />,
              href: `/admin/microsite/${branch.id}`,
            },
            {
              label: 'Edit',
              icon: <Edit2 className="w-4 h-4" />,
              onClick: () => onEditBranch(branch),
            },
            {
              label: branch.isActive ? 'Deactivate' : 'Activate',
              icon: branch.isActive ? <ToggleLeft className="w-4 h-4" /> : <ToggleRight className="w-4 h-4" />,
              onClick: () => handleToggleStatus(branch.id, branch.isActive),
              variant: branch.isActive ? 'warning' : 'default',
            },
            ...(user?.role === 'SUPER_ADMIN' || user?.role === 'BRAND_MANAGER'
              ? [
                  {
                    label: 'Delete',
                    icon: <Trash2 className="w-4 h-4" />,
                    onClick: () => handleDelete(branch.id),
                    variant: 'danger' as const,
                  },
                ]
              : []),
          ]}
        />
      ),
    },
  ], [onEditBranch, handleDelete, handleToggleStatus, user?.role]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <SkeletonTable rows={5} columns={6} />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white dark:bg-neutral-800 shadow rounded-lg p-6">
        <div className="text-center">
          <div className="text-error-600 dark:text-error-400 mb-4">
            Error: {error instanceof Error ? error.message : 'Failed to load branches'}
          </div>
          <button
            onClick={() => refetch()}
            className="bg-primary-600 dark:bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-700 dark:hover:bg-primary-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show empty state for no brand selected
  if (!brandId && user?.role !== 'BRANCH_ADMIN') {
    return (
      <div className="bg-white dark:bg-neutral-800 shadow rounded-lg p-12 text-center">
        <div className="mx-auto h-16 w-16 text-neutral-300 dark:text-neutral-600 mb-4">
          <MapPin className="w-full h-full" />
        </div>
        <h3 className="text-lg font-medium text-neutral-900 dark:text-white">Select a brand</h3>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Choose a brand to view and manage its branches
        </p>
      </div>
    );
  }

  // Show empty state for no branches
  if (branches.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-800 shadow rounded-lg p-12 text-center">
        <div className="mx-auto h-16 w-16 text-neutral-300 dark:text-neutral-600 mb-4">
          <Building2 className="w-full h-full" />
        </div>
        <h3 className="text-lg font-medium text-neutral-900 dark:text-white">No branches</h3>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Get started by creating your first branch location.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="px-6 pt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-3 w-full sm:w-auto">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search branches..."
            className="w-full sm:w-64"
          />
          <FilterDropdown
            label="Status"
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as string)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
          />
        </div>
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          {filteredBranches.length} of {branches.length} branches
        </div>
      </div>

      {/* Data Table */}
      <DataTable<Branch>
        data={filteredBranches}
        columns={columns}
        keyField="id"
        selectable
        selectedRows={selectedBranches}
        onSelectionChange={setSelectedBranches}
        defaultSort={{ column: 'name', direction: 'asc' }}
        bulkActions={
          selectedBranches.length > 0
            ? [
                {
                  label: `Delete (${selectedBranches.length})`,
                  onClick: handleBulkDelete,
                  variant: 'danger',
                },
              ]
            : undefined
        }
        emptyMessage="No branches match your search criteria"
        className="rounded-lg"
      />
    </div>
  );
}

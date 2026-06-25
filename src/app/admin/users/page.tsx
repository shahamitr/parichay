'use client';

import { useState, useCallback, useMemo } from 'react';
import { usePageHelp } from '@/hooks/usePageHelp';
import { StatCard, SectionHeader, Button } from '@/components/ui';
import DataTable, { StatusBadge } from '@/components/ui/DataTable';
import type { Column, BulkAction } from '@/components/ui/DataTable';
import ConfirmModal from '@/components/ui/ConfirmModal';
import UserForm from '@/components/users/UserForm';
import { useToastHelpers } from '@/components/ui/Toast';
import {
  useUsers,
  useUserStats,
  useDeleteUser,
  useRestoreUser,
  useUpdateUser,
} from '@/lib/api-hooks';
import type { UserData } from '@/lib/api-hooks';
import {
  Users,
  Plus,
  UserCheck,
  UserX,
  Crown,
  Shield,
  Briefcase,
  Download,
  Trash2,
  Edit,
  RotateCcw,
  ToggleLeft,
  ToggleRight,
  Mail,
  Phone,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';

// =============================================================================
// Role display config
// =============================================================================
const ROLE_CONFIG: Record<string, { label: string; color: string; icon: typeof Crown }> = {
  SUPER_ADMIN: { label: 'Super Admin', color: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400', icon: Crown },
  BRAND_MANAGER: { label: 'Brand Manager', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400', icon: Briefcase },
  BRANCH_ADMIN: { label: 'Branch Admin', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400', icon: Shield },
  EXECUTIVE: { label: 'Executive', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400', icon: UserCheck },
};

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'Non-Deleted Users' },
  { value: 'active', label: 'Active Users' },
  { value: 'inactive', label: 'Inactive Users' },
  { value: 'deleted', label: 'Deleted Users' },
];

// =============================================================================
// Page Component
// =============================================================================
export default function UsersPage() {
  // Help
  usePageHelp({ pageContext: 'Users' });

  // Toast
  const { showSuccess, showError } = useToastHelpers();

  // Table state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedRows, setSelectedRows] = useState<UserData[]>([]);

  // UI state
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; user: UserData | null }>({
    show: false,
    user: null,
  });

  // Data fetching
  const filters = useMemo(() => ({
    search: search || undefined,
    role: roleFilter || undefined,
    status: statusFilter || undefined,
    page,
    limit: pageSize,
    sortBy,
    sortOrder,
    includeStats: true,
  }), [search, roleFilter, statusFilter, page, pageSize, sortBy, sortOrder]);

  const { data, isLoading, isError, error } = useUsers(filters);
  const { data: statsData } = useUserStats();

  // Mutations
  const deleteUser = useDeleteUser();
  const restoreUser = useRestoreUser();
  const updateUser = useUpdateUser();

  // Stats from the dedicated stats hook (more reliable than per-page stats)
  const stats = statsData || data?.stats;

  // ==========================================================================
  // Handlers
  // ==========================================================================
  const handleSearch = useCallback((query: string) => {
    setSearch(query);
    setPage(1);
  }, []);

  const handleSort = useCallback((column: string, direction: 'asc' | 'desc' | null) => {
    if (direction) {
      setSortBy(column);
      setSortOrder(direction);
    } else {
      setSortBy('createdAt');
      setSortOrder('desc');
    }
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    setSelectedRows([]);
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(1);
    setSelectedRows([]);
  }, []);

  const handleEdit = useCallback((user: UserData) => {
    setEditingUser(user);
    setShowUserForm(true);
  }, []);

  const handleDelete = useCallback((user: UserData) => {
    setDeleteConfirm({ show: true, user });
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteConfirm.user) return;
    try {
      await deleteUser.mutateAsync(deleteConfirm.user.id);
      showSuccess(`${deleteConfirm.user.firstName} ${deleteConfirm.user.lastName} has been deleted`);
      setSelectedRows([]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete user';
      showError(message);
    } finally {
      setDeleteConfirm({ show: false, user: null });
    }
  }, [deleteConfirm.user, deleteUser, showSuccess, showError]);

  const handleRestore = useCallback(async (user: UserData) => {
    try {
      await restoreUser.mutateAsync(user.id);
      showSuccess(`${user.firstName} ${user.lastName} has been restored`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to restore user';
      showError(message);
    }
  }, [restoreUser, showSuccess, showError]);

  const handleToggleActive = useCallback(async (user: UserData) => {
    try {
      await updateUser.mutateAsync({
        id: user.id,
        data: { isActive: !user.isActive },
      });
      showSuccess(`${user.firstName} ${user.lastName} is now ${user.isActive ? 'inactive' : 'active'}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update user';
      showError(message);
    }
  }, [updateUser, showSuccess, showError]);

  const handleFormSave = useCallback(() => {
    setShowUserForm(false);
    setEditingUser(null);
  }, []);

  const handleFormCancel = useCallback(() => {
    setShowUserForm(false);
    setEditingUser(null);
  }, []);

  const handleExport = useCallback(() => {
    const statusParam = statusFilter ? `?status=${statusFilter}` : '';
    window.open(`/api/users/export${statusParam}`, '_blank');
  }, [statusFilter]);

  // ==========================================================================
  // Table columns
  // ==========================================================================
  const columns: Column<UserData>[] = useMemo(() => [
    {
      id: 'name',
      header: 'Name',
      sortable: true,
      minWidth: '200px',
      cell: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-300 font-semibold text-sm flex-shrink-0">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
              {user.firstName} {user.lastName}
            </div>
            {user.brand?.name && (
              <div className="text-xs text-neutral-500 truncate">{user.brand.name}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      id: 'email',
      header: 'Email',
      sortable: true,
      minWidth: '220px',
      cell: (user) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-sm text-neutral-700 dark:text-neutral-300">
            <Mail className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Phone className="w-3 h-3 text-neutral-400 flex-shrink-0" />
              <span>{user.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'role',
      header: 'Role',
      sortable: true,
      width: '160px',
      cell: (user) => {
        const config = ROLE_CONFIG[user.role] || {
          label: user.role,
          color: 'text-neutral-600 bg-neutral-100 dark:bg-neutral-700 dark:text-neutral-300',
          icon: Users,
        };
        const Icon = config.icon;
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
            <Icon className="w-3 h-3" />
            {config.label}
          </span>
        );
      },
    },
    {
      id: 'status',
      header: 'Status',
      width: '120px',
      cell: (user) => {
        if (user.deletedAt) {
          return <StatusBadge status="error" label="Deleted" />;
        }
        return user.isActive
          ? <StatusBadge status="success" label="Active" />
          : <StatusBadge status="warning" label="Inactive" />;
      },
    },
    {
      id: 'security',
      header: 'Security',
      width: '120px',
      cell: (user) => (
        <div className="flex items-center gap-2">
          {user.emailVerified && (
            <span title="Email verified" className="text-green-500">
              <ShieldCheck className="w-4 h-4" />
            </span>
          )}
          {user.mfaEnabled && (
            <span title="MFA enabled" className="text-blue-500">
              <KeyRound className="w-4 h-4" />
            </span>
          )}
          {!user.emailVerified && !user.mfaEnabled && (
            <span className="text-xs text-neutral-400">—</span>
          )}
        </div>
      ),
    },
    {
      id: 'lastLoginAt',
      header: 'Last Login',
      sortable: true,
      width: '150px',
      cell: (user) => (
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          {user.lastLoginAt
            ? new Date(user.lastLoginAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : '—'}
        </span>
      ),
    },
    {
      id: 'createdAt',
      header: 'Created',
      sortable: true,
      width: '130px',
      cell: (user) => (
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          {new Date(user.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      ),
    },
  ], []);

  // ==========================================================================
  // Row actions
  // ==========================================================================
  const rowActions = useCallback((user: UserData) => {
    if (user.deletedAt) {
      return (
        <button
          onClick={() => handleRestore(user)}
          className="p-1.5 rounded-lg text-neutral-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
          title="Restore user"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      );
    }

    return (
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleToggleActive(user)}
          className={`p-1.5 rounded-lg transition-colors ${
            user.isActive
              ? 'text-green-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20'
              : 'text-neutral-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
          }`}
          title={user.isActive ? 'Deactivate user' : 'Activate user'}
        >
          {user.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
        </button>
        <button
          onClick={() => handleEdit(user)}
          className="p-1.5 rounded-lg text-neutral-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
          title="Edit user"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleDelete(user)}
          className="p-1.5 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          title="Delete user"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  }, [handleEdit, handleDelete, handleRestore, handleToggleActive]);

  // ==========================================================================
  // Bulk actions
  // ==========================================================================
  const bulkActions: BulkAction<UserData>[] = useMemo(() => [
    {
      id: 'bulk-delete',
      label: 'Delete Selected',
      icon: <Trash2 className="w-4 h-4" />,
      variant: 'danger' as const,
      onClick: async (rows: UserData[]) => {
        try {
          await Promise.all(rows.map(r => deleteUser.mutateAsync(r.id)));
          showSuccess(`${rows.length} user(s) deleted`);
          setSelectedRows([]);
        } catch {
          showError('Failed to delete some users');
        }
      },
    },
  ], [deleteUser, showSuccess, showError]);

  // ==========================================================================
  // Render
  // ==========================================================================
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <SectionHeader
          title="User Management"
          subtitle="Manage user accounts, roles, and permissions across the platform."
        />
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button
            size="sm"
            onClick={() => { setEditingUser(null); setShowUserForm(true); }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers ?? '—'}
          icon={<Users className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          title="Active"
          value={stats?.activeUsers ?? '—'}
          icon={<UserCheck className="w-5 h-5" />}
          color="green"
          subtitle={stats ? `${Math.round((stats.activeUsers / Math.max(stats.totalUsers, 1)) * 100)}% of total` : undefined}
        />
        <StatCard
          title="Inactive"
          value={stats?.inactiveUsers ?? '—'}
          icon={<UserX className="w-5 h-5" />}
          color="orange"
        />
        <StatCard
          title="Deleted"
          value={stats?.deletedUsers ?? '—'}
          icon={<Trash2 className="w-5 h-5" />}
          color="red"
        />
        {stats?.byRole && Object.entries(stats.byRole).map(([role, count]) => {
          const config = ROLE_CONFIG[role];
          if (!config) return null;
          const Icon = config.icon;
          return (
            <StatCard
              key={role}
              title={config.label}
              value={count}
              icon={<Icon className="w-5 h-5" />}
              color={
                role === 'SUPER_ADMIN' ? 'red' :
                role === 'BRAND_MANAGER' ? 'purple' :
                role === 'BRANCH_ADMIN' ? 'blue' :
                'orange'
              }
            />
          );
        })}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Filter by status"
          >
            {STATUS_FILTER_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Filter by role"
          >
            <option value="">All Roles</option>
            {Object.entries(ROLE_CONFIG).map(([value, cfg]) => (
              <option key={value} value={value}>{cfg.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          Failed to load users: {error instanceof Error ? error.message : 'Unknown error'}. Please try again.
        </div>
      )}

      {/* Data Table */}
      <DataTable<UserData>
        data={data?.users ?? []}
        columns={columns}
        keyField="id"
        loading={isLoading}
        emptyMessage={
          search || roleFilter || statusFilter
            ? 'No users match your filters. Try adjusting your search or filters.'
            : 'No users found. Click "Add User" to create the first one.'
        }
        // Search
        searchable
        searchPlaceholder="Search by name, email, or brand..."
        onSearch={handleSearch}
        // Selection & Bulk
        selectable
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        bulkActions={bulkActions}
        // Sorting (server-side)
        sortable
        defaultSort={{ column: sortBy, direction: sortOrder }}
        onSort={handleSort}
        // Pagination (server-side)
        pagination
        currentPage={page}
        pageSize={pageSize}
        totalItems={data?.total ?? 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={[10, 25, 50, 100]}
        // Row actions
        rowActions={rowActions}
        // Styling
        hoverable
        striped
      />

      {/* User Form Drawer */}
      {showUserForm && (
        <UserForm
          user={editingUser ? {
            id: editingUser.id,
            email: editingUser.email,
            firstName: editingUser.firstName,
            lastName: editingUser.lastName,
            role: editingUser.role,
            brandId: editingUser.brandId || undefined,
          } : null}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.show}
        title="Delete User"
        message={
          deleteConfirm.user
            ? `Are you sure you want to delete ${deleteConfirm.user.firstName} ${deleteConfirm.user.lastName}? The user will be soft-deleted and can be restored later.`
            : ''
        }
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ show: false, user: null })}
      />
    </div>
  );
}

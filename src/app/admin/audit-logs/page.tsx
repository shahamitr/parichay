'use client';

import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SectionHeader } from '@/components/ui';
import DataTable, { StatusBadge } from '@/components/ui/DataTable';
import type { Column } from '@/components/ui/DataTable';
import {
  Shield,
  Search,
  Calendar,
  Download,
  AlertTriangle,
  LogIn,
  LogOut,
  UserPlus,
  UserMinus,
  KeyRound,
  CreditCard,
  Database,
  RefreshCw,
} from 'lucide-react';

// =============================================================================
// Types
// =============================================================================
interface AuditLogEntry {
  id: string;
  eventType: string;
  userId: string | null;
  resourceId: string | null;
  resourceType: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: Record<string, unknown> | null;
  correlationId: string | null;
  createdAt: string;
}

interface AuditLogsResponse {
  logs: AuditLogEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// =============================================================================
// Event type config
// =============================================================================
const EVENT_ICONS: Record<string, typeof Shield> = {
  USER_LOGIN: LogIn,
  USER_LOGIN_FAILED: AlertTriangle,
  USER_LOCKED: AlertTriangle,
  USER_LOGOUT: LogOut,
  USER_CREATED: UserPlus,
  USER_UPDATED: RefreshCw,
  USER_DELETED: UserMinus,
  USER_RESTORED: RefreshCw,
  PASSWORD_CHANGED: KeyRound,
  PASSWORD_RESET: KeyRound,
  PAYMENT_PROCESSED: CreditCard,
  PAYMENT_FAILED: CreditCard,
  DATA_EXPORTED: Database,
  DATA_DELETED: Database,
};

const EVENT_COLORS: Record<string, string> = {
  USER_LOGIN: 'text-green-600 bg-green-50 dark:bg-green-900/20',
  USER_LOGIN_FAILED: 'text-red-600 bg-red-50 dark:bg-red-900/20',
  USER_LOCKED: 'text-red-600 bg-red-50 dark:bg-red-900/20',
  USER_LOGOUT: 'text-neutral-600 bg-neutral-100 dark:bg-neutral-700',
  USER_CREATED: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
  USER_DELETED: 'text-red-600 bg-red-50 dark:bg-red-900/20',
  PASSWORD_CHANGED: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
  PASSWORD_RESET: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
  PAYMENT_PROCESSED: 'text-green-600 bg-green-50 dark:bg-green-900/20',
  PAYMENT_FAILED: 'text-red-600 bg-red-50 dark:bg-red-900/20',
  DATA_EXPORTED: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
  DATA_DELETED: 'text-red-600 bg-red-50 dark:bg-red-900/20',
};

const EVENT_TYPE_OPTIONS = [
  'USER_LOGIN',
  'USER_LOGIN_FAILED',
  'USER_LOCKED',
  'USER_LOGOUT',
  'USER_CREATED',
  'USER_UPDATED',
  'USER_DELETED',
  'USER_RESTORED',
  'PASSWORD_CHANGED',
  'PASSWORD_RESET',
  'MFA_ENABLED',
  'MFA_DISABLED',
  'BRAND_CREATED',
  'BRAND_UPDATED',
  'BRAND_DELETED',
  'SUBSCRIPTION_CREATED',
  'SUBSCRIPTION_UPDATED',
  'SUBSCRIPTION_CANCELLED',
  'PAYMENT_PROCESSED',
  'PAYMENT_FAILED',
  'DATA_EXPORTED',
  'DATA_DELETED',
  'ROLE_CHANGED',
];

// =============================================================================
// Page
// =============================================================================
export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(pageSize));
    if (search) params.set('search', search);
    if (eventTypeFilter) params.set('eventType', eventTypeFilter);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    return params.toString();
  }, [page, pageSize, search, eventTypeFilter, startDate, endDate]);

  const { data, isLoading, isError } = useQuery<AuditLogsResponse>({
    queryKey: ['audit-logs', queryParams],
    queryFn: async () => {
      const res = await fetch(`/api/audit-logs?${queryParams}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch audit logs');
      return res.json();
    },
  });

  const handleSearch = useCallback((q: string) => {
    setSearch(q);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((p: number) => setPage(p), []);
  const handlePageSizeChange = useCallback((s: number) => { setPageSize(s); setPage(1); }, []);

  const handleExport = useCallback(() => {
    window.open(`/api/audit-logs?${queryParams}&limit=10000`, '_blank');
  }, [queryParams]);

  // ==========================================================================
  // Columns
  // ==========================================================================
  const columns: Column<AuditLogEntry>[] = useMemo(() => [
    {
      id: 'createdAt',
      header: 'Timestamp',
      width: '180px',
      cell: (log) => (
        <span className="text-sm text-neutral-700 dark:text-neutral-300 font-mono">
          {new Date(log.createdAt).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </span>
      ),
    },
    {
      id: 'eventType',
      header: 'Event',
      width: '200px',
      cell: (log) => {
        const Icon = EVENT_ICONS[log.eventType] || Shield;
        const color = EVENT_COLORS[log.eventType] || 'text-neutral-600 bg-neutral-100 dark:bg-neutral-700';
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
            <Icon className="w-3 h-3" />
            {log.eventType.replace(/_/g, ' ')}
          </span>
        );
      },
    },
    {
      id: 'userId',
      header: 'User ID',
      width: '140px',
      cell: (log) => (
        <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
          {log.userId ? `${log.userId.slice(0, 12)}…` : '—'}
        </span>
      ),
    },
    {
      id: 'resourceType',
      header: 'Resource',
      width: '140px',
      cell: (log) => (
        <div className="text-sm">
          {log.resourceType && (
            <span className="text-neutral-700 dark:text-neutral-300">{log.resourceType}</span>
          )}
          {log.resourceId && (
            <span className="text-xs font-mono text-neutral-400 ml-1">
              {log.resourceId.slice(0, 8)}…
            </span>
          )}
          {!log.resourceType && <span className="text-neutral-400">—</span>}
        </div>
      ),
    },
    {
      id: 'ipAddress',
      header: 'IP Address',
      width: '130px',
      cell: (log) => (
        <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
          {log.ipAddress || '—'}
        </span>
      ),
    },
    {
      id: 'metadata',
      header: 'Details',
      cell: (log) => {
        if (!log.metadata || Object.keys(log.metadata).length === 0) {
          return <span className="text-neutral-400">—</span>;
        }
        return (
          <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[200px] block" title={JSON.stringify(log.metadata)}>
            {JSON.stringify(log.metadata).slice(0, 60)}
            {JSON.stringify(log.metadata).length > 60 ? '…' : ''}
          </span>
        );
      },
    },
  ], []);

  // ==========================================================================
  // Render
  // ==========================================================================
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <SectionHeader
          title="Audit Logs"
          subtitle="Security and compliance event trail for all sensitive operations."
          icon={<Shield className="w-5 h-5" />}
        />
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export JSON
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
        <select
          value={eventTypeFilter}
          onChange={(e) => { setEventTypeFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Filter by event type"
        >
          <option value="">All Events</option>
          {EVENT_TYPE_OPTIONS.map((evt) => (
            <option key={evt} value={evt}>{evt.replace(/_/g, ' ')}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-neutral-400" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Start date"
          />
          <span className="text-neutral-400">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="End date"
          />
        </div>

        {(eventTypeFilter || startDate || endDate) && (
          <button
            onClick={() => { setEventTypeFilter(''); setStartDate(''); setEndDate(''); setPage(1); }}
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Error */}
      {isError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          Failed to load audit logs. Please try again.
        </div>
      )}

      {/* Table */}
      <DataTable<AuditLogEntry>
        data={data?.logs ?? []}
        columns={columns}
        keyField="id"
        loading={isLoading}
        emptyMessage="No audit log entries found matching your filters."
        searchable
        searchPlaceholder="Search by user ID, IP, event type..."
        onSearch={handleSearch}
        sortable={false}
        pagination
        currentPage={page}
        pageSize={pageSize}
        totalItems={data?.total ?? 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={[25, 50, 100]}
        hoverable
        striped
      />
    </div>
  );
}

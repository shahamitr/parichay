'use client';

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';

// =============================================================================
// API CLIENT
// =============================================================================
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(endpoint, {
    ...options,
    headers,
    credentials: 'include', // Include cookies for auth
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.error || errorData.message || `HTTP error ${response.status}`,
      response.status,
      errorData
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// =============================================================================
// QUERY KEYS
// =============================================================================
export const queryKeys = {
  // Auth
  currentUser: ['auth', 'me'] as const,

  // Brands
  brands: ['brands'] as const,
  brand: (id: string) => ['brands', id] as const,

  // Branches
  branches: (filters?: { brandId?: string; search?: string }) =>
    ['branches', filters] as const,
  branch: (id: string) => ['branches', id] as const,

  // Analytics
  realtimeAnalytics: (params: { period: string; brandId?: string }) =>
    ['analytics', 'realtime', params] as const,
  dashboardAnalytics: (params: { startDate?: string; endDate?: string; brandId?: string }) =>
    ['analytics', 'dashboard', params] as const,

  // Leads
  leads: (filters?: { branchId?: string; status?: string; page?: number }) =>
    ['leads', filters] as const,
  lead: (id: string) => ['leads', id] as const,

  // Notifications
  notifications: (unreadOnly?: boolean) => ['notifications', { unreadOnly }] as const,

  // Users
  users: (filters?: { role?: string; page?: number }) => ['users', filters] as const,
  user: (id: string) => ['users', id] as const,

  // Executives
  executiveStats: (params?: { executiveId?: string; brandId?: string }) =>
    ['executives', 'stats', params] as const,

  // Reminders
  reminders: (days?: number) => ['reminders', { days }] as const,

  // QR Codes
  qrCodes: (branchId?: string) => ['qrcodes', { branchId }] as const,

  // Short Links
  shortLinks: (branchId?: string) => ['shortlinks', { branchId }] as const,
};

// =============================================================================
// AUTH HOOKS
// =============================================================================
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  brandId?: string;
}

export function useCurrentUser(options?: Partial<UseQueryOptions<User>>) {
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: () => apiClient<User>('/api/auth/me'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry auth failures
    ...options,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient('/api/auth/logout', { method: 'POST' }),
    onSuccess: () => {
      queryClient.clear();
      window.location.href = '/login';
    },
  });
}

// =============================================================================
// BRANDS HOOKS
// =============================================================================
interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  tagline?: string;
  _count?: { branches: number };
}

export function useBrands() {
  return useQuery({
    queryKey: queryKeys.brands,
    queryFn: () => apiClient<Brand[]>('/api/brands'),
  });
}

export function useBrand(id: string) {
  return useQuery({
    queryKey: queryKeys.brand(id),
    queryFn: () => apiClient<Brand>(`/api/brands/${id}`),
    enabled: !!id,
  });
}

export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Brand>) =>
      apiClient<Brand>('/api/brands', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands });
    },
  });
}

export function useUpdateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Brand> }) =>
      apiClient<Brand>(`/api/brands/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands });
      queryClient.invalidateQueries({ queryKey: queryKeys.brand(id) });
    },
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient(`/api/brands/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands });
    },
  });
}

// =============================================================================
// BRANCHES HOOKS
// =============================================================================
interface Branch {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    whatsapp?: string;
  };
  brand?: Brand;
  _count?: { leads: number };
}

interface BranchFilters {
  brandId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function useBranches(filters?: BranchFilters) {
  const params = new URLSearchParams();
  if (filters?.brandId) params.append('brandId', filters.brandId);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.page) params.append('page', String(filters.page));
  if (filters?.limit) params.append('limit', String(filters.limit));

  const queryString = params.toString();
  const url = `/api/branches${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey: queryKeys.branches(filters),
    queryFn: () => apiClient<Branch[]>(url),
  });
}

export function useBranch(id: string) {
  return useQuery({
    queryKey: queryKeys.branch(id),
    queryFn: () => apiClient<Branch>(`/api/branches/${id}`),
    enabled: !!id,
  });
}

export function useCreateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Branch>) =>
      apiClient<Branch>('/api/branches', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
  });
}

export function useUpdateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Branch> }) =>
      apiClient<Branch>(`/api/branches/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.branch(id) });
    },
  });
}

export function useDeleteBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient(`/api/branches/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
  });
}

// =============================================================================
// ANALYTICS HOOKS
// =============================================================================
interface RealtimeAnalytics {
  metrics: {
    pageViews: number;
    qrScans: number;
    leads: number;
    vcardDownloads: number;
    shortLinkClicks: number;
    branches: number;
  };
  recentEvents: Array<{
    id: string;
    eventType: string;
    branchName?: string;
    createdAt: string;
  }>;
  topBranches: Array<{
    id: string;
    name: string;
    views: number;
  }>;
}

export function useRealtimeAnalytics(params: { period: string; brandId?: string }) {
  const searchParams = new URLSearchParams({ period: params.period });
  if (params.brandId) searchParams.append('brandId', params.brandId);

  return useQuery({
    queryKey: queryKeys.realtimeAnalytics(params),
    queryFn: () => apiClient<RealtimeAnalytics>(`/api/analytics/realtime?${searchParams}`),
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });
}

// =============================================================================
// NOTIFICATIONS HOOKS
// =============================================================================
interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export function useNotifications(unreadOnly = false) {
  const params = new URLSearchParams();
  if (unreadOnly) params.append('unreadOnly', 'true');

  return useQuery({
    queryKey: queryKeys.notifications(unreadOnly),
    queryFn: () => apiClient<{ notifications: Notification[]; unreadCount: number }>(
      `/api/notifications?${params}`
    ),
    refetchInterval: 60000, // Refresh every minute
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient(`/api/notifications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isRead: true }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiClient('/api/notifications/mark-all-read', { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// =============================================================================
// LEADS HOOKS
// =============================================================================
interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  status: string;
  createdAt: string;
  branch?: Branch;
}

interface LeadFilters {
  branchId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export function useLeads(filters?: LeadFilters) {
  const params = new URLSearchParams();
  if (filters?.branchId) params.append('branchId', filters.branchId);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.page) params.append('page', String(filters.page));
  if (filters?.limit) params.append('limit', String(filters.limit));

  const queryString = params.toString();
  const url = `/api/leads${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey: queryKeys.leads(filters),
    queryFn: () => apiClient<{ leads: Lead[]; total: number; page: number; totalPages: number }>(url),
  });
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiClient(`/api/leads/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

// =============================================================================
// EXECUTIVE STATS HOOKS
// =============================================================================
interface ExecutiveStats {
  totalOnboarded: number;
  activeCount: number;
  thisMonthCount: number;
  lastMonthCount: number;
  recentBranches: Branch[];
}

export function useExecutiveStats(params?: { executiveId?: string; brandId?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.executiveId) searchParams.append('executiveId', params.executiveId);
  if (params?.brandId) searchParams.append('brandId', params.brandId);

  const queryString = searchParams.toString();
  const url = `/api/executives/stats${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey: queryKeys.executiveStats(params),
    queryFn: () => apiClient<ExecutiveStats>(url),
  });
}

// =============================================================================
// REMINDERS HOOKS
// =============================================================================
interface Reminder {
  id: string;
  type: string;
  title: string;
  dueDate: string;
  branch?: Branch;
}

export function useReminders(days = 3) {
  return useQuery({
    queryKey: queryKeys.reminders(days),
    queryFn: () => apiClient<Reminder[]>(`/api/reminders?days=${days}`),
  });
}

// =============================================================================
// USERS HOOKS
// =============================================================================
interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface UserFilters {
  role?: string;
  page?: number;
  limit?: number;
}

export function useUsers(filters?: UserFilters) {
  const params = new URLSearchParams();
  if (filters?.role) params.append('role', filters.role);
  if (filters?.page) params.append('page', String(filters.page));
  if (filters?.limit) params.append('limit', String(filters.limit));

  const queryString = params.toString();
  const url = `/api/users${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey: queryKeys.users(filters),
    queryFn: () => apiClient<{ users: UserData[]; total: number }>(url),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UserData> & { password: string }) =>
      apiClient<UserData>('/api/users', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserData> }) =>
      apiClient<UserData>(`/api/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.user(id) });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient(`/api/users/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

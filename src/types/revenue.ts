/**
 * Revenue module type definitions
 * Covers Revenue Dashboard, Date Ranges, Trends, and Expense types
 */

import { BusinessInvoiceStatus } from './invoice';

// ============================================================================
// Dashboard Types
// ============================================================================

export interface RevenueDashboardData {
  totalRevenue: number;
  totalOutstanding: number;
  totalOverdue: number;
  invoicesByStatus: Record<BusinessInvoiceStatus, number>;
  monthlyRevenueTrend: MonthlyTrend[];
  topCustomers: TopCustomer[];
  avgCollectionDays: number;
  totalExpenses: number;
  netProfit: number;
  expensesByCategory: Record<string, number>;
}

// ============================================================================
// Date Range
// ============================================================================

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// ============================================================================
// Trend Types
// ============================================================================

export interface MonthlyTrend {
  month: string;
  revenue: number;
}

export interface TopCustomer {
  customerId: string;
  name: string;
  revenue: number;
}

// ============================================================================
// Expense Types
// ============================================================================

export interface Expense {
  id: string;
  amount: number;
  date: Date;
  category: string;
  description: string | null;
  vendorName: string | null;
  receiptUrl: string | null;
  branchId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExpenseInput {
  amount: number;
  date: Date;
  category: string;
  description?: string;
  vendorName?: string;
  receiptUrl?: string;
  branchId: string;
}

export interface ExpenseFilters {
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
  vendorName?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'amount' | 'category' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ExpenseCategory {
  id: string;
  name: string;
  isDefault: boolean;
  branchId: string | null;
  createdAt: Date;
}

export interface MonthlySummary {
  month: string;
  totalExpenses: number;
  byCategory: Record<string, number>;
}

'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Target,
  Award,
  Calendar,
  ArrowUpRight,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/Loading';

// =============================================================================
// TYPES
// =============================================================================
interface PerformanceMetric {
  label: string;
  value: number;
  target?: number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'accent' | 'error';
}

interface PerformanceData {
  stats: {
    totalOnboarded: number;
    activeCount: number;
    thisMonthCount: number;
    lastMonthCount: number;
    weeklyCount: number;
    successRate: number;
  };
  monthlyGoal?: number;
  weeklyGoal?: number;
  leaderboardRank?: number;
  totalExecutives?: number;
  recentActivity: ActivityItem[];
  performanceHistory: {
    month: string;
    count: number;
  }[];
}

interface ActivityItem {
  id: string;
  type: 'onboarding' | 'activation' | 'support';
  title: string;
  description: string;
  timestamp: Date | string;
  status: 'success' | 'pending' | 'failed';
  branchName?: string;
}

interface PerformanceDashboardProps {
  data: PerformanceData | null;
  loading?: boolean;
  executiveName?: string;
  onRefresh?: () => void;
}

// =============================================================================
// COLOR MAPS
// =============================================================================
const colorClasses = {
  primary: {
    bg: 'bg-primary-100 dark:bg-primary-900/30',
    text: 'text-primary-600 dark:text-primary-400',
    border: 'border-primary-200 dark:border-primary-800',
    progress: 'bg-primary-600',
  },
  success: {
    bg: 'bg-success-100 dark:bg-success-900/30',
    text: 'text-success-600 dark:text-success-400',
    border: 'border-success-200 dark:border-success-800',
    progress: 'bg-success-600',
  },
  accent: {
    bg: 'bg-accent-100 dark:bg-accent-900/30',
    text: 'text-accent-600 dark:text-accent-400',
    border: 'border-accent-200 dark:border-accent-800',
    progress: 'bg-accent-600',
  },
  error: {
    bg: 'bg-error-100 dark:bg-error-900/30',
    text: 'text-error-600 dark:text-error-400',
    border: 'border-error-200 dark:border-error-800',
    progress: 'bg-error-600',
  },
};

// =============================================================================
// METRIC CARD COMPONENT
// =============================================================================
interface MetricCardProps {
  metric: PerformanceMetric;
  loading?: boolean;
}

function MetricCard({ metric, loading }: MetricCardProps) {
  const colors = colorClasses[metric.color];
  const progress = metric.target ? Math.min((metric.value / metric.target) * 100, 100) : null;

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-32" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {metric.label}
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-bold text-neutral-900 dark:text-white">
              {metric.value}
            </p>
            {metric.target && (
              <span className="text-sm text-neutral-400 dark:text-neutral-500">/ {metric.target}</span>
            )}
          </div>
        </div>
        <div className={cn('p-3 rounded-xl', colors.bg)}>
          <div className={colors.text}>{metric.icon}</div>
        </div>
      </div>

      {/* Progress bar */}
      {progress !== null && (
        <div className="mt-4">
          <div className="h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all duration-500', colors.progress)}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {progress.toFixed(0)}% of target
          </p>
        </div>
      )}

      {/* Change indicator */}
      {metric.change !== undefined && (
        <div className="flex items-center gap-1 mt-3">
          {metric.change >= 0 ? (
            <TrendingUp className="w-4 h-4 text-success-500 dark:text-success-400" />
          ) : (
            <TrendingDown className="w-4 h-4 text-error-500 dark:text-error-400" />
          )}
          <span
            className={cn(
              'text-sm font-medium',
              metric.change >= 0 ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'
            )}
          >
            {metric.change >= 0 ? '+' : ''}{metric.change}%
          </span>
          {metric.changeLabel && (
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {metric.changeLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// PERFORMANCE CHART (Simple Bar Chart)
// =============================================================================
interface PerformanceChartProps {
  data: { month: string; count: number }[];
  loading?: boolean;
}

function PerformanceChart({ data, loading }: PerformanceChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
        <Skeleton className="h-5 w-40 mb-4" />
        <div className="flex items-end gap-2 h-48">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-1" style={{ height: `${30 + Math.random() * 70}%` }}>
              <Skeleton className="h-full w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary-500 dark:text-primary-400" />
          Monthly Performance
        </h3>
      </div>

      <div className="flex items-end gap-2 h-48">
        {data.map((item, index) => {
          const height = (item.count / maxCount) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center justify-end h-40">
                <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  {item.count}
                </span>
                <div
                  className="w-full bg-primary-500 dark:bg-primary-600 rounded-t-md transition-all duration-500 hover:bg-primary-600 dark:hover:bg-primary-700"
                  style={{ height: `${Math.max(height, 5)}%` }}
                />
              </div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// LEADERBOARD POSITION
// =============================================================================
interface LeaderboardPositionProps {
  rank: number;
  total: number;
  loading?: boolean;
}

function LeaderboardPosition({ rank, total, loading }: LeaderboardPositionProps) {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-warning-50 to-accent-50 dark:from-warning-900/20 dark:to-accent-900/20 rounded-xl p-6">
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-10 w-24" />
      </div>
    );
  }

  const percentile = Math.round(((total - rank) / total) * 100);
  const isTopPerformer = rank <= 3;

  return (
    <div className={cn(
      'rounded-xl p-6',
      isTopPerformer
        ? 'bg-gradient-to-br from-warning-50 to-accent-50 dark:from-warning-900/20 dark:to-accent-900/20 border border-warning-200 dark:border-warning-800'
        : 'bg-white dark:bg-neutral-800'
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          'p-3 rounded-xl',
          isTopPerformer ? 'bg-warning-200 dark:bg-warning-800' : 'bg-neutral-100 dark:bg-neutral-700'
        )}>
          <Award className={cn(
            'w-6 h-6',
            isTopPerformer ? 'text-warning-600 dark:text-warning-400' : 'text-neutral-500 dark:text-neutral-400'
          )} />
        </div>
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Leaderboard Rank</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-neutral-900 dark:text-white">
              #{rank}
            </p>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">of {total}</span>
          </div>
        </div>
      </div>

      {isTopPerformer && (
        <div className="mt-4 flex items-center gap-2 text-sm text-warning-700 dark:text-warning-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>Top performer! Keep it up!</span>
        </div>
      )}

      {!isTopPerformer && percentile >= 50 && (
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          You&apos;re in the top {100 - percentile}% of executives
        </p>
      )}
    </div>
  );
}

// =============================================================================
// ACTIVITY STATUS BADGE
// =============================================================================
function ActivityStatusBadge({ status }: { status: 'success' | 'pending' | 'failed' }) {
  const config = {
    success: {
      icon: <CheckCircle2 className="w-4 h-4" />,
      text: 'Completed',
      className: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
    },
    pending: {
      icon: <Clock className="w-4 h-4" />,
      text: 'Pending',
      className: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
    },
    failed: {
      icon: <XCircle className="w-4 h-4" />,
      text: 'Failed',
      className: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400',
    },
  };

  const { icon, text, className } = config[status];

  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', className)}>
      {icon}
      {text}
    </span>
  );
}

// =============================================================================
// MAIN PERFORMANCE DASHBOARD
// =============================================================================
export function PerformanceDashboard({
  data,
  loading = false,
  executiveName,
  onRefresh,
}: PerformanceDashboardProps) {
  const metrics: PerformanceMetric[] = useMemo(() => {
    if (!data) return [];

    const monthChange = data.stats.lastMonthCount > 0
      ? Math.round(((data.stats.thisMonthCount - data.stats.lastMonthCount) / data.stats.lastMonthCount) * 100)
      : 0;

    return [
      {
        label: 'Total Onboarded',
        value: data.stats.totalOnboarded,
        icon: <Building2 className="w-6 h-6" />,
        color: 'primary',
      },
      {
        label: 'This Month',
        value: data.stats.thisMonthCount,
        target: data.monthlyGoal,
        change: monthChange,
        changeLabel: 'vs last month',
        icon: <Calendar className="w-6 h-6" />,
        color: 'success',
      },
      {
        label: 'This Week',
        value: data.stats.weeklyCount,
        target: data.weeklyGoal,
        icon: <Target className="w-6 h-6" />,
        color: 'primary',
      },
      {
        label: 'Success Rate',
        value: data.stats.successRate,
        target: 100,
        icon: <Activity className="w-6 h-6" />,
        color: 'accent',
      },
    ];
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Performance Dashboard
          </h2>
          {executiveName && (
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">
              Welcome back, {executiveName}
            </p>
          )}
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="px-4 py-2 text-sm bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            Refresh
          </button>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? [...Array(4)].map((_, i) => (
              <MetricCard key={i} metric={{} as PerformanceMetric} loading />
            ))
          : metrics.map((metric, index) => (
              <MetricCard key={index} metric={metric} />
            ))}
      </div>

      {/* Charts and Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2">
          <PerformanceChart
            data={data?.performanceHistory || []}
            loading={loading}
          />
        </div>

        {/* Leaderboard Position */}
        {data?.leaderboardRank && data?.totalExecutives && (
          <LeaderboardPosition
            rank={data.leaderboardRank}
            total={data.totalExecutives}
            loading={loading}
          />
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <h3 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary-500 dark:text-primary-400" />
            Recent Activity
          </h3>
        </div>
        <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="px-6 py-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-48 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </div>
            ))
          ) : data?.recentActivity?.length ? (
            data.recentActivity.map((activity) => (
              <div key={activity.id} className="px-6 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'p-2 rounded-lg',
                      activity.status === 'success' ? 'bg-success-100 dark:bg-success-900/30' :
                      activity.status === 'pending' ? 'bg-warning-100 dark:bg-warning-900/30' :
                      'bg-error-100 dark:bg-error-900/30'
                    )}>
                      <Building2 className={cn(
                        'w-5 h-5',
                        activity.status === 'success' ? 'text-success-600 dark:text-success-400' :
                        activity.status === 'pending' ? 'text-warning-600 dark:text-warning-400' :
                        'text-error-600 dark:text-error-400'
                      )} />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {activity.title}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {activity.description}
                      </p>
                      {activity.branchName && (
                        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                          Branch: {activity.branchName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <ActivityStatusBadge status={activity.status} />
                    <span className="text-xs text-neutral-400 dark:text-neutral-500">
                      {typeof activity.timestamp === 'string'
                        ? new Date(activity.timestamp).toLocaleDateString()
                        : activity.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-neutral-500 dark:text-neutral-400">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PerformanceDashboard;

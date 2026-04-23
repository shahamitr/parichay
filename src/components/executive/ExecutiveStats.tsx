'use client';

import { Award, TrendingUp, TrendingDown, Target, Calendar, RefreshCw } from 'lucide-react';

interface ExecutiveStatsProps {
  stats: {
    totalOnboarded: number;
    activeCount: number;
    thisMonthCount: number;
    lastMonthCount: number;
  };
  executiveId: string;
  onRefresh: () => void;
}

export default function ExecutiveStats({ stats, executiveId, onRefresh }: ExecutiveStatsProps) {
  const getTrendPercentage = () => {
    if (stats.lastMonthCount === 0) {
      return stats.thisMonthCount > 0 ? '+100%' : '0%';
    }
    const change = ((stats.thisMonthCount - stats.lastMonthCount) / stats.lastMonthCount) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const isPositiveTrend = stats.thisMonthCount >= stats.lastMonthCount;
  const successRate = stats.totalOnboarded > 0
    ? ((stats.activeCount / stats.totalOnboarded) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to Your Dashboard!</h2>
        <p className="text-primary-100 dark:text-primary-200">
          Track your onboarding performance and manage your branches
        </p>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={onRefresh}
          className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Refresh Stats</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Onboarded */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Award className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Total Onboarded</p>
          <p className="text-3xl font-bold text-neutral-900 dark:text-white">{stats.totalOnboarded}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">All time</p>
        </div>

        {/* Active Branches */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-success-100 dark:bg-success-900/30 rounded-lg">
              <Target className="w-6 h-6 text-success-600 dark:text-success-400" />
            </div>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Active Branches</p>
          <p className="text-3xl font-bold text-neutral-900 dark:text-white">{stats.activeCount}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
            {successRate}% success rate
          </p>
        </div>

        {/* This Month */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">This Month</p>
          <p className="text-3xl font-bold text-neutral-900 dark:text-white">{stats.thisMonthCount}</p>
          <div className="flex items-center gap-1 mt-2">
            {isPositiveTrend ? (
              <TrendingUp className="w-4 h-4 text-success-500 dark:text-success-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-error-500 dark:text-error-400" />
            )}
            <p className={`text-xs font-medium ${
              isPositiveTrend ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'
            }`}>
              {getTrendPercentage()} vs last month
            </p>
          </div>
        </div>

        {/* Last Month */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-accent-100 dark:bg-accent-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-accent-600 dark:text-accent-400" />
            </div>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Last Month</p>
          <p className="text-3xl font-bold text-neutral-900 dark:text-white">{stats.lastMonthCount}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">Previous period</p>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Performance Insights</h3>

        <div className="space-y-4">
          {/* Success Rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Success Rate</span>
              <span className="text-sm font-bold text-neutral-900 dark:text-white">{successRate}%</span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
              <div
                className="bg-success-500 dark:bg-success-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${successRate}%` }}
              ></div>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {stats.activeCount} of {stats.totalOnboarded} branches are active
            </p>
          </div>

          {/* Monthly Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Monthly Progress</span>
              <span className="text-sm font-bold text-neutral-900 dark:text-white">
                {stats.thisMonthCount} branches
              </span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
              <div
                className="bg-primary-500 dark:bg-primary-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((stats.thisMonthCount / Math.max(stats.lastMonthCount, 5)) * 100, 100)}%`
                }}
              ></div>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {isPositiveTrend ? 'Great progress!' : 'Keep pushing!'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Quick Tips</h3>
        <ul className="space-y-3">
          <li className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-primary-600 dark:text-primary-400 text-xs font-bold">1</span>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">Complete all branch details</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Ensure contact info, address, and business hours are accurate</p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-primary-600 dark:text-primary-400 text-xs font-bold">2</span>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">Configure microsite settings</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Set up hero section, services, and contact forms</p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-primary-600 dark:text-primary-400 text-xs font-bold">3</span>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">Test before activation</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Preview the microsite and verify all features work correctly</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

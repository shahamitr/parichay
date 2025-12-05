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
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to Your Dashboard!</h2>
        <p className="text-blue-100">
          Track your onboarding performance and manage your branches
        </p>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={onRefresh}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm font-medium">Refresh Stats</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Onboarded */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Onboarded</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalOnboarded}</p>
          <p className="text-xs text-gray-500 mt-2">All time</p>
        </div>

        {/* Active Branches */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Active Branches</p>
          <p className="text-3xl font-bold text-gray-900">{stats.activeCount}</p>
          <p className="text-xs text-gray-500 mt-2">
            {successRate}% success rate
          </p>
        </div>

        {/* This Month */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">This Month</p>
          <p className="text-3xl font-bold text-gray-900">{stats.thisMonthCount}</p>
          <div className="flex items-center gap-1 mt-2">
            {isPositiveTrend ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <p className={`text-xs font-medium ${
              isPositiveTrend ? 'text-green-600' : 'text-red-600'
            }`}>
              {getTrendPercentage()} vs last month
            </p>
          </div>
        </div>

        {/* Last Month */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Last Month</p>
          <p className="text-3xl font-bold text-gray-900">{stats.lastMonthCount}</p>
          <p className="text-xs text-gray-500 mt-2">Previous period</p>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>

        <div className="space-y-4">
          {/* Success Rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Success Rate</span>
              <span className="text-sm font-bold text-gray-900">{successRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${successRate}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.activeCount} of {stats.totalOnboarded} branches are active
            </p>
          </div>

          {/* Monthly Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Monthly Progress</span>
              <span className="text-sm font-bold text-gray-900">
                {stats.thisMonthCount} branches
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((stats.thisMonthCount / Math.max(stats.lastMonthCount, 5)) * 100, 100)}%`
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {isPositiveTrend ? 'Great progress!' : 'Keep pushing!'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Tips</h3>
        <ul className="space-y-3">
          <li className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-blue-600 text-xs font-bold">1</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Complete all branch details</p>
              <p className="text-xs text-gray-500">Ensure contact info, address, and business hours are accurate</p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-blue-600 text-xs font-bold">2</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Configure microsite settings</p>
              <p className="text-xs text-gray-500">Set up hero section, services, and contact forms</p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-blue-600 text-xs font-bold">3</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Test before activation</p>
              <p className="text-xs text-gray-500">Preview the microsite and verify all features work correctly</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

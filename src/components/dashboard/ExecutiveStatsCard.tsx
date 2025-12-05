'use client';

import { useState, useEffect } from 'react';
import { Users, TrendingUp, TrendingDown, Award, Calendar } from 'lucide-react';

interface ExecutiveStats {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  joinedAt: string;
  stats: {
    totalOnboarded: number;
    activeCount: number;
    inactiveCount: number;
    thisMonthCount: number;
    lastMonthCount: number;
  };
}

interface OverallStats {
  totalExecutives: number;
  activeExecutives: number;
  totalBranchesOnboarded: number;
  thisMonthTotal: number;
  lastMonthTotal: number;
}

export default function ExecutiveStatsCard() {
  const [executives, setExecutives] = useState<ExecutiveStats[]>([]);
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'month' | 'custom'>('all');

  useEffect(() => {
    fetchExecutiveStats();
  }, []);

  const fetchExecutiveStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/executives/stats');

      if (!response.ok) {
        throw new Error('Failed to fetch executive stats');
      }

      const result = await response.json();

      if (result.success) {
        setExecutives(result.data.executives);
        setOverallStats(result.data.overallStats);
      } else {
        throw new Error(result.error || 'Failed to load stats');
      }
    } catch (err) {
      console.error('Error fetching executive stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (current < previous) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  const getTrendPercentage = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? '+100%' : '0%';
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  if (loading != null) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error != null) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-red-600">
          <p className="font-semibold">Error loading executive stats</p>
          <p className="text-sm mt-2">{error}</p>
          <button
            onClick={fetchExecutiveStats}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      {overallStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Executives</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {overallStats.totalExecutives}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {overallStats.activeExecutives} active
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Onboarded</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {overallStats.totalBranchesOnboarded}
                </p>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {overallStats.thisMonthTotal}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(overallStats.thisMonthTotal, overallStats.lastMonthTotal)}
                  <p className="text-xs text-gray-500">
                    {getTrendPercentage(overallStats.thisMonthTotal, overallStats.lastMonthTotal)} vs last month
                  </p>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Last Month</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {overallStats.lastMonthTotal}
                </p>
                <p className="text-xs text-gray-500 mt-1">Previous period</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Executive Leaderboard */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Executive Leaderboard</h2>
            <button
              onClick={fetchExecutiveStats}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Executive
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Onboarded
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  This Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {executives.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No executives found
                  </td>
                </tr>
              ) : (
                executives.map((exec, index) => (
                  <tr key={exec.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index < 3 ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-sm">
                            {index + 1}
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-semibold text-sm">
                            {index + 1}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{exec.name}</div>
                        <div className="text-sm text-gray-500">{exec.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {exec.stats.totalOnboarded}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {exec.stats.activeCount}
                        <span className="text-gray-400 ml-1">
                          / {exec.stats.totalOnboarded}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {exec.stats.thisMonthCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getTrendIcon(exec.stats.thisMonthCount, exec.stats.lastMonthCount)}
                        <span className="text-sm text-gray-600">
                          {getTrendPercentage(exec.stats.thisMonthCount, exec.stats.lastMonthCount)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {exec.isActive ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

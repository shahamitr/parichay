// @ts-nocheck
'use client';

/**
 * Analytics Dashboard Component
 * Displays comprehensive analytics with charts and metrics
 */

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AnalyticsSummary {
  pageViews: number;
  clicks: number;
  qrScans: number;
  leadSubmits: number;
  totalEvents: number;
}

interface ChartDataPoint {
  date: string;
  pageViews: number;
  clicks: number;
  qrScans: number;
  leadSubmits: number;
}

interface AnalyticsData {
  summary: AnalyticsSummary;
  chartData: ChartDataPoint[];
  clickBreakdown: Record<string, number>;
  topLocations: { location: string; count: number }[];
}

interface AnalyticsDashboardProps {
  branchId?: string;
  brandId?: string;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AnalyticsDashboard({
  branchId,
  brandId,
}: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchAnalytics();
  }, [branchId, brandId, dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (branchId) params.append('branchId', branchId);
      if (brandId) params.append('brandId', brandId);
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);

      const response = await fetch(`/api/analytics/dashboard?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');

      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
  };

  if (loading != null) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading analytics...</div>
      </div>
    );
  }

  if (error != null) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
        {error}
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No analytics data available.</p>
      </div>
    );
  }

  const clickBreakdownData = Object.entries(analytics.clickBreakdown).map(
    ([name, value]) => ({ name, value })
  );

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            onClick={() => setDateRange({ startDate: '', endDate: '' })}
            className="mt-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-sm text-gray-600 mb-1">Page Views</div>
          <div className="text-3xl font-bold text-blue-600">
            {analytics.summary.pageViews.toLocaleString()}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-sm text-gray-600 mb-1">Clicks</div>
          <div className="text-3xl font-bold text-green-600">
            {analytics.summary.clicks.toLocaleString()}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-sm text-gray-600 mb-1">QR Scans</div>
          <div className="text-3xl font-bold text-yellow-600">
            {analytics.summary.qrScans.toLocaleString()}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-sm text-gray-600 mb-1">Lead Submissions</div>
          <div className="text-3xl font-bold text-red-600">
            {analytics.summary.leadSubmits.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Activity Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics.chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pageViews"
              stroke="#3B82F6"
              name="Page Views"
            />
            <Line type="monotone" dataKey="clicks" stroke="#10B981" name="Clicks" />
            <Line
              type="monotone"
              dataKey="qrScans"
              stroke="#F59E0B"
              name="QR Scans"
            />
            <Line
              type="monotone"
              dataKey="leadSubmits"
              stroke="#EF4444"
              name="Leads"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Click Breakdown */}
        {clickBreakdownData.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Click Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={clickBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {clickBreakdownData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top Locations */}
        {analytics.topLocations.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Top Locations</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.topLocations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

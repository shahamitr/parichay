// @ts-nocheck
'use client';

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
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  Users,
  Eye,
  Clock,
  MousePointer,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Calendar,
  Download,
  RefreshCw,
  Filter,
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { toast } from 'react-hot-toast';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

interface AnalyticsDashboardProps {
  brandId: string;
  branchId?: string;
}

export default function AdvancedAnalyticsDashboard({
  brandId,
  branchId,
}: AnalyticsDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [realtimeData, setRealtimeData] = useState<any>(null);
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...(branchId && { branchId }),
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });

      const response = await fetch(`/api/analytics/advanced?${params}`);
      const analyticsData = await response.json();

      if (response.ok) {
        setData(analyticsData);
      } else {
        toast.error('Failed to load analytics');
      }
    } catch (error) {
      console.error('Analytics error:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const fetchRealtime = async () => {
    try {
      const params = new URLSearchParams({
        ...(branchId && { branchId }),
        realtime: 'true',
      });

      const response = await fetch(`/api/analytics/advanced?${params}`);
      const realtimeAnalytics = await response.json();

      if (response.ok) {
        setRealtimeData(realtimeAnalytics);
      }
    } catch (error) {
      console.error('Realtime analytics error:', error);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchRealtime();

    // Refresh realtime data every 30 seconds
    const interval = setInterval(fetchRealtime, 30000);
    return () => clearInterval(interval);
  }, [brandId, branchId, dateRange]);

  const exportData = () => {
    const csv = generateCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${dateRange.startDate}-to-${dateRange.endDate}.csv`;
    a.click();
    toast.success('Analytics exported!');
  };

  const generateCSV = (data: any) => {
    // Simple CSV generation
    let csv = 'Metric,Value\n';
    csv += `Total Views,${data.totalViews}\n`;
    csv += `Unique Visitors,${data.uniqueVisitors}\n`;
    csv += `Avg Time on Page,${data.avgTimeOnPage}s\n`;
    csv += `Bounce Rate,${data.bounceRate}%\n`;
    return csv;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
          <p className="text-gray-600 mt-1">Comprehensive insights into your performance</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchAnalytics}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={exportData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-gray-400" />
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Real-time Stats */}
      {realtimeData && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Now</p>
              <p className="text-3xl font-bold">{realtimeData.activeVisitors}</p>
              <p className="text-green-100 text-sm mt-1">visitors in last 5 minutes</p>
            </div>
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={<Eye className="w-6 h-6" />}
          title="Total Views"
          value={data.totalViews.toLocaleString()}
          color="blue"
        />
        <MetricCard
          icon={<Users className="w-6 h-6" />}
          title="Unique Visitors"
          value={data.uniqueVisitors.toLocaleString()}
          color="green"
        />
        <MetricCard
          icon={<Clock className="w-6 h-6" />}
          title="Avg Time on Page"
          value={`${data.avgTimeOnPage}s`}
          color="purple"
        />
        <MetricCard
          icon={<MousePointer className="w-6 h-6" />}
          title="Bounce Rate"
          value={`${data.bounceRate}%`}
          color="orange"
        />
      </div>

      {/* Daily Traffic Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Traffic Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.dailyTraffic}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="views" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Views" />
            <Area type="monotone" dataKey="visitors" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Visitors" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Device & Browser Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Device Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.deviceBreakdown}
                dataKey="count"
                nameKey="device"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(entry) => `${entry.device}: ${entry.percentage.toFixed(1)}%`}
              >
                {data.deviceBreakdown.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Browser Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Browser Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.browserBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="browser" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hourly Traffic */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Traffic by Hour</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.hourlyTraffic}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Conversion Funnel</h3>
        <div className="space-y-4">
          {data.conversionFunnel.map((step: any, index: number) => (
            <div key={index} className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{step.step}</span>
                <span className="text-sm text-gray-600">
                  {step.count} ({index > 0 ? `${step.dropoff.toFixed(1)}% dropoff` : '100%'})
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                  style={{
                    width: `${index === 0 ? 100 : 100 - step.dropoff}%`,
                  }}
                >
                  {step.count}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Pages & Referrers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Top Pages</h3>
          <div className="space-y-3">
            {data.topPages.slice(0, 5).map((page: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 truncate flex-1">{page.page}</span>
                <span className="text-sm font-medium ml-2">{page.views} views</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Referrers */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Top Referrers</h3>
          <div className="space-y-3">
            {data.topReferrers.slice(0, 5).map((referrer: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 truncate flex-1">{referrer.referrer}</span>
                <span className="text-sm font-medium ml-2">{referrer.count} visits</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, title, value, color }: any) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} mb-4`}>
        {icon}
      </div>
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  QrCode,
  MousePointerClick,
  ArrowUp,
  ArrowDown,
  Calendar,
  Loader2,
  TrendingUp,
  Eye,
  Clock
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import AdvancedSearch from '@/components/dashboard/AdvancedSearch';
import { StatCard } from '@/components/dashboard/DataVisualization';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics?period=${period}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  const lineChartData = {
    labels: data?.chartData?.labels || [],
    datasets: [
      {
        label: 'Page Views',
        data: data?.chartData?.data || [],
        fill: true,
        borderColor: 'rgb(99, 102, 241)', // Indigo 500
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your microsite performance and lead generation
          </p>
        </div>
        <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => setPeriod('7d')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${period === '7d'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:text-gray-900'
              }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setPeriod('30d')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${period === '30d'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:text-gray-900'
              }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setPeriod('90d')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${period === '90d'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:text-gray-900'
              }`}
          >
            90 Days
          </button>
        </div>
      </div>

      {/* Advanced Search */}
      <AdvancedSearch
        onSearch={(query, filters) => {
          console.log('Search:', query, filters);
        }}
        placeholder="Search analytics data..."
        availableFilters={[
          { field: 'date', label: 'Date Range', type: 'date' },
          { field: 'branch', label: 'Branch', type: 'text' },
          { field: 'metric', label: 'Metric', type: 'select', options: [
            { value: 'views', label: 'Views' },
            { value: 'leads', label: 'Leads' },
            { value: 'scans', label: 'QR Scans' },
          ]},
        ]}
      />

      {/* Enhanced Stats Grid with Animated Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Views"
          value={data?.stats?.views || 0}
          change={12}
          trend="up"
          icon={<Eye className="w-6 h-6 text-blue-600" />}
          color="blue"
        />
        <StatCard
          title="Total Leads"
          value={data?.stats?.leads || 0}
          change={8}
          trend="up"
          icon={<Users className="w-6 h-6 text-green-600" />}
          color="green"
        />
        <StatCard
          title="QR Scans"
          value={data?.stats?.qrScans || 0}
          change={-2}
          trend="down"
          icon={<QrCode className="w-6 h-6 text-purple-600" />}
          color="purple"
        />
        <StatCard
          title="Avg. Session"
          value="3m 24s"
          change={5}
          trend="up"
          icon={<Clock className="w-6 h-6 text-orange-600" />}
          color="orange"
        />
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Traffic Overview</h3>
        <div className="h-80">
          <Line options={chartOptions} data={lineChartData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Branches */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Branches</h3>
          <div className="space-y-4">
            {data?.topBranches?.length > 0 ? (
              data.topBranches.map((branch: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white rounded-full border border-gray-200 font-semibold text-gray-700">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900">{branch.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{branch.views}</span>
                    <span className="text-xs text-gray-500">views</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No data available</p>
            )}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Leads</h3>
          <div className="space-y-4">
            {data?.recentLeads?.length > 0 ? (
              data.recentLeads.map((lead: any) => (
                <div key={lead.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                    {lead.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{lead.name}</p>
                    <p className="text-xs text-gray-500 truncate">{lead.email || lead.phone}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(lead.createdAt).toLocaleDateString()} • {lead.branch?.name}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No leads yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, trend, color }: any) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${colors[color as keyof typeof colors]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend !== 0 && (
          <div className={`flex items-center text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
      </div>
    </div>
  );
}

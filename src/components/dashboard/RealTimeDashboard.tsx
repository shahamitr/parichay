
'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Eye,
  Users,
  QrCode,
  Download,
  Link2,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Clock,
  RefreshCw,
  ArrowUpRight,
  BarChart3,
  Target,
} from 'lucide-react';
import Link from 'next/link';

interface Metrics {
  pageViews: number;
  qrScans: number;
  leads: number;
  vcardDownloads: number;
  shortLinkClicks: number;
  branches: number;
  totalLeads: number;
  conversionRate: number;
  liveVisitors: number;
}

interface RecentEvent {
  id: string;
  type: string;
  branch: string;
  brand: string;
  timestamp: string;
  metadata?: any;
}

interface TopBranch {
  id: string;
  name: string;
  views: number;
  slug?: string;
}

interface RealTimeDashboardProps {
  brandId?: string;
}

const eventTypeLabels: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PAGE_VIEW: { label: 'Page View', color: 'bg-blue-500', icon: <Eye className="w-3 h-3" /> },
  QR_SCAN: { label: 'QR Scan', color: 'bg-purple-500', icon: <QrCode className="w-3 h-3" /> },
  LEAD_SUBMIT: { label: 'New Lead', color: 'bg-green-500', icon: <Users className="w-3 h-3" /> },
  VCARD_DOWNLOAD: { label: 'vCard Download', color: 'bg-orange-500', icon: <Download className="w-3 h-3" /> },
  SHORT_LINK_CLICK: { label: 'Link Click', color: 'bg-pink-500', icon: <Link2 className="w-3 h-3" /> },
  CLICK: { label: 'Click', color: 'bg-gray-500', icon: <Activity className="w-3 h-3" /> },
};

export default function RealTimeDashboard({ brandId }: RealTimeDashboardProps) {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [topBranches, setTopBranches] = useState<TopBranch[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const params = new URLSearchParams({ period });
      if (brandId) params.append('brandId', brandId);

      const response = await fetch(`/api/analytics/realtime?${params}`);
      if (response.ok) {
        const data = await response.json();
        setMetrics(data.metrics);
        setRecentEvents(data.recentEvents);
        setTopBranches(data.topBranches);
        setLastUpdated(new Date(data.lastUpdated));
      }
    } catch (error) {
      console.error('Error fetching real-time data:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [brandId, period]);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (loading != null) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse border border-gray-200 dark:border-gray-700">
              <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Live Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Real-time</span>
          </div>
          {metrics?.liveVisitors !== undefined && metrics.liveVisitors > 0 && (
            <div className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-xs font-medium border border-red-100 dark:border-red-900/30">
              <Zap className="w-3.5 h-3.5" />
              {metrics.liveVisitors} active users
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(['today', 'week', 'month'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${period === p
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          {/* Refresh Button */}
          <button
            onClick={fetchData}
            disabled={isRefreshing}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Page Views */}
        <MetricCard
          title="Page Views"
          value={metrics?.pageViews || 0}
          icon={<Eye className="w-5 h-5" />}
          color="blue"
          trend={12}
        />
        {/* QR Scans */}
        <MetricCard
          title="QR Scans"
          value={metrics?.qrScans || 0}
          icon={<QrCode className="w-5 h-5" />}
          color="purple"
          trend={8}
        />
        {/* New Leads */}
        <MetricCard
          title="New Leads"
          value={metrics?.leads || 0}
          icon={<Users className="w-5 h-5" />}
          color="green"
          trend={15}
          highlight
        />
        {/* Conversion Rate */}
        <MetricCard
          title="Conversion Rate"
          value={`${metrics?.conversionRate || 0}%`}
          icon={<Target className="w-5 h-5" />}
          color="orange"
          trend={5}
        />
        {/* vCard Downloads */}
        <MetricCard
          title="vCard Downloads"
          value={metrics?.vcardDownloads || 0}
          icon={<Download className="w-5 h-5" />}
          color="pink"
          trend={-3}
        />
        {/* Link Clicks */}
        <MetricCard
          title="Link Clicks"
          value={metrics?.shortLinkClicks || 0}
          icon={<Link2 className="w-5 h-5" />}
          color="indigo"
          trend={22}
        />
        {/* Active Branches */}
        <MetricCard
          title="Active Branches"
          value={metrics?.branches || 0}
          icon={<BarChart3 className="w-5 h-5" />}
          color="teal"
        />
        {/* Total Leads */}
        <MetricCard
          title="Total Leads"
          value={metrics?.totalLeads || 0}
          icon={<Users className="w-5 h-5" />}
          color="gray"
          subtitle="All time"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Activity Feed */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Live Activity</h3>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Updated {lastUpdated ? getTimeAgo(lastUpdated.toISOString()) : 'now'}
            </span>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-700 max-h-96 overflow-y-auto">
            {recentEvents.length > 0 ? (
              recentEvents.map((event) => {
                const eventInfo = eventTypeLabels[event.type] || eventTypeLabels.CLICK;
                return (
                  <div
                    key={event.id}
                    className="px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-4 group"
                  >
                    <div className={`w-8 h-8 rounded-full ${eventInfo.color} text-white flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      {eventInfo.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate group-hover:text-gray-900 dark:group-hover:text-white">
                        {eventInfo.label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {event.branch}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                      <Clock className="w-3 h-3" />
                      {getTimeAgo(event.timestamp)}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                <Activity className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Performing Branches */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2 bg-gray-50/50 dark:bg-gray-800/50">
            <TrendingUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Top Performing Branches</h3>
          </div>
          <div className="p-6">
            {topBranches.length > 0 ? (
              <div className="space-y-5">
                {topBranches.map((branch, index) => {
                  const maxViews = topBranches[0]?.views || 1;
                  const percentage = (branch.views / maxViews) * 100;
                  return (
                    <div key={branch.id} className="space-y-2 group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            index === 1 ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' :
                              index === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                'bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                            }`}>
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{branch.name}</span>
                        </div>
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {formatNumber(branch.views)} views
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${index === 0 ? 'bg-blue-500' :
                            index === 1 ? 'bg-blue-400' :
                              index === 2 ? 'bg-blue-300' :
                                'bg-blue-200 dark:bg-blue-800'
                            }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                <p>No data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionCard
            title="View All Leads"
            description="Manage your leads"
            href="/dashboard/leads"
            icon={<Users className="w-5 h-5" />}
            color="green"
          />
          <QuickActionCard
            title="Analytics"
            description="Detailed reports"
            href="/dashboard/analytics"
            icon={<BarChart3 className="w-5 h-5" />}
            color="blue"
          />
          <QuickActionCard
            title="Short Links"
            description="Manage links"
            href="/dashboard/short-links"
            icon={<Link2 className="w-5 h-5" />}
            color="purple"
          />
          <QuickActionCard
            title="Social & Reviews"
            description="Manage reviews"
            href="/dashboard/social"
            icon={<Activity className="w-5 h-5" />}
            color="orange"
          />
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({
  title,
  value,
  icon,
  color,
  trend,
  highlight,
  subtitle,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  trend?: number;
  highlight?: boolean;
  subtitle?: string;
}) {
  const colorClasses: Record<string, { bg: string; text: string; iconBg: string }> = {
    blue: { bg: 'bg-blue-50 dark:bg-blue-900/10', text: 'text-blue-600 dark:text-blue-400', iconBg: 'bg-blue-50 dark:bg-blue-900/20' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-900/10', text: 'text-purple-600 dark:text-purple-400', iconBg: 'bg-purple-50 dark:bg-purple-900/20' },
    green: { bg: 'bg-green-50 dark:bg-green-900/10', text: 'text-green-600 dark:text-green-400', iconBg: 'bg-green-50 dark:bg-green-900/20' },
    orange: { bg: 'bg-orange-50 dark:bg-orange-900/10', text: 'text-orange-600 dark:text-orange-400', iconBg: 'bg-orange-50 dark:bg-orange-900/20' },
    pink: { bg: 'bg-pink-50 dark:bg-pink-900/10', text: 'text-pink-600 dark:text-pink-400', iconBg: 'bg-pink-50 dark:bg-pink-900/20' },
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/10', text: 'text-indigo-600 dark:text-indigo-400', iconBg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    teal: { bg: 'bg-teal-50 dark:bg-teal-900/10', text: 'text-teal-600 dark:text-teal-400', iconBg: 'bg-teal-50 dark:bg-teal-900/20' },
    gray: { bg: 'bg-gray-50 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', iconBg: 'bg-gray-50 dark:bg-gray-800' },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
    return val.toString();
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow ${highlight ? 'ring-1 ring-green-500/50' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${colors.iconBg} ${colors.text}`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-0.5 text-xs font-medium ${trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
        {formatValue(value)}
      </div>
      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{title}</div>
      {subtitle && <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</div>}
    </div>
  );
}

// Quick Action Card Component
function QuickActionCard({
  title,
  description,
  href,
  icon,
  color,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    green: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 group-hover:bg-green-100 dark:group-hover:bg-green-900/30',
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30',
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30',
    orange: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30',
  };

  return (
    <Link
      href={href}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 transition-all hover:shadow-md group flex items-center gap-4"
    >
      <div className={`p-3 rounded-lg ${colorClasses[color]} transition-colors`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{title}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{description}</div>
      </div>
      <ArrowUpRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
    </Link>
  );
}

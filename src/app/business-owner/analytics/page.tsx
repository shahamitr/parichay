'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  Eye,
  Users,
  Calendar,
  Star,
  MapPin,
  Clock,
  Download,
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalViews: number;
    uniqueVisitors: number;
    totalLeads: number;
    conversionRate: number;
    avgSessionDuration: number;
    bounceRate: number;
  };
  trends: {
    viewsChange: number;
    leadsChange: number;
    conversionChange: number;
  };
  topSources: Array<{
    source: string;
    visits: number;
    percentage: number;
  }>;
  topPages: Array<{
    page: string;
    views: number;
    uniqueViews: number;
  }>;
  geographicData: Array<{
    location: string;
    visits: number;
    percentage: number;
  }>;
  timeData: Array<{
    hour: number;
    visits: number;
  }>;
  deviceData: Array<{
    device: string;
    visits: number;
    percentage: number;
  }>;
}

export default function BusinessAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Mock data for demo - in production, fetch from API
      const mockData: AnalyticsData = {
        overview: {
          totalViews: 1247,
          uniqueVisitors: 892,
          totalLeads: 89,
          conversionRate: 7.1,
          avgSessionDuration: 142, // seconds
          bounceRate: 34.2
        },
        trends: {
          viewsChange: 23.5,
          leadsChange: 15.8,
          conversionChange: -2.1
        },
        topSources: [
          { source: 'Direct', visits: 456, percentage: 36.6 },
          { source: 'Google Search', visits: 312, percentage: 25.0 },
          { source: 'Social Media', visits: 234, percentage: 18.8 },
          { source: 'QR Code', visits: 156, percentage: 12.5 },
          { source: 'Referral', visits: 89, percentage: 7.1 }
        ],
        topPages: [
          { page: '/profile', views: 567, uniqueViews: 423 },
          { page: '/services', views: 234, uniqueViews: 198 },
          { page: '/contact', views: 189, uniqueViews: 156 },
          { page: '/portfolio', views: 145, uniqueViews: 123 },
          { page: '/about', views: 112, uniqueViews: 98 }
        ],
        geographicData: [
          { location: 'New York, NY', visits: 234, percentage: 18.8 },
          { location: 'Los Angeles, CA', visits: 189, percentage: 15.2 },
          { location: 'Chicago, IL', visits: 156, percentage: 12.5 },
          { location: 'Houston, TX', visits: 123, percentage: 9.9 },
          { location: 'Phoenix, AZ', visits: 98, percentage: 7.9 }
        ],
        timeData: [
          { hour: 0, visits: 12 },
          { hour: 1, visits: 8 },
          { hour: 2, visits: 5 },
          { hour: 3, visits: 3 },
          { hour: 4, visits: 4 },
          { hour: 5, visits: 7 },
          { hour: 6, visits: 15 },
          { hour: 7, visits: 28 },
          { hour: 8, visits: 45 },
          { hour: 9, visits: 67 },
          { hour: 10, visits: 89 },
          { hour: 11, visits: 78 },
          { hour: 12, visits: 92 },
          { hour: 13, visits: 85 },
          { hour: 14, visits: 76 },
          { hour: 15, visits: 82 },
          { hour: 16, visits: 74 },
          { hour: 17, visits: 68 },
          { hour: 18, visits: 59 },
          { hour: 19, visits: 45 },
          { hour: 20, visits: 34 },
          { hour: 21, visits: 28 },
          { hour: 22, visits: 22 },
          { hour: 23, visits: 16 }
        ],
        deviceData: [
          { device: 'Mobile', visits: 623, percentage: 50.0 },
          { device: 'Desktop', visits: 436, percentage: 35.0 },
          { device: 'Tablet', visits: 188, percentage: 15.0 }
        ]
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalyticsData();
    setRefreshing(false);
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (change < 0) return <ArrowDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/business-owner/dashboard" className="text-blue-600 hover:text-blue-800">
                ← Dashboard
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-lg font-semibold text-gray-900">Analytics</h1>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData?.overview.totalViews.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(analyticsData?.trends.viewsChange || 0)}
                  <span className={`text-sm font-medium ${getTrendColor(analyticsData?.trends.viewsChange || 0)}`}>
                    {Math.abs(analyticsData?.trends.viewsChange || 0)}% vs last period
                  </span>
                </div>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unique Visitors</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData?.overview.uniqueVisitors.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {((analyticsData?.overview.uniqueVisitors || 0) / (analyticsData?.overview.totalViews || 1) * 100).toFixed(1)}% of total views
                </p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData?.overview.totalLeads}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(analyticsData?.trends.leadsChange || 0)}
                  <span className={`text-sm font-medium ${getTrendColor(analyticsData?.trends.leadsChange || 0)}`}>
                    {Math.abs(analyticsData?.trends.leadsChange || 0)}% vs last period
                  </span>
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData?.overview.conversionRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(analyticsData?.trends.conversionChange || 0)}
                  <span className={`text-sm font-medium ${getTrendColor(analyticsData?.trends.conversionChange || 0)}`}>
                    {Math.abs(analyticsData?.trends.conversionChange || 0)}% vs last period
                  </span>
                </div>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Session Duration</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatDuration(analyticsData?.overview.avgSessionDuration || 0)}
                </p>
                <p className="text-sm text-gray-500 mt-1">Time spent on site</p>
              </div>
              <Clock className="w-8 h-8 text-indigo-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bounce Rate</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData?.overview.bounceRate}%</p>
                <p className="text-sm text-gray-500 mt-1">Single page visits</p>
              </div>
              <BarChart3 className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Charts and Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Traffic Sources */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
            <div className="space-y-4">
              {analyticsData?.topSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500" style={{
                      backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                    }}></div>
                    <span className="text-sm font-medium text-gray-900">{source.source}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{source.visits.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{source.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Pages */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
            <div className="space-y-4">
              {analyticsData?.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{page.page}</div>
                    <div className="text-xs text-gray-500">{page.uniqueViews} unique views</div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">{page.views.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Geographic Data */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Locations</h3>
            <div className="space-y-4">
              {analyticsData?.geographicData.map((location, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{location.location}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{location.visits.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{location.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Data */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Types</h3>
            <div className="space-y-4">
              {analyticsData?.deviceData.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500" style={{
                      backgroundColor: `hsl(${index * 120}, 70%, 50%)`
                    }}></div>
                    <span className="text-sm font-medium text-gray-900">{device.device}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{device.visits.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{device.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hourly Traffic Chart */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Traffic Pattern</h3>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-2" />
              <p className="text-gray-600">Interactive hourly traffic chart</p>
              <p className="text-sm text-gray-500">Peak hours: 12 PM - 3 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
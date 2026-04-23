'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Users,
  Calendar,
  MessageSquare,
  TrendingUp,
  Eye,
  Phone,
  Mail,
  MapPin,
  Star,
  Clock,
  DollarSign,
  Target,
  Activity,
  Settings,
  Bell,
  Download,
  Filter,
  Search,
  Plus
} from 'lucide-react';

interface DashboardStats {
  totalViews: number;
  totalLeads: number;
  totalAppointments: number;
  conversionRate: number;
  avgRating: number;
  totalReviews: number;
  monthlyGrowth: number;
  activeOffers: number;
}

interface RecentActivity {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
}

export default function BusinessOwnerDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Mock data for demo - in production, fetch from API
      const mockStats: DashboardStats = {
        totalViews: 1247,
        totalLeads: 89,
        totalAppointments: 34,
        conversionRate: 7.1,
        avgRating: 4.8,
        totalReviews: 156,
        monthlyGrowth: 23.5,
        activeOffers: 3
      };

      const mockActivity: RecentActivity[] = [
        {
          id: '1',
          type: 'lead',
          title: 'New Lead from Website',
          description: 'Sarah Johnson inquired about hair styling services',
          timestamp: '2024-01-24T10:30:00Z'
        },
        {
          id: '2',
          type: 'appointment',
          title: 'Appointment Booked',
          description: 'Mike Chen scheduled a consultation for tomorrow',
          timestamp: '2024-01-24T09:15:00Z'
        },
        {
          id: '3',
          type: 'review',
          title: 'New 5-Star Review',
          description: 'Emma Davis left a positive review about your service',
          timestamp: '2024-01-24T08:45:00Z'
        },
        {
          id: '4',
          type: 'view',
          title: 'Profile Views Spike',
          description: 'Your profile received 45 views in the last hour',
          timestamp: '2024-01-24T08:00:00Z'
        }
      ];

      const mockLeads: Lead[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah.j@email.com',
          phone: '+1 (555) 123-4567',
          message: 'Interested in hair styling services for a wedding event',
          source: 'website',
          status: 'new',
          priority: 'high',
          createdAt: '2024-01-24T10:30:00Z'
        },
        {
          id: '2',
          name: 'Mike Chen',
          email: 'mike.chen@email.com',
          phone: '+1 (555) 987-6543',
          message: 'Looking for business consultation services',
          source: 'qr_code',
          status: 'contacted',
          priority: 'medium',
          createdAt: '2024-01-24T09:15:00Z'
        },
        {
          id: '3',
          name: 'Emma Davis',
          phone: '+1 (555) 456-7890',
          message: 'Need plumbing repair services urgently',
          source: 'social_share',
          status: 'qualified',
          priority: 'high',
          createdAt: '2024-01-23T16:20:00Z'
        }
      ];

      setStats(mockStats);
      setRecentActivity(mockActivity);
      setRecentLeads(mockLeads);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lead': return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'appointment': return <Calendar className="w-4 h-4 text-green-600" />;
      case 'review': return <Star className="w-4 h-4 text-yellow-600" />;
      case 'view': return <Eye className="w-4 h-4 text-purple-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
              <Link href="/" className="text-xl font-bold text-blue-600">
                Parichay
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-lg font-semibold text-gray-900">Business Dashboard</h1>
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

              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5" />
              </button>

              <Link
                href="/admin/settings"
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <Settings className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Profile Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalViews.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">+{stats?.monthlyGrowth}% this month</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalLeads}</p>
                <p className="text-sm text-blue-600 mt-1">{stats?.conversionRate}% conversion rate</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalAppointments}</p>
                <p className="text-sm text-purple-600 mt-1">This month</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.avgRating}</p>
                <p className="text-sm text-yellow-600 mt-1">{stats?.totalReviews} reviews</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charts and Analytics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Chart */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg">Views</button>
                  <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Leads</button>
                  <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Bookings</button>
                </div>
              </div>

              {/* Mock Chart Area */}
              <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                  <p className="text-gray-600">Interactive charts will be displayed here</p>
                  <p className="text-sm text-gray-500">Showing {dateRange} data</p>
                </div>
              </div>
            </div>

            {/* Recent Leads */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
                <Link
                  href="/business-owner/leads"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All →
                </Link>
              </div>

              <div className="space-y-4">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{lead.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(lead.priority)}`}>
                          {lead.priority}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">{lead.message}</p>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {lead.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span>{lead.email}</span>
                          </div>
                        )}
                        {lead.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Activity and Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

              <div className="space-y-3">
                <Link
                  href="/business-owner/profile/edit"
                  className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Edit Profile</span>
                </Link>

                <Link
                  href="/business-owner/leads"
                  className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">Manage Leads</span>
                </Link>

                <Link
                  href="/business-owner/appointments"
                  className="flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-900">View Appointments</span>
                </Link>

                <Link
                  href="/business-owner/analytics"
                  className="flex items-center gap-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                >
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                  <span className="font-medium text-orange-900">View Analytics</span>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>

              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Profile Views</span>
                  </div>
                  <span className="text-sm font-bold text-green-700">+23%</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Lead Quality</span>
                  </div>
                  <span className="text-sm font-bold text-blue-700">High</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-900">Customer Satisfaction</span>
                  </div>
                  <span className="text-sm font-bold text-yellow-700">4.8/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
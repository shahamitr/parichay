'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { usePageHelp } from '@/hooks/usePageHelp';
import {
  Eye,
  Users,
  Phone as PhoneIcon,
  MessageCircle,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Share2,
  ExternalLink,
  Pencil,
  AlertCircle,
  BarChart3,
  Calendar,
} from 'lucide-react';

interface DashboardStats {
  pageViews: number;
  leadsThisWeek: number;
  calls: number;
  whatsappMessages: number;
}

interface Lead {
  id: string;
  name: string;
  createdAt: string;
  source: string;
  status: string;
}

interface ActionData {
  action: string;
  label: string;
  count: number;
  trend: number;
  trendDirection: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    pageViews: 0,
    leadsThisWeek: 0,
    calls: 0,
    whatsappMessages: 0,
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [actions, setActions] = useState<ActionData[]>([]);

  usePageHelp({ pageContext: 'Dashboard' });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [analyticsRes, actionsRes, leadsRes] = await Promise.all([
        fetch('/api/analytics/dashboard', { credentials: 'include' }),
        fetch('/api/analytics/actions?period=7d', { credentials: 'include' }),
        fetch('/api/leads?limit=5', { credentials: 'include' }),
      ]);

      // Process analytics
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setStats((prev) => ({
          ...prev,
          pageViews: analyticsData.summary?.pageViews || 0,
          leadsThisWeek: analyticsData.summary?.leadSubmits || 0,
        }));
      }

      // Process actions
      if (actionsRes.ok) {
        const actionsData = await actionsRes.json();
        setActions(actionsData.actions || []);
        const callAction = actionsData.actions?.find((a: ActionData) => a.action === 'call');
        const whatsappAction = actionsData.actions?.find((a: ActionData) => a.action === 'whatsapp');
        setStats((prev) => ({
          ...prev,
          calls: callAction?.count || 0,
          whatsappMessages: whatsappAction?.count || 0,
        }));
      }

      // Process leads
      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        const leads = leadsData.leads || leadsData.data || leadsData || [];
        setRecentLeads(
          (Array.isArray(leads) ? leads : []).slice(0, 5).map((l: any) => ({
            id: l.id,
            name: l.name || l.firstName || 'Unknown',
            createdAt: l.createdAt,
            source: l.source || 'Direct',
            status: l.status || 'new',
          }))
        );
      }
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const greeting =
    new Date().getHours() < 12
      ? 'Good morning'
      : new Date().getHours() < 17
        ? 'Good afternoon'
        : 'Good evening';

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
      });
    } catch {
      return '—';
    }
  };

  const statusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-700',
      contacted: 'bg-yellow-100 text-yellow-700',
      qualified: 'bg-green-100 text-green-700',
      converted: 'bg-emerald-100 text-emerald-700',
      lost: 'bg-gray-100 text-gray-500',
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-6 max-w-[1200px]">
        <div className="h-7 w-48 bg-gray-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 h-64 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 lg:p-8 max-w-[1200px]">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
          <h2 className="text-[16px] font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-[13px] text-gray-500 mb-6 max-w-sm">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-[13px] font-medium rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1200px]">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-semibold text-gray-900 tracking-[-0.01em]">
            {greeting}, {user?.firstName || 'there'}
          </h1>
          <p className="text-[13px] text-gray-500 mt-1">
            Here&apos;s how your business is doing this week
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Profile Views', value: stats.pageViews, icon: Eye, color: 'text-blue-600 bg-blue-50' },
          { label: 'Leads This Week', value: stats.leadsThisWeek, icon: Users, color: 'text-green-600 bg-green-50' },
          { label: 'Calls', value: stats.calls, icon: PhoneIcon, color: 'text-violet-600 bg-violet-50' },
          { label: 'WhatsApp Messages', value: stats.whatsappMessages, icon: MessageCircle, color: 'text-emerald-600 bg-emerald-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-200 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[22px] font-semibold text-gray-900 tracking-[-0.02em]">
              {stat.value.toLocaleString('en-IN')}
            </p>
            <p className="text-[12px] text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Chart placeholder + Recent leads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart placeholder */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-gray-900">Activity Overview</h3>
            <div className="flex items-center gap-1 text-[12px] text-gray-400">
              <BarChart3 className="w-3.5 h-3.5" />
              Last 7 days
            </div>
          </div>
          <div className="h-48 flex items-center justify-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <div className="text-center">
              <BarChart3 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-[13px] text-gray-400">Chart coming soon</p>
              <p className="text-[11px] text-gray-300 mt-1">Recharts integration placeholder</p>
            </div>
          </div>

          {/* Action breakdown below chart */}
          {actions.length > 0 && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-[12px] font-medium text-gray-500 mb-3">Action Breakdown</p>
              <div className="flex flex-wrap gap-3">
                {actions.slice(0, 5).map((action) => (
                  <div key={action.action} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                    <span className="text-[12px] text-gray-600">{action.label}</span>
                    <span className="text-[12px] font-semibold text-gray-900">{action.count}</span>
                    {action.trend !== 0 && (
                      <span className={`text-[11px] ${action.trendDirection === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                        {action.trendDirection === 'up' ? '↑' : '↓'}{Math.abs(action.trend)}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Leads */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-gray-900">Recent Leads</h3>
            <button
              onClick={() => router.push('/admin/leads')}
              className="text-[12px] text-primary-600 hover:text-primary-700 font-medium"
            >
              View all
            </button>
          </div>

          {recentLeads.length === 0 ? (
            <div className="py-8 text-center">
              <Users className="w-8 h-8 text-gray-200 mx-auto mb-2" />
              <p className="text-[13px] text-gray-400">No leads yet</p>
              <p className="text-[11px] text-gray-300 mt-1">Share your profile to start getting leads</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-[12px] font-medium text-gray-600">
                      {lead.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-gray-800 truncate">{lead.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-gray-400">{formatDate(lead.createdAt)}</span>
                      <span className="text-[11px] text-gray-300">•</span>
                      <span className="text-[11px] text-gray-400">{lead.source}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h3 className="text-[14px] font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              label: 'Share Profile',
              desc: 'Share your digital card via WhatsApp or link',
              icon: Share2,
              color: 'bg-green-50 text-green-600',
              action: () => {
                if (navigator.share) {
                  navigator.share({ title: 'My Parichay Profile', url: window.location.origin + '/' + (user as any)?.brand?.slug });
                } else {
                  router.push('/admin/share');
                }
              },
            },
            {
              label: 'View Microsite',
              desc: 'See how your profile looks to visitors',
              icon: ExternalLink,
              color: 'bg-blue-50 text-blue-600',
              action: () => {
                const brandSlug = (user as any)?.brand?.slug;
                if (brandSlug) window.open(`/${brandSlug}`, '_blank');
                else router.push('/admin/brands');
              },
            },
            {
              label: 'Edit Services',
              desc: 'Update your business services & offerings',
              icon: Pencil,
              color: 'bg-violet-50 text-violet-600',
              action: () => router.push('/admin/branches'),
            },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all text-left group"
            >
              <div className={`w-9 h-9 rounded-lg ${item.color} flex items-center justify-center flex-shrink-0`}>
                <item.icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-medium text-gray-800 group-hover:text-gray-900">{item.label}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{item.desc}</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-400 mt-1 group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

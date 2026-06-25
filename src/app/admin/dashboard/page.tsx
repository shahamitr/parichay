'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { usePageHelp } from '@/hooks/usePageHelp';
import {
  Building2,
  GitBranch,
  Users,
  Eye,
  TrendingUp,
  ArrowRight,
  Calendar,
  BarChart3,
  QrCode,
  Zap,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ views: 0, leads: 0, clicks: 0, conversion: 0 });

  usePageHelp({ pageContext: 'Dashboard' });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/analytics/dashboard', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setStats({
            views: data.summary?.pageViews || 0,
            leads: data.summary?.leadSubmits || 0,
            clicks: data.summary?.clicks || 0,
            conversion: data.summary?.pageViews ? Math.round((data.summary.leadSubmits / data.summary.pageViews) * 1000) / 10 : 0,
          });
        }
      } catch {}
      setLoading(false);
    })();
  }, []);

  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening';

  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-6">
        <div className="h-7 w-48 bg-gray-100 rounded-lg skeleton" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl skeleton" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1200px]">
      {/* Greeting */}
      <div>
        <h1 className="text-[20px] font-semibold text-gray-900 tracking-[-0.01em]">
          {greeting}, {user?.firstName || 'there'}
        </h1>
        <p className="text-[13px] text-gray-500 mt-1">
          Here&apos;s how your business is doing this month
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Profile Views', value: stats.views, icon: Eye, color: 'text-blue-600 bg-blue-50' },
          { label: 'Leads', value: stats.leads, icon: Users, color: 'text-green-600 bg-green-50' },
          { label: 'Link Clicks', value: stats.clicks, icon: TrendingUp, color: 'text-violet-600 bg-violet-50' },
          { label: 'Conversion', value: `${stats.conversion}%`, icon: BarChart3, color: 'text-amber-600 bg-amber-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-200 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[22px] font-semibold text-gray-900 tracking-[-0.02em]">{stat.value}</p>
            <p className="text-[12px] text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-5">
          <h3 className="text-[14px] font-semibold text-gray-900 mb-4">Quick actions</h3>
          <div className="space-y-1">
            {[
              { label: 'Add new brand', icon: Building2, href: '/admin/brands?action=new', color: 'bg-blue-50 text-blue-600' },
              { label: 'Add new branch', icon: GitBranch, href: '/admin/branches?action=new', color: 'bg-emerald-50 text-emerald-600' },
              { label: 'View leads', icon: Users, href: '/admin/leads', color: 'bg-violet-50 text-violet-600' },
              { label: 'Generate QR code', icon: QrCode, href: '/admin/qr-codes', color: 'bg-amber-50 text-amber-600' },
            ].map((a) => (
              <button
                key={a.label}
                onClick={() => router.push(a.href)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-gray-50 transition-colors group"
              >
                <div className={`w-8 h-8 rounded-lg ${a.color} flex items-center justify-center flex-shrink-0`}>
                  <a.icon className="w-4 h-4" />
                </div>
                <span className="text-[13px] font-medium text-gray-700 group-hover:text-gray-900 flex-1">{a.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Getting Started / Tips */}
        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-5">
          <h3 className="text-[14px] font-semibold text-gray-900 mb-4">Getting the most out of Parichay</h3>
          <div className="space-y-3">
            {[
              { title: 'Complete your profile', desc: 'Add services, photos, and timings to get more views', done: false },
              { title: 'Share your link on WhatsApp', desc: 'Send your profile URL to existing customers', done: false },
              { title: 'Print your QR code', desc: 'Add it to your visiting card, shop banner, or menu', done: false },
              { title: 'Check your leads daily', desc: 'Respond to enquiries within 2 hours for best results', done: false },
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/70">
                <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] font-medium text-gray-800">{tip.title}</p>
                  <p className="text-[12px] text-gray-500 mt-0.5">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

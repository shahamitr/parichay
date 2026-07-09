'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Eye, Users, Phone, MessageCircle, Star, Share2, ExternalLink,
  Pencil, QrCode, Copy, Check, Clock, ArrowRight, Loader2,
  RefreshCw, Settings, UserPlus, BarChart3, FileText, AlertCircle,
} from 'lucide-react';

interface BusinessData {
  brand: { id: string; name: string; slug: string; logo: string | null; tagline: string | null };
  branch: { id: string; name: string; slug: string; isActive: boolean; isVerified: boolean; leadsCount: number; reviewsCount: number } | null;
  subscription: { plan: string; status: string; endDate: string; isTrial: boolean } | null;
  profileUrl: string | null;
}

interface Stats {
  viewsThisWeek: number;
  leadsThisWeek: number;
  callsThisWeek: number;
  whatsappThisWeek: number;
  totalLeads: number;
}

interface Lead {
  id: string;
  name: string;
  phone: string | null;
  message: string | null;
  source: string;
  status: string;
  createdAt: string;
}

export default function BusinessOwnerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bizRes, statsRes, leadsRes] = await Promise.all([
        fetch('/api/my-business', { credentials: 'include' }),
        fetch('/api/my-business/analytics', { credentials: 'include' }),
        fetch('/api/my-business/leads?limit=5', { credentials: 'include' }),
      ]);

      if (bizRes.ok) {
        const data = await bizRes.json();
        setBusiness(data);
      }
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
      }
      if (leadsRes.ok) {
        const data = await leadsRes.json();
        setLeads(data.leads || []);
      }
    } catch {}
    setLoading(false);
  };

  const handleCopyLink = async () => {
    if (!business?.profileUrl) return;
    const fullUrl = window.location.origin + business.profileUrl;
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    if (!business?.profileUrl) return;
    const url = window.location.origin + business.profileUrl;
    const text = encodeURIComponent(`Check out ${business.brand.name} on Parichay: ${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!business?.brand) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No Business Found</h2>
          <p className="text-sm text-gray-500 mb-6">Create your business profile to get started.</p>
          <Link href="/onboarding" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">
            Create Business <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
            {business.brand.logo ? (
              <img src={business.brand.logo} alt="" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <span className="text-indigo-600 font-bold text-lg">{business.brand.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{business.brand.name}</h1>
            <p className="text-xs text-gray-500">{business.brand.tagline || 'Your business profile'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadData} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link href="/business-owner/edit" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Pencil className="w-3.5 h-3.5" /> Edit
          </Link>
          {business.profileUrl && (
            <Link href={business.profileUrl} target="_blank" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
              <ExternalLink className="w-3.5 h-3.5" /> View Profile
            </Link>
          )}
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Views This Week', value: stats.viewsThisWeek, icon: Eye, color: 'text-blue-600 bg-blue-50' },
            { label: 'New Leads', value: stats.leadsThisWeek, icon: Users, color: 'text-green-600 bg-green-50' },
            { label: 'Calls', value: stats.callsThisWeek, icon: Phone, color: 'text-violet-600 bg-violet-50' },
            { label: 'WhatsApp', value: stats.whatsappThisWeek, icon: MessageCircle, color: 'text-emerald-600 bg-emerald-50' },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4">
              <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center mb-2`}>
                <s.icon className="w-4 h-4" />
              </div>
              <p className="text-xl font-semibold text-gray-900">{s.value}</p>
              <p className="text-[11px] text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Share Profile */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Share Your Profile</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
            <span className="text-xs text-gray-600 font-mono truncate flex-1">
              {typeof window !== 'undefined' ? window.location.origin : ''}{business.profileUrl}
            </span>
            <button onClick={handleCopyLink} className="p-1.5 hover:bg-gray-200 rounded-md">
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-500" />}
            </button>
          </div>
          <button onClick={handleWhatsAppShare} className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600">
            <Share2 className="w-4 h-4" /> WhatsApp
          </button>
          <Link href={`/api/card-image/${business.brand.slug}`} target="_blank" className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
            <QrCode className="w-4 h-4" /> Card Image
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Recent Leads</h3>
            <Link href="/business-owner/leads" className="text-xs text-indigo-600 font-medium hover:text-indigo-700">
              View all ({stats?.totalLeads || 0})
            </Link>
          </div>
          {leads.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-8 h-8 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No leads yet. Share your profile to start getting enquiries.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {leads.map((lead) => (
                <div key={lead.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-gray-600">{lead.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{lead.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{lead.message || lead.source}</p>
                  </div>
                  <span className="text-[10px] text-gray-400">{new Date(lead.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'Edit Services', href: '/business-owner/edit#services', icon: FileText, desc: 'Update pricing & descriptions' },
              { label: 'Business Hours', href: '/business-owner/edit#hours', icon: Clock, desc: 'Change open/close times' },
              { label: 'View Reviews', href: '/business-owner/reviews', icon: Star, desc: `${business.branch?.reviewsCount || 0} reviews` },
              { label: 'Analytics', href: '/business-owner/analytics', icon: BarChart3, desc: 'Views, leads & more' },
              { label: 'Invite Team', href: '/business-owner/team', icon: UserPlus, desc: 'Add staff members' },
              { label: 'Settings', href: '/business-owner/settings', icon: Settings, desc: 'Profile & notifications' },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-indigo-50 flex items-center justify-center">
                  <action.icon className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-gray-800">{action.label}</p>
                  <p className="text-[11px] text-gray-400">{action.desc}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-indigo-500" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Subscription Status */}
      {business.subscription && (
        <div className="bg-white border border-gray-100 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {business.subscription.plan} Plan
              {business.subscription.isTrial && <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Trial</span>}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {business.subscription.status === 'ACTIVE'
                ? `Renews ${new Date(business.subscription.endDate).toLocaleDateString()}`
                : `Status: ${business.subscription.status}`}
            </p>
          </div>
          <Link href="/business-owner/subscription" className="text-xs text-indigo-600 font-medium hover:text-indigo-700">
            Manage Plan →
          </Link>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useToastHelpers } from '@/components/ui/Toast';
import Link from 'next/link';
import {
  ArrowLeft,
  Eye,
  Users,
  Link2,
  QrCode,
  Download,
  Settings,
  ExternalLink,
  Copy,
  Check,
  Plus,
  TrendingUp,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Edit,
  BarChart3,
  Star,
  MessageSquare,
} from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  address: any;
  contact: any;
  socialMedia: any;
  brand: { id: string; name: string; slug: string };
  _count?: { leads: number };
}

interface BranchStats {
  pageViews: number;
  qrScans: number;
  leads: number;
  shortLinks: number;
  vcardDownloads: number;
}

interface ShortLink {
  id: string;
  code: string;
  targetUrl: string;
  clicks: number;
  isActive: boolean;
  createdAt: string;
}

interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  source: string;
  createdAt: string;
}

export default function BranchDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { user } = useAuth();
  const { success, error } = useToastHelpers();

  const [branch, setBranch] = useState<Branch | null>(null);
  const [stats, setStats] = useState<BranchStats | null>(null);
  const [shortLinks, setShortLinks] = useState<ShortLink[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'links' | 'leads' | 'analytics'>('overview');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [creatingLink, setCreatingLink] = useState(false);


  useEffect(() => {
    fetchBranchData();
  }, [id]);

  const fetchBranchData = async () => {
    try {
      setLoading(true);

      // Fetch branch details
      const branchRes = await fetch(`/api/branches/${id}`);
      if (!branchRes.ok) throw new Error('Branch not found');
      const branchData = await branchRes.json();
      setBranch(branchData.branch);

      // Fetch stats, short links, and leads in parallel
      const [statsRes, linksRes, leadsRes] = await Promise.all([
        fetch(`/api/analytics/realtime?period=month&branchId=${id}`).catch(() => null),
        fetch(`/api/short-links?branchId=${id}`),
        fetch(`/api/leads?branchId=${id}&limit=5`),
      ]);

      if (statsRes?.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.metrics);
      }

      if (linksRes.ok) {
        const linksData = await linksRes.json();
        setShortLinks(linksData.shortLinks || []);
      }

      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        setLeads(leadsData.leads || []);
      }
    } catch (error) {
      console.error('Error fetching branch:', error);
      toast.error('Failed to load branch details');
    } finally {
      setLoading(false);
    }
  };

  const getMicrositeUrl = () => {
    if (!branch) return '';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    return `${baseUrl}/${branch.brand.slug}/${branch.slug}`;
  };

  const copyToClipboard = async (text: string, linkId?: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedLink(linkId || 'main');
    setTimeout(() => setCopiedLink(null), 2000);
    toast.success('Copied to clipboard!');
  };

  const createShortLink = async () => {
    if (!branch) return;
    setCreatingLink(true);
    try {
      const response = await fetch('/api/short-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl: getMicrositeUrl(),
          branchId: branch.id,
        }),
      });
      if (response.ok) {
        success('Short link created!');
        fetchBranchData();
      }
    } catch (error) {
      error('Failed to create short link');
    } finally {
      setCreatingLink(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!branch) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Branch not found</p>
        <Link href="/dashboard/branches" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to branches
        </Link>
      </div>
    );
  }

  const micrositeUrl = getMicrositeUrl();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/branches"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{branch.name}</h1>
            <p className="text-sm text-gray-500">{branch.brand.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={micrositeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Microsite
          </a>
          <Link
            href={`/dashboard/microsite/${branch.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Microsite
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard icon={<Eye />} label="Page Views" value={stats?.pageViews || 0} color="blue" />
        <StatCard icon={<Users />} label="Leads" value={stats?.leads || branch._count?.leads || 0} color="green" />
        <StatCard icon={<QrCode />} label="QR Scans" value={stats?.qrScans || 0} color="purple" />
        <StatCard icon={<Link2 />} label="Short Links" value={shortLinks.length} color="orange" />
        <StatCard icon={<Download />} label="vCard Downloads" value={stats?.vcardDownloads || 0} color="pink" />
      </div>

      {/* Microsite URL Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-1">Microsite URL</h3>
            <p className="text-blue-100 text-sm mb-3">Share this link with your customers</p>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
              <Globe className="w-4 h-4" />
              <span className="font-mono text-sm">{micrositeUrl}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => copyToClipboard(micrositeUrl)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              {copiedLink === 'main' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedLink === 'main' ? 'Copied!' : 'Copy Link'}
            </button>
            <button
              onClick={createShortLink}
              disabled={creatingLink}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Short Link
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'links', label: 'Short Links', icon: <Link2 className="w-4 h-4" />, count: shortLinks.length },
              { id: 'leads', label: 'Leads', icon: <Users className="w-4 h-4" />, count: leads.length },
              { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Contact Information</h3>
                <div className="space-y-3">
                  {branch.contact?.phone && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{branch.contact.phone}</span>
                    </div>
                  )}
                  {branch.contact?.email && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{branch.contact.email}</span>
                    </div>
                  )}
                  {branch.address && (
                    <div className="flex items-start gap-3 text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5" />
                      <span>
                        {branch.address.street}, {branch.address.city}, {branch.address.state}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Recent Leads</h3>
                {leads.length > 0 ? (
                  <div className="space-y-2">
                    {leads.slice(0, 3).map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{lead.name}</p>
                          <p className="text-xs text-gray-500">{lead.email || lead.phone}</p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                    <Link
                      href={`/dashboard/leads?branchId=${branch.id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View all leads →
                    </Link>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No leads yet</p>
                )}
              </div>
            </div>
          )}

          {/* Short Links Tab */}
          {activeTab === 'links' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-500">Manage short links for this branch</p>
                <button
                  onClick={createShortLink}
                  disabled={creatingLink}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Create Link
                </button>
              </div>
              {shortLinks.length > 0 ? (
                <div className="space-y-3">
                  {shortLinks.map((link) => (
                    <div key={link.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-blue-600">
                            {window.location.origin}/s/{link.code}
                          </span>
                          <button
                            onClick={() => copyToClipboard(`${window.location.origin}/s/${link.code}`, link.id)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            {copiedLink === link.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 truncate max-w-md">{link.targetUrl}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{link.clicks}</p>
                          <p className="text-xs text-gray-500">clicks</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Link2 className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>No short links yet</p>
                </div>
              )}
            </div>
          )}

          {/* Leads Tab */}
          {activeTab === 'leads' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-500">Leads captured from this branch</p>
                <Link
                  href={`/dashboard/leads?branchId=${branch.id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View all in Lead Manager →
                </Link>
              </div>
              {leads.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 border-b">
                        <th className="pb-3 font-medium">Name</th>
                        <th className="pb-3 font-medium">Contact</th>
                        <th className="pb-3 font-medium">Source</th>
                        <th className="pb-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {leads.map((lead) => (
                        <tr key={lead.id}>
                          <td className="py-3 font-medium text-gray-900">{lead.name}</td>
                          <td className="py-3 text-gray-600">{lead.email || lead.phone || '-'}</td>
                          <td className="py-3">
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              {lead.source}
                            </span>
                          </td>
                          <td className="py-3 text-gray-500 text-sm">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>No leads captured yet</p>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 mb-4">Detailed analytics for this branch</p>
              <Link
                href={`/dashboard/analytics?branchId=${branch.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <TrendingUp className="w-4 h-4" />
                View Full Analytics
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    pink: 'bg-pink-50 text-pink-600',
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
    </div>
  );
}
'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Eye,
  Pause,
  Play,
  Trash2,
  Edit2,
  ExternalLink,
  Search,
  Filter,
  Megaphone,
  TrendingUp,
  MousePointer,
  Target,
  Calendar,
  X,
  BarChart3,
  DollarSign,
  ArrowRight,
  Activity,
  Zap,
  Clock
} from 'lucide-react';
import { SectionHeader, Card, Button, StatCard, ProgressBar } from '@/components/ui';
import AdForm from '@/components/ads/AdForm';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useToastHelpers } from '@/components/ui/Toast';

interface Ad {
  id: string;
  title: string;
  description?: string;
  category: string;
  city: string;
  status: string;
  impressions: number;
  clicks: number;
  start_date: string;
  end_date: string;
}

export default function AdsManagementPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; ad: Ad | null }>({ show: false, ad: null });
  const { showSuccess, showError } = useToastHelpers();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await fetch('/api/admin/ads');
      const data = await response.json();
      setAds(data.ads || []);
    } catch (error) {
      console.error('Failed to fetch ads');
    } finally {
      setLoading(false);
    }
  };

  const filteredAds = useMemo(() => {
    return ads.filter(ad => 
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [ads, searchQuery]);

  if (loading) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="h-12 bg-neutral-900 border border-neutral-800 rounded-2xl w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-neutral-900 border border-neutral-800 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <SectionHeader
          title="Campaign Ordnance"
          description="High-frequency advertisement deployment and reach optimization."
        />
        <button 
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary-500/20"
        >
          <Plus className="w-4 h-4" />
          Deploy New Campaign
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Campaigns"
          value={ads.filter(a => a.status === 'ACTIVE').length}
          icon={<Megaphone className="w-5 h-5" />}
          color="primary"
        />
        <StatCard
          title="Global Impressions"
          value={ads.reduce((acc, curr) => acc + curr.impressions, 0).toLocaleString()}
          icon={<Eye className="w-5 h-5" />}
          color="emerald"
        />
        <StatCard
          title="Interaction Pulse"
          value={ads.reduce((acc, curr) => acc + curr.clicks, 0).toLocaleString()}
          icon={<MousePointer className="w-5 h-5" />}
          color="amber"
        />
        <StatCard
          title="Yield Rate"
          value="4.2%"
          icon={<Target className="w-5 h-5" />}
          color="indigo"
        />
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="relative flex-1 w-full lg:max-w-xl group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            placeholder="Search campaign registry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-neutral-900 border border-neutral-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 transition-all placeholder:text-neutral-700"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-30" />
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-800/50 bg-neutral-950/50">
                <th className="text-left px-8 py-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">Campaign Profile</th>
                <th className="text-left px-6 py-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">Telemetry</th>
                <th className="text-left px-6 py-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">Status</th>
                <th className="text-left px-6 py-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">Timeline</th>
                <th className="text-right px-8 py-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/30">
              {filteredAds.map((ad) => (
                <tr key={ad.id} className="group hover:bg-primary-500/5 transition-all duration-300">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-center text-primary-500">
                        <Megaphone className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-white">{ad.title}</span>
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-1">{ad.category} • {ad.city}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-neutral-600">CTR</span>
                        <span className="text-white">{((ad.clicks / (ad.impressions || 1)) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-32 h-1 bg-neutral-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary-500" 
                          style={{ width: `${Math.min(100, (ad.clicks / (ad.impressions || 1)) * 1000)}%` }} 
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`inline-flex px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] ${
                      ad.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      {ad.status}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-neutral-700" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                        {new Date(ad.end_date).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-3 bg-neutral-950 border border-neutral-800 text-neutral-500 hover:text-primary-500 hover:border-primary-500/30 rounded-xl transition-all shadow-xl">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-3 bg-neutral-950 border border-neutral-800 text-neutral-500 hover:text-rose-500 hover:border-rose-500/30 rounded-xl transition-all shadow-xl">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

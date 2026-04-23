'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Globe,
  Eye,
  Edit2,
  ExternalLink,
  Search,
  Filter,
  Plus,
  Trash2,
  Copy,
  Settings,
  Palette,
  Layout,
  BarChart3,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Zap,
  Activity,
  Target
} from 'lucide-react';
import { SectionHeader, Card, Button, StatCard } from '@/components/ui';
import { toast } from '@/components/ui/Toast';

interface Microsite {
  id: string;
  slug: string;
  title: string;
  isActive: boolean;
  views: number;
  leads: number;
  lastUpdated: string;
  branch: {
    name: string;
    brand: {
      name: string;
      slug: string;
    };
  };
}

export default function MicrositeManagementPage() {
  const router = useRouter();
  const [microsites, setMicrosites] = useState<Microsite[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMicrosites();
  }, []);

  const fetchMicrosites = async () => {
    try {
      const response = await fetch('/api/admin/microsites');
      const data = await response.json();
      setMicrosites(data.microsites || []);
    } catch (error) {
      console.error('Failed to fetch microsites');
    } finally {
      setLoading(false);
    }
  };

  const filteredMicrosites = useMemo(() => {
    return microsites.filter(m => 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [microsites, searchQuery]);

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
          title="Microsite Ecosystem"
          description="Global management of hyper-localized digital footprints."
        />
        <button 
          onClick={() => router.push('/admin/branches')}
          className="flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary-500/20"
        >
          <Plus className="w-4 h-4" />
          Provision New Node
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Global Nodes"
          value={microsites.length}
          icon={<Globe className="w-5 h-5" />}
          color="primary"
        />
        <StatCard
          title="Network Traffic"
          value={microsites.reduce((acc, curr) => acc + curr.views, 0).toLocaleString()}
          icon={<Eye className="w-5 h-5" />}
          color="emerald"
        />
        <StatCard
          title="Conversion Yield"
          value={microsites.reduce((acc, curr) => acc + curr.leads, 0).toLocaleString()}
          icon={<Target className="w-5 h-5" />}
          color="amber"
        />
        <StatCard
          title="Uptime Matrix"
          value="99.9%"
          icon={<Zap className="w-5 h-5" />}
          color="indigo"
        />
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="relative flex-1 w-full lg:max-w-xl group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            placeholder="Filter network nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-neutral-900 border border-neutral-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 transition-all placeholder:text-neutral-700"
          />
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMicrosites.map((site) => (
          <div key={site.id} className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl hover:border-primary-500/20 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-primary-500/10 transition-colors" />
            
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-center text-primary-500 shadow-xl group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-white truncate">{site.title}</h3>
                  <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">/{site.slug}</span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                site.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-neutral-800 text-neutral-500'
              }`}>
                {site.isActive ? 'Online' : 'Offline'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-neutral-950/50 border border-neutral-800/50 rounded-2xl">
                <span className="block text-[8px] font-black uppercase tracking-widest text-neutral-600 mb-1">Views</span>
                <span className="text-sm font-black text-white">{site.views.toLocaleString()}</span>
              </div>
              <div className="p-4 bg-neutral-950/50 border border-neutral-800/50 rounded-2xl">
                <span className="block text-[8px] font-black uppercase tracking-widest text-neutral-600 mb-1">Leads</span>
                <span className="text-sm font-black text-white">{site.leads.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => router.push(`/admin/microsite/${site.id}`)}
                className="flex-1 px-4 py-3 bg-neutral-950 border border-neutral-800 text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-white hover:border-primary-500/30 rounded-xl transition-all"
              >
                Configuration
              </button>
              <button className="p-3 bg-neutral-950 border border-neutral-800 text-neutral-500 hover:text-primary-500 hover:border-primary-500/30 rounded-xl transition-all shadow-xl">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
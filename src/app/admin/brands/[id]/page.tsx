'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import {
  ArrowLeft,
  Edit,
  Settings,
  Eye,
  FileText,
  GitBranch,
  BarChart3,
  QrCode,
  Link2,
  Users,
  TrendingUp,
  Globe,
  ExternalLink,
  Plus,
  Activity,
  Zap,
  Target,
  ChevronRight
} from 'lucide-react';
import { SectionHeader, Card, Button, StatCard } from '@/components/ui';

export default function AdminBrandDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [brand, setBrand] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const brandId = params.id as string;

  useEffect(() => {
    fetchBrand();
  }, [brandId]);

  const fetchBrand = async () => {
    try {
      const response = await fetch(`/api/brands/${brandId}`);
      if (response.ok) {
        const data = await response.json();
        setBrand(data.brand);
      }
    } catch (error) {
      console.error('Failed to fetch brand');
    } finally {
      setLoading(false);
    }
  };

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

  if (!brand) return null;

  return (
    <div className="p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <button 
            onClick={() => router.push('/admin/brands')}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Registry
          </button>
          <SectionHeader
            title={brand.name}
            description={brand.description || "Active intelligence node configuration."}
          />
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.open(`/${brand.slug}`, '_blank')}
            className="p-4 bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-white hover:border-primary-500/30 rounded-2xl transition-all"
          >
            <ExternalLink className="w-5 h-5" />
          </button>
          <button 
            onClick={() => router.push(`/admin/brands/${brandId}/edit`)}
            className="flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary-500/20"
          >
            <Edit className="w-4 h-4" />
            Modify Protocol
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Satellite Nodes"
          value={brand.branches?.length || 0}
          icon={<GitBranch className="w-5 h-5" />}
          color="primary"
        />
        <StatCard
          title="Global Reach"
          value={brand._count?.views?.toLocaleString() || 0}
          icon={<Eye className="w-5 h-5" />}
          color="emerald"
        />
        <StatCard
          title="Conversion Yield"
          value={brand._count?.leads?.toLocaleString() || 0}
          icon={<Target className="w-5 h-5" />}
          color="amber"
        />
        <StatCard
          title="Pulse Rate"
          value="High"
          icon={<Zap className="w-5 h-5" />}
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Satellites List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Node Cluster</h4>
            <button className="text-[9px] font-black uppercase tracking-widest text-primary-500 hover:text-white transition-colors">Expand All</button>
          </div>
          
          <div className="grid gap-4">
            {brand.branches?.map((branch: any) => (
              <div 
                key={branch.id}
                onClick={() => router.push(`/admin/microsite/${branch.id}`)}
                className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 hover:border-primary-500/20 transition-all group cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform">
                    <GitBranch className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-sm font-black text-white">{branch.name}</span>
                    <span className="block text-[10px] font-bold text-neutral-500 uppercase mt-1 tracking-widest">{branch.address?.city || 'Default Node'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right hidden sm:block">
                    <span className="block text-[8px] font-black uppercase tracking-widest text-neutral-600">Leads</span>
                    <span className="text-sm font-black text-white">{branch._count?.leads || 0}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-700 group-hover:text-primary-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Info */}
        <div className="space-y-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-8">Node Parameters</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Protocol Status</span>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[9px] font-black uppercase tracking-widest">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Primary Slug</span>
                <span className="text-[10px] font-black text-white tracking-widest">/{brand.slug}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Encryption</span>
                <span className="text-[10px] font-black text-white tracking-widest">AES-256</span>
              </div>
            </div>
          </div>

          <div className="p-8 bg-primary-500/5 border border-primary-500/10 rounded-[32px] group hover:bg-primary-500/10 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-primary-500 text-white rounded-xl flex items-center justify-center mb-6 shadow-xl shadow-primary-500/20">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-2">Deploy New Satellite</h3>
            <p className="text-[10px] font-bold text-neutral-500 uppercase leading-relaxed">Establish a new branch node within this brand matrix.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

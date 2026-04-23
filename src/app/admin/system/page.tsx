// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { useToastHelpers } from '@/components/ui/Toast';
import CategoryManager from '@/components/admin/CategoryManager';
import LandingPageManager from '@/components/admin/LandingPageManager';
import {
  Settings,
  Mail,
  Database,
  Shield,
  Sliders,
  CreditCard,
  Building2,
  Save,
  AlertTriangle,
  Server,
  Globe,
  Lock,
  Layout,
  Activity,
  Zap,
  Target,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { SectionHeader, Card, Button, StatCard } from '@/components/ui';

type TabType = 'general' | 'email' | 'storage' | 'features' | 'limits' | 'payment' | 'categories' | 'landing';

export default function SystemPage() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToastHelpers();
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'general' as TabType, name: 'CORE', icon: Settings },
    { id: 'email' as TabType, name: 'COMMS', icon: Mail },
    { id: 'storage' as TabType, name: 'VAULT', icon: Database },
    { id: 'features' as TabType, name: 'MATRIX', icon: Sliders },
    { id: 'limits' as TabType, name: 'QUOTA', icon: Shield },
    { id: 'payment' as TabType, name: 'REVENUE', icon: CreditCard },
    { id: 'categories' as TabType, name: 'TAXONOMY', icon: Building2 },
    { id: 'landing' as TabType, name: 'FRONTEND', icon: Layout },
  ];

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
          title="System Intelligence"
          description="Global configuration and kernel-level platform management."
        />
        <button className="flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary-500/20">
          <Save className="w-4 h-4" />
          Synchronize Kernel
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Kernel Status"
          value="Stable"
          icon={<Server className="w-5 h-5" />}
          color="emerald"
        />
        <StatCard
          title="Network Load"
          value="18%"
          icon={<Activity className="w-5 h-5" />}
          color="primary"
        />
        <StatCard
          title="Security Tier"
          value="Level-4"
          icon={<ShieldCheck className="w-5 h-5" />}
          color="indigo"
        />
        <StatCard
          title="Sync Latency"
          value="14ms"
          icon={<Zap className="w-5 h-5" />}
          color="amber"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Navigation */}
        <div className="w-full lg:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${
                activeTab === tab.id
                  ? 'bg-primary-500/10 border-primary-500/20 text-white'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-primary-500' : ''}`} />
                <span className="text-[10px] font-black uppercase tracking-widest">{tab.name}</span>
              </div>
              {activeTab === tab.id && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-8 max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {activeTab === 'general' && (
                <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl">
                  <SectionHeader
                    title="Core Identity"
                    description="Platform identity and global endpoint configuration."
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-2">Site Designation</label>
                      <input
                        type="text"
                        defaultValue="Parichay Intelligence"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-primary-500/50 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-2">Global Endpoint (URL)</label>
                      <input
                        type="text"
                        defaultValue="https://parichay.ai"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-primary-500/50 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'categories' && (
                <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl">
                  <CategoryManager />
                </div>
              )}

              {activeTab === 'landing' && (
                <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl">
                  <LandingPageManager />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

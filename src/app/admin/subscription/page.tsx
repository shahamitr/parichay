'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  Crown,
  Zap,
  Calendar,
  Receipt,
  Settings,
  CheckCircle,
  ArrowUpRight,
  Package,
  TrendingUp,
  Activity,
  Target,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { SectionHeader, Card, Button, StatCard } from '@/components/ui';

type TabType = 'overview' | 'plans' | 'billing' | 'payment';

export default function SubscriptionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { id: 'overview' as TabType, name: 'MATRIX', icon: Package },
    { id: 'plans' as TabType, name: 'UPGRADE', icon: Crown },
    { id: 'billing' as TabType, name: 'LEDGER', icon: Receipt },
    { id: 'payment' as TabType, name: 'CHANNELS', icon: CreditCard },
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
          title="Revenue Intelligence"
          description="Plan lifecycle management and billing synchronization."
        />
        <button className="flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary-500/20">
          <Zap className="w-4 h-4" />
          Accelerate Plan
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Tier"
          value="Enterprise"
          icon={<Crown className="w-5 h-5" />}
          color="primary"
        />
        <StatCard
          title="Next Cycle"
          value="May 24"
          icon={<Calendar className="w-5 h-5" />}
          color="emerald"
        />
        <StatCard
          title="Resource Load"
          value="42%"
          icon={<Activity className="w-5 h-5" />}
          color="amber"
        />
        <StatCard
          title="Vault Status"
          value="Verified"
          icon={<ShieldCheck className="w-5 h-5" />}
          color="indigo"
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
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-neutral-950 border border-neutral-800 rounded-[24px] flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform">
                          <Crown className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black uppercase tracking-widest text-white">Neural Enterprise</h3>
                          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Global scaling & intelligence</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="block text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-1">Current Yield</span>
                          <span className="text-xl font-black text-white">$499<span className="text-sm text-neutral-600">/mo</span></span>
                        </div>
                        <button className="p-4 bg-neutral-950 border border-neutral-800 text-primary-500 hover:text-white hover:border-primary-500/30 rounded-2xl transition-all">
                          <ArrowUpRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-neutral-800/50">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-neutral-500">
                          <span>Compute Units</span>
                          <span>42%</span>
                        </div>
                        <div className="h-1 bg-neutral-950 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-500" style={{ width: '42%' }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-neutral-500">
                          <span>Bandwidth</span>
                          <span>18%</span>
                        </div>
                        <div className="h-1 bg-neutral-950 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: '18%' }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-neutral-500">
                          <span>Storage</span>
                          <span>64%</span>
                        </div>
                        <div className="h-1 bg-neutral-950 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500" style={{ width: '64%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      'Unlimited Neural Nodes',
                      'Priority Support Stream',
                      'Global Asset Distribution',
                      'Advanced Analytics Matrix',
                    ].map((feature) => (
                      <div key={feature} className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center gap-4 group hover:border-primary-500/20 transition-all">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-white transition-colors">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

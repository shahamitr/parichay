'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Star,
  Zap,
  Crown,
  Building2,
  Globe,
  Smartphone,
  BarChart3,
  Shield,
  Palette,
  Sparkles,
  Lock,
  Layers,
  Code,
  MessageSquare,
  Calendar,
  ChevronRight,
  Activity,
  Target,
  ShieldCheck
} from 'lucide-react';
import { SectionHeader, Card, Button, StatCard } from '@/components/ui';

type TabType = 'overview' | 'templates' | 'integrations' | 'advanced';

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    { id: 'overview' as TabType, name: 'MATRIX', icon: Globe },
    { id: 'templates' as TabType, name: 'Skins', icon: Palette },
    { id: 'integrations' as TabType, name: 'NODES', icon: Zap },
    { id: 'advanced' as TabType, name: 'QUANTUM', icon: Shield },
  ];

  const features = [
    {
      icon: Smartphone,
      title: 'Neural Mobile',
      description: 'Localized responsive footprint optimization.',
      tier: 'Standard',
      color: 'text-blue-500',
    },
    {
      icon: BarChart3,
      title: 'Data Intelligence',
      description: 'High-frequency analytical event tracking.',
      tier: 'Standard',
      color: 'text-emerald-500',
    },
    {
      icon: ShieldCheck,
      title: 'Vault Security',
      description: 'End-to-end encryption for all nodes.',
      tier: 'Standard',
      color: 'text-indigo-500',
    },
    {
      icon: Globe,
      title: 'Domain Mapping',
      description: 'Custom endpoint routing protocols.',
      tier: 'Pro',
      color: 'text-amber-500',
    },
  ];

  return (
    <div className="p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <SectionHeader
          title="Capability Matrix"
          description="Global feature set and operational integration parameters."
        />
        <button className="flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary-500/20">
          <Sparkles className="w-4 h-4" />
          Request Enhancement
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Core Modules"
          value="24"
          icon={<Layers className="w-5 h-5" />}
          color="primary"
        />
        <StatCard
          title="Active Syncs"
          value="18"
          icon={<Zap className="w-5 h-5" />}
          color="emerald"
        />
        <StatCard
          title="Yield Uplift"
          value="32%"
          icon={<Activity className="w-5 h-5" />}
          color="amber"
        />
        <StatCard
          title="Access Level"
          value="Pro"
          icon={<Crown className="w-5 h-5" />}
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
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {activeTab === 'overview' && features.map((feature, i) => (
                <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 hover:border-primary-500/20 transition-all group">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-14 h-14 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <span className="px-3 py-1 bg-neutral-950 border border-neutral-800 rounded-lg text-[9px] font-black uppercase tracking-widest text-neutral-500">{feature.tier}</span>
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-white mb-2">{feature.title}</h3>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

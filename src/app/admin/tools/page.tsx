'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Download,
  Wand2,
  FileText,
  Zap,
  Copy,
  Check,
  Link2,
  QrCode,
  Image as ImageIcon,
  Globe,
  Code,
  Palette,
  Settings,
  Webhook,
  Plus,
  Trash2,
  Play,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Search,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useToastHelpers } from '@/components/ui/Toast';
import { SectionHeader, Card, Button, StatCard } from '@/components/ui';
import GoogleBusinessImport from '@/components/import/GoogleBusinessImport';


import AIContentGenerator from '@/components/ai/AIContentGenerator';

type TabType = 'google-import' | 'ai-content' | 'utilities' | 'webhooks';

export default function ToolsPage() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToastHelpers();
  const [activeTab, setActiveTab] = useState<TabType>('google-import');
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  const [aiFieldType, setAiFieldType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const tabs = [
    { id: 'google-import' as TabType, name: 'GBP SYNC', icon: Download },
    { id: 'ai-content' as TabType, name: 'NEURAL LABS', icon: Sparkles },
    { id: 'utilities' as TabType, name: 'TOOLBOX', icon: Zap },
    { id: 'webhooks' as TabType, name: 'WEBHOOKS', icon: Webhook },
  ];

  if (loading) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="h-12 bg-neutral-900 border border-neutral-800 rounded-2xl w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
          title="Operational Toolkit"
          description="Advanced automation and ecosystem synchronization modules."
        />
      </div>

      {/* Navigation */}
      <div className="flex flex-col lg:flex-row gap-10">
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

        <div className="flex-1 space-y-8 max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {activeTab === 'google-import' && (
                <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
                  <SectionHeader
                    title="Google Business Synchronization"
                    description="Automated entity extraction from GBP profiles."
                  />
                  <div className="mt-10">
                    <GoogleBusinessImport
                      onImportComplete={() => showSuccess('Synchronization complete.')}
                      executiveId={user?.id}
                    />


                  </div>
                </div>
              )}

              {activeTab === 'ai-content' && (
                <div className="space-y-8">
                  <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl">
                    <SectionHeader
                      title="Neural Content Synthesis"
                      description="Generate professional copy-stacks using proprietary LLM models."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                      {[
                        { title: 'Headline Matrix', desc: 'Conversion-optimized titles', icon: FileText },
                        { title: 'Brand Narrative', desc: 'High-impact about sections', icon: Globe },
                        { title: 'Feature Stack', desc: 'Technical service breakdowns', icon: Zap },
                        { title: 'Action Protocol', desc: 'High-conversion CTAs', icon: Wand2 },
                      ].map((item) => (
                        <button 
                          key={item.title}
                          className="flex items-center gap-6 p-6 bg-neutral-950 border border-neutral-800 rounded-[24px] hover:border-primary-500/30 group transition-all"
                        >
                          <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform">
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <span className="block text-[10px] font-black uppercase tracking-widest text-white">{item.title}</span>
                            <span className="block text-[9px] font-bold text-neutral-500 uppercase mt-1">{item.desc}</span>
                          </div>
                          <ArrowRight className="ml-auto w-4 h-4 text-neutral-800 group-hover:text-primary-500 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'utilities' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: 'Link Compression', icon: Link2, desc: 'Shorten URIs with tracking' },
                    { name: 'QR Matrix', icon: QrCode, desc: 'Dynamic QR code synthesis' },
                    { name: 'Optic Engine', icon: ImageIcon, desc: 'Neural image optimization' },
                    { name: 'Chroma Lab', icon: Palette, desc: 'Color system generator' },
                  ].map((tool) => (
                    <div key={tool.name} className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 hover:border-primary-500/20 transition-all group">
                      <div className="w-14 h-14 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center justify-center text-primary-500 mb-6 group-hover:rotate-12 transition-transform">
                        <tool.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-white mb-2">{tool.name}</h3>
                      <p className="text-[10px] font-bold text-neutral-500 uppercase mb-6">{tool.desc}</p>
                      <button className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-500 hover:text-white transition-colors flex items-center gap-2">
                        Initialize Node <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

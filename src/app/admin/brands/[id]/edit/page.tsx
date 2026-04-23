'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Info, 
  Palette, 
  Settings, 
  Loader2, 
  Upload, 
  Image as ImageIcon, 
  PartyPopper,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import { SectionHeader, Card, Button, StatCard } from '@/components/ui';
import FestivalSettingsEditor from '@/components/admin/FestivalSettingsEditor';


type TabType = 'basic' | 'branding' | 'festival' | 'settings';

export default function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [brand, setBrand] = useState<any>(null);

  useEffect(() => {
    fetchBrand();
  }, [id]);

  const fetchBrand = async () => {
    try {
      const response = await fetch(`/api/brands/${id}`);
      if (response.ok) {
        const data = await response.json();
        setBrand(data.brand);
      }
    } catch (err) {
      console.error('Failed to fetch brand');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'basic' as TabType, name: 'CORE', icon: Info },
    { id: 'branding' as TabType, name: 'VISUALS', icon: Palette },
    { id: 'festival' as TabType, name: 'EVENTS', icon: PartyPopper },
    { id: 'settings' as TabType, name: 'KERNEL', icon: Settings },
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

  if (!brand) return null;

  return (
    <div className="p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <button 
            onClick={() => router.push(`/admin/brands/${id}`)}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Node View
          </button>
          <SectionHeader
            title="Modify Identity"
            description="Reconfiguring brand parameters and neural design signatures."
          />
        </div>
        <button 
          onClick={() => setSaving(true)}
          className="flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary-500/20"
        >
          <Save className="w-4 h-4" />
          Synchronize Changes
        </button>
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
              {activeTab === 'basic' && (
                <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-2">Brand Designation</label>
                        <input
                          type="text"
                          defaultValue={brand.name}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-primary-500/50 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-2">Primary Slug</label>
                        <input
                          type="text"
                          defaultValue={brand.slug}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-primary-500/50 transition-all outline-none"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-2">Identity Narrative</label>
                        <textarea
                          defaultValue={brand.description}
                          rows={4}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-primary-500/50 transition-all outline-none resize-none"
                        />
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'festival' && (
                <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl">
                  <FestivalSettingsEditor brandId={id} onSave={() => {}} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

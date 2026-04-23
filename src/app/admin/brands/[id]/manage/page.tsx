'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { 
  ArrowLeft, 
  Globe, 
  Settings, 
  BarChart3, 
  Users, 
  Eye, 
  ExternalLink,
  ChevronRight,
  Zap,
  Activity,
  Target
} from 'lucide-react';
import MicrositeEditor from '@/components/microsite/MicrositeEditor';

import { SectionHeader, Card, Button, StatCard } from '@/components/ui';

type TabType = 'content' | 'design' | 'analytics' | 'settings';

export default function BrandManagePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [brandData, setBrandData] = useState<any>(null);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>('content');

  const brandId = params.id as string;

  useEffect(() => {
    fetchBrandData();
  }, [brandId]);

  const fetchBrandData = async () => {
    try {
      const response = await fetch(`/api/brands/${brandId}`);
      if (response.ok) {
        const data = await response.json();
        setBrandData(data.brand);
        if (data.brand.branches?.length > 0) {
          setSelectedBranch(data.brand.branches[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch brand data');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'content' as TabType, name: 'CONTENT', icon: Globe },
    { id: 'design' as TabType, name: 'SKINS', icon: Settings },
    { id: 'analytics' as TabType, name: 'MATRIX', icon: BarChart3 },
    { id: 'settings' as TabType, name: 'CONFIG', icon: Users },
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

  if (!brandData) return null;

  return (
    <div className="p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <button 
            onClick={() => router.push(`/admin/brands/${brandId}`)}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Node Analysis
          </button>
          <SectionHeader
            title={`Manage ${brandData.name}`}
            description="Operational synchronization and asset deployment hub."
          />
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.open(`/preview/${brandData.id}`, '_blank')}
            className="flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary-500/20"
          >
            <ExternalLink className="w-4 h-4" />
            Live Stream Preview
          </button>
        </div>
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
        <div className="flex-1 space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'content' && selectedBranch && (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl overflow-hidden relative">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
                   <MicrositeEditor
                    branchId={selectedBranch.id}
                    brandId={brandData.id}
                    initialConfig={selectedBranch.micrositeConfig || {}}
                    userRole={user?.role || 'ADMIN'}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

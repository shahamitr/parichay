'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import MicrositeEditor from '@/components/microsite/MicrositeEditor';

import { MicrositeConfig } from '@/types/microsite';
import { AlertCircle, ArrowLeft, ExternalLink, Eye, ChevronRight, Layout, Sparkles } from 'lucide-react';
import { SectionHeader, Card, Button } from '@/components/ui';

export default function AdminMicrositeEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [branchData, setBranchData] = useState<any>(null);
  const [brandName, setBrandName] = useState<string>('');

  const branchId = params.branchId as string;

  useEffect(() => {
    if (!user) return;
    fetchBranchData();
  }, [user, branchId]);

  const fetchBranchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const brandResponse = await fetch(`/api/brands/${branchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!brandResponse.ok) {
        throw new Error('Failed to fetch brand data');
      }

      const brandData = await brandResponse.json();
      const brand = brandData.brand;

      if (!brand.branches || brand.branches.length === 0) {
        throw new Error('No branches found for this brand');
      }

      setBrandName(brand.name || 'Brand');

      const branch = {
        ...brand.branches[0],
        brandId: brand.id,
        brandSlug: brand.slug,
        brandName: brand.name,
      };

      setBranchData(branch);
    } catch (err) {
      setError('Failed to load branch data');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="h-12 bg-neutral-900 border border-neutral-800 rounded-2xl w-1/4 mb-8"></div>
        <div className="h-[600px] bg-neutral-900 border border-neutral-800 rounded-3xl"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  if (error || !branchData) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-rose-500" />
        </div>
        <h3 className="text-xl font-black uppercase tracking-widest text-white mb-2">{error || 'Node Missing'}</h3>
        <p className="text-neutral-500 max-w-md mb-8">The requested microsite deployment configuration could not be synchronized.</p>
        <button 
          onClick={() => router.push('/admin/brands')}
          className="flex items-center gap-2 px-8 py-4 bg-neutral-900 border border-neutral-800 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-800 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Abort and Return
        </button>
      </div>
    );
  }

  const initialConfig: MicrositeConfig = branchData.micrositeConfig || {
    templateId: 'modern-business',
    sections: {
      hero: { enabled: true, title: '', subtitle: '', backgroundType: 'gradient' },
      about: { enabled: true, content: '' },
      services: { enabled: true, items: [] },
      gallery: { enabled: true, images: [] },
      contact: {
        enabled: true,
        showMap: false,
        leadForm: { enabled: true, fields: ['name', 'email', 'phone', 'message'] },
      },
    },
    seoSettings: { title: branchData.name || '', description: '', keywords: [] },
  };

  const branchName = branchData.name || 'Branch';

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
            title={branchName}
            description="Neural microsite kernel configuration and asset deployment."
          />
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.open(`/preview/${branchData.brandSlug || branchData.brandId}/${branchData.id}`, '_blank')}
            className="flex items-center gap-2 px-8 py-4 bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-white hover:border-primary-500/30 rounded-2xl transition-all shadow-xl"
          >
            <Eye className="w-4 h-4" />
            Live Preview
          </button>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-[100px] -mr-32 -mt-32" />
        
        <div className="relative z-10">
          <MicrositeEditor
            branchId={branchData.id}
            brandId={branchData.brandSlug || branchData.brandId}
            initialConfig={initialConfig}
            userRole={user.role}
            branchName={branchName}
            brandName={brandName}
            embedded
          />
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { usePageHelp } from '@/hooks/usePageHelp';
import { StatCard, SectionHeader, Card, Button } from '@/components/ui';
import {
  Building2,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  Users,
  GitBranch,
  Layout
} from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  primaryColor?: string;
  createdAt: string;
  branchCount: number;
  viewCount: number;
}

export default function BrandsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Initialize help for this page
  usePageHelp({ pageContext: 'Brands' });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);

      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 800));

      setBrands([
        {
          id: '1',
          name: 'TechCorp Solutions',
          slug: 'techcorp-solutions',
          description: 'Leading technology solutions provider',
          primaryColor: '#3B82F6',
          createdAt: '2024-01-15',
          branchCount: 5,
          viewCount: 1250
        },
        {
          id: '2',
          name: 'Green Energy Ltd',
          slug: 'green-energy-ltd',
          description: 'Sustainable energy solutions',
          primaryColor: '#10B981',
          createdAt: '2024-01-20',
          branchCount: 3,
          viewCount: 890
        },
        {
          id: '3',
          name: 'Creative Studio',
          slug: 'creative-studio',
          description: 'Digital design and marketing agency',
          primaryColor: '#8B5CF6',
          createdAt: '2024-02-01',
          branchCount: 2,
          viewCount: 567
        }
      ]);
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateBrand = () => {
    setShowCreateForm(true);
  };

  const handleEditBrand = (brandId: string) => {
    router.push(`/admin/brands/${brandId}/edit`);
  };

  const handleViewBranches = (brandId: string) => {
    router.push(`/admin/branches?brand=${brandId}`);
  };

  if (loading) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="h-12 bg-neutral-900 border border-neutral-800 rounded-2xl w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-neutral-900 border border-neutral-800 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <SectionHeader
          title="Brand Architecture"
          description="Manage corporate identities and global brand settings."
        />
        <button 
          onClick={handleCreateBrand}
          className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary-500/20"
        >
          <Plus className="w-4 h-4" />
          Initialize Brand
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-600 w-4 h-4" />
          <input
            type="text"
            placeholder="SEARCH CORPORATE IDENTITIES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 w-full bg-neutral-900 border border-neutral-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 focus:ring-0 transition-all placeholder:text-neutral-700"
          />
        </div>
      </div>

      {/* Brands Grid */}
      {filteredBrands.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 bg-neutral-950 border border-neutral-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Building2 className="w-10 h-10 text-neutral-800" />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-2">No Brands Registered</h3>
          <p className="text-xs font-medium text-neutral-600 mb-8">Start by defining your first corporate identity</p>
          <button 
            onClick={handleCreateBrand}
            className="px-8 py-3 bg-neutral-900 border border-neutral-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-neutral-800 transition-all"
          >
            Create Brand Profile
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBrands.map((brand) => (
            <div key={brand.id} className="group bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl hover:border-primary-500/30 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-colors" />
              
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: brand.primaryColor || '#3B82F6' }}
                  >
                    {brand.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-primary-500 transition-colors line-clamp-1">{brand.name}</h3>
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-1">/{brand.slug}</span>
                  </div>
                </div>
                <button className="p-2 text-neutral-600 hover:text-white transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm font-medium text-neutral-400 mb-8 line-clamp-2 leading-relaxed">
                {brand.description || 'No description provided for this brand profile.'}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-neutral-950 border border-neutral-800/50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <GitBranch className="w-3 h-3 text-emerald-500" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-neutral-600">Distribution</span>
                  </div>
                  <p className="text-xl font-black text-white">{brand.branchCount}</p>
                  <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest mt-0.5">Active Nodes</p>
                </div>
                <div className="bg-neutral-950 border border-neutral-800/50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="w-3 h-3 text-primary-500" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-neutral-600">Reach</span>
                  </div>
                  <p className="text-xl font-black text-white">{brand.viewCount.toLocaleString()}</p>
                  <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest mt-0.5">Total Visits</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleEditBrand(brand.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-white hover:bg-neutral-800 hover:border-neutral-700 transition-all"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Configure
                </button>
                <button 
                  onClick={() => handleViewBranches(brand.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-white hover:bg-neutral-800 hover:border-neutral-700 transition-all"
                >
                  <Layout className="w-3.5 h-3.5" />
                  Nodes
                </button>
                <button 
                  onClick={() => window.open(`/${brand.slug}`, '_blank')}
                  className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-500 hover:text-primary-500 hover:border-primary-500/30 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Brand Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-10 w-full max-w-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50" />
            
            <SectionHeader
              title="Identity Setup"
              description="Register a new brand entity in the ecosystem."
            />
            
            <form className="space-y-6 mt-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Corporate Designation</label>
                <input
                  type="text"
                  className="w-full px-6 py-4 bg-neutral-950 border border-neutral-800 rounded-2xl text-sm font-medium text-white focus:border-primary-500/50 focus:ring-0 transition-all placeholder:text-neutral-700"
                  placeholder="Official Brand Name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Industry Context</label>
                <textarea
                  className="w-full px-6 py-4 bg-neutral-950 border border-neutral-800 rounded-2xl text-sm font-medium text-white focus:border-primary-500/50 focus:ring-0 transition-all placeholder:text-neutral-700"
                  rows={3}
                  placeholder="Strategic overview and description..."
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Brand Color Signature</label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    className="w-20 h-14 bg-neutral-950 border border-neutral-800 rounded-2xl cursor-pointer p-2"
                    defaultValue="#3B82F6"
                  />
                  <div className="flex-1 px-6 py-4 bg-neutral-950 border border-neutral-800 rounded-2xl text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                    Hex Protocol: #3B82F6
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-6">
                <button 
                  type="submit"
                  className="flex-1 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary-500/20"
                >
                  Authorize Brand
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-8 py-4 bg-neutral-950 border border-neutral-800 text-neutral-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:text-white hover:bg-neutral-800 transition-all"
                >
                  Abort
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
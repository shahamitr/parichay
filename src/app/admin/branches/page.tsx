'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePageHelp } from '@/hooks/usePageHelp';
import { StatCard, SectionHeader, Card, Button } from '@/components/ui';
import {
  GitBranch,
  Plus,
  Search,
  MapPin,
  Phone,
  Mail,
  Edit,
  Trash2,
  ExternalLink,
  Building2,
  User,
  Shield,
  Activity
} from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  slug: string;
  brandName: string;
  brandId: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export default function BranchesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'all');

  // Initialize help for this page
  usePageHelp({ pageContext: 'Branches' });

  useEffect(() => {
    fetchBranches();
  }, [selectedBrand]);

  const fetchBranches = async () => {
    try {
      setLoading(true);

      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 800));

      setBranches([
        {
          id: '1',
          name: 'Mumbai Head Office',
          slug: 'mumbai-head-office',
          brandName: 'TechCorp Solutions',
          brandId: '1',
          address: 'Bandra Kurla Complex, Mumbai, Maharashtra 400051',
          phone: '+91 98765 43210',
          email: 'mumbai@techcorp.com',
          manager: 'Rajesh Kumar',
          status: 'active',
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          name: 'Delhi Branch',
          slug: 'delhi-branch',
          brandName: 'TechCorp Solutions',
          brandId: '1',
          address: 'Connaught Place, New Delhi, Delhi 110001',
          phone: '+91 98765 43211',
          email: 'delhi@techcorp.com',
          manager: 'Priya Sharma',
          status: 'active',
          createdAt: '2024-01-20'
        },
        {
          id: '3',
          name: 'Bangalore Office',
          slug: 'bangalore-office',
          brandName: 'Green Energy Ltd',
          brandId: '2',
          address: 'Electronic City, Bangalore, Karnataka 560100',
          phone: '+91 98765 43212',
          email: 'bangalore@greenenergy.com',
          manager: 'Amit Patel',
          status: 'active',
          createdAt: '2024-02-01'
        }
      ]);
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBranches = branches.filter(branch => {
    const matchesSearch = branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         branch.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         branch.manager.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand === 'all' || branch.brandId === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  const handleCreateBranch = () => {
    router.push('/admin/branches/create');
  };

  const handleEditBranch = (branchId: string) => {
    router.push(`/admin/branches/${branchId}/edit`);
  };

  if (loading) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="h-12 bg-neutral-900 border border-neutral-800 rounded-2xl w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-neutral-900 border border-neutral-800 rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-64 bg-neutral-900 border border-neutral-800 rounded-3xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const branchStats = {
    total: branches.length,
    active: branches.filter(b => b.status === 'active').length,
    coverage: '12 Regions',
    uptime: '99.9%'
  };

  return (
    <div className="p-8 space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <SectionHeader
          title="Node Infrastructure"
          description="Global network locations and operational parameters."
        />
        <button 
          onClick={handleCreateBranch}
          className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary-500/20"
        >
          <Plus className="w-4 h-4" />
          Deploy New Node
        </button>
      </div>

      {/* Branch Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Active Nodes"
          value={branchStats.total}
          icon={GitBranch}
          color="primary"
        />
        <StatCard
          title="Operational"
          value={branchStats.active}
          icon={Shield}
          description="Real-time connectivity"
          color="emerald"
        />
        <StatCard
          title="Regional Reach"
          value={branchStats.coverage}
          icon={MapPin}
          color="amber"
        />
        <StatCard
          title="System Health"
          value={branchStats.uptime}
          icon={Activity}
          color="purple"
        />
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-600 w-4 h-4" />
          <input
            type="text"
            placeholder="FILTER NODES BY NAME, ADDRESS OR MANAGER..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 w-full bg-neutral-900 border border-neutral-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 focus:ring-0 transition-all placeholder:text-neutral-700"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600 hidden md:block">Filter by brand</span>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="px-6 py-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 focus:ring-0 transition-all"
          >
            <option value="all">Global Network</option>
            <option value="1">TechCorp Solutions</option>
            <option value="2">Green Energy Ltd</option>
            <option value="3">Creative Studio</option>
          </select>
        </div>
      </div>

      {/* Branches List */}
      {filteredBranches.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 bg-neutral-950 border border-neutral-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <GitBranch className="w-10 h-10 text-neutral-800" />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-2">No Nodes Found</h3>
          <p className="text-xs font-medium text-neutral-600 mb-8">Deploy your first regional location to expand coverage</p>
          <button 
            onClick={handleCreateBranch}
            className="px-8 py-3 bg-neutral-900 border border-neutral-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-neutral-800 transition-all"
          >
            Initiate Deployment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredBranches.map((branch) => (
            <div key={branch.id} className="group bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl hover:border-primary-500/30 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-colors" />
              
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-primary-500 transition-colors mb-1">{branch.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{branch.brandName}</span>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest border ${
                  branch.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-neutral-800 text-neutral-500 border-neutral-700'
                }`}>
                  {branch.status === 'active' ? 'Synchronized' : 'Offline'}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-950 border border-neutral-800/50">
                  <MapPin className="w-4 h-4 text-primary-500 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase tracking-widest text-neutral-600 mb-1">Geographic Location</span>
                    <span className="text-[11px] font-bold text-neutral-300 leading-relaxed">{branch.address}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-950 border border-neutral-800/50">
                    <Phone className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-bold text-neutral-400">{branch.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-950 border border-neutral-800/50">
                    <Mail className="w-4 h-4 text-purple-500" />
                    <span className="text-[10px] font-bold text-neutral-400 line-clamp-1">{branch.email}</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-neutral-800/50">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-primary-500">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase tracking-widest text-neutral-600">Operations Manager</span>
                      <span className="text-xs font-black text-white uppercase">{branch.manager}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black uppercase tracking-widest text-neutral-600">Commissioned</span>
                    <span className="text-xs font-black text-neutral-400 uppercase">{new Date(branch.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleEditBranch(branch.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-neutral-950 border border-neutral-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
                  >
                    <Edit className="w-4 h-4" />
                    Manage Node
                  </button>
                  <button 
                    onClick={() => window.open(`/${branch.brandName.toLowerCase().replace(/\s+/g, '-')}/${branch.slug}`, '_blank')}
                    className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl text-neutral-600 hover:text-primary-500 hover:border-primary-500/30 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
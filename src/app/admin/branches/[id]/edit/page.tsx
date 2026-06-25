'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { SectionHeader, Card, Button, Input } from '@/components/ui';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Save, 
  ArrowLeft,
  Shield,
  Activity,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function BranchEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    manager: '',
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    fetchBranchData();
  }, [id]);

  const fetchBranchData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data - in real app this would fetch from API
      setFormData({
        name: 'Mumbai Head Office',
        address: 'Bandra Kurla Complex, Mumbai, Maharashtra 400051',
        phone: '+91 98765 43210',
        email: 'mumbai@techcorp.com',
        manager: user?.firstName || 'Rajesh Kumar',
        status: 'active',
      });
    } catch (error) {
      toast.error('Failed to load branch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Simulate API update
      await new Promise(resolve => setTimeout(resolve, 1200));
      toast.success('Branch details updated successfully!');
      router.push('/admin/branches');
    } catch (error) {
      toast.error('Failed to update branch');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="h-12 bg-neutral-900 rounded-2xl w-1/4"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-96 bg-neutral-900 rounded-3xl"></div>
          </div>
          <div className="h-64 bg-neutral-900 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to network
          </button>
          <SectionHeader
            title="Configure Node"
            description={`Operational parameters for ${formData.name}`}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="border-neutral-800 text-neutral-400"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            loading={saving}
            className="bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20 px-8"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Configuration */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-neutral-900 border-neutral-800 rounded-[32px] p-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white">Identity & Location</h3>
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Primary node identification</p>
              </div>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 ml-1">Node Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-neutral-950 border-neutral-800 rounded-2xl py-4 focus:border-primary-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 ml-1">Operations Manager</label>
                  <Input
                    value={formData.manager}
                    onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                    className="bg-neutral-950 border-neutral-800 rounded-2xl py-4 focus:border-primary-500/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 ml-1">Physical Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-neutral-600 w-5 h-5" />
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl p-4 pl-12 text-sm font-bold text-white focus:border-primary-500/50 focus:ring-0 transition-all min-h-[120px]"
                  />
                </div>
              </div>
            </form>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800 rounded-[32px] p-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white">Contact Interface</h3>
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Connectivity parameters</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 ml-1">Phone Number</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                  className="bg-neutral-950 border-neutral-800 rounded-2xl py-4 focus:border-emerald-500/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 ml-1">Email Endpoint</label>
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@brand.com"
                  className="bg-neutral-950 border-neutral-800 rounded-2xl py-4 focus:border-emerald-500/50"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
          <Card className="bg-neutral-900 border-neutral-800 rounded-[32px] p-8 shadow-2xl">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-6">Status Protocol</h3>
            
            <div className="space-y-4">
              <button
                onClick={() => setFormData({ ...formData, status: 'active' })}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${
                  formData.status === 'active' 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
                    : 'bg-neutral-950 border-neutral-800 text-neutral-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-widest">Synchronized</span>
                </div>
                {formData.status === 'active' && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />}
              </button>

              <button
                onClick={() => setFormData({ ...formData, status: 'inactive' })}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${
                  formData.status === 'inactive' 
                    ? 'bg-red-500/10 border-red-500/30 text-red-500' 
                    : 'bg-neutral-950 border-neutral-800 text-neutral-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-widest">Maintenance</span>
                </div>
                {formData.status === 'inactive' && <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />}
              </button>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-primary-600 to-blue-700 rounded-[32px] p-8 shadow-2xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <Globe className="w-10 h-10 mb-4 opacity-50" />
              <h3 className="text-lg font-black uppercase tracking-tight mb-2">Live Preview</h3>
              <p className="text-xs font-bold text-blue-100 uppercase tracking-widest leading-relaxed mb-6">
                View how your customers see this node in the global network.
              </p>
              <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[10px] transition-all">
                Open Microsite
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
          </Card>
        </div>
      </div>
    </div>
  );
}

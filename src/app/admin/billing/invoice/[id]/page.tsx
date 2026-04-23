'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Download,
  FileText,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Mail,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import { SectionHeader, Card, Button, StatCard } from '@/components/ui';

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

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
        <div className="space-y-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Ledger
          </button>
          <SectionHeader
            title="Transaction Node"
            description="Deep analysis of ledger entry and resource allocation."
          />
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary-500/20">
          <Download className="w-4 h-4" />
          Export Artifact
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Yield Value"
          value="₹2,999"
          icon={<DollarSign className="w-5 h-5" />}
          color="primary"
        />
        <StatCard
          title="Lifecycle"
          value="Finalized"
          icon={<CheckCircle className="w-5 h-5" />}
          color="emerald"
        />
        <StatCard
          title="Cycle Start"
          value="Jan 15"
          icon={<Calendar className="w-5 h-5" />}
          color="amber"
        />
        <StatCard
          title="Verification"
          value="Secure"
          icon={<ShieldCheck className="w-5 h-5" />}
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/5 rounded-full blur-3xl -mr-24 -mt-24" />
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-neutral-950 border border-neutral-800 rounded-[24px] flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-widest text-white">INV-2024-001</h3>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Enterprise Protocol Subscription</span>
                </div>
              </div>
              <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest">Settled</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-600">Allocation Breakdown</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-4 border-b border-neutral-800/50">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Professional License</span>
                    <span className="text-sm font-black text-white">₹2,999</span>
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Net Yield</span>
                    <span className="text-lg font-black text-primary-500">₹2,999</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-600">Timeline Matrix</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Deployment</span>
                    <span className="text-[10px] font-black text-white tracking-widest">15 JAN 2024</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Settlement</span>
                    <span className="text-[10px] font-black text-emerald-500 tracking-widest">20 JAN 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-8">Subject Identity</h4>
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-center text-primary-500">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-widest text-white">Neural Entity</span>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase">Demo Protocol User</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-center text-indigo-500">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-widest text-white">Comms Channel</span>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase">demo@parichay.ai</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
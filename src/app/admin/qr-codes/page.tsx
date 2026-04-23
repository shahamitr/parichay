'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode,
  Download,
  Eye,
  Share2,
  Copy,
  Trash2,
  Plus,
  Search,
  Filter,
  BarChart3,
  MousePointer,
  Calendar,
  ExternalLink,
  Smartphone,
  Globe,
  X,
  ArrowRight,
  Zap,
  Activity,
  Target
} from 'lucide-react';
import { toast } from '@/components/ui/Toast';
import { SectionHeader, Card, Button, StatCard } from '@/components/ui';

interface QRCodeData {
  id: string;
  name: string;
  url: string;
  type: 'microsite' | 'custom' | 'vcard' | 'wifi';
  scans: number;
  createdAt: string;
  isActive: boolean;
  branch?: {
    name: string;
    brand: {
      name: string;
    };
  };
}

export default function QRCodesPage() {
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQR, setSelectedQR] = useState<QRCodeData | null>(null);

  useEffect(() => {
    fetchQRCodes();
  }, []);

  const fetchQRCodes = async () => {
    try {
      const response = await fetch('/api/admin/qr-codes');
      const data = await response.json();
      setQrCodes(data.qrCodes || []);
    } catch (error) {
      console.error('Failed to fetch QR codes');
    } finally {
      setLoading(false);
    }
  };

  const filteredQRCodes = useMemo(() => {
    return qrCodes.filter(qr => 
      qr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qr.url.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [qrCodes, searchQuery]);

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
          title="Optic Matrix Management"
          description="Synthesize and track physical-to-digital entry points."
        />
        <button className="flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary-500/20">
          <Plus className="w-4 h-4" />
          Synthesize New QR
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Matrices"
          value={qrCodes.length}
          icon={<QrCode className="w-5 h-5" />}
          color="primary"
        />
        <StatCard
          title="Global Interactions"
          value={qrCodes.reduce((acc, curr) => acc + curr.scans, 0).toLocaleString()}
          icon={<MousePointer className="w-5 h-5" />}
          color="emerald"
        />
        <StatCard
          title="Active Nodes"
          value={qrCodes.filter(q => q.isActive).length}
          icon={<Zap className="w-5 h-5" />}
          color="amber"
        />
        <StatCard
          title="Unique Triggers"
          value="8.2K"
          icon={<Target className="w-5 h-5" />}
          color="indigo"
        />
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="relative flex-1 w-full lg:max-w-xl group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            placeholder="Search matrix registry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-neutral-900 border border-neutral-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 transition-all placeholder:text-neutral-700"
          />
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredQRCodes.map((qr) => (
          <div key={qr.id} className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl hover:border-primary-500/20 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-primary-500/10 transition-colors" />
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-center text-primary-500 shadow-xl group-hover:scale-110 transition-transform">
                <QrCode className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-white truncate">{qr.name}</h3>
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">{qr.type} protocol</span>
              </div>
            </div>

            <div className="bg-neutral-950/50 border border-neutral-800/50 rounded-2xl p-4 flex items-center justify-between mb-8">
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-1">Total Scans</span>
                <span className="text-xl font-black text-white">{qr.scans.toLocaleString()}</span>
              </div>
              <Activity className="w-5 h-5 text-emerald-500/50" />
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setSelectedQR(qr)}
                className="flex-1 px-4 py-3 bg-neutral-950 border border-neutral-800 text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-white hover:border-primary-500/30 rounded-xl transition-all"
              >
                Inspect
              </button>
              <button className="p-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-all shadow-lg shadow-primary-500/20">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedQR && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-[40px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-neutral-800 bg-neutral-950/50 flex items-center justify-between">
                <SectionHeader
                  title="Matrix Profile"
                  description="Real-time interaction telemetry and node configuration."
                />
                <button onClick={() => setSelectedQR(null)} className="p-4 bg-neutral-900 hover:bg-neutral-800 text-neutral-500 hover:text-white rounded-2xl transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-10 space-y-8 text-center">
                <div className="mx-auto w-48 h-48 bg-white p-4 rounded-3xl shadow-2xl">
                  <div className="w-full h-full bg-neutral-100 rounded-2xl flex items-center justify-center text-neutral-300">
                    <QrCode className="w-20 h-20" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-3xl text-left">
                    <span className="block text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-2">Target URI</span>
                    <span className="text-[10px] font-bold text-white truncate block">{selectedQR.url}</span>
                  </div>
                  <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-3xl text-left">
                    <span className="block text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-2">Protocol Health</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Active Node</span>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-neutral-950/50 border-t border-neutral-800 flex justify-end gap-4">
                <button className="px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border border-neutral-800">Copy Protocol Link</button>
                <button className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary-500/20">Download Vector</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
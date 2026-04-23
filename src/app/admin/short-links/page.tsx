'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link2,
  Copy,
  Trash2,
  Plus,
  ExternalLink,
  TrendingUp,
  Search,
  Filter,
  Activity,
  Calendar,
  X,
  ArrowRight,
  Zap,
  Target,
  Globe
} from 'lucide-react';
import { toast } from '@/components/ui/Toast';
import { SectionHeader, Card, Button, StatCard } from '@/components/ui';

interface ShortLink {
  id: string;
  code: string;
  shortUrl: string;
  targetUrl: string;
  clicks: number;
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}

export default function ShortLinksPage() {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newLink, setNewLink] = useState({ targetUrl: '', expiresAt: '' });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/short-links');
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      }
    } catch (error) {
      console.error('Error fetching links:', error);
      toast.error('Failed to fetch protocol links');
    } finally {
      setIsLoading(false);
    }
  };

  const createLink = async () => {
    try {
      setIsCreating(true);
      const response = await fetch('/api/short-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLink),
      });

      if (response.ok) {
        await fetchLinks();
        setShowCreateModal(false);
        setNewLink({ targetUrl: '', expiresAt: '' });
        toast.success('Protocol link synthesized successfully');
      }
    } catch (error) {
      console.error('Error creating link:', error);
      toast.error('Synthesis failed');
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  const deleteLink = async (id: string) => {
    if (!confirm('Are you sure you want to terminate this protocol link?')) return;

    try {
      const response = await fetch(`/api/short-links/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setLinks(links.filter(l => l.id !== id));
        toast.success('Link terminated');
      }
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error('Termination failed');
    }
  };

  const filteredLinks = useMemo(() => {
    return links.filter(link => 
      link.shortUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.targetUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [links, searchQuery]);

  if (isLoading) {
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
          title="URI Compression Lab"
          description="Synthesize high-velocity short URLs for multi-channel distribution."
        />
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary-500/20"
        >
          <Plus className="w-4 h-4" />
          Synthesize New Link
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Links"
          value={links.length}
          icon={<Link2 className="w-5 h-5" />}
          color="primary"
        />
        <StatCard
          title="Total Redirects"
          value={links.reduce((sum, link) => sum + link.clicks, 0).toLocaleString()}
          icon={<TrendingUp className="w-5 h-5" />}
          color="emerald"
        />
        <StatCard
          title="Active Nodes"
          value={links.filter((l) => l.isActive).length}
          icon={<Zap className="w-5 h-5" />}
          color="amber"
        />
        <StatCard
          title="Avg Velocity"
          value="12/day"
          icon={<Activity className="w-5 h-5" />}
          color="indigo"
        />
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="relative flex-1 w-full lg:max-w-xl group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            placeholder="Search protocol registry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-neutral-900 border border-neutral-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 transition-all placeholder:text-neutral-700"
          />
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLinks.map((link) => (
          <div key={link.id} className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl hover:border-primary-500/20 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-primary-500/10 transition-colors" />
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-center text-primary-500 shadow-xl group-hover:scale-110 transition-transform">
                <Link2 className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-white truncate">{link.shortUrl}</h3>
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block truncate mt-1">→ {link.targetUrl}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-neutral-950/50 border border-neutral-800/50 rounded-2xl p-4 flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-1">Redirections</span>
                <span className="text-xl font-black text-white">{link.clicks.toLocaleString()}</span>
              </div>
              <div className="bg-neutral-950/50 border border-neutral-800/50 rounded-2xl p-4 flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-1">Status</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${link.isActive ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {link.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => copyToClipboard(link.shortUrl)}
                className="flex-1 px-4 py-3 bg-neutral-950 border border-neutral-800 text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-white hover:border-primary-500/30 rounded-xl transition-all"
              >
                Copy Link
              </button>
              <button 
                onClick={() => deleteLink(link.id)}
                className="p-3 bg-neutral-950 border border-neutral-800 text-neutral-500 hover:text-rose-500 hover:border-rose-500/30 rounded-xl transition-all shadow-xl"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredLinks.length === 0 && (
          <div className="col-span-full py-24 flex flex-col items-center justify-center gap-4 bg-neutral-950/30 border border-dashed border-neutral-800 rounded-[40px]">
            <Link2 className="w-12 h-12 text-neutral-800" />
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600">No protocol links identified.</p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="text-[10px] font-black uppercase tracking-widest text-primary-500 mt-4 hover:text-primary-400 transition-colors"
              >
                Synthesize First Link <ArrowRight className="w-3 h-3 inline ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-[40px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-neutral-800 bg-neutral-950/50 flex items-center justify-between">
                <SectionHeader
                  title="Protocol Synthesis"
                  description="Define the target destination and node parameters."
                />
                <button onClick={() => setShowCreateModal(false)} className="p-4 bg-neutral-900 hover:bg-neutral-800 text-neutral-500 hover:text-white rounded-2xl transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-10 space-y-8">
                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 ml-2">Target Destination URI</label>
                  <input
                    type="url"
                    value={newLink.targetUrl}
                    onChange={(e) => setNewLink({ ...newLink, targetUrl: e.target.value })}
                    placeholder="https://example.com/destination"
                    className="w-full px-8 py-6 bg-neutral-950 border border-neutral-800 rounded-3xl text-sm font-medium text-white focus:border-primary-500 transition-all outline-none"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500 ml-2">Expiration Timestamp (Optional)</label>
                  <input
                    type="datetime-local"
                    value={newLink.expiresAt}
                    onChange={(e) => setNewLink({ ...newLink, expiresAt: e.target.value })}
                    className="w-full px-8 py-6 bg-neutral-950 border border-neutral-800 rounded-3xl text-sm font-medium text-white focus:border-primary-500 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="p-8 bg-neutral-950/50 border-t border-neutral-800 flex justify-end gap-4">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border border-neutral-800"
                >
                  Abort
                </button>
                <button 
                  onClick={createLink}
                  disabled={!newLink.targetUrl || isCreating}
                  className="px-8 py-4 bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-800 disabled:text-neutral-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary-500/20"
                >
                  {isCreating ? 'Synthesizing...' : 'Initialize Node'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

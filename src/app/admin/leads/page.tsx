'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Mail,
  Phone,
  Download,
  Search,
  Eye,
  Trash2,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  X,
  Archive,
  Loader2,
  Filter,
  MoreVertical,
  CheckSquare,
  Square,
  Calendar
} from 'lucide-react';
import { toast } from '@/components/ui/Toast';
import { StatCard, SectionHeader, Card, Button } from '@/components/ui';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source?: string;
  createdAt: string;
  branch: {
    name: string;
    brand: {
      name: string;
    };
  };
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    let filtered = leads;
    if (searchQuery) {
      filtered = filtered.filter(l => 
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(l => l.status === statusFilter);
    }
    setFilteredLeads(filtered);
  }, [searchQuery, statusFilter, leads]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/leads');
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (error) {
      console.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredLeads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredLeads.map(l => l.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-primary-500/10 text-primary-500',
      contacted: 'bg-amber-500/10 text-amber-500',
      qualified: 'bg-indigo-500/10 text-indigo-500',
      converted: 'bg-emerald-500/10 text-emerald-500',
      lost: 'bg-rose-500/10 text-rose-500',
    };
    return colors[status] || 'bg-neutral-800 text-neutral-400';
  };

  return (
    <div className="p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <SectionHeader
          title="Conversion Pipeline"
          description="High-velocity lead management and attribution tracking."
        />
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Leads"
          value={leads.length}
          icon={<Users className="w-5 h-5" />}
          color="primary"
        />
        <StatCard
          title="New Arrivals"
          value={leads.filter(l => l.status === 'new').length}
          icon={<Star className="w-5 h-5" />}
          color="amber"
        />
        <StatCard
          title="Conversion rate"
          value="12.4%"
          icon={<TrendingUp className="w-5 h-5" />}
          color="emerald"
        />
        <StatCard
          title="Avg response"
          value="2.4h"
          icon={<Clock className="w-5 h-5" />}
          color="indigo"
        />
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="flex flex-1 gap-4 w-full lg:max-w-xl">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder="Filter by contact signature..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-neutral-900 border border-neutral-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 transition-all placeholder:text-neutral-700"
            />
          </div>
          <div className="flex items-center gap-3 px-6 py-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
            <Filter className="w-4 h-4 text-neutral-600" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-white focus:ring-0 cursor-pointer"
            >
              <option value="all">Global status</option>
              <option value="new">Unprocessed</option>
              <option value="contacted">In Contact</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Finalized</option>
              <option value="lost">Terminated</option>
            </select>
          </div>
        </div>

        {selectedIds.size > 0 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 px-6 py-3 bg-primary-500/10 border border-primary-500/20 rounded-2xl"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-primary-500">{selectedIds.size} records locked</span>
            <div className="w-px h-4 bg-primary-500/20" />
            <button className="text-[10px] font-black uppercase tracking-widest text-white hover:text-primary-500 transition-colors">Archive</button>
            <button className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-400 transition-colors">Purge</button>
          </motion.div>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-30" />
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-800/50 bg-neutral-950/50">
                <th className="px-8 py-6 w-10">
                  <button onClick={toggleSelectAll} className="text-neutral-700 hover:text-primary-500 transition-colors">
                    {selectedIds.size === filteredLeads.length && filteredLeads.length > 0 ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                  </button>
                </th>
                <th className="text-left px-6 py-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">Contact Identity</th>
                <th className="text-left px-6 py-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">Business Unit</th>
                <th className="text-left px-6 py-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">Protocol Status</th>
                <th className="text-left px-6 py-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">Attribution</th>
                <th className="text-right px-8 py-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/30">
              {filteredLeads.map((lead) => (
                <tr 
                  key={lead.id} 
                  className={`group hover:bg-primary-500/5 transition-all duration-300 ${selectedIds.has(lead.id) ? 'bg-primary-500/5' : ''}`}
                >
                  <td className="px-8 py-6">
                    <button onClick={() => toggleSelect(lead.id)} className={`transition-colors ${selectedIds.has(lead.id) ? 'text-primary-500' : 'text-neutral-800 group-hover:text-neutral-700'}`}>
                      {selectedIds.has(lead.id) ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-white">{lead.name}</span>
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-1">{lead.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">{lead.branch?.brand?.name}</span>
                      <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest mt-0.5">{lead.branch?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`inline-flex px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-neutral-700" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{lead.source || 'Direct Network'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setSelectedLead(lead)}
                        className="p-3 bg-neutral-950 border border-neutral-800 text-neutral-500 hover:text-white hover:border-primary-500/30 rounded-xl transition-all shadow-xl"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-3 bg-neutral-950 border border-neutral-800 text-neutral-500 hover:text-rose-500 hover:border-rose-500/30 rounded-xl transition-all shadow-xl">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLeads.length === 0 && !loading && (
            <div className="py-24 flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center justify-center text-neutral-800">
                <Users className="w-8 h-8" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600">No matching identifiers found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Lead Modal */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
            >
              <div className="p-8 border-b border-neutral-800 bg-neutral-950/50 flex items-center justify-between">
                <SectionHeader
                  title="Lead Profile"
                  description="Detailed record and interaction history."
                />
                <button onClick={() => setSelectedLead(null)} className="p-4 bg-neutral-900 hover:bg-neutral-800 text-neutral-500 hover:text-white rounded-2xl transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-10 space-y-10">
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Contact Details</label>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-neutral-950 border border-neutral-800 rounded-2xl">
                        <Users className="w-4 h-4 text-primary-500" />
                        <span className="text-sm font-black text-white">{selectedLead.name}</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-neutral-950 border border-neutral-800 rounded-2xl">
                        <Mail className="w-4 h-4 text-neutral-600" />
                        <span className="text-sm font-medium text-neutral-300">{selectedLead.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Business Context</label>
                    <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-3xl space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-neutral-600">Unit</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">{selectedLead.branch?.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-neutral-600">Brand</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">{selectedLead.branch?.brand?.name}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Interrogation Message</label>
                  <div className="p-8 bg-neutral-950 border border-neutral-800 rounded-[32px] text-sm text-neutral-400 leading-relaxed italic">
                    "{selectedLead.message || 'No manual input provided by subject.'}"
                  </div>
                </div>
              </div>

              <div className="p-8 bg-neutral-950/50 border-t border-neutral-800 flex justify-end gap-4">
                <button className="px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border border-neutral-800">Archive Record</button>
                <button className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary-500/20">Initiate Contact</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

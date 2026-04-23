'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  List,
  Settings,
  Plus,
  Search,
  Filter,
  Clock,
  Target,
  ChevronRight,
  ArrowRight,
  X,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/components/ui/Toast';
import { SectionHeader, Card, Button, StatCard } from '@/components/ui';
import AppointmentList from '@/components/appointments/AppointmentList';
import AppointmentCalendar from '@/components/appointments/AppointmentCalendar';
import ServiceSlotManager from '@/components/appointments/ServiceSlotManager';

type ViewMode = 'calendar' | 'list' | 'services';

export default function AppointmentsAdminPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await fetch('/api/branches');
      const data = await response.json();
      if (data.branches?.length > 0) {
        setBranches(data.branches);
        setSelectedBranchId(data.branches[0].id);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setLoading(false);
    }
  };

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
          title="Temporal Scheduling Hub"
          description="Manage service protocols and temporal appointment blocks."
        />
        <div className="flex items-center gap-3">
          <select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            className="px-6 py-4 bg-neutral-900 border border-neutral-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 transition-all outline-none"
          >
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
          <button className="flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary-500/20">
            <Plus className="w-4 h-4" />
            Book Override
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 p-1.5 bg-neutral-950 border border-neutral-900 rounded-[24px] w-fit">
        {[
          { id: 'list', name: 'Queue Stream', icon: List },
          { id: 'calendar', name: 'Temporal Grid', icon: Calendar },
          { id: 'services', name: 'Service Modules', icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setViewMode(tab.id as ViewMode)}
            className={`flex items-center gap-3 px-6 py-3 rounded-[18px] transition-all ${
              viewMode === tab.id
                ? 'bg-neutral-900 border border-neutral-800 text-white shadow-xl'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${viewMode === tab.id ? 'text-primary-500' : ''}`} />
            <span className="text-[10px] font-black uppercase tracking-widest">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-[40px] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-30" />
        
        <div className="p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {viewMode === 'list' && (
                <AppointmentList branchId={selectedBranchId} />
              )}

              {viewMode === 'calendar' && (
                <div className="bg-neutral-950 rounded-[32px] p-8 border border-neutral-800/50">
                  <AppointmentCalendar
                    branchId={selectedBranchId}
                    onDateSelect={(date) => console.log('Date selected:', date)}
                  />
                </div>
              )}

              {viewMode === 'services' && (
                <ServiceSlotManager branchId={selectedBranchId} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Operational Protocol Help */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-primary-500/5 border border-primary-500/10 rounded-[32px] p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-500">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Efficiency Protocol</h3>
          </div>
          <ul className="space-y-4">
            {[
              'Automated verification for high-priority bookings',
              'Real-time synchronization with external calendars',
              'Temporal block optimization for peak performance'
            ].map((text, i) => (
              <li key={i} className="flex items-center gap-3 text-[11px] font-medium text-neutral-400 uppercase tracking-wide">
                <CheckCircle className="w-3.5 h-3.5 text-primary-500" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-amber-500/5 border border-amber-500/10 rounded-[32px] p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">System Alert</h3>
          </div>
          <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide leading-loose">
            Ensure all service modules are correctly configured with temporal buffers to prevent protocol collisions.
          </p>
          <button className="mt-6 text-[10px] font-black uppercase tracking-widest text-amber-500 hover:text-white transition-colors flex items-center gap-2">
            View Buffer Settings <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

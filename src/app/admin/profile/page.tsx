'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Shield, 
  Bell, 
  Settings, 
  Save, 
  Loader2, 
  Mail, 
  Phone, 
  Lock, 
  Globe, 
  Clock, 
  Eye, 
  EyeOff,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { toast } from '@/components/ui/Toast';
import { SectionHeader, Card, Button, StatCard } from '@/components/ui';

type TabType = 'profile' | 'security' | 'notifications' | 'preferences';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const tabs = [
    { id: 'profile' as TabType, name: 'IDENTITY', icon: User },
    { id: 'security' as TabType, name: 'SECURITY', icon: Shield },
    { id: 'notifications' as TabType, name: 'ALERTS', icon: Bell },
    { id: 'preferences' as TabType, name: 'CONFIG', icon: Settings },
  ];

  return (
    <div className="p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <SectionHeader
          title="Account Intelligence"
          description="Authentication matrix and identity profile management."
        />
        <button 
          onClick={() => {}}
          className="flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary-500/20"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Update Registry
        </button>
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
        <div className="flex-1 space-y-8 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {activeTab === 'profile' && (
                <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
                  <SectionHeader
                    title="Identity Profile"
                    description="Personal authentication parameters."
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-2">First Designation</label>
                      <input
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => setProfile(p => ({ ...p, firstName: e.target.value }))}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-primary-500/50 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-2">Final Designation</label>
                      <input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => setProfile(p => ({ ...p, lastName: e.target.value }))}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-primary-500/50 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-2">Communications Vector (Email)</label>
                      <div className="relative">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-700" />
                        <input
                          type="email"
                          value={profile.email}
                          className="w-full bg-neutral-950/50 border border-neutral-800 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-neutral-500 cursor-not-allowed outline-none"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl">
                  <SectionHeader
                    title="Shield Protocols"
                    description="Authentication hardening and credential rotation."
                  />
                  <div className="space-y-8 mt-10">
                    <div className="p-8 bg-neutral-950 border border-neutral-800 rounded-[32px] flex items-center justify-between group hover:border-primary-500/20 transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center text-primary-500">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="block text-[11px] font-black uppercase tracking-widest text-white">MFA Authentication</span>
                          <span className="block text-[9px] font-bold text-emerald-500 uppercase mt-1 tracking-widest">Protocol Active</span>
                        </div>
                      </div>
                      <button className="px-6 py-2.5 bg-neutral-900 border border-neutral-800 text-[10px] font-black uppercase tracking-widest text-white rounded-xl hover:bg-neutral-800 transition-all">Configure</button>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-600 ml-2">Credential Rotation</h4>
                      <div className="grid gap-4">
                        <input 
                          type="password" 
                          placeholder="Current Access Key"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-primary-500/50 transition-all outline-none"
                        />
                        <input 
                          type="password" 
                          placeholder="New Access Key"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:border-primary-500/50 transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

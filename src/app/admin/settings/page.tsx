'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { usePageHelp } from '@/hooks/usePageHelp';
import { SectionHeader, Card, Button } from '@/components/ui';
import MFASettings from '@/components/users/MFASettings';
import {
  User,
  Bell,
  Shield,
  Save,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Check,
  Smartphone,
  ChevronRight,
  Globe
} from 'lucide-react';

type TabType = 'profile' | 'notifications' | 'security' | 'preferences';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true
  });

  // Initialize help for this page
  usePageHelp({ pageContext: 'Settings' });

  const tabs = [
    { id: 'profile' as TabType, name: 'Identity', icon: User },
    { id: 'notifications' as TabType, name: 'Channels', icon: Bell },
    { id: 'security' as TabType, name: 'Firewall', icon: Shield },
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <SectionHeader
          title="System Preferences"
          description="Global configuration and account security parameters."
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Navigation Sidebar */}
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

        {/* Content Area */}
        <div className="flex-1 max-w-3xl space-y-8">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-30" />
                
                <SectionHeader
                  title="Personnel Records"
                  description="Administrative contact information and credentials."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500">First Designation</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-6 py-4 bg-neutral-950 border border-neutral-800 rounded-2xl text-sm font-medium text-white focus:border-primary-500/50 focus:ring-0 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Family Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-6 py-4 bg-neutral-950 border border-neutral-800 rounded-2xl text-sm font-medium text-white focus:border-primary-500/50 focus:ring-0 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Secure Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-neutral-950 border border-neutral-800 rounded-2xl text-sm font-medium text-white focus:border-primary-500/50 focus:ring-0 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Mobile Protocol</label>
                    <div className="relative">
                      <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-neutral-950 border border-neutral-800 rounded-2xl text-sm font-medium text-white focus:border-primary-500/50 focus:ring-0 transition-all"
                        placeholder="+91 00000 00000"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex justify-end">
                  <button 
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary-500/20 disabled:opacity-50"
                  >
                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                    Commit Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-30" />
                
                <SectionHeader
                  title="Credential Rotation"
                  description="Update your cryptographic access tokens."
                />

                <div className="space-y-6 mt-10 max-w-md">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Legacy Password</label>
                    <div className="relative">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                      <input
                        type="password"
                        className="w-full pl-14 pr-6 py-4 bg-neutral-950 border border-neutral-800 rounded-2xl text-sm font-medium text-white focus:border-rose-500/50 focus:ring-0 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-neutral-500">New Protocol Token</label>
                    <div className="relative">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="w-full pl-14 pr-14 py-4 bg-neutral-950 border border-neutral-800 rounded-2xl text-sm font-medium text-white focus:border-rose-500/50 focus:ring-0 transition-all"
                      />
                      <button 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-rose-500/20">
                    <Shield className="w-4 h-4" />
                    Authorize Rotation
                  </button>
                </div>
              </div>

              <MFASettings />
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-30" />
                
                <SectionHeader
                  title="Communication Matrix"
                  description="Define active alerting and messaging nodes."
                />

                <div className="space-y-6 mt-10">
                  {[
                    { id: 'email', label: 'Electronic Mail Alerts', desc: 'Critical system events and audit logs' },
                    { id: 'sms', label: 'Mobile Messaging', desc: 'Urgent security and downtime notifications' },
                    { id: 'marketing', label: 'Insight Reports', desc: 'New feature updates and platform insights' },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-6 bg-neutral-950 border border-neutral-800/50 rounded-3xl group hover:border-amber-500/30 transition-all">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">{item.label}</span>
                        <span className="text-[9px] font-bold text-neutral-600 uppercase mt-1">{item.desc}</span>
                      </div>
                      <button className="w-12 h-6 bg-neutral-900 rounded-full relative p-1 group-hover:bg-neutral-800 transition-colors">
                        <div className="w-4 h-4 bg-neutral-700 rounded-full" />
                      </button>
                    </div>
                  ))}
                  
                  <div className="flex justify-end pt-4">
                    <button className="flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-amber-500/20">
                      <Save className="w-4 h-4" />
                      Save Matrix
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

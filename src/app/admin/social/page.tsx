'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  MessageSquare,
  Video,
  Award,
  Tag,
  Briefcase,
  Check,
  X,
  Reply,
  Eye,
  Filter,
  Plus,
  Trash2,
  Edit2,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  Activity,
  Zap,
  Target
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useToastHelpers } from '@/components/ui/Toast';
import { SectionHeader, Card, Button, StatCard } from '@/components/ui';

type TabType = 'reviews' | 'video-testimonials' | 'badges' | 'offers' | 'portfolio';

export default function SocialDashboardPage() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToastHelpers();
  const [activeTab, setActiveTab] = useState<TabType>('reviews');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const tabs = [
    { id: 'reviews' as TabType, label: 'REVIEWS', icon: MessageSquare },
    { id: 'video-testimonials' as TabType, label: 'VIDEOS', icon: Video },
    { id: 'badges' as TabType, label: 'PROOF', icon: Award },
    { id: 'offers' as TabType, label: 'OFFERS', icon: Tag },
    { id: 'portfolio' as TabType, label: 'WORK', icon: Briefcase },
  ];

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
          title="Social Intelligence"
          description="Sentiment analysis and community engagement management."
        />
        <button className="flex items-center gap-2 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary-500/20">
          <Plus className="w-4 h-4" />
          Broadcast Update
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Global Sentiment"
          value="4.8"
          icon={<Star className="w-5 h-5" />}
          color="primary"
        />
        <StatCard
          title="Pending Proof"
          value="12"
          icon={<Activity className="w-5 h-5" />}
          color="amber"
        />
        <StatCard
          title="Conversion Boost"
          value="24%"
          icon={<Zap className="w-5 h-5" />}
          color="emerald"
        />
        <StatCard
          title="Target Reach"
          value="12.4K"
          icon={<Target className="w-5 h-5" />}
          color="indigo"
        />
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
                <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
              </div>
              {activeTab === tab.id && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-8 max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Unprocessed Testimonials</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-neutral-700">Filter:</span>
                      <select className="bg-transparent border-none text-[9px] font-black uppercase tracking-widest text-primary-500 focus:ring-0 cursor-pointer">
                        <option>Critical First</option>
                        <option>Recent First</option>
                      </select>
                    </div>
                  </div>

                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 hover:border-primary-500/20 transition-all group">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center justify-center text-white font-black text-xs">
                            S{i}
                          </div>
                          <div>
                            <span className="block text-[11px] font-black uppercase tracking-widest text-white">Subject Delta-{i}</span>
                            <div className="flex gap-1 mt-1">
                              {[...Array(5)].map((_, s) => (
                                <Star key={s} className="w-3 h-3 fill-primary-500 text-primary-500" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-neutral-600">2.4h ago</span>
                      </div>
                      <p className="text-sm text-neutral-400 italic leading-relaxed mb-8">
                        "The operational efficiency achieved through Parichay's neural-sync protocols is unprecedented. Our conversion matrix has optimized by 40%."
                      </p>
                      <div className="flex items-center gap-3">
                        <button className="flex-1 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-emerald-500 hover:text-white hover:border-emerald-500/30 transition-all">Approve Protocol</button>
                        <button className="flex-1 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-rose-500 hover:text-white hover:border-rose-500/30 transition-all">Terminal Reject</button>
                        <button className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-600 hover:text-primary-500 transition-all"><Reply className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'badges' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: 'Verified Authority', icon: Check, color: 'text-emerald-500' },
                    { name: 'Alpha Performer', icon: Star, color: 'text-amber-500' },
                    { name: 'Trusted Network', icon: Award, color: 'text-blue-500' },
                    { name: 'Prime Status', icon: Zap, color: 'text-purple-500' },
                  ].map((badge) => (
                    <div key={badge.name} className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 flex items-center justify-between group hover:border-primary-500/20 transition-all">
                      <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center justify-center ${badge.color} group-hover:scale-110 transition-transform`}>
                          <badge.icon className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-white">{badge.name}</span>
                      </div>
                      <button className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-600 hover:text-primary-500 transition-all">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Book,
  MessageCircle,
  Video,
  FileText,
  Search,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  Mail,
  Phone,
  ExternalLink,
  Lightbulb,
  Zap,
  Users,
  Settings,
  X,
  ArrowRight
} from 'lucide-react';
import { SectionHeader, Card, Button, StatCard } from '@/components/ui';

type TabType = 'faq' | 'guides' | 'contact' | 'videos';

export default function AdminHelpPage() {
  const [activeTab, setActiveTab] = useState<TabType>('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const tabs = [
    { id: 'faq' as TabType, label: 'KNOWLEDGE BASE', icon: HelpCircle },
    { id: 'guides' as TabType, label: 'OPERATIONAL GUIDES', icon: Book },
    { id: 'videos' as TabType, label: 'NEURAL VISUALS', icon: Video },
    { id: 'contact' as TabType, label: 'DIRECT SUPPORT', icon: MessageCircle },
  ];

  const faqs = [
    {
      question: 'How do I initiate a brand deployment?',
      answer: 'Navigate to the Brands matrix from the primary sidebar, then initialize a "New Node". Fill in the mandatory identity parameters including name, category, and visual assets.',
    },
    {
      question: 'Protocol for adding branch satellites?',
      answer: 'Access the Branches module and click "Establish Branch". Map it to a parent brand node and define its geographical and contact coordinates.',
    },
    {
      question: 'Lead attribution logic?',
      answer: 'Every microsite interaction is monitored. Subjects submitting data through integrated forms are captured as conversion leads and prioritized in the Leads hub.',
    },
  ];

  return (
    <div className="p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <SectionHeader
          title="Intelligence Support"
          description="Access the comprehensive operational knowledge base and direct support channels."
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Articles"
          value="42"
          icon={<Book className="w-5 h-5" />}
          color="primary"
        />
        <StatCard
          title="Video Docs"
          value="12"
          icon={<Video className="w-5 h-5" />}
          color="emerald"
        />
        <StatCard
          title="Response Time"
          value="< 2h"
          icon={<Zap className="w-5 h-5" />}
          color="amber"
        />
        <StatCard
          title="Uptime"
          value="99.9%"
          icon={<Activity className="w-5 h-5" />}
          color="indigo"
        />
      </div>

      {/* Navigation */}
      <div className="flex flex-col lg:flex-row gap-10">
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

        <div className="flex-1 space-y-8 max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {activeTab === 'faq' && (
                <div className="space-y-6">
                  <div className="relative group max-w-xl">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="Search knowledge registry..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-14 pr-6 py-4 bg-neutral-900 border border-neutral-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 transition-all placeholder:text-neutral-700 outline-none"
                    />
                  </div>

                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden group hover:border-primary-500/20 transition-all">
                        <button
                          onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                          className="w-full flex items-center justify-between p-8 text-left"
                        >
                          <span className="text-[11px] font-black uppercase tracking-widest text-white">{faq.question}</span>
                          <ChevronDown className={`w-5 h-5 text-neutral-600 transition-transform ${expandedFAQ === index ? 'rotate-180 text-primary-500' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {expandedFAQ === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                            >
                              <div className="px-8 pb-8 text-sm text-neutral-400 leading-relaxed italic border-t border-neutral-800/50 pt-8">
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 space-y-6 hover:border-primary-500/20 transition-all group">
                    <div className="w-14 h-14 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-white mb-2">Neural Link (Email)</h3>
                      <p className="text-[10px] font-bold text-neutral-500 uppercase mb-6 leading-relaxed">Direct synchronization with our intelligence team.</p>
                      <a href="mailto:support@parichay.ai" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 hover:text-white transition-colors">support@parichay.ai</a>
                    </div>
                  </div>

                  <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 space-y-6 hover:border-primary-500/20 transition-all group">
                    <div className="w-14 h-14 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-white mb-2">Real-time Stream</h3>
                      <p className="text-[10px] font-bold text-neutral-500 uppercase mb-6 leading-relaxed">Live interrogation and operational support.</p>
                      <button className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 hover:text-white transition-colors">Initialize Stream</button>
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

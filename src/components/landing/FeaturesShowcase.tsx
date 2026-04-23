'use client';

import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Zap,
  Share2,
  BarChart3,
  Lock,
  Palette,
  QrCode,
  Globe,
  MessageSquare,
  LucideIcon
} from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
}

// Icon map for dynamic rendering
const iconMap: Record<string, LucideIcon> = {
  smartphone: Smartphone,
  zap: Zap,
  share2: Share2,
  barChart3: BarChart3,
  lock: Lock,
  palette: Palette,
  qrCode: QrCode,
  globe: Globe,
  messageSquare: MessageSquare,
};

// Outcome-driven marketing copy
const defaultFeatures: Feature[] = [
  {
    id: 'out-1',
    title: 'Transform Meetings into Leads',
    description: 'Capture contact info instantly into your digital CRM the moment someone views your card.',
    icon: 'messageSquare',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'out-2',
    title: 'Get 3x More Follow-ups',
    description: '1-tap save to contacts and auto-WhatsApp shortcuts ensure prospects never lose your number.',
    icon: 'zap',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    id: 'out-3',
    title: 'Know Exactly Who Viewed You',
    description: 'Real-time analytics tell you when, where, and how often your profile was opened.',
    icon: 'barChart3',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'out-4',
    title: 'Never Run Out of Cards',
    description: 'Share infinitely via QR codes, links, or NFC. Always have your business card ready.',
    icon: 'share2',
    gradient: 'from-orange-500 to-red-600',
  },
  {
    id: 'out-5',
    title: 'Build Instant Credibility',
    description: 'A premium, modern digital profile proves you are an industry leader who means business.',
    icon: 'palette',
    gradient: 'from-blue-600 to-cyan-600',
  },
  {
    id: 'out-6',
    title: 'CRM-Lite Dashboard',
    description: 'Every collected lead is stored securely for easy tracking, follow-ups, and exporting.',
    icon: 'lock',
    gradient: 'from-neutral-700 to-black',
  },
];

export default function FeaturesShowcase() {
  const [features, setFeatures] = useState<Feature[]>(defaultFeatures);


  return (
    <section className="py-20 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-800 dark:to-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            A Lead Generation Engine in Your Pocket
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Stop handing out paper cards that get thrown away. Start capturing leads, tracking views, and growing your revenue.
          </p>
        </div>

        {/* Removed loading state to display marketing copy immediately */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = iconMap[feature.icon] || Zap;
            return (
              <div
                key={feature.id}
                className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100 dark:border-neutral-700 group hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <a
            href="/features"
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            Explore All Features
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

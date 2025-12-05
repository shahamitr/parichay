'use client';

import React from 'react';
import {
  Smartphone,
  Zap,
  Share2,
  BarChart3,
  Lock,
  Palette,
  QrCode,
  Globe,
  MessageSquare
} from 'lucide-react';

export default function FeaturesShowcase() {
  const features = [
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description: 'Perfectly optimized for all devices. Your card looks stunning on any screen.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'Instant Setup',
      description: 'Create your professional digital business card in under 5 minutes.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Share2,
      title: 'Easy Sharing',
      description: 'Share via QR code, link, email, or social media with one tap.',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track views, clicks, and engagement with detailed analytics.',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Palette,
      title: 'Custom Branding',
      description: 'Personalize colors, fonts, and layouts to match your brand identity.',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: QrCode,
      title: 'Dynamic QR Codes',
      description: 'Generate custom QR codes that link directly to your digital card.',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Globe,
      title: 'Custom Domain',
      description: 'Use your own domain name for a professional web presence.',
      gradient: 'from-teal-500 to-cyan-500',
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'Enterprise-grade security to protect your data and privacy.',
      gradient: 'from-gray-600 to-gray-800',
    },
    {
      icon: MessageSquare,
      title: 'Lead Capture',
      description: 'Collect inquiries and feedback directly from your digital card.',
      gradient: 'from-yellow-500 to-orange-500',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to Stand Out
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful features designed to help you make lasting impressions and grow your network
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <a
            href="/features"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
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

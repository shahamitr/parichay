'use client';

import React, { useState } from 'react';
import { Check, ExternalLink, Search, MapPin, Phone, Globe, Star, Shield, Zap } from 'lucide-react';
import { FadeIn, SlideIn } from '@/components/ui/AnimatedElements';

export default function DirectoryValidationSection() {
  const [activeTab, setActiveTab] = useState('google');

  const directories = [
    {
      id: 'google',
      name: 'Google Local Places',
      icon: '🌐',
      color: 'from-blue-500 to-blue-600',
      description: 'Sync with Google My Business and local search results',
      features: [
        'Auto-sync business information',
        'Real-time reviews integration',
        'Location-based visibility',
        'Google Maps integration',
        'Local SEO optimization'
      ],
      stats: { businesses: '150M+', coverage: 'Global' }
    },
    {
      id: 'justdial',
      name: 'JustDial',
      icon: '📞',
r: 'from-red-500 to-red-600',
      description: 'India\'s largest local search platform integration',
      features: [
        'Business listing sync',
        'Customer reviews import',
        'Contact information validation',
        'Category-based visibility',
        'Local market reach'
      ],
      stats: { businesses: '30M+', coverage: 'India' }
    },
    {
      id: 'yellowpages',
      name: 'Yellow Pages',
      icon: '📋',
      color: 'from-yellow-500 to-orange-500',
      description: 'Traditional directory with digital presence',
      features: [
        'Business directory listing',
        'Contact verification',
        'Industry categorization',
        'Local business network',
        'Trust indicators'
      ],
      stats: { businesses: '20M+', coverage: 'US & International' }
    },
    {
      id: 'others',
      name: 'Other Directories',
      icon: '🔗',
      color: 'from-purple-500 to-purple-600',
      description: 'Connect with 50+ business directories worldwide',
      features: [
        'Yelp integration',
        'Facebook Business sync',
        'Industry-specific directories',
        'Regional platforms',
        'Custom API connections'
      ],
      stats: { businesses: '100M+', coverage: 'Worldwide' }
    }
  ];

  const activeDirectory = directories.find(d => d.id === activeTab) || directories[0];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-6 py-3 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Directory Validation & Integration
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Validate & Sync with Major Directories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Automatically validate your business information across Google Local Places, JustDial, Yellow Pages, and 50+ other directories worldwide.
            </p>
          </div>
        </FadeIn>

        {/* Directory Tabs */}
        <SlideIn direction="up" delay={200}>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {directories.map((directory) => (
              <button
                key={directory.id}
                onClick={() => setActiveTab(directory.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 ${
                  activeTab === directory.id
                    ? `bg-gradient-to-r ${directory.color} text-white shadow-lg`
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-600'
                }`}
              >
                <span className="text-2xl">{directory.icon}</span>
                <span>{directory.name}</span>
              </button>
            ))}
          </div>
        </SlideIn>

        {/* Active Directory Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <SlideIn direction="left" delay={400}>
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${activeDirectory.color} flex items-center justify-center shadow-lg`}>
                    <span className="text-3xl">{activeDirectory.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {activeDirectory.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {activeDirectory.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {activeDirectory.stats.businesses}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Businesses Listed
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {activeDirectory.stats.coverage}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Coverage Area
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Integration Features
                </h4>
                <ul className="space-y-3">
                  {activeDirectory.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className={`flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r ${activeDirectory.color} hover:shadow-lg transition-all duration-300 hover:scale-105`}>
                  <Zap className="w-5 h-5" />
                  Start Integration
                </button>
                <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-300">
                  <ExternalLink className="w-5 h-5" />
                  Learn More
                </button>
              </div>
            </div>
          </SlideIn>

          {/* Right Content - Visual Demo */}
          <SlideIn direction="right" delay={600}>
            <div className="relative">
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-slate-700">
                <div className="space-y-6">
                  {/* Mock Directory Interface */}
                  <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-slate-600">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${activeDirectory.color} flex items-center justify-center`}>
                      <span className="text-xl">{activeDirectory.icon}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        Business Validation
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {activeDirectory.name} Integration
                      </div>
                    </div>
                  </div>

                  {/* Validation Steps */}
                  <div className="space-y-4">
                    {[
                      { step: 'Verify Business Info', status: 'completed', icon: Check },
                      { step: 'Sync Contact Details', status: 'completed', icon: Phone },
                      { step: 'Update Location Data', status: 'completed', icon: MapPin },
                      { step: 'Import Reviews', status: 'in-progress', icon: Star },
                      { step: 'Optimize Listing', status: 'pending', icon: Search }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          item.status === 'completed' ? 'bg-green-100 text-green-600' :
                          item.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-400'
                        }`}>
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium ${
                            item.status === 'completed' ? 'text-green-700 dark:text-green-400' :
                            item.status === 'in-progress' ? 'text-blue-700 dark:text-blue-400' :
                            'text-gray-500 dark:text-gray-400'
                          }`}>
                            {item.step}
                          </div>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          item.status === 'completed' ? 'bg-green-100 text-green-700' :
                          item.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {item.status === 'completed' ? 'Done' :
                           item.status === 'in-progress' ? 'Processing' : 'Pending'}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Success Metrics */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div className="font-semibold text-green-800 dark:text-green-300">
                        Validation Complete
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-semibold text-green-700 dark:text-green-400">98%</div>
                        <div className="text-green-600 dark:text-green-500">Accuracy Score</div>
                      </div>
                      <div>
                        <div className="font-semibold text-green-700 dark:text-green-400">24/7</div>
                        <div className="text-green-600 dark:text-green-500">Auto Sync</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Success Indicators */}
              <div className="absolute -top-4 -right-2 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg animate-bounce">
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </SlideIn>
        </div>

        {/* Bottom CTA */}
        <FadeIn delay={800}>
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Validate Your Business Across All Directories?
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Connect with Google Local Places, JustDial, Yellow Pages, and 50+ other directories in minutes
              </p>
              <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                Start Directory Validation
              </button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
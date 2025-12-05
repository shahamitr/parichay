'use client';

import React from 'react';
import { TrendingUp, Users, Globe, Award } from 'lucide-react';

export default function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: '10,000+',
      label: 'Active Users',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Globe,
      value: '50+',
      label: 'Countries',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: TrendingUp,
      value: '98%',
      label: 'Satisfaction Rate',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Award,
      value: '4.9/5',
      label: 'User Rating',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center group">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

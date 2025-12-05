'use client';

import { useState } from 'react';
import { Search, Download, Star, TrendingUp, Users, DollarSign, Activity, Calendar, Mail, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Widget {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  rating: number;
  downloads: number;
  price: number;
  preview: string;
}

const availableWidgets: Widget[] = [
  {
    id: 'analytics',
    name: 'Analytics Dashboard',
    description: 'Real-time analytics with charts and metrics',
    icon: <TrendingUp className="w-6 h-6" />,
    category: 'Analytics',
    rating: 4.8,
    downloads: 1234,
    price: 0,
    preview: '/widgets/analytics.png',
  },
  {
    id: 'users',
    name: 'User Management',
    description: 'Manage users and permissions',
    icon: <Users className="w-6 h-6" />,
    category: 'Management',
    rating: 4.6,
    downloads: 892,
    price: 0,
    preview: '/widgets/users.png',
  },
  {
    id: 'revenue',
    name: 'Revenue Tracker',
    description: 'Track revenue and financial metrics',
    icon: <DollarSign className="w-6 h-6" />,
    category: 'Finance',
    rating: 4.9,
    downloads: 2341,
    price: 0,
    preview: '/widgets/revenue.png',
  },
  {
    id: 'activity',
    name: 'Activity Feed',
    description: 'Recent activity and notifications',
    icon: <Activity className="w-6 h-6" />,
    category: 'Social',
    rating: 4.5,
    downloads: 567,
    price: 0,
    preview: '/widgets/activity.png',
  },
  {
    id: 'calendar',
    name: 'Calendar Widget',
    description: 'Events and scheduling',
    icon: <Calendar className="w-6 h-6" />,
    category: 'Productivity',
    rating: 4.7,
    downloads: 1456,
    price: 0,
    preview: '/widgets/calendar.png',
  },
  {
    id: 'email',
    name: 'Email Stats',
    description: 'Email campaign analytics',
    icon: <Mail className="w-6 h-6" />,
    category: 'Marketing',
    rating: 4.4,
    downloads: 789,
    price: 0,
    preview: '/widgets/email.png',
  },
];

export default function WidgetMarketplace({ onInstall }: { onInstall?: (widget: Widget) => void }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [installed, setInstalled] = useState<string[]>([]);

  const categories = ['All', ...Array.from(new Set(availableWidgets.map((w) => w.category)))];

  const filteredWidgets = availableWidgets.filter((widget) => {
    const matchesSearch = widget.name.toLowerCase().includes(search.toLowerCase()) ||
      widget.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || widget.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleInstall = (widget: Widget) => {
    setInstalled([...installed, widget.id]);
    onInstall?.(widget);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Widget Marketplace</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search widgets..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWidgets.map((widget) => {
          const isInstalled = installed.includes(widget.id);
          return (
            <div
              key={widget.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    'p-3 rounded-lg',
                    'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                  )}>
                    {widget.icon}
                  </div>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded">
                    {widget.category}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {widget.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {widget.description}
                </p>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{widget.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    <span>{widget.downloads}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleInstall(widget)}
                  disabled={isInstalled}
                  className={cn(
                    'w-full py-2.5 rounded-lg font-medium transition-colors',
                    isInstalled
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  )}
                >
                  {isInstalled ? 'Installed' : widget.price === 0 ? 'Install Free' : `Install $${widget.price}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

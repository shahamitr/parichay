'use client';

import { useState } from 'react';
import {
  Home,
  Info,
  ShoppingBag,
  Image as ImageIcon,
  Video,
  Phone,
  CreditCard,
  MessageSquare,
  TrendingUp,
  Star,
  Megaphone,
  Award,
  Settings,
  Eye,
} from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface MicrositeEditorTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  enabledSections?: Record<string, boolean>;
}

/**
 * MicrositeEditorTabs Component
 *
 * Navigation tabs for microsite editor sections
 */
export default function MicrositeEditorTabs({
  activeTab,
  onTabChange,
  enabledSections = {},
}: MicrositeEditorTabsProps) {
  const tabs: Tab[] = [
    { id: 'profile', label: 'Profile', icon: <Home className="w-4 h-4" /> },
    { id: 'hero', label: 'Hero', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <Info className="w-4 h-4" /> },
    { id: 'services', label: 'Services', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'impact', label: 'Impact', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'testimonials', label: 'Testimonials', icon: <Star className="w-4 h-4" /> },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'trust', label: 'Trust', icon: <Award className="w-4 h-4" /> },
    { id: 'videos', label: 'Videos', icon: <Video className="w-4 h-4" /> },
    { id: 'cta', label: 'CTA', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact', icon: <Phone className="w-4 h-4" /> },
    { id: 'payment', label: 'Payment', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'theme', label: 'Theme', icon: <Settings className="w-4 h-4" /> },
    { id: 'seo', label: 'SEO', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
      <div className="flex overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isDisabled = enabledSections[tab.id] === false;

          return (
            <button
              key={tab.id}
              onClick={() => !isDisabled && onTabChange(tab.id)}
              disabled={isDisabled}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                ${isActive
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }
                ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="ml-1 px-2 py-0.5 text-xs bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

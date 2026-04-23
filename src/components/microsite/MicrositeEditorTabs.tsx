'use client';

import {
  Home,
  Info,
  ShoppingBag,
  Image as ImageIcon,
  Video,
  Phone,
  CreditCard,
  TrendingUp,
  Star,
  Megaphone,
  Award,
  Settings,
  Palette,
  Search,
  Calendar,
} from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  group: 'content' | 'social' | 'settings';
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
 * Navigation tabs for microsite editor sections - organized by category
 */
export default function MicrositeEditorTabs({
  activeTab,
  onTabChange,
  enabledSections = {},
}: MicrositeEditorTabsProps) {
  const tabs: Tab[] = [
    // Content sections
    { id: 'profile', label: 'Profile', icon: <Home className="w-4 h-4" />, group: 'content' },
    { id: 'hero', label: 'Hero', icon: <Megaphone className="w-4 h-4" />, group: 'content' },
    { id: 'about', label: 'About', icon: <Info className="w-4 h-4" />, group: 'content' },
    { id: 'services', label: 'Services', icon: <ShoppingBag className="w-4 h-4" />, group: 'content' },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon className="w-4 h-4" />, group: 'content' },
    { id: 'videos', label: 'Videos', icon: <Video className="w-4 h-4" />, group: 'content' },
    // Social proof sections
    { id: 'impact', label: 'Impact', icon: <TrendingUp className="w-4 h-4" />, group: 'social' },
    { id: 'testimonials', label: 'Testimonials', icon: <Star className="w-4 h-4" />, group: 'social' },
    { id: 'trust', label: 'Trust', icon: <Award className="w-4 h-4" />, group: 'social' },
    { id: 'cta', label: 'CTA', icon: <Megaphone className="w-4 h-4" />, group: 'social' },
    // Contact & settings
    { id: 'contact', label: 'Contact', icon: <Phone className="w-4 h-4" />, group: 'settings' },
    { id: 'booking', label: 'Booking', icon: <Calendar className="w-4 h-4" />, group: 'settings' },
    { id: 'payment', label: 'Payment', icon: <CreditCard className="w-4 h-4" />, group: 'settings' },
    { id: 'theme', label: 'Theme', icon: <Palette className="w-4 h-4" />, group: 'settings' },
    { id: 'seo', label: 'SEO', icon: <Search className="w-4 h-4" />, group: 'settings' },
  ];

  const groupLabels: Record<string, string> = {
    content: 'Content',
    social: 'Social Proof',
    settings: 'Settings',
  };

  const groups = ['content', 'social', 'settings'] as const;

  return (
    <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
      <div className="flex overflow-x-auto scrollbar-hide">
        {groups.map((group, groupIndex) => {
          const groupTabs = tabs.filter((t) => t.group === group);
          return (
            <div key={group} className="flex items-center">
              {/* Group label */}
              <div className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-r border-gray-800">
                {groupLabels[group]}
              </div>
              {/* Group tabs */}
              {groupTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const isDisabled = enabledSections[tab.id] === false;

                return (
                  <button
                    key={tab.id}
                    onClick={() => !isDisabled && onTabChange(tab.id)}
                    disabled={isDisabled}
                    className={`
                      flex items-center gap-2 px-3 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                      ${isActive
                        ? 'border-amber-500 text-amber-500 bg-amber-500/5'
                        : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }
                      ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && (
                      <span className="ml-1 px-2 py-0.5 text-xs bg-amber-500/10 text-amber-500 rounded-full">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
              {/* Separator between groups */}
              {groupIndex < groups.length - 1 && (
                <div className="w-px h-8 bg-gray-800 mx-1" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

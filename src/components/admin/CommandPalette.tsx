'use client';

import { Fragment, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, Combobox, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminStore } from '@/lib/admin-store';
import {
  Search,
  LayoutDashboard,
  Building2,
  GitBranch,
  Users,
  BarChart3,
  Settings,
  Plus,
  ArrowRight,
  Clock,
  Hash,
  FileText,
  Link2,
  Star,
  CreditCard,
  HelpCircle,
  Command,
} from 'lucide-react';

interface CommandItem {
  id: string;
  name: string;
  description?: string;
  icon: React.ElementType;
  href?: string;
  action?: () => void;
  category: 'navigation' | 'actions' | 'recent' | 'search';
  keywords?: string[];
}

const navigationCommands: CommandItem[] = [
  { id: 'dashboard', name: 'Dashboard', description: 'Go to dashboard', icon: LayoutDashboard, href: '/admin/dashboard', category: 'navigation', keywords: ['home', 'overview'] },
  { id: 'brands', name: 'Brands', description: 'Manage your brands', icon: Building2, href: '/admin/brands', category: 'navigation', keywords: ['business', 'company'] },
  { id: 'branches', name: 'Branches', description: 'Manage branches', icon: GitBranch, href: '/admin/branches', category: 'navigation', keywords: ['location', 'store'] },
  { id: 'users', name: 'Users', description: 'User management', icon: Users, href: '/admin/users', category: 'navigation', keywords: ['team', 'members'] },
  { id: 'analytics', name: 'Analytics', description: 'View analytics', icon: BarChart3, href: '/admin/analytics', category: 'navigation', keywords: ['stats', 'reports', 'metrics'] },
  { id: 'leads', name: 'Leads', description: 'Manage leads', icon: Users, href: '/admin/leads', category: 'navigation', keywords: ['contacts', 'customers'] },
  { id: 'tools', name: 'Short Links', description: 'Link management', icon: Link2, href: '/admin/tools', category: 'navigation', keywords: ['urls', 'links'] },
  { id: 'social', name: 'Social & Reviews', description: 'Social media and reviews', icon: Star, href: '/admin/social', category: 'navigation', keywords: ['facebook', 'google'] },
  { id: 'subscription', name: 'Subscription', description: 'Manage subscription', icon: CreditCard, href: '/admin/subscription', category: 'navigation', keywords: ['billing', 'plan'] },
  { id: 'settings', name: 'Settings', description: 'App settings', icon: Settings, href: '/admin/settings', category: 'navigation', keywords: ['preferences', 'config'] },
  { id: 'help', name: 'Help & Support', description: 'Get help', icon: HelpCircle, href: '/admin/help', category: 'navigation', keywords: ['faq', 'support'] },
];

const actionCommands: CommandItem[] = [
  { id: 'new-brand', name: 'Create New Brand', description: 'Add a new brand', icon: Plus, href: '/admin/brands?action=new', category: 'actions', keywords: ['add', 'create'] },
  { id: 'new-branch', name: 'Create New Branch', description: 'Add a new branch', icon: Plus, href: '/admin/branches?action=new', category: 'actions', keywords: ['add', 'create'] },
  { id: 'new-lead', name: 'Add New Lead', description: 'Add a new lead manually', icon: Plus, href: '/admin/leads?action=new', category: 'actions', keywords: ['add', 'create'] },
];

export default function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen, recentSearches, addRecentSearch } = useAdminStore();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get recent items from local storage
  const recentItems: CommandItem[] = recentSearches
    .map((search) => {
      const item = [...navigationCommands, ...actionCommands].find(
        (cmd) => cmd.id === search || cmd.name.toLowerCase() === search.toLowerCase()
      );
      return item ? { ...item, category: 'recent' as const } : null;
    })
    .filter(Boolean) as CommandItem[];

  // Filter commands based on query
  const filteredCommands = query === ''
    ? [...actionCommands, ...navigationCommands]
    : [...navigationCommands, ...actionCommands].filter((command) => {
        const searchTerms = [
          command.name.toLowerCase(),
          command.description?.toLowerCase() || '',
          ...(command.keywords || []).map((k) => k.toLowerCase()),
        ].join(' ');
        return searchTerms.includes(query.toLowerCase());
      });

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, command) => {
    const cat = query === '' ? command.category : 'search';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(command);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  // Handle selection
  const handleSelect = (command: CommandItem) => {
    addRecentSearch(command.id);
    setCommandPaletteOpen(false);
    setQuery('');

    if (command.href) {
      router.push(command.href);
    } else if (command.action) {
      command.action();
    }
  };

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  // Reset query when closing
  useEffect(() => {
    if (!commandPaletteOpen) {
      setQuery('');
    }
  }, [commandPaletteOpen]);

  const categoryLabels: Record<string, string> = {
    recent: 'Recent',
    actions: 'Quick Actions',
    navigation: 'Navigation',
    search: 'Results',
  };

  return (
    <Transition.Root show={commandPaletteOpen} as={Fragment} afterLeave={() => setQuery('')}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setCommandPaletteOpen(false)}
      >
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/50 dark:bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-2xl ring-1 ring-gray-900/5 dark:ring-white/10 transition-all">
              <Combobox onChange={(command: CommandItem | null) => command && handleSelect(command)}>
                {/* Search input */}
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <Combobox.Input
                    className="h-14 w-full border-0 bg-transparent pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-0 sm:text-sm"
                    placeholder="Search commands, pages, actions..."
                    onChange={(e) => setQuery(e.target.value)}
                    autoComplete="off"
                  />
                  <div className="absolute right-4 top-4">
                    <kbd className="inline-flex items-center gap-1 rounded border border-gray-200 dark:border-gray-700 px-2 py-0.5 text-xs font-medium text-gray-400">
                      ESC
                    </kbd>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 dark:border-gray-800" />

                {/* Results */}
                <Combobox.Options
                  static
                  className="max-h-[60vh] scroll-py-2 overflow-y-auto py-2"
                >
                  {/* Recent items when no query */}
                  {query === '' && recentItems.length > 0 && (
                    <div className="px-2 pb-2">
                      <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Recent
                      </h3>
                      {recentItems.slice(0, 3).map((item) => (
                        <Combobox.Option
                          key={`recent-${item.id}`}
                          value={item}
                          className={({ active }) => `
                            flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm
                            ${active ? 'bg-primary-50 dark:bg-primary-500/10' : ''}
                          `}
                        >
                          {({ active }) => (
                            <>
                              <div className={`
                                p-2 rounded-lg
                                ${active ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}
                              `}>
                                <item.icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={`font-medium ${active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'}`}>
                                  {item.name}
                                </div>
                                {item.description && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {item.description}
                                  </div>
                                )}
                              </div>
                              <Clock className="w-4 h-4 text-gray-400" />
                            </>
                          )}
                        </Combobox.Option>
                      ))}
                    </div>
                  )}

                  {/* Grouped results */}
                  {Object.entries(groupedCommands).map(([category, items]) => (
                    <div key={category} className="px-2 pb-2">
                      <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {categoryLabels[category] || category}
                      </h3>
                      {items.map((item) => (
                        <Combobox.Option
                          key={item.id}
                          value={item}
                          className={({ active }) => `
                            flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm
                            ${active ? 'bg-primary-50 dark:bg-primary-500/10' : ''}
                          `}
                        >
                          {({ active }) => (
                            <>
                              <div className={`
                                p-2 rounded-lg
                                ${active ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}
                              `}>
                                <item.icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={`font-medium ${active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'}`}>
                                  {item.name}
                                </div>
                                {item.description && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {item.description}
                                  </div>
                                )}
                              </div>
                              <ArrowRight className={`w-4 h-4 ${active ? 'text-primary-500' : 'text-gray-300 dark:text-gray-600'}`} />
                            </>
                          )}
                        </Combobox.Option>
                      ))}
                    </div>
                  ))}

                  {/* Empty state */}
                  {query !== '' && filteredCommands.length === 0 && (
                    <div className="py-14 px-6 text-center">
                      <Search className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-4 text-sm font-medium text-gray-900 dark:text-white">
                        No results found
                      </p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Try searching for something else
                      </p>
                    </div>
                  )}
                </Combobox.Options>

                {/* Footer */}
                <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">↑</kbd>
                      <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">↓</kbd>
                      to navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">↵</kbd>
                      to select
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Command className="w-3 h-3" />
                    <span>K to open</span>
                  </div>
                </div>
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

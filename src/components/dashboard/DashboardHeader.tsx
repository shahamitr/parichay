'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import NotificationBell from '@/components/notifications/NotificationBell';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Command,
  Zap,
  Settings,
  LogOut,
  User,
  HelpCircle,
  Menu,
  Grid,
  ArrowRight
} from 'lucide-react';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/brands': 'Brands',
  '/dashboard/branches': 'Branches',
  '/dashboard/leads': 'Lead Management',
  '/dashboard/short-links': 'Short Links',
  '/dashboard/social': 'Social & Reviews',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/profile': 'Profile',
  '/dashboard/settings': 'Settings',
  '/dashboard/tools': 'Admin Tools',
  '/dashboard/users': 'User Management',
  '/dashboard/subscription': 'Subscription',
  '/dashboard/system': 'System Settings',
};

interface DashboardHeaderProps {
  onOpenHelp?: () => void;
}

export default function DashboardHeader({ onOpenHelp }: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [liveCount, setLiveCount] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 1) {
        setIsSearching(true);
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
          if (response.ok) {
            const data = await response.json();
            setSearchResults(data.results);
          }
        } catch (error) {
          console.error('Search failed', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Reset search when modal closes
  useEffect(() => {
    if (!showSearch) {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [showSearch]);

  const pageTitle = pageTitles[pathname] || 'Dashboard';

  // Fetch live visitor count
  useEffect(() => {
    const fetchLiveCount = async () => {
      try {
        const response = await fetch('/api/analytics/realtime?period=today');
        if (response.ok) {
          const data = await response.json();
          setLiveCount(data.metrics?.liveVisitors || 0);
        }
      } catch (error) {
        // Silently fail
      }
    };
    fetchLiveCount();
    const interval = setInterval(fetchLiveCount, 30000);
    return () => clearInterval(interval);
  }, []);


  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
        setShowUserMenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 h-16 transition-colors duration-300">
        <div className="px-4 h-full flex items-center justify-between gap-4">

          {/* Left: Title (Mobile only mostly, or if sidebar is collapsed) */}
          <div className="flex items-center gap-4 lg:hidden">
            <h1 className="text-lg font-medium text-gray-700 dark:text-gray-200">{pageTitle}</h1>
          </div>

          {/* Desktop Title - Hidden if search is active or on small screens if needed */}
          <div className="hidden lg:flex items-center">
            <h1 className="text-xl font-normal text-gray-600 dark:text-gray-300">{pageTitle}</h1>
          </div>

          {/* Center: Google-style Search */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-auto">
            <div
              onClick={() => setShowSearch(true)}
              className="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 hover:shadow-md border border-transparent hover:border-gray-200 dark:hover:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 text-sm transition-all cursor-text group"
            >
              <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              <span className="flex-1 text-left">Search for brands, branches, or settings</span>
              <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px] font-bold text-gray-500 dark:text-gray-400">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Live Indicator */}
            {liveCount > 0 && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-medium">{liveCount} live</span>
              </div>
            )}

            {/* Icons */}
            <div className="flex items-center gap-1">
              <div className="hidden sm:block">
                <LanguageSwitcher variant="toggle" />
              </div>
              <ThemeToggle />
              <button
                onClick={onOpenHelp}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-full transition-colors"
                title="Help & Documentation"
              >
                <HelpCircle className="w-6 h-6" />
              </button>
              <NotificationBell />
              <button className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-full transition-colors hidden sm:block">
                <Grid className="w-6 h-6" />
              </button>
            </div>

            {/* User Menu */}
            {user && (
              <div className="relative ml-1">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                >
                  <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium text-sm shadow-sm">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50 overflow-hidden ring-1 ring-black ring-opacity-5">
                      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex flex-col items-center text-center bg-gray-50/50 dark:bg-gray-800/50">
                        <div className="h-16 w-16 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium text-2xl shadow-sm mb-3">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 capitalize">
                          {user.role.replace('_', ' ').toLowerCase()}
                        </span>
                      </div>

                      <div className="p-2">
                        <Link
                          href="/dashboard/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-4 h-4" />
                          Manage your account
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Preferences
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 dark:border-gray-700 p-2">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            logout();
                          }}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg w-full transition-colors border border-gray-200 dark:border-gray-700"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>

                      <div className="py-2 bg-gray-50 dark:bg-gray-800/50 text-center border-t border-gray-100 dark:border-gray-700">
                        <p className="text-xs text-gray-400 dark:text-gray-500">Parichay Admin Console</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            <div
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
              onClick={() => setShowSearch(false)}
            />
            <div className="inline-block w-full max-w-2xl mt-20 text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden ring-1 ring-black ring-opacity-5 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for brands, branches, leads..."
                  className="flex-1 text-lg outline-none placeholder-gray-400 text-gray-700 dark:text-gray-200 bg-transparent"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  onClick={() => setShowSearch(false)}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-xs text-gray-500 dark:text-gray-400 font-medium transition-colors"
                >
                  ESC
                </button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {isSearching ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-1">
                    {searchResults.map((result: any) => (
                      <Link
                        key={`${result.type}-${result.id}`}
                        href={result.url}
                        onClick={() => setShowSearch(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl group transition-colors"
                      >
                        <div className={`p-2 rounded-lg ${result.type === 'brand' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                          result.type === 'branch' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                            'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                          {result.type === 'brand' && <Zap className="w-5 h-5" />}
                          {result.type === 'branch' && <Grid className="w-5 h-5" />}
                          {result.type === 'lead' && <User className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {result.title}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {result.subtitle}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                ) : searchQuery.length > 1 ? (
                  <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                    <Search className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p>No results found for "{searchQuery}"</p>
                  </div>
                ) : (
                  <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                    <p>Type at least 2 characters to search...</p>
                  </div>
                )}
              </div>
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400 flex justify-between">
                <span>Search across Brands, Branches, and Leads</span>
                <span>Press <kbd className="font-sans px-1 bg-gray-200 dark:bg-gray-700 rounded">↵</kbd> to select</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

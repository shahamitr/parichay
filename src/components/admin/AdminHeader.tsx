'use client';

import { useState, useEffect, Fragment } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Transition } from '@headlessui/react';
import { useAdminStore } from '@/lib/admin-store';
import { useAuth } from '@/lib/auth-context';
import {
  Search,
  Bell,
  Moon,
  Sun,
  User,
  ChevronDown,
  Settings,
  CreditCard,
  LogOut,
  Plus,
  Building2,
  GitBranch,
  Users,
  Command,
  ChevronRight,
  Clock,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

// Mock notifications - in production, fetch from API
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Lead Received',
    message: 'John Doe submitted a contact form on Brand X',
    time: '5 minutes ago',
    read: false,
    type: 'success',
  },
  {
    id: '2',
    title: 'Subscription Expiring',
    message: 'Your subscription for Brand Y expires in 7 days',
    time: '1 hour ago',
    read: false,
    type: 'warning',
  },
  {
    id: '3',
    title: 'Analytics Report Ready',
    message: 'Weekly analytics report is ready to view',
    time: '2 hours ago',
    read: true,
    type: 'info',
  },
];

const quickActions = [
  { name: 'New Brand', icon: Building2, href: '/admin/brands?action=new' },
  { name: 'New Branch', icon: GitBranch, href: '/admin/branches?action=new' },
  { name: 'New Lead', icon: Users, href: '/admin/leads?action=new' },
];

// Get breadcrumbs from pathname
function getBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [];

  let path = '';
  for (let i = 0; i < segments.length; i++) {
    path += '/' + segments[i];
    const label = segments[i].charAt(0).toUpperCase() + segments[i].slice(1).replace(/-/g, ' ');

    // Don't make the last item a link
    if (i === segments.length - 1) {
      breadcrumbs.push({ label, href: undefined });
    } else {
      breadcrumbs.push({ label, href: path });
    }
  }

  return breadcrumbs;
}

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const {
    setCommandPaletteOpen,
    sidebarCollapsed,
    setSidebarCollapsed
  } = useAdminStore();

  const [isDark, setIsDark] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [showNotifications, setShowNotifications] = useState(false);

  const breadcrumbs = getBreadcrumbs(pathname);

  // Handle theme toggle
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 bg-neutral-950 border-b border-neutral-800/50 flex items-center z-50">
      {/* Logo Section - Fixed width matching sidebar */}
      <div
        className={`
          h-full flex items-center justify-between px-6 border-r border-neutral-800/50
          transition-all duration-300 ease-[0.23, 1, 0.32, 1]
          ${sidebarCollapsed ? 'w-20' : 'w-[240px]'}
        `}
      >
        <Link href="/admin/dashboard" className="flex items-center gap-3 min-w-0 group">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
            <span className="text-white font-black text-sm">P</span>
          </div>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-black text-white text-[11px] uppercase tracking-[0.2em] truncate"
            >
              Parichay
            </motion.span>
          )}
        </Link>

        {/* Sidebar toggle button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-900 rounded-xl transition-all"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <PanelLeft className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Main Header Content */}
      <div className="flex-1 h-full flex items-center justify-between px-6 gap-6">
        {/* Left side - Breadcrumbs */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <nav className="flex items-center">
            {breadcrumbs.map((crumb, index) => (
              <Fragment key={index}>
                {index > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-700 mx-3 flex-shrink-0" />
                )}
                {crumb.href ? (
                  <button
                    onClick={() => router.push(crumb.href!)}
                    className="text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-colors truncate"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-[10px] font-black uppercase tracking-widest text-white truncate px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-lg">
                    {crumb.label}
                  </span>
                )}
              </Fragment>
            ))}
          </nav>
        </div>

        {/* Center - Search trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:border-neutral-700 hover:bg-neutral-900 transition-all min-w-[280px] group"
        >
          <Search className="w-4 h-4 text-neutral-600 group-hover:text-primary-500 transition-colors" />
          <span className="flex-1 text-left">Global Search</span>
          <div className="flex items-center gap-1 px-2 py-1 bg-neutral-800 border border-neutral-700 rounded-lg text-[8px] font-black">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </button>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Actions */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary-500/20">
              <Plus className="w-4 h-4" />
              <span className="hidden lg:inline">Create</span>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-150"
              enterFrom="transform opacity-0 scale-95 translate-y-2"
              enterTo="transform opacity-100 scale-100 translate-y-0"
              leave="transition ease-in duration-100"
              leaveFrom="transform opacity-100 scale-100 translate-y-0"
              leaveTo="transform opacity-0 scale-95 translate-y-2"
            >
              <Menu.Items className="absolute right-0 mt-3 w-56 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden">
                <div className="px-4 py-2 mb-1 border-b border-neutral-800">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-600">Quick Actions</span>
                </div>
                {quickActions.map((action) => (
                  <Menu.Item key={action.name}>
                    {({ active }) => (
                      <button
                        onClick={() => router.push(action.href)}
                        className={`
                          w-full flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all
                          ${active ? 'bg-primary-500/10 text-primary-500' : 'text-neutral-400 hover:text-white'}
                        `}
                      >
                        <div className={`p-1.5 rounded-lg transition-colors ${active ? 'bg-primary-500/20' : 'bg-neutral-800'}`}>
                          <action.icon className="w-3.5 h-3.5" />
                        </div>
                        {action.name}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 text-neutral-500 hover:text-white hover:bg-neutral-900 rounded-xl transition-all border border-transparent hover:border-neutral-800"
            title={isDark ? 'Light Mode' : 'Dark Mode'}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 text-neutral-500 hover:text-white hover:bg-neutral-900 rounded-xl transition-all border border-transparent hover:border-neutral-800"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full ring-4 ring-neutral-950"></span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className="absolute right-0 mt-3 w-80 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-800/20">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[9px] font-black uppercase tracking-widest text-primary-500 hover:text-primary-400"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                      {notifications.length === 0 ? (
                        <div className="py-12 text-center">
                          <Bell className="w-10 h-10 mx-auto mb-4 text-neutral-800" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600">All caught up</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`
                              px-5 py-4 border-b border-neutral-800/50 last:border-0
                              hover:bg-neutral-800/30 cursor-pointer transition-all
                              ${!notification.read ? 'bg-primary-500/5' : ''}
                            `}
                          >
                            <div className="flex gap-4">
                              <div className={`
                                w-2 h-2 rounded-full mt-2 flex-shrink-0
                                ${notification.type === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : ''}
                                ${notification.type === 'warning' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : ''}
                                ${notification.type === 'error' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : ''}
                                ${notification.type === 'info' ? 'bg-primary-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''}
                              `} />
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-tight text-white mb-1">
                                  {notification.title}
                                </p>
                                <p className="text-[10px] font-medium text-neutral-500 leading-relaxed line-clamp-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Clock className="w-3 h-3 text-neutral-700" />
                                  <span className="text-[8px] font-black uppercase tracking-widest text-neutral-600">
                                    {notification.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="px-5 py-3 border-t border-neutral-800 bg-neutral-800/10">
                      <button
                        onClick={() => {
                          setShowNotifications(false);
                          router.push('/admin/notifications');
                        }}
                        className="w-full py-2 text-[9px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-colors"
                      >
                        View System Logs
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-neutral-800/50 mx-2" />

          {/* User menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-3 p-1.5 hover:bg-neutral-900 border border-transparent hover:border-neutral-800 rounded-2xl transition-all">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-[11px] font-black uppercase tracking-widest text-white">
                  {user?.firstName || 'Admin'}
                </div>
                <div className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest mt-0.5">
                  {user?.role?.replace('_', ' ') || 'SYSTEM ADMIN'}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-neutral-700 hidden lg:block" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-150"
              enterFrom="transform opacity-0 scale-95 translate-y-2"
              enterTo="transform opacity-100 scale-100 translate-y-0"
              leave="transition ease-in duration-100"
              leaveFrom="transform opacity-100 scale-100 translate-y-0"
              leaveTo="transform opacity-0 scale-95 translate-y-2"
            >
              <Menu.Items className="absolute right-0 mt-3 w-64 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden">
                <div className="px-5 py-4 border-b border-neutral-800 bg-neutral-800/20">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest mt-1">
                      {user?.email}
                    </span>
                  </div>
                </div>

                <div className="py-2">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => router.push('/admin/profile')}
                        className={`
                          w-full flex items-center gap-4 px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all
                          ${active ? 'bg-primary-500/10 text-primary-500' : 'text-neutral-400 hover:text-white'}
                        `}
                      >
                        <User className="w-4 h-4" />
                        Account Settings
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => router.push('/admin/billing')}
                        className={`
                          w-full flex items-center gap-4 px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all
                          ${active ? 'bg-primary-500/10 text-primary-500' : 'text-neutral-400 hover:text-white'}
                        `}
                      >
                        <CreditCard className="w-4 h-4" />
                        Plan & Billing
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => router.push('/admin/settings')}
                        className={`
                          w-full flex items-center gap-4 px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all
                          ${active ? 'bg-primary-500/10 text-primary-500' : 'text-neutral-400 hover:text-white'}
                        `}
                      >
                        <Settings className="w-4 h-4" />
                        System Config
                      </button>
                    )}
                  </Menu.Item>
                </div>

                <div className="border-t border-neutral-800 pt-2">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`
                          w-full flex items-center gap-4 px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all
                          ${active ? 'bg-red-500/10 text-red-500' : 'text-neutral-500 hover:text-red-400'}
                        `}
                      >
                        <LogOut className="w-4 h-4" />
                        End Session
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
}

'use client';

import { useState, Fragment } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, Transition } from '@headlessui/react';
import { useAdminStore } from '@/lib/admin-store';
import { useAuth } from '@/lib/auth-context';
import {
  Search,
  Bell,
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
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';

const quickActions = [
  { name: 'New Brand', icon: Building2, href: '/admin/brands?action=new' },
  { name: 'New Branch', icon: GitBranch, href: '/admin/branches?action=new' },
  { name: 'New Lead', icon: Users, href: '/admin/leads?action=new' },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { setCommandPaletteOpen, sidebarCollapsed, setSidebarCollapsed } = useAdminStore();

  // Get current page title from pathname
  const pageTitle = pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Dashboard';

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center z-50 px-4">
      {/* Left: Toggle + Title */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {sidebarCollapsed ? <PanelLeft className="w-[18px] h-[18px]" /> : <PanelLeftClose className="w-[18px] h-[18px]" />}
        </button>
        <h1 className="text-[15px] font-semibold text-gray-900 truncate">{pageTitle}</h1>
      </div>

      {/* Center: Search */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="hidden md:flex items-center gap-2.5 h-9 px-4 bg-gray-50 border border-gray-150 rounded-lg text-[13px] text-gray-400 hover:bg-gray-100 hover:border-gray-200 transition-colors min-w-[220px] max-w-[280px]"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="flex-1 text-left">Search</span>
        <kbd className="hidden lg:flex items-center gap-0.5 text-[11px] text-gray-400 bg-white border border-gray-200 rounded px-1.5 py-0.5">
          <Command className="w-2.5 h-2.5" />K
        </kbd>
      </button>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 ml-4">
        {/* Create */}
        <Menu as="div" className="relative">
          <Menu.Button className="h-8 px-3 flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-[12px] font-medium rounded-lg transition-colors">
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Create</span>
          </Menu.Button>
          <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
            <Menu.Items className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
              {quickActions.map((action) => (
                <Menu.Item key={action.name}>
                  {({ active }) => (
                    <button onClick={() => router.push(action.href)} className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] ${active ? 'bg-gray-50 text-gray-900' : 'text-gray-600'}`}>
                      <action.icon className="w-4 h-4 text-gray-400" />
                      {action.name}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>

        {/* User */}
        <Menu as="div" className="relative ml-1">
          <Menu.Button className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center">
              <span className="text-primary-700 font-semibold text-[11px]">{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0) || ''}</span>
            </div>
            <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:block" />
          </Menu.Button>
          <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="opacity-100" leaveTo="opacity-0 scale-95">
            <Menu.Items className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
              <div className="px-3.5 py-2.5 border-b border-gray-50">
                <p className="text-[13px] font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-[11px] text-gray-400 mt-0.5 truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <Menu.Item>{({ active }) => (<button onClick={() => router.push('/admin/profile')} className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] ${active ? 'bg-gray-50' : ''} text-gray-600`}><User className="w-4 h-4 text-gray-400" />Account</button>)}</Menu.Item>
                <Menu.Item>{({ active }) => (<button onClick={() => router.push('/admin/billing')} className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] ${active ? 'bg-gray-50' : ''} text-gray-600`}><CreditCard className="w-4 h-4 text-gray-400" />Billing</button>)}</Menu.Item>
                <Menu.Item>{({ active }) => (<button onClick={() => router.push('/admin/settings')} className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] ${active ? 'bg-gray-50' : ''} text-gray-600`}><Settings className="w-4 h-4 text-gray-400" />Settings</button>)}</Menu.Item>
              </div>
              <div className="border-t border-gray-50 py-1">
                <Menu.Item>{({ active }) => (<button onClick={async () => { await logout(); router.push('/login'); }} className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] ${active ? 'bg-red-50 text-red-600' : 'text-gray-600'}`}><LogOut className="w-4 h-4 text-gray-400" />Sign out</button>)}</Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
}

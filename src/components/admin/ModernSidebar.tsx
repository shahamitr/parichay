'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAdminStore } from '@/lib/admin-store';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  Building2,
  GitBranch,
  BarChart3,
  Users,
  Link2,
  QrCode,
  Settings,
  User,
  Megaphone,
  CreditCard,
  LogOut,
  type LucideIcon,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  roles?: string[];
}

// Streamlined navigation - no duplicates, minimal sections
const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Brands', href: '/admin/brands', icon: Building2 },
  { name: 'Branches', href: '/admin/branches', icon: GitBranch },
  { name: 'Leads', href: '/admin/leads', icon: Users },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Short Links', href: '/admin/tools', icon: Link2 },
  { name: 'QR Codes', href: '/admin/qr-codes', icon: QrCode },
  { name: 'Ads', href: '/admin/ads', icon: Megaphone },
  { name: 'Billing', href: '/admin/billing', icon: CreditCard },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function ModernSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { sidebarCollapsed, setSidebarHovered, sidebarHovered } = useAdminStore();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');
  const effectiveCollapsed = sidebarCollapsed && !sidebarHovered;

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const sidebarVariants = {
    expanded: { width: 240 },
    collapsed: { width: 80 },
  };

  return (
    <motion.div
      initial={false}
      animate={effectiveCollapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      onMouseEnter={() => sidebarCollapsed && setSidebarHovered(true)}
      onMouseLeave={() => setSidebarHovered(false)}
      className="relative bg-neutral-950 border-r border-neutral-800/50 flex flex-col h-full z-40"
    >
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto scrollbar-hide">
        <div className="space-y-1">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all duration-300
                  ${active
                    ? 'bg-primary-500/10 text-primary-500 shadow-lg shadow-primary-500/5'
                    : 'text-neutral-500 hover:text-white hover:bg-neutral-900'
                  }
                  ${effectiveCollapsed ? 'justify-center' : ''}
                `}
                title={effectiveCollapsed ? item.name : undefined}
              >
                {active && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.5)]" 
                  />
                )}
                <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${active ? 'text-primary-500' : 'text-neutral-500 group-hover:text-white'}`} />
                {!effectiveCollapsed && (
                  <span className="truncate uppercase tracking-widest text-[10px] font-black">{item.name}</span>
                )}
                
                {active && !effectiveCollapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-neutral-900/50">
        <div className={`
          flex items-center gap-3 p-2 rounded-2xl bg-neutral-900/50 border border-neutral-800/30
          ${effectiveCollapsed ? 'justify-center p-1.5' : ''}
        `}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/20">
            <User className="w-4 h-4 text-white" />
          </div>
          {!effectiveCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-black uppercase tracking-widest text-white truncate">
                  {user?.firstName || 'Admin'}
                </div>
                <div className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest truncate mt-0.5">
                  {user?.role?.replace('_', ' ') || 'SYSTEM ADMIN'}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

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
  Megaphone,
  CreditCard,
  LogOut,
  Shield,
  type LucideIcon,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  roles?: string[];
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Brands', href: '/admin/brands', icon: Building2, roles: ['SUPER_ADMIN', 'BRAND_MANAGER'] },
  { name: 'Branches', href: '/admin/branches', icon: GitBranch },
  { name: 'Leads', href: '/admin/leads', icon: Users },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, roles: ['SUPER_ADMIN', 'BRAND_MANAGER'] },
  { name: 'Tools', href: '/admin/tools', icon: Link2, roles: ['SUPER_ADMIN'] },
  { name: 'QR Codes', href: '/admin/qr-codes', icon: QrCode },
  { name: 'Ads', href: '/admin/ads', icon: Megaphone, roles: ['SUPER_ADMIN'] },
  { name: 'Billing', href: '/admin/billing', icon: CreditCard, roles: ['SUPER_ADMIN', 'BRAND_MANAGER'] },
  { name: 'Audit Logs', href: '/admin/audit-logs', icon: Shield, roles: ['SUPER_ADMIN'] },
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

  return (
    <motion.div
      initial={false}
      animate={{ width: effectiveCollapsed ? 72 : 240 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={() => sidebarCollapsed && setSidebarHovered(true)}
      onMouseLeave={() => setSidebarHovered(false)}
      className="relative bg-white border-r border-gray-100 flex flex-col h-full z-40"
    >
      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto scrollbar-hide">
        <div className="space-y-0.5">
          {navigation
            .filter((item) => !item.roles || (user?.role && item.roles.includes(user.role)))
            .map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150
                    ${active
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                    ${effectiveCollapsed ? 'justify-center px-2' : ''}
                  `}
                  title={effectiveCollapsed ? item.name : undefined}
                >
                  <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                  {!effectiveCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
        </div>
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-gray-100">
        <div className={`flex items-center gap-3 px-2 py-2 ${effectiveCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
            <span className="text-primary-700 font-semibold text-[12px]">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0) || ''}
            </span>
          </div>
          {!effectiveCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-gray-900 truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
              </div>
              <button onClick={handleLogout} className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors" title="Sign out">
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

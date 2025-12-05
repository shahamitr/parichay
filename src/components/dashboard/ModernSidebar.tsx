'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
    LayoutDashboard,
    Building2,
    MapPin,
    BarChart3,
    Settings,
    Users,
    Server,
    CreditCard,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    Share2,
    QrCode,
    MessageSquare
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Brands', href: '/dashboard/brands', icon: Building2 },
    { name: 'Branches', href: '/dashboard/branches', icon: MapPin },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Leads', href: '/dashboard/leads', icon: Users },
    { name: 'Short Links', href: '/dashboard/short-links', icon: Share2 },
    { name: 'QR Codes', href: '/dashboard/qr-codes', icon: QrCode },
    { name: 'Social & Reviews', href: '/dashboard/social', icon: MessageSquare },
];

const adminNavigation = [
    { name: 'User Management', href: '/dashboard/users', icon: Users },
    { name: 'System Settings', href: '/dashboard/system', icon: Server },
    { name: 'Subscription', href: '/dashboard/subscription', icon: CreditCard },
];

interface ModernSidebarProps {
    collapsed: boolean;
    setCollapsed: (value: boolean) => void;
    mobileOpen: boolean;
    setMobileOpen: (value: boolean) => void;
}

export default function ModernSidebar({
    collapsed,
    setCollapsed,
    mobileOpen,
    setMobileOpen
}: ModernSidebarProps) {
    const pathname = usePathname();
    const { user, logout, loading } = useAuth();

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname, setMobileOpen]);

    const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

    const NavItem = ({ item }: { item: any }) => {
        const Icon = item.icon;
        const active = isActive(item.href);

        return (
            <Link
                href={item.href}
                className={`
          group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
          ${active
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-semibold shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                    }
          ${collapsed ? 'justify-center' : ''}
        `}
                title={collapsed ? item.name : undefined}
            >
                <Icon
                    className={`
            w-5 h-5 transition-colors
            ${active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}
          `}
                />
                {!collapsed && (
                    <span className="truncate">{item.name}</span>
                )}
                {!collapsed && active && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400" />
                )}
            </Link>
        );
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                type="button"
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md text-gray-600 dark:text-gray-300"
                onClick={() => setMobileOpen(!mobileOpen)}
            >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Backdrop */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`
          fixed top-0 left-0 z-40 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${collapsed ? 'w-20' : 'w-72'}
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800">
                        {!collapsed && (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-200 dark:shadow-none">
                                    P
                                </div>
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500 dark:from-primary-400 dark:to-primary-200">
                                    Parichay
                                </span>
                            </div>
                        )}
                        {collapsed && (
                            <div className="w-full flex justify-center">
                                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                    P
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="hidden lg:flex p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8 scrollbar-hide">
                        {/* Main Nav */}
                        <div className="space-y-1">
                            {!collapsed && (
                                <h3 className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                                    Overview
                                </h3>
                            )}
                            {navigation.map((item) => (
                                <NavItem key={item.name} item={item} />
                            ))}
                        </div>

                        {/* Help & Features */}
                        <div className="space-y-1">
                            {!collapsed && (
                                <h3 className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                                    Help
                                </h3>
                            )}
                            <NavItem item={{ name: 'Features', href: '/dashboard/features', icon: Settings }} />
                        </div>

                        {/* Admin Nav */}
                        {user?.role === 'SUPER_ADMIN' && (
                            <div className="space-y-1">
                                {!collapsed && (
                                    <h3 className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                                        Administration
                                    </h3>
                                )}
                                {adminNavigation.map((item) => (
                                    <NavItem key={item.name} item={item} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer / User Profile */}
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                        {loading ? (
                            <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                                {!collapsed && (
                                    <div className="flex-1 min-w-0 space-y-2">
                                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                                        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                                    </div>
                                )}
                            </div>
                        ) : user ? (
                            <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-md">
                                        {user.firstName?.[0]}{user.lastName?.[0]}
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                                </div>

                                {!collapsed && (
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                            {user.firstName} {user.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">
                                            {user.role.replace('_', ' ').toLowerCase()}
                                        </p>
                                    </div>
                                )}

                                {!collapsed && (
                                    <button
                                        onClick={logout}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Sign out"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        ) : null}
                    </div>
                </div>
            </aside>
        </>
    );
}

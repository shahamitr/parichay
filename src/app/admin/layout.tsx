'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import ModernSidebar from '@/components/admin/ModernSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/lib/theme-context';
import { useAdminStore } from '@/lib/admin-store';
import { useTokenRefresh } from '@/hooks/useTokenRefresh';

const CommandPalette = dynamic(() => import('@/components/admin/CommandPalette'), { ssr: false });
const WelcomeTour = dynamic(() => import('@/components/onboarding/WelcomeTour'), { ssr: false });

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { toggleSidebar, toggleCommandPalette } = useAdminStore();
  useTokenRefresh();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); toggleCommandPalette(); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') { e.preventDefault(); toggleSidebar(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar, toggleCommandPalette]);

  return (
    <div className="flex flex-col h-screen bg-[#fafbfc] overflow-hidden">
      <AdminHeader />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <ModernSidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <CommandPalette />
      <WelcomeTour />
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="parichay-theme">
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </ThemeProvider>
    </AuthProvider>
  );
}

'use client';

import { useEffect } from 'react';
import ModernSidebar from '@/components/admin/ModernSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import dynamic from 'next/dynamic';
const CommandPalette = dynamic(() => import('@/components/admin/CommandPalette'), { ssr: false });

import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/lib/theme-context';
import { useAdminStore } from '@/lib/admin-store';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { toggleSidebar, toggleCommandPalette } = useAdminStore();

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
      // Cmd/Ctrl + B for sidebar toggle
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar, toggleCommandPalette]);

  return (
    <div className="flex flex-col h-screen bg-[#141414] overflow-hidden">
      {/* Unified Header - Full width */}
      <AdminHeader />

      {/* Content area with sidebar */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar - Navigation only */}
        <ModernSidebar />

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-[#141414]">
          {children}
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette />
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="system" storageKey="parichay-theme">
        <AdminLayoutContent>
          {children}
        </AdminLayoutContent>
      </ThemeProvider>
    </AuthProvider>
  );
}

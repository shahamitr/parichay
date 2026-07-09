'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  useTokenRefresh();

  // Hidden database console trigger: press 'd' five times rapidly
  const keyPresses = useRef<number[]>([]);
  const [showDbHint, setShowDbHint] = useState(false);

  const handleHiddenTrigger = useCallback((e: KeyboardEvent) => {
    // Only track if not typing in an input/textarea
    const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

    if (e.key === 'd' || e.key === 'D') {
      const now = Date.now();
      keyPresses.current.push(now);

      // Keep only presses within last 2 seconds
      keyPresses.current = keyPresses.current.filter((t) => now - t < 2000);

      if (keyPresses.current.length >= 5) {
        keyPresses.current = [];
        setShowDbHint(true);
        // Auto-hide hint after 5 seconds if not clicked
        setTimeout(() => setShowDbHint(false), 5000);
      }
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); toggleCommandPalette(); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') { e.preventDefault(); toggleSidebar(); }
      handleHiddenTrigger(e);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar, toggleCommandPalette, handleHiddenTrigger]);

  return (
    <div className="admin-layout flex flex-col h-screen bg-[#fafbfc] overflow-hidden">
      <AdminHeader />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <ModernSidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <CommandPalette />
      <WelcomeTour />

      {/* Hidden DB Console trigger — appears when 'd' pressed 5 times */}
      {showDbHint && (
        <div className="fixed bottom-6 right-6 z-[9999] animate-in slide-in-from-bottom duration-300">
          <button
            onClick={() => { setShowDbHint(false); router.push('/admin/system/database'); }}
            className="flex items-center gap-2 px-4 py-3 bg-gray-900 text-white text-[12px] font-medium rounded-xl shadow-2xl hover:bg-gray-800 transition-colors"
          >
            <span className="text-[14px]">🔓</span>
            Open Database Console
          </button>
        </div>
      )}
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

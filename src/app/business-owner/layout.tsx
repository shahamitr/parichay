'use client';

import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/lib/theme-context';

export default function BusinessOwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="parichay-theme">
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
}

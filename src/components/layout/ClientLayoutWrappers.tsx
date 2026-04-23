'use client';

import dynamic from 'next/dynamic';
import { HelpProvider } from '@/contexts/HelpContext';
import { I18nProvider } from '@/lib/i18n/context';

const HelpSystem = dynamic(() => import('@/components/ui/HelpSystem'), { ssr: false });

export function ClientLayoutWrappers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <HelpProvider>
        {children}
        <HelpSystem />
      </HelpProvider>
    </I18nProvider>
  );
}

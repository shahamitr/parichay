'use client';

import { useState, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  children: (activeTab: string) => ReactNode;
  variant?: 'default' | 'pills';
}

export function Tabs({ tabs, defaultTab, children, variant = 'default' }: TabsProps) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id || '');

  return (
    <div>
      <div className={cn(
        'flex',
        variant === 'default' && 'border-b border-gray-200 gap-0',
        variant === 'pills' && 'gap-1 p-1 bg-gray-100 rounded-xl',
      )}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              'flex items-center gap-2 text-sm font-medium transition-all',
              variant === 'default' && cn(
                'px-4 py-2.5 border-b-2 -mb-px',
                active === tab.id ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-700',
              ),
              variant === 'pills' && cn(
                'px-4 py-2 rounded-lg',
                active === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700',
              ),
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {children(active)}
      </div>
    </div>
  );
}

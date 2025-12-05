'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  blur?: 'sm' | 'md' | 'lg';
}

export default function GlassCard({
  children,
  className,
  hover = false,
  gradient = false,
  blur = 'md',
}: GlassCardProps) {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
  };

  return (
    <div
      className={cn(
        'relative rounded-2xl border border-white/20 dark:border-gray-700/50',
        'bg-white/70 dark:bg-gray-800/70',
        blurClasses[blur],
        'shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50',
        gradient && 'bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/60',
        hover && 'transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02]',
        className
      )}
    >
      {children}
    </div>
  );
}

// Stat Card with Animation
interface StatCardProps {
  title: string;
  value: number | string;
  change?: number;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
  suffix?: string;
  prefix?: string;
}

export function StatCard({
  title,
  value,
  change,
  icon,
  trend = 'neutral',
  loading = false,
  suffix = '',
  prefix = '',
}: StatCardProps) {
  const trendColors = {
    up: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
    down: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
    neutral: 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50',
  };

  return (
    <GlassCard hover className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {title}
          </p>
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ) : (
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
              </h3>
              {change !== undefined && (
                <span className={cn('text-sm font-medium px-2 py-0.5 rounded-full', trendColors[trend])}>
                  {change > 0 ? '+' : ''}{change}%
                </span>
              )}
            </div>
          )}
        </div>
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
          {icon}
        </div>
      </div>
      {change !== undefined && (
        <div className="mt-4 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <span className={cn('font-medium', trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : '')}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
          <span>vs last period</span>
        </div>
      )}
    </GlassCard>
  );
}

// Empty State Component
interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  illustration?: string;
}

export function EmptyState({ icon, title, description, action, illustration }: EmptyStateProps) {
  return (
    <GlassCard className="p-12">
      <div className="text-center max-w-md mx-auto">
        {illustration ? (
          <img src={illustration} alt={title} className="w-48 h-48 mx-auto mb-6 opacity-80" />
        ) : (
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
            <div className="text-gray-400 dark:text-gray-500">
              {icon}
            </div>
          </div>
        )}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {description}
        </p>
        {action && (
          <button
            onClick={action.onClick}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            {action.label}
          </button>
        )}
      </div>
    </GlassCard>
  );
}

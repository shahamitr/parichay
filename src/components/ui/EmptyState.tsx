'use client';

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  illustration?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  illustration,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
      {/* Illustration or Icon */}
      {illustration ? (
        <div className="mb-6">{illustration}</div>
      ) : (
        <div className="relative mb-6">
          {/* Animated background circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full animate-pulse" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/20 rounded-full animate-pulse delay-75" />
          </div>

          {/* Icon */}
          <div className="relative z-10 w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl">
            <Icon className="w-10 h-10" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="text-center max-w-md">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {description}
        </p>

        {/* Actions */}
        {(action || secondaryAction) && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {action && (
              <button
                onClick={action.onClick}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                {action.icon && <action.icon className="w-5 h-5" />}
                {action.label}
              </button>
            )}
            {secondaryAction && (
              <button
                onClick={secondaryAction.onClick}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {secondaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Preset empty states
export function NoDataEmptyState({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <EmptyState
      icon={require('lucide-react').Database}
      title="No Data Available"
      description="There's no data to display yet. Start by adding some content."
      action={
        onRefresh
          ? {
              label: 'Refresh',
              onClick: onRefresh,
              icon: require('lucide-react').RefreshCw,
            }
          : undefined
      }
    />
  );
}

export function SearchEmptyState({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <EmptyState
      icon={require('lucide-react').Search}
      title="No Results Found"
      description={`We couldn't find anything matching "${query}". Try adjusting your search.`}
      action={{
        label: 'Clear Search',
        onClick: onClear,
        icon: require('lucide-react').X,
      }}
    />
  );
}

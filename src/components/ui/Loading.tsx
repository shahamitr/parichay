'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// =============================================================================
// SPINNER COMPONENT
// =============================================================================
interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'primary' | 'white' | 'gray';
}

const spinnerSizes = {
  xs: 'h-3 w-3 border',
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-2',
  xl: 'h-12 w-12 border-3',
};

const spinnerColors = {
  primary: 'border-primary-600 border-t-transparent',
  white: 'border-white border-t-transparent',
  gray: 'border-neutral-400 border-t-transparent',
};

export function Spinner({ size = 'md', className, color = 'primary' }: SpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full',
        spinnerSizes[size],
        spinnerColors[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// =============================================================================
// SKELETON COMPONENT
// =============================================================================
interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'circular' | 'rounded';
  animation?: 'pulse' | 'shimmer' | 'none';
}

export function Skeleton({
  className,
  variant = 'default',
  animation = 'pulse'
}: SkeletonProps) {
  const baseClasses = 'bg-neutral-200 dark:bg-neutral-700';

  const variantClasses = {
    default: 'rounded',
    circular: 'rounded-full',
    rounded: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    shimmer: 'animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-700 bg-[length:200%_100%]',
    none: '',
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      aria-hidden="true"
    />
  );
}

// =============================================================================
// SKELETON PRESETS
// =============================================================================
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm', className)}>
      <div className="flex items-center space-x-4 mb-4">
        <Skeleton variant="circular" className="h-10 w-10" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-700 px-6 py-4">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
      </div>
      {/* Rows */}
      <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="flex gap-4 items-center">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton
                  key={colIndex}
                  className={cn(
                    'h-4 flex-1',
                    colIndex === 0 && 'max-w-[200px]'
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonStats({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm"
        >
          <Skeleton className="h-4 w-1/2 mb-3" />
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonList({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 bg-white dark:bg-neutral-800 rounded-lg p-4 shadow-sm"
        >
          <Skeleton variant="circular" className="h-12 w-12 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <SkeletonStats count={4} />
      {/* Table */}
      <SkeletonTable rows={5} columns={4} />
    </div>
  );
}

// =============================================================================
// FULL PAGE LOADER
// =============================================================================
interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center">
      <Spinner size="xl" />
      <p className="mt-4 text-neutral-600 dark:text-neutral-400 text-sm">{message}</p>
    </div>
  );
}

// =============================================================================
// INLINE LOADER
// =============================================================================
interface InlineLoaderProps {
  text?: string;
  size?: 'sm' | 'md';
}

export function InlineLoader({ text = 'Loading', size = 'md' }: InlineLoaderProps) {
  return (
    <div className="flex items-center gap-2">
      <Spinner size={size === 'sm' ? 'xs' : 'sm'} />
      <span className={cn(
        'text-neutral-600 dark:text-neutral-400',
        size === 'sm' ? 'text-xs' : 'text-sm'
      )}>
        {text}
      </span>
    </div>
  );
}

// =============================================================================
// BUTTON LOADER
// =============================================================================
interface ButtonLoaderProps {
  loading: boolean;
  children: React.ReactNode;
  loadingText?: string;
}

export function ButtonLoader({ loading, children, loadingText }: ButtonLoaderProps) {
  if (loading) {
    return (
      <span className="flex items-center gap-2">
        <Spinner size="sm" color="white" />
        {loadingText && <span>{loadingText}</span>}
      </span>
    );
  }
  return <>{children}</>;
}

// =============================================================================
// OVERLAY LOADER
// =============================================================================
interface OverlayLoaderProps {
  visible: boolean;
  message?: string;
}

export function OverlayLoader({ visible, message = 'Processing...' }: OverlayLoaderProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center">
        <Spinner size="xl" />
        <p className="mt-4 text-neutral-700 dark:text-neutral-300 font-medium">{message}</p>
      </div>
    </div>
  );
}

// =============================================================================
// CONTENT LOADER (shows skeleton while loading, then content)
// =============================================================================
interface ContentLoaderProps {
  loading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  error?: Error | null;
  onRetry?: () => void;
}

export function ContentLoader({ loading, skeleton, children, error, onRetry }: ContentLoaderProps) {
  if (error) {
    return (
      <div className="bg-error-50 dark:bg-error-900/20 rounded-xl p-6 text-center">
        <p className="text-error-600 dark:text-error-400 mb-4">
          {error.message || 'An error occurred while loading data'}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-error-600 hover:bg-error-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (loading) {
    return <>{skeleton}</>;
  }

  return <>{children}</>;
}

// Add shimmer animation to tailwind config if not present
// Add this to globals.css:
// @keyframes shimmer {
//   0% { background-position: 200% 0; }
//   100% { background-position: -200% 0; }
// }
// .animate-shimmer { animation: shimmer 1.5s infinite; }

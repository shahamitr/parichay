'use client';

import { cn } from '@/lib/cn';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rect';
  width?: string;
  height?: string;
}

export function Skeleton({ className, variant = 'rect', width, height }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        variant === 'circle' && 'rounded-full',
        variant === 'text' && 'rounded-md h-4',
        variant === 'rect' && 'rounded-xl',
        className
      )}
      style={{ width, height }}
    />
  );
}

/** Pre-built skeleton patterns */
export function CardSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3">
      <Skeleton className="h-40 w-full" />
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="text" className="w-1/2" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton variant="circle" className="w-10 h-10" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-1/3" />
            <Skeleton variant="text" className="w-2/3 h-3" />
          </div>
        </div>
      ))}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  label?: string;
  animated?: boolean;
}

export default function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#3B82F6',
  backgroundColor = '#E5E7EB',
  showPercentage = true,
  label,
  animated = true,
}: ProgressRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedProgress / 100) * circumference;

  useEffect(() => {
    if (animated != null) {
      const timer = setTimeout(() => {
        setAnimatedProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedProgress(progress);
    }
  }, [progress, animated]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn(animated && 'transition-all duration-1000 ease-out')}
        />
      </svg>
      {(showPercentage || label) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showPercentage && (
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(animatedProgress)}%
            </span>
          )}
          {label && (
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Multiple progress rings
export function ProgressRingGroup({ items }: { items: Array<{ label: string; progress: number; color: string }> }) {
  return (
    <div className="flex gap-6 flex-wrap">
      {items.map((item, index) => (
        <ProgressRing
          key={index}
          progress={item.progress}
          color={item.color}
          label={item.label}
          size={100}
        />
      ))}
    </div>
  );
}

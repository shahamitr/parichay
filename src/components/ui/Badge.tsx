'use client';

import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  removable = false,
  onRemove,
  className = '',
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
    success: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
    warning: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
    error: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400',
    info: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
    primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
    accent: 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400',
  };

  const dotColors = {
    default: 'bg-neutral-500 dark:bg-neutral-400',
    success: 'bg-success-500 dark:bg-success-400',
    warning: 'bg-warning-500 dark:bg-warning-400',
    error: 'bg-error-500 dark:bg-error-400',
    info: 'bg-primary-500 dark:bg-primary-400',
    primary: 'bg-primary-500 dark:bg-primary-400',
    accent: 'bg-accent-500 dark:bg-accent-400',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}

// Status Badge with animation
interface StatusBadgeProps {
  status: 'online' | 'offline' | 'busy' | 'away';
  label?: string;
  showDot?: boolean;
}

export function StatusBadge({ status, label, showDot = true }: StatusBadgeProps) {
  const statusConfig = {
    online: {
      color: 'bg-success-500',
      label: 'Online',
      bgColor: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
    },
    offline: {
      color: 'bg-neutral-400 dark:bg-neutral-500',
      label: 'Offline',
      bgColor: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
    },
    busy: {
      color: 'bg-error-500',
      label: 'Busy',
      bgColor: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400'
    },
    away: {
      color: 'bg-warning-500',
      label: 'Away',
      bgColor: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400'
    },
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor}`}>
      {showDot && (
        <span className="relative flex h-2 w-2">
          {status === 'online' && (
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.color} opacity-75`} />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${config.color}`} />
        </span>
      )}
      {label || config.label}
    </span>
  );
}

// Notification Badge
interface NotificationBadgeProps {
  count: number;
  max?: number;
  children: ReactNode;
}

export function NotificationBadge({ count, max = 99, children }: NotificationBadgeProps) {
  const displayCount = count > max ? `${max}+` : count;

  return (
    <div className="relative inline-flex">
      {children}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold text-white bg-error-500 rounded-full">
          {displayCount}
        </span>
      )}
    </div>
  );
}

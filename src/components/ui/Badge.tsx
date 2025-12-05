'use client';

import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'pink';
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
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    pink: 'bg-pink-100 text-pink-700',
  };

  const dotColors = {
    default: 'bg-gray-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
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
          className="ml-0.5 hover:bg-black/10 rounded-full p-0.5 transition-colors"
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
    online: { color: 'bg-green-500', label: 'Online', bgColor: 'bg-green-100 text-green-700' },
    offline: { color: 'bg-gray-400', label: 'Offline', bgColor: 'bg-gray-100 text-gray-700' },
    busy: { color: 'bg-red-500', label: 'Busy', bgColor: 'bg-red-100 text-red-700' },
    away: { color: 'bg-yellow-500', label: 'Away', bgColor: 'bg-yellow-100 text-yellow-700' },
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
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold text-white bg-red-500 rounded-full">
          {displayCount}
        </span>
      )}
    </div>
  );
}

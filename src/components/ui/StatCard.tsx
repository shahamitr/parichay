'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number | React.ReactNode;
  icon: React.ReactNode;
  color?: 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'indigo' | 'teal' | 'gray' | 'red';
  trend?: number | 'up' | 'down' | 'neutral';
  trendLabel?: string;
  subtitle?: string;
  highlight?: boolean;
  className?: string;
  loading?: boolean;
  prefix?: string;
  suffix?: string;
  change?: number;
}

const colorClasses: Record<string, { bg: string; text: string; iconBg: string; ring: string }> = {
  blue: { 
    bg: 'bg-blue-50 dark:bg-blue-900/10', 
    text: 'text-blue-600 dark:text-blue-400', 
    iconBg: 'bg-blue-50 dark:bg-blue-900/20',
    ring: 'ring-blue-500/50'
  },
  purple: { 
    bg: 'bg-purple-50 dark:bg-purple-900/10', 
    text: 'text-purple-600 dark:text-purple-400', 
    iconBg: 'bg-purple-50 dark:bg-purple-900/20',
    ring: 'ring-purple-500/50'
  },
  green: { 
    bg: 'bg-green-50 dark:bg-green-900/10', 
    text: 'text-green-600 dark:text-green-400', 
    iconBg: 'bg-green-50 dark:bg-green-900/20',
    ring: 'ring-green-500/50'
  },
  orange: { 
    bg: 'bg-orange-50 dark:bg-orange-900/10', 
    text: 'text-orange-600 dark:text-orange-400', 
    iconBg: 'bg-orange-50 dark:bg-orange-900/20',
    ring: 'ring-orange-500/50'
  },
  pink: { 
    bg: 'bg-pink-50 dark:bg-pink-900/10', 
    text: 'text-pink-600 dark:text-pink-400', 
    iconBg: 'bg-pink-50 dark:bg-pink-900/20',
    ring: 'ring-pink-500/50'
  },
  indigo: { 
    bg: 'bg-indigo-50 dark:bg-indigo-900/10', 
    text: 'text-indigo-600 dark:text-indigo-400', 
    iconBg: 'bg-indigo-50 dark:bg-indigo-900/20',
    ring: 'ring-indigo-500/50'
  },
  teal: { 
    bg: 'bg-teal-50 dark:bg-teal-900/10', 
    text: 'text-teal-600 dark:text-teal-400', 
    iconBg: 'bg-teal-50 dark:bg-teal-900/20',
    ring: 'ring-teal-500/50'
  },
  red: { 
    bg: 'bg-red-50 dark:bg-red-900/10', 
    text: 'text-red-600 dark:text-red-400', 
    iconBg: 'bg-red-50 dark:bg-red-900/20',
    ring: 'ring-red-500/50'
  },
  gray: { 
    bg: 'bg-gray-50 dark:bg-gray-800', 
    text: 'text-gray-600 dark:text-gray-400', 
    iconBg: 'bg-gray-50 dark:bg-gray-800',
    ring: 'ring-gray-500/50'
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = 'blue',
  trend,
  trendLabel,
  subtitle,
  highlight = false,
  className = '',
  loading = false,
  prefix = '',
  suffix = '',
  change,
}) => {
  const colors = colorClasses[color] || colorClasses.blue;

  const formatValue = (val: any) => {
    if (React.isValidElement(val)) return val;
    if (typeof val === 'string') return val;
    if (typeof val === 'number') {
      if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
      if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
      return val.toString();
    }
    return val;
  };

  const getTrendIcon = () => {
    if (trend === 'up' || (typeof trend === 'number' && trend > 0)) return <TrendingUp className="w-3 h-3" />;
    if (trend === 'down' || (typeof trend === 'number' && trend < 0)) return <TrendingDown className="w-3 h-3" />;
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'up' || (typeof trend === 'number' && trend > 0)) return 'text-success-600 dark:text-success-400';
    if (trend === 'down' || (typeof trend === 'number' && trend < 0)) return 'text-error-600 dark:text-error-400';
    return 'text-neutral-500';
  };

  const trendValue = typeof trend === 'number' ? Math.abs(trend) : change;

  if (loading) {
    return (
      <div className={`bg-white dark:bg-neutral-800 rounded-xl p-5 shadow-sm border border-neutral-200 dark:border-neutral-700 animate-pulse ${className}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-700 rounded-lg"></div>
        </div>
        <div className="h-8 bg-neutral-100 dark:bg-neutral-700 rounded w-2/3 mb-2"></div>
        <div className="h-3 bg-neutral-100 dark:bg-neutral-700 rounded w-1/3"></div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-neutral-800 rounded-xl p-5 shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow ${highlight ? `ring-1 ${colors.ring}` : ''} ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${colors.iconBg} ${colors.text}`}>
          {icon}
        </div>
        {(trend !== undefined || change !== undefined) && (
          <div className={`flex items-center gap-0.5 text-xs font-medium ${getTrendColor()}`}>
            {getTrendIcon()}
            {trendValue !== undefined && `${trendValue}%`}
            {trendLabel && <span className="ml-1 text-neutral-400 font-normal">{trendLabel}</span>}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
        {prefix}{formatValue(value)}{suffix}
      </div>
      <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">{title}</div>
      {subtitle && <div className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">{subtitle}</div>}
    </div>
  );
};

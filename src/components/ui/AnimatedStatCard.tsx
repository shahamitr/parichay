'uset';

import { useEffect, useState } from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import GlassCard from './GlassCard';

interface AnimatedStatCardProps {
  title: string;
  value: number;
  previousValue?: number;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  format?: 'number' | 'currency' | 'percentage';
  prefix?: string;
  suffix?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  loading?: boolean;
}

export default function AnimatedStatCard({
  title,
  value,
  previousValue,
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBgColor = 'bg-blue-100 dark:bg-blue-900/30',
  format = 'number',
  prefix = '',
  suffix = '',
  trend,
  trendValue,
  loading = false,
}: AnimatedStatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  // Animate counter
  useEffect(() => {
    if (loading) return;

    const duration = 1000; // 1 second
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;

      if (step >= steps) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, loading]);

  // Calculate trend if not provided
  const calculatedTrend = trend || (previousValue !== undefined
    ? value > previousValue ? 'up' : value < previousValue ? 'down' : 'neutral'
    : undefined);

  const calculatedTrendValue = trendValue !== undefined
    ? trendValue
    : previousValue !== undefined && previousValue > 0
    ? Math.round(((value - previousValue) / previousValue) * 100)
    : undefined;

  const formatValue = (val: number) => {
    if (format === 'currency') {
      return `₹${val.toLocaleString('en-IN')}`;
    } else if (format === 'percentage') {
      return `${val}%`;
    }
    return val.toLocaleString('en-IN');
  };

  const TrendIcon = calculatedTrend === 'up' ? TrendingUp : calculatedTrend === 'down' ? TrendingDown : Minus;
  const trendColor = calculatedTrend === 'up' ? 'text-green-600 dark:text-green-400' : calculatedTrend === 'down' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400';

  if (loading != null) {
    return (
      <GlassCard hover gradient>
        <div className="p-6 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            <div className={`w-12 h-12 ${iconBgColor} rounded-xl`}></div>
          </div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard hover gradient>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <div className={`w-12 h-12 ${iconBgColor} rounded-xl flex items-center justify-center transition-transform hover:scale-110`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
            {prefix}{formatValue(displayValue)}{suffix}
          </h3>
        </div>

        {calculatedTrend && calculatedTrendValue !== undefined && (
          <div className="flex items-center gap-1">
            <TrendIcon className={`w-4 h-4 ${trendColor}`} />
            <span className={`text-sm font-medium ${trendColor}`}>
              {Math.abs(calculatedTrendValue)}%
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">vs last period</span>
          </div>
        )}
      </div>
    </GlassCard>
  );
}

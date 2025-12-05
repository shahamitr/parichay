'use client';

import { ReactNode } from 'react';

interface ModernCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'glass' | 'elevated' | 'bordered';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export default function ModernCard({
  children,
  className = '',
  variant = 'default',
  hover = false,
  padding = 'md',
  onClick,
}: ModernCardProps) {
  const baseStyles = 'rounded-2xl transition-all duration-300';

  const variantStyles = {
    default: 'bg-white border border-gray-100 shadow-sm',
    gradient: 'bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm',
    glass: 'bg-white/80 backdrop-blur-lg border border-white/20 shadow-lg',
    elevated: 'bg-white shadow-xl shadow-gray-200/50',
    bordered: 'bg-white border-2 border-gray-200',
  };

  const hoverStyles = hover
    ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer'
    : '';

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${paddingStyles[padding]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'teal';
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  color = 'blue',
}: StatCardProps) {
  const colorStyles = {
    blue: { bg: 'bg-blue-50', icon: 'bg-blue-100 text-blue-600', accent: 'text-blue-600' },
    green: { bg: 'bg-green-50', icon: 'bg-green-100 text-green-600', accent: 'text-green-600' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-600', accent: 'text-purple-600' },
    orange: { bg: 'bg-orange-50', icon: 'bg-orange-100 text-orange-600', accent: 'text-orange-600' },
    pink: { bg: 'bg-pink-50', icon: 'bg-pink-100 text-pink-600', accent: 'text-pink-600' },
    teal: { bg: 'bg-teal-50', icon: 'bg-teal-100 text-teal-600', accent: 'text-teal-600' },
  };

  const colors = colorStyles[color];

  return (
    <ModernCard variant="default" hover>
      <div className="flex items-start justify-between">
        {icon && (
          <div className={`p-3 rounded-xl ${colors.icon}`}>
            {icon}
          </div>
        )}
        {change !== undefined && (
          <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{title}</p>
        {changeLabel && (
          <p className="text-xs text-gray-400 mt-1">{changeLabel}</p>
        )}
      </div>
    </ModernCard>
  );
}

// Feature Card Component
interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

export function FeatureCard({ title, description, icon, color = 'blue' }: FeatureCardProps) {
  const colorStyles = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <ModernCard variant="default" hover className="group">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorStyles[color]} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </ModernCard>
  );
}

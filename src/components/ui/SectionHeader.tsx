'use client';

import React from 'react';

export interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  icon,
  subtitle,
  action,
  className = '',
  variant = 'default',
}) => {
  const baseStyles = "px-6 py-4 flex items-center justify-between";
  const variantStyles = variant === 'gradient' 
    ? "bg-gradient-to-r from-primary-50/50 to-transparent dark:from-primary-900/10 border-b border-neutral-100 dark:border-neutral-700"
    : "border-b border-neutral-100 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50";

  return (
    <div className={`${baseStyles} ${variantStyles} ${className}`}>
      <div className="flex items-center gap-2">
        {icon && <div className="text-neutral-500 dark:text-neutral-400">{icon}</div>}
        <div>
          <h3 className="font-bold text-neutral-900 dark:text-neutral-100">{title}</h3>
          {subtitle && <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

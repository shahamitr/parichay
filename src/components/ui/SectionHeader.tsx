'use client';

import React from 'react';

export interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
  description?: string; // Alias for subtitle (backward compat)
  action?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'clean';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  icon,
  subtitle,
  description,
  action,
  className = '',
  variant = 'clean',
}) => {
  const displaySubtitle = subtitle || description;

  if (variant === 'clean') {
    return (
      <div className={`flex items-start gap-3 ${className}`}>
        {icon && <div className="text-gray-400 mt-0.5">{icon}</div>}
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          {displaySubtitle && (
            <p className="text-sm text-gray-500 mt-1">{displaySubtitle}</p>
          )}
        </div>
        {action && <div className="flex-shrink-0 ml-auto">{action}</div>}
      </div>
    );
  }

  const baseStyles = "px-6 py-4 flex items-center justify-between";
  const variantStyles = variant === 'gradient'
    ? "bg-gradient-to-r from-primary-50/50 to-transparent border-b border-gray-100"
    : "border-b border-gray-100 bg-gray-50/50";

  return (
    <div className={`${baseStyles} ${variantStyles} ${className}`}>
      <div className="flex items-center gap-2">
        {icon && <div className="text-gray-500">{icon}</div>}
        <div>
          <h3 className="font-bold text-gray-900">{title}</h3>
          {displaySubtitle && <p className="text-sm text-gray-500 mt-0.5">{displaySubtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

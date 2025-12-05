'use client';

import { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode, forwardRef } from 'react';

interface ModernInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'filled' | 'underline';
}

export const ModernInput = forwardRef<HTMLInputElement, ModernInputProps>(
  ({ label, error, hint, icon, iconPosition = 'left', variant = 'default', className = '', ...props }, ref) => {
    const baseInputStyles = 'w-full transition-all duration-200 focus:outline-none';

    const variantStyles = {
      default: 'px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent',
      filled: 'px-4 py-3 bg-gray-100 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500',
      underline: 'px-0 py-3 border-b-2 border-gray-300 focus:border-blue-500 rounded-none',
    };

    const errorStyles = error ? 'border-red-500 focus:ring-red-500' : '';
    const iconPadding = icon ? (iconPosition === 'left' ? 'pl-11' : 'pr-11') : '';

    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${iconPosition === 'left' ? 'left-4' : 'right-4'}`}>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`${baseInputStyles} ${variantStyles[variant]} ${errorStyles} ${iconPadding} ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {hint && !error && <p className="text-sm text-gray-500">{hint}</p>}
      </div>
    );
  }
);

ModernInput.displayName = 'ModernInput';

// Textarea variant
interface ModernTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  variant?: 'default' | 'filled';
}

export const ModernTextarea = forwardRef<HTMLTextAreaElement, ModernTextareaProps>(
  ({ label, error, hint, variant = 'default', className = '', ...props }, ref) => {
    const baseStyles = 'w-full transition-all duration-200 focus:outline-none resize-none';

    const variantStyles = {
      default: 'px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent',
      filled: 'px-4 py-3 bg-gray-100 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500',
    };

    const errorStyles = error ? 'border-red-500 focus:ring-red-500' : '';

    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`${baseStyles} ${variantStyles[variant]} ${errorStyles} ${className}`}
          {...props}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {hint && !error && <p className="text-sm text-gray-500">{hint}</p>}
      </div>
    );
  }
);

ModernTextarea.displayName = 'ModernTextarea';

// Select variant
interface ModernSelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const ModernSelect = forwardRef<HTMLSelectElement, ModernSelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white ${error ? 'border-red-500' : ''} ${className}`}
          {...(props as any)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

ModernSelect.displayName = 'ModernSelect';

export default ModernInput;

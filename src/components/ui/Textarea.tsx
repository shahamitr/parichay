import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

/**
 * Textarea Component
 *
 * A textarea component with consistent styling and focus states.
 *
 * @example
 * ```tsx
 * <Textarea
 *   label="Message"
 *   placeholder="Enter your message"
 *   rows={4}
 * />
 * ```
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      resize = 'vertical',
      className = '',
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    // Base textarea styles
    const baseStyles = 'block px-4 py-3 text-base text-neutral-900 dark:text-neutral-50 bg-white dark:bg-neutral-800 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed';

    // Border styles based on error state
    const borderStyles = error
      ? 'border-error-500 focus:border-error-500 focus:ring-error-500'
      : 'border-neutral-300 dark:border-neutral-600 focus:border-primary-500 focus:ring-primary-500';

    // Width styles
    const widthStyles = fullWidth ? 'w-full' : '';

    // Resize styles
    const resizeStyles = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`
            ${baseStyles}
            ${borderStyles}
            ${widthStyles}
            ${resizeStyles[resize]}
            ${className}
          `}
          {...props}
        />

        {error && (
          <p className="mt-1.5 text-sm text-error-500">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

'use client';

import React, { useState, useEffect, useId, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Check, AlertCircle, Eye, EyeOff, HelpCircle } from 'lucide-react';

// =============================================================================
// FORM FIELD WRAPPER
// =============================================================================
interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  error,
  hint,
  required,
  children,
  className,
}: FormFieldProps) {
  const id = useId();

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<{ id?: string }>, { id })
        : children}
      {hint && !error && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-error-600 dark:text-error-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

// =============================================================================
// INPUT COMPONENT
// =============================================================================
type InputStatus = 'default' | 'success' | 'error' | 'loading';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  status?: InputStatus;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, status = 'default', leftIcon, rightIcon, type, onClear, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    const statusStyles = {
      default: 'border-neutral-300 dark:border-neutral-600 focus:border-primary-500 focus:ring-primary-500',
      success: 'border-success-500 focus:border-success-500 focus:ring-success-500',
      error: 'border-error-500 focus:border-error-500 focus:ring-error-500',
      loading: 'border-neutral-300 dark:border-neutral-600 animate-pulse',
    };

    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          type={inputType}
          className={cn(
            'w-full px-3 py-2.5 rounded-lg border bg-white dark:bg-neutral-800',
            'text-neutral-900 dark:text-neutral-100 placeholder-neutral-400',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'transition-colors duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            statusStyles[status],
            leftIcon && 'pl-10',
            (rightIcon || isPassword || onClear) && 'pr-10',
            className
          )}
          {...props}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {status === 'success' && (
            <Check className="w-4 h-4 text-success-500" />
          )}
          {status === 'error' && (
            <AlertCircle className="w-4 h-4 text-error-500" />
          )}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
          {rightIcon && !isPassword && status === 'default' && rightIcon}
        </div>
      </div>
    );
  }
);
Input.displayName = 'Input';

// =============================================================================
// TEXTAREA COMPONENT
// =============================================================================
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  status?: InputStatus;
  showCharCount?: boolean;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, status = 'default', showCharCount, maxLength, value, ...props }, ref) => {
    const charCount = typeof value === 'string' ? value.length : 0;

    const statusStyles = {
      default: 'border-neutral-300 dark:border-neutral-600 focus:border-primary-500 focus:ring-primary-500',
      success: 'border-success-500 focus:border-success-500 focus:ring-success-500',
      error: 'border-error-500 focus:border-error-500 focus:ring-error-500',
      loading: 'border-neutral-300 dark:border-neutral-600 animate-pulse',
    };

    return (
      <div className="relative">
        <textarea
          ref={ref}
          value={value}
          maxLength={maxLength}
          className={cn(
            'w-full px-3 py-2.5 rounded-lg border bg-white dark:bg-neutral-800',
            'text-neutral-900 dark:text-neutral-100 placeholder-neutral-400',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'transition-colors duration-200 resize-y min-h-[100px]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            statusStyles[status],
            showCharCount && 'pb-7',
            className
          )}
          {...props}
        />
        {showCharCount && maxLength && (
          <span
            className={cn(
              'absolute bottom-2 right-3 text-xs',
              charCount >= maxLength
                ? 'text-error-500'
                : charCount >= maxLength * 0.9
                ? 'text-warning-500'
                : 'text-neutral-400'
            )}
          >
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// =============================================================================
// SELECT COMPONENT
// =============================================================================
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[];
  placeholder?: string;
  status?: InputStatus;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, status = 'default', ...props }, ref) => {
    const statusStyles = {
      default: 'border-neutral-300 dark:border-neutral-600 focus:border-primary-500 focus:ring-primary-500',
      success: 'border-success-500 focus:border-success-500 focus:ring-success-500',
      error: 'border-error-500 focus:border-error-500 focus:ring-error-500',
      loading: 'border-neutral-300 dark:border-neutral-600 animate-pulse',
    };

    return (
      <select
        ref={ref}
        className={cn(
          'w-full px-3 py-2.5 rounded-lg border bg-white dark:bg-neutral-800',
          'text-neutral-900 dark:text-neutral-100',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          'transition-colors duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          statusStyles[status],
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);
Select.displayName = 'Select';

// =============================================================================
// CHECKBOX COMPONENT
// =============================================================================
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, ...props }, ref) => {
    return (
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            className={cn(
              'w-5 h-5 rounded border-2 border-neutral-300 dark:border-neutral-600',
              'text-primary-600 focus:ring-primary-500 focus:ring-offset-0',
              'transition-colors duration-200',
              'checked:bg-primary-600 checked:border-primary-600',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              className
            )}
            {...props}
          />
        </div>
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-neutral-300">
                {label}
              </span>
            )}
            {description && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {description}
              </p>
            )}
          </div>
        )}
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';

// =============================================================================
// RADIO GROUP COMPONENT
// =============================================================================
interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  orientation = 'vertical',
  className,
}: RadioGroupProps) {
  return (
    <div
      className={cn(
        'flex gap-4',
        orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        className
      )}
      role="radiogroup"
    >
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            'flex items-start gap-3 cursor-pointer group',
            option.disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange?.(e.target.value)}
              disabled={option.disabled}
              className={cn(
                'w-5 h-5 border-2 border-neutral-300 dark:border-neutral-600',
                'text-primary-600 focus:ring-primary-500 focus:ring-offset-0',
                'transition-colors duration-200'
              )}
            />
          </div>
          <div className="flex-1">
            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-neutral-300">
              {option.label}
            </span>
            {option.description && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {option.description}
              </p>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}

// =============================================================================
// SWITCH/TOGGLE COMPONENT
// =============================================================================
interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Switch({
  checked = false,
  onChange,
  label,
  description,
  disabled,
  size = 'md',
}: SwitchProps) {
  const sizes = {
    sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
    md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
    lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' },
  };

  return (
    <label
      className={cn(
        'flex items-center gap-3 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          'relative inline-flex flex-shrink-0 rounded-full',
          'transition-colors duration-200 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          sizes[size].track,
          checked ? 'bg-primary-600' : 'bg-neutral-200 dark:bg-neutral-700'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block rounded-full bg-white shadow-lg',
            'transform transition-transform duration-200 ease-in-out',
            sizes[size].thumb,
            checked ? sizes[size].translate : 'translate-x-0.5',
            'mt-0.5 ml-0.5'
          )}
        />
      </button>
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {label}
            </span>
          )}
          {description && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {description}
            </p>
          )}
        </div>
      )}
    </label>
  );
}

// =============================================================================
// FORM VALIDATION HOOK
// =============================================================================
interface ValidationRule {
  validate: (value: unknown) => boolean;
  message: string;
}

interface FieldConfig {
  rules?: ValidationRule[];
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

interface UseFormFieldOptions<T> {
  initialValue: T;
  config?: FieldConfig;
}

export function useFormField<T>({ initialValue, config }: UseFormFieldOptions<T>) {
  const [value, setValue] = useState<T>(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [dirty, setDirty] = useState(false);

  const validate = (val: T): boolean => {
    if (!config?.rules) return true;

    for (const rule of config.rules) {
      if (!rule.validate(val)) {
        setError(rule.message);
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleChange = (newValue: T) => {
    setValue(newValue);
    setDirty(true);
    if (config?.validateOnChange && touched) {
      validate(newValue);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    if (config?.validateOnBlur) {
      validate(value);
    }
  };

  const reset = () => {
    setValue(initialValue);
    setError(null);
    setTouched(false);
    setDirty(false);
  };

  return {
    value,
    error,
    touched,
    dirty,
    isValid: !error,
    setValue: handleChange,
    setError,
    onBlur: handleBlur,
    validate: () => validate(value),
    reset,
  };
}

// =============================================================================
// COMMON VALIDATION RULES
// =============================================================================
export const validationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    validate: (value) => {
      if (typeof value === 'string') return value.trim().length > 0;
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== undefined;
    },
    message,
  }),

  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    validate: (value) => {
      if (!value || typeof value !== 'string') return true;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (!value || typeof value !== 'string') return true;
      return value.length >= min;
    },
    message: message || `Must be at least ${min} characters`,
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (!value || typeof value !== 'string') return true;
      return value.length <= max;
    },
    message: message || `Must be no more than ${max} characters`,
  }),

  pattern: (regex: RegExp, message: string): ValidationRule => ({
    validate: (value) => {
      if (!value || typeof value !== 'string') return true;
      return regex.test(value);
    },
    message,
  }),

  phone: (message = 'Please enter a valid phone number'): ValidationRule => ({
    validate: (value) => {
      if (!value || typeof value !== 'string') return true;
      return /^[\d\s\-+()]{10,}$/.test(value.replace(/\s/g, ''));
    },
    message,
  }),

  url: (message = 'Please enter a valid URL'): ValidationRule => ({
    validate: (value) => {
      if (!value || typeof value !== 'string') return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message,
  }),
};

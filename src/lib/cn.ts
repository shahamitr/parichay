/**
 * Utility for conditionally joining class names.
 * Replaces scattered clsx/tailwind-merge usage with one canonical import.
 *
 * Usage:
 *   import { cn } from '@/lib/cn';
 *   <div className={cn('base-class', isActive && 'active-class', variant === 'primary' && 'bg-indigo-600')} />
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

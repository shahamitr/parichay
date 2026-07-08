'use client';

import { ReactNode, useEffect } from 'react';
import { cn } from '@/lib/cn';
import { X } from 'lucide-react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Dialog({ open, onClose, children, title, description, size = 'md' }: DialogProps) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizeClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Content */}
      <div className={cn('relative bg-white rounded-2xl shadow-2xl w-full p-6', sizeClass)}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {title && <h2 className="text-lg font-bold text-gray-900 mb-1 pr-8">{title}</h2>}
        {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}

        {children}
      </div>
    </div>
  );
}

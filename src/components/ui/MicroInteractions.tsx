'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Check, Heart, Star, ThumbsUp, Bookmark, Share2 } from 'lucide-react';

// Ripple Effect Component
export function RippleButton({
  children,
  onClick,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    onClick?.(e);
  };

  return (
    <button
      onClick={handleClick}
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
          }}
        />
      ))}
    </button>
  );
}

// Animated Like Button
export function LikeButton({ onLike, isLiked: initialLiked = false }: { onLike?: (liked: boolean) => void; isLiked?: boolean }) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsLiked(!isLiked);
    setIsAnimating(true);
    onLike?.(!isLiked);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'group relative p-3 rounded-full transition-all duration-300',
        isLiked ? 'bg-red-50 dark:bg-red-900/20' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
      )}
    >
      <Heart
        className={cn(
          'w-6 h-6 transition-all duration-300',
          isLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-600 dark:text-gray-400',
          isAnimating && 'animate-bounce'
        )}
      />
      {isAnimating && (
        <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
      )}
    </button>
  );
}

// Animated Star Rating
export function StarRating({
  rating: initialRating = 0,
  maxRating = 5,
  onChange,
  readonly = false,
}: {
  rating?: number;
  maxRating?: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
}) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value: number) => {
    if (readonly) return;
    setRating(value);
    onChange?.(value);
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, i) => i + 1).map((value) => (
        <button
          key={value}
          onClick={() => handleClick(value)}
          onMouseEnter={() => !readonly && setHoverRating(value)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          disabled={readonly}
          className={cn(
            'transition-all duration-200',
            !readonly && 'hover:scale-125 cursor-pointer',
            readonly && 'cursor-default'
          )}
        >
          <Star
            className={cn(
              'w-6 h-6 transition-all duration-200',
              value <= (hoverRating || rating)
                ? 'fill-yellow-400 text-yellow-400 scale-110'
                : 'text-gray-300 dark:text-gray-600'
            )}
          />
        </button>
      ))}
    </div>
  );
}

// Animated Checkbox
export function AnimatedCheckbox({
  checked: initialChecked = false,
  onChange,
  label,
}: {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
}) {
  const [checked, setChecked] = useState(initialChecked);

  const handleChange = () => {
    setChecked(!checked);
    onChange?.(!checked);
  };

  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        className={cn(
          'relative w-6 h-6 rounded-md border-2 transition-all duration-300',
          checked
            ? 'bg-blue-600 border-blue-600 scale-110'
            : 'border-gray-300 dark:border-gray-600 group-hover:border-blue-400'
        )}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          className="sr-only"
        />
        <Check
          className={cn(
            'absolute inset-0 w-4 h-4 m-auto text-white transition-all duration-300',
            checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          )}
        />
      </div>
      {label && (
        <span className="text-gray-700 dark:text-gray-300 select-none">{label}</span>
      )}
    </label>
  );
}

// Animated Toggle Switch
export function AnimatedToggle({
  enabled: initialEnabled = false,
  onChange,
  label,
}: {
  enabled?: boolean;
  onChange?: (enabled: boolean) => void;
  label?: string;
}) {
  const [enabled, setEnabled] = useState(initialEnabled);

  const handleToggle = () => {
    setEnabled(!enabled);
    onChange?.(!enabled);
  };

  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        className={cn(
          'relative w-12 h-6 rounded-full transition-all duration-300',
          enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
        )}
      >
        <input
          type="checkbox"
          checked={enabled}
          onChange={handleToggle}
          className="sr-only"
        />
        <div
          className={cn(
            'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300',
            enabled ? 'left-6' : 'left-0.5'
          )}
        />
      </div>
      {label && (
        <span className="text-gray-700 dark:text-gray-300 select-none">{label}</span>
      )}
    </label>
  );
}

// Animated Counter
export function AnimatedCounter({
  value,
  duration = 1000,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const diff = value - startValue;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      const current = Math.floor(startValue + diff * easeOutQuad);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [value, duration]);

  return <span className={className}>{displayValue.toLocaleString()}</span>;
}

// Floating Action Button with Menu
export function FloatingActionButton({
  actions,
}: {
  actions: { icon: React.ReactNode; label: string; onClick: () => void }[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.onClick();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="text-gray-700 dark:text-gray-300 whitespace-nowrap">
                {action.label}
              </span>
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                {action.icon}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300',
          isOpen && 'rotate-45 scale-110'
        )}
      >
        <span className="text-2xl">+</span>
      </button>
    </div>
  );
}

// Skeleton Loader with Shimmer
export function SkeletonLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-lg',
        'before:absolute before:inset-0 before:-translate-x-full',
        'before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
        'before:animate-shimmer',
        className
      )}
    />
  );
}

// Progress Bar with Animation
export function AnimatedProgressBar({
  progress,
  showLabel = true,
  className,
}: {
  progress: number;
  showLabel?: boolean;
  className?: string;
}) {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className={cn('space-y-2', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Progress</span>
          <span>{Math.round(displayProgress)}%</span>
        </div>
      )}
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${displayProgress}%` }}
        />
      </div>
    </div>
  );
}

'use client';

import { useNavigation } from '@/lib/navigation-context';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavigationLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export default function NavigationLink({
  href,
  children,
  className = '',
  activeClassName = '',
  exact = false,
  disabled = false,
  onClick
}: NavigationLinkProps) {
  const { navigate, isNavigating, targetPath } = useNavigation();
  const pathname = usePathname();

  const isActive = exact ? pathname === href : pathname.startsWith(href);
  const isCurrentlyNavigating = isNavigating && targetPath === href;

  const handleClick = () => {
    if (disabled || isCurrentlyNavigating) return;
    
    onClick?.();
    navigate(href);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isCurrentlyNavigating}
      className={cn(
        'transition-all duration-200',
        isActive && activeClassName,
        isCurrentlyNavigating && 'opacity-75 cursor-wait',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
      {isCurrentlyNavigating && (
        <div className="ml-2 w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
      )}
    </button>
  );
}
'use client';

import React, { createContext, useContext, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronRight, Home, MoreHorizontal } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================
interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  current?: boolean;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  className?: string;
  showHome?: boolean;
  homeHref?: string;
  autoGenerate?: boolean;
}

// =============================================================================
// ROUTE LABELS MAPPING
// =============================================================================
const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  analytics: 'Analytics',
  branches: 'Branches',
  brands: 'Brands',
  leads: 'Leads',
  users: 'Users',
  settings: 'Settings',
  profile: 'Profile',
  system: 'System',
  subscription: 'Subscription',
  'short-links': 'Short Links',
  'qr-codes': 'QR Codes',
  social: 'Social & Reviews',
  microsite: 'Microsite Editor',
  tools: 'Tools',
  executive: 'Executive Portal',
  login: 'Login',
  register: 'Register',
  // Dynamic route placeholders
  new: 'New',
  edit: 'Edit',
};

// =============================================================================
// BREADCRUMB CONTEXT (for nested layouts)
// =============================================================================
interface BreadcrumbContextValue {
  items: BreadcrumbItem[];
  setItems: (items: BreadcrumbItem[]) => void;
  addItem: (item: BreadcrumbItem) => void;
  removeItem: (label: string) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<BreadcrumbItem[]>([]);

  const addItem = (item: BreadcrumbItem) => {
    setItems((prev) => [...prev.filter((i) => i.label !== item.label), item]);
  };

  const removeItem = (label: string) => {
    setItems((prev) => prev.filter((i) => i.label !== label));
  };

  return (
    <BreadcrumbContext.Provider value={{ items, setItems, addItem, removeItem }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbs() {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumbs must be used within a BreadcrumbProvider');
  }
  return context;
}

// =============================================================================
// BREADCRUMBS COMPONENT
// =============================================================================
export function Breadcrumbs({
  items: propItems,
  separator,
  maxItems = 4,
  className,
  showHome = true,
  homeHref = '/admin',
  autoGenerate = true,
}: BreadcrumbsProps) {
  const pathname = usePathname();

  // Auto-generate breadcrumbs from pathname
  const autoItems = useMemo(() => {
    if (!autoGenerate || propItems) return [];

    const segments = pathname.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [];
    let path = '';

    segments.forEach((segment, index) => {
      path += `/${segment}`;

      // Skip ID-like segments (UUIDs, numeric IDs)
      const isId = /^[a-f0-9-]{20,}$/i.test(segment) || /^\d+$/.test(segment);

      if (isId) {
        // For ID segments, try to get a more descriptive label
        // This could be enhanced with actual data fetching
        items.push({
          label: 'Details',
          href: path,
          current: index === segments.length - 1,
        });
      } else {
        const label = routeLabels[segment] ||
          segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

        items.push({
          label,
          href: path,
          current: index === segments.length - 1,
        });
      }
    });

    return items;
  }, [pathname, autoGenerate, propItems]);

  const items = propItems || autoItems;

  // Collapse breadcrumbs if too many
  const displayItems = useMemo(() => {
    if (items.length <= maxItems) return items;

    const first = items[0];
    const last = items.slice(-2);

    return [
      first,
      { label: '...', href: undefined, current: false },
      ...last,
    ];
  }, [items, maxItems]);

  if (items.length === 0 && !showHome) return null;

  const defaultSeparator = (
    <ChevronRight className="w-4 h-4 text-neutral-400 flex-shrink-0" />
  );

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
      <ol className="flex items-center flex-wrap gap-1">
        {/* Home */}
        {showHome && (
          <>
            <li>
              <Link
                href={homeHref}
                className="flex items-center text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="sr-only">Home</span>
              </Link>
            </li>
            {items.length > 0 && (
              <li className="flex items-center">
                {separator || defaultSeparator}
              </li>
            )}
          </>
        )}

        {/* Items */}
        {displayItems.map((item, index) => (
          <React.Fragment key={item.label + index}>
            <li className="flex items-center">
              {item.label === '...' ? (
                <span className="px-2 text-neutral-400">
                  <MoreHorizontal className="w-4 h-4" />
                </span>
              ) : item.current || !item.href ? (
                <span
                  className={cn(
                    'text-sm font-medium flex items-center gap-1.5',
                    item.current
                      ? 'text-neutral-900 dark:text-white'
                      : 'text-neutral-500 dark:text-neutral-400'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.icon}
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors flex items-center gap-1.5"
                >
                  {item.icon}
                  {item.label}
                </Link>
              )}
            </li>
            {index < displayItems.length - 1 && (
              <li className="flex items-center">
                {separator || defaultSeparator}
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}

// =============================================================================
// PAGE HEADER WITH BREADCRUMBS
// =============================================================================
interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
  backHref?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
  backHref,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} className="mb-3" />

      {/* Header content */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}

// =============================================================================
// BREADCRUMB ITEM HOOK (for dynamic updates)
// =============================================================================
export function useBreadcrumbItem(item: BreadcrumbItem) {
  const context = useContext(BreadcrumbContext);

  React.useEffect(() => {
    if (context) {
      context.addItem(item);
      return () => context.removeItem(item.label);
    }
  }, [context, item]);
}

export default Breadcrumbs;

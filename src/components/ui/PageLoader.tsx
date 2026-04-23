'use client';

import { motion } from 'framer-motion';
import { DashboardSkeleton, CardSkeleton, TableSkeleton, ListSkeleton } from './SkeletonLoader';

interface PageLoaderProps {
  type?: 'dashboard' | 'table' | 'cards' | 'list' | 'form' | 'custom';
  children?: React.ReactNode;
  className?: string;
}

export default function PageLoader({ type = 'dashboard', children, className = '' }: PageLoaderProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'dashboard':
        return <DashboardSkeleton />;
      case 'table':
        return <TableSkeleton rows={8} />;
      case 'cards':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        );
      case 'list':
        return <ListSkeleton items={8} />;
      case 'form':
        return <FormSkeleton />;
      case 'custom':
        return children;
      default:
        return <DashboardSkeleton />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {renderSkeleton()}
    </motion.div>
  );
}

function FormSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        ))}
        
        <div className="flex gap-3 pt-4">
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

// Specific page loaders for common dashboard pages
export function BrandsPageLoader() {
  return <PageLoader type="cards" />;
}

export function LeadsPageLoader() {
  return <PageLoader type="table" />;
}

export function AnalyticsPageLoader() {
  return <PageLoader type="dashboard" />;
}

export function SettingsPageLoader() {
  return <PageLoader type="form" />;
}
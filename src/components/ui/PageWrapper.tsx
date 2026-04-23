'use client';

import { Suspense } from 'react';
import PageTransition from './PageTransition';
import PageLoader from './PageLoader';

interface PageWrapperProps {
  children: React.ReactNode;
  loading?: boolean;
  loaderType?: 'dashboard' | 'table' | 'cards' | 'list' | 'form';
  className?: string;
}

export default function PageWrapper({ 
  children, 
  loading = false, 
  loaderType = 'dashboard',
  className = '' 
}: PageWrapperProps) {
  if (loading) {
    return <PageLoader type={loaderType} className={className} />;
  }

  return (
    <PageTransition className={className}>
      <Suspense fallback={<PageLoader type={loaderType} />}>
        {children}
      </Suspense>
    </PageTransition>
  );
}

// Specific page wrappers for common dashboard pages
export function DashboardPageWrapper({ children, loading }: { children: React.ReactNode; loading?: boolean }) {
  return <PageWrapper loading={loading} loaderType="dashboard">{children}</PageWrapper>;
}

export function TablePageWrapper({ children, loading }: { children: React.ReactNode; loading?: boolean }) {
  return <PageWrapper loading={loading} loaderType="table">{children}</PageWrapper>;
}

export function CardsPageWrapper({ children, loading }: { children: React.ReactNode; loading?: boolean }) {
  return <PageWrapper loading={loading} loaderType="cards">{children}</PageWrapper>;
}

export function FormPageWrapper({ children, loading }: { children: React.ReactNode; loading?: boolean }) {
  return <PageWrapper loading={loading} loaderType="form">{children}</PageWrapper>;
}
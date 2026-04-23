import { ReactNode } from 'react';

export const metadata = {
  title: 'Executive Portal - Parichay',
  description: 'Onboard new microsites and track your performance',
};

export default function ExecutiveLayout({ children }: { children: ReactNode }) {
  // Redirect to admin - executive has dedicated section in admin
  if (typeof window !== 'undefined') {
    window.location.href = '/admin';
    return null;
  }
  return children;
}

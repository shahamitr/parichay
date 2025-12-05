import { Metadata } from 'next';
import DashboardLayoutWrapper from '@/components/dashboard/DashboardLayoutWrapper';

export const metadata: Metadata = {
  title: 'Dashboard - Parichay',
  description: 'Manage your brands and microsites',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayoutWrapper>
      {children}
    </DashboardLayoutWrapper>
  );
}
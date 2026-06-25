import { ReactNode } from 'react';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Executive Portal - Parichay',
  description: 'Onboard new microsites and track your performance',
};

export default function ExecutiveLayout({ children }: { children: ReactNode }) {
  // Executive section is within admin panel
  redirect('/admin');
}

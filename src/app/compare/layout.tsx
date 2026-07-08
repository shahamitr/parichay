import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Parichay vs Competitors — Feature Comparison',
  description: 'Compare Parichay with JustDial, Google Business, traditional websites, and other digital card platforms. See which solution fits your business.',
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}

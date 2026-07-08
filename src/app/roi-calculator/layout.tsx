import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ROI Calculator — Parichay',
  description: 'Calculate how much your business can save by switching to Parichay. Compare costs of traditional websites, agencies, and digital platforms.',
};

export default function ROILayout({ children }: { children: React.ReactNode }) {
  return children;
}

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — Parichay',
  description: 'Get in touch with the Parichay team. Questions about our platform, pricing, or partnerships? We respond within 4 hours.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

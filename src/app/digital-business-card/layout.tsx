import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Digital Business Card — Parichay',
  description: 'Create a professional digital business card in minutes. Share via QR code, WhatsApp, or link. Replace paper cards with a smart digital profile.',
  keywords: ['digital business card', 'digital visiting card', 'QR code card', 'professional profile', 'India'],
};

export default function DigitalCardLayout({ children }: { children: React.ReactNode }) {
  return children;
}

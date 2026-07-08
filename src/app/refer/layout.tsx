import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refer & Earn — Parichay',
  description: 'Share Parichay with friends and earn 30 free days for every successful referral. They get 7 extra trial days too.',
};

export default function ReferLayout({ children }: { children: React.ReactNode }) {
  return children;
}

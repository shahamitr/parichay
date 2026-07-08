import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password — Parichay',
  description: 'Create a new password for your Parichay account.',
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}

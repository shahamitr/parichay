import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find Businesses Near You — Parichay Directory',
  description: 'Search for local businesses, professionals, and services near you. Find doctors, restaurants, salons, consultants and more on Parichay.',
  keywords: ['business directory', 'find businesses near me', 'local services', 'India business search'],
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Pricing | Parichay',
};

export default function PricingPage() {
  redirect('/#pricing');
}

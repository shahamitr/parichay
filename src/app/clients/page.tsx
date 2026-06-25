import { redirect } from 'next/navigation';

// Redirect to industries section on landing page
export default function ClientsPage() {
  redirect('/#industries');
}

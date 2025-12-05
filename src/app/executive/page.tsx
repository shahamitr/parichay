import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { JWTService } from '@/lib/jwt';
import ExecutivePortal from '@/components/executive/ExecutivePortal';

export default async function ExecutiveDashboard() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    redirect('/login?redirect=/executive');
  }

  const payload = JWTService.verifyToken(accessToken);

  if (!payload || payload.role !== 'EXECUTIVE') {
    redirect('/dashboard');
  }

  return <ExecutivePortal />;
}

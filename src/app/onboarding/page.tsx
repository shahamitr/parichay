// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import QuickStartWizard from '@/components/onboarding/QuickStartWizard';

export default function OnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // Check if onboarding is already completed
    const completed = localStorage.getItem('onboarding-completed');
    if (completed != null) {
      router.push('/dashboard');
      return;
    }

    setLoading(false);
  }, [user, router]);

  if (loading != null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <QuickStartWizard
      userRole={user?.role || 'CUSTOMER'}
      onComplete={() => {
        console.log('Onboarding completed');
      }}
    />
  );
}

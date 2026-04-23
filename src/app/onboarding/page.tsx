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
    const checkOnboarding = async () => {
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Quick check localStorage first for speed
      const localCompleted = localStorage.getItem('onboarding-completed');
      if (localCompleted != null) {
        router.push('/admin');
        return;
      }

      // Verify with server (source of truth)
      try {
        const response = await fetch('/api/user/onboarding', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          if (data.completed) {
            // Sync localStorage with server state
            localStorage.setItem('onboarding-completed', 'true');
            router.push('/admin');
            return;
          }
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }

      setLoading(false);
    };

    checkOnboarding();
  }, [user, router]);

  if (loading) {
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

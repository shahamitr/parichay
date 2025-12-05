'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import BrandSelector from '@/components/dashboard/BrandSelector';
import RealTimeDashboard from '@/components/dashboard/RealTimeDashboard';
import ReminderWidget from '@/components/dashboard/ReminderWidget';
import OnboardingTour, { useOnboardingTour } from '@/components/onboarding/OnboardingTour';
import {
  Sparkles,
  ArrowRight,
  Plus,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { shouldShow } = useOnboardingTour('dashboard-tour');

  useEffect(() => {
    if (user?.brandId) {
      setSelectedBrandId(user.brandId);
    }
  }, [user]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const tourSteps = [
    {
      target: '#dashboard-header',
      title: 'Welcome to Parichay!',
      content: 'This is your main dashboard where you can manage brands, branches, and view analytics.',
      placement: 'bottom' as const,
    },
    {
      target: '#create-branch-btn',
      title: 'Create Branches',
      content: 'Click here to create new branches for your brands.',
      placement: 'bottom' as const,
    },
    {
      target: '#brand-selector',
      title: 'Brand Selector',
      content: 'Select a brand to view its analytics and manage microsites.',
      placement: 'bottom' as const,
    },
  ];

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8 pb-12">
        {/* Header Section */}
        <div id="dashboard-header" className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-normal text-gray-800">
              {getGreeting()}, {user.firstName}
            </h1>
            <p className="text-gray-500 mt-1">
              Welcome to your Parichay Admin Console
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              id="create-branch-btn"
              href="/dashboard/branches/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Create Branch
            </Link>
          </div>
        </div>

        {/* Brand Selector (Admin Only) */}
        {(user.role === 'SUPER_ADMIN' || user.role === 'BRAND_MANAGER') && (
          <div id="brand-selector" className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <BrandSelector
              selectedBrandId={selectedBrandId}
              onBrandChange={setSelectedBrandId}
            />
          </div>
        )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Dashboard */}
        <div className="lg:col-span-2">
          {selectedBrandId ? (
            <RealTimeDashboard brandId={selectedBrandId} />
          ) : user.role === 'BRANCH_ADMIN' ? (
            <RealTimeDashboard />
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Brand</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Choose a brand from the selector above to view real-time analytics and manage your microsites.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar - Reminder Widget */}
        <div className="lg:col-span-1">
          <ReminderWidget />
        </div>
      </div>
      </div>

      {/* Onboarding Tour */}
      {shouldShow && user && (
        <OnboardingTour
          steps={tourSteps}
          storageKey="dashboard-tour"
          onComplete={() => console.log('Tour completed')}
        />
      )}
    </>
  );
}

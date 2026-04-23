'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ExecutiveHeader from './ExecutiveHeader';
import ExecutiveStats from './ExecutiveStats';
import OnboardingForm from './OnboardingForm';
import MyBranches from './MyBranches';
import {
  LayoutDashboard,
  PlusCircle,
  Building2,
  LogOut
} from 'lucide-react';

type Tab = 'dashboard' | 'onboard' | 'branches';

interface ExecutiveData {
  id: string;
  name: string;
  email: string;
  stats: {
    totalOnboarded: number;
    activeCount: number;
    thisMonthCount: number;
    lastMonthCount: number;
  };
}

export default function ExecutivePortal() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [executiveData, setExecutiveData] = useState<ExecutiveData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExecutiveData();
  }, []);

  const fetchExecutiveData = async () => {
    try {
      setLoading(true);

      // Get current user info
      const userResponse = await fetch('/api/auth/me');
      const userData = await userResponse.json();

      if (!userData.success || userData.data.role !== 'EXECUTIVE') {
        router.push('/admin');
        return;
      }

      // Get executive stats
      const statsResponse = await fetch(
        `/api/executives/stats?executiveId=${userData.data.id}`
      );
      const statsData = await statsResponse.json();

      if (statsData.success) {
        setExecutiveData({
          id: userData.data.id,
          name: `${userData.data.firstName} ${userData.data.lastName}`,
          email: userData.data.email,
          stats: statsData.data.stats,
        });
      }
    } catch (error) {
      console.error('Error fetching executive data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleOnboardingSuccess = () => {
    // Refresh stats and switch to branches tab
    fetchExecutiveData();
    setActiveTab('branches');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mx-auto"></div>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!executiveData) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-error-600 dark:text-error-400">Failed to load executive data</p>
          <button
            onClick={() => router.push('/admin')}
            className="mt-4 px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-md hover:bg-primary-700 dark:hover:bg-primary-600"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Header */}
      <ExecutiveHeader
        name={executiveData.name}
        email={executiveData.email}
        onLogout={handleLogout}
      />

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                  : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-600'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('onboard')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'onboard'
                  ? 'border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                  : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-600'
              }`}
            >
              <PlusCircle className="w-5 h-5" />
              <span>Onboard New</span>
            </button>

            <button
              onClick={() => setActiveTab('branches')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'branches'
                  ? 'border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                  : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-600'
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span>My Branches</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <ExecutiveStats
            stats={executiveData.stats}
            executiveId={executiveData.id}
            onRefresh={fetchExecutiveData}
          />
        )}

        {activeTab === 'onboard' && (
          <OnboardingForm
            executiveId={executiveData.id}
            onSuccess={handleOnboardingSuccess}
          />
        )}

        {activeTab === 'branches' && (
          <MyBranches
            executiveId={executiveData.id}
            onRefresh={fetchExecutiveData}
          />
        )}
      </main>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import SubscriptionPlans from '@/components/subscription/SubscriptionPlans';
import CurrentSubscription from '@/components/subscription/CurrentSubscription';
import BillingHistory from '@/components/subscription/BillingHistory';
import PaymentMethodManager from '@/components/subscription/PaymentMethodManager';

export default function SubscriptionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'billing' | 'payment'>('overview');
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchSubscription();
  }, [user, router]);

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/subscriptions');
      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscriptions?.[0] || null);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading != null) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading subscription...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: 'dashboard' },
    { id: 'plans', name: 'Plans', icon: 'grid' },
    { id: 'billing', name: 'Billing History', icon: 'document' },
    { id: 'payment', name: 'Payment Methods', icon: 'credit-card' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
        <p className="mt-1 text-gray-600">
          Manage your subscription plan, billing, and payment methods
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <CurrentSubscription
              subscription={subscription}
              onUpdate={fetchSubscription}
            />
          )}
          {activeTab === 'plans' && (
            <SubscriptionPlans
              currentSubscription={subscription}
              onSubscribe={fetchSubscription}
            />
          )}
          {activeTab === 'billing' && (
            <BillingHistory subscription={subscription} />
          )}
          {activeTab === 'payment' && (
            <PaymentMethodManager subscription={subscription} />
          )}
        </div>
      </div>
    </div>
  );
}

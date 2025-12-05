'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SubscriptionPlansProps {
  currentSubscription: any;
  onSubscribe: () => void;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: 'MONTHLY' | 'YEARLY';
  features: {
    maxBranches: number;
    customDomain: boolean;
    analytics: boolean;
    qrCodes: boolean;
    leadCapture: boolean;
    prioritySupport?: boolean;
  };
}

export default function SubscriptionPlans({ currentSubscription, onSubscribe }: SubscriptionPlansProps) {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [actionType, setActionType] = useState<'upgrade' | 'downgrade' | 'subscribe'>('subscribe');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/subscription-plans');
      if (response.ok) {
        const data = await response.json();
        setPlans(data.plans || []);
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPlanPrice = () => {
    return currentSubscription?.plan?.price || 0;
  };

  const determineActionType = (plan: Plan): 'upgrade' | 'downgrade' | 'subscribe' => {
    if (!currentSubscription) return 'subscribe';
    const currentPrice = getCurrentPlanPrice();
    if (plan.price > currentPrice) return 'upgrade';
    if (plan.price < currentPrice) return 'downgrade';
    return 'subscribe';
  };

  const handlePlanSelection = (plan: Plan) => {
    const action = determineActionType(plan);
    setSelectedPlan(plan);
    setActionType(action);
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedPlan) return;

    setProcessingPlanId(selectedPlan.id);
    setShowConfirmModal(false);

    try {
      if (actionType === 'upgrade' || actionType === 'downgrade') {
        // Handle upgrade/downgrade
        const response = await fetch(`/api/subscriptions/${currentSubscription.id}/change-plan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newPlanId: selectedPlan.id }),
        });

        if (response.ok) {
          const data = await response.json();
          alert(`Successfully ${actionType}d to ${selectedPlan.name}!`);
          onSubscribe();
        } else {
          const error = await response.json();
          alert(error.error || `Failed to ${actionType} plan`);
        }
      } else {
        // Handle new subscription - redirect to payment
        router.push(`/dashboard/subscription/checkout?planId=${selectedPlan.id}`);
      }
    } catch (error) {
      console.error(`Error ${actionType}ing plan:`, error);
      alert(`Failed to ${actionType} plan. Please try again.`);
    } finally {
      setProcessingPlanId(null);
    }
  };

  if (loading != null) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  const isCurrentPlan = (planId: string) => {
    return currentSubscription?.plan?.id === planId;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
        <p className="mt-2 text-gray-600">
          Select the perfect plan for your business needs
        </p>
      </div>

      {/* Plan Comparison Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feature
                </th>
                {plans.map((plan) => (
                  <th key={plan.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Price
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-2xl font-bold text-gray-900">₹{plan.price}</div>
                    <div className="text-xs text-gray-500">
                      per {plan.duration === 'MONTHLY' ? 'month' : 'year'}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Branches
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                    {plan.features.maxBranches}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Custom Domain
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-center">
                    {plan.features.customDomain ? (
                      <svg className="h-5 w-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Analytics Dashboard
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-center">
                    {plan.features.analytics ? (
                      <svg className="h-5 w-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  QR Code Generation
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-center">
                    {plan.features.qrCodes ? (
                      <svg className="h-5 w-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Lead Capture Forms
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-center">
                    {plan.features.leadCapture ? (
                      <svg className="h-5 w-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Priority Support
                </td>
                {plans.map((plan) => (
                  <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-center">
                    {plan.features.prioritySupport ? (
                      <svg className="h-5 w-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const action = determineActionType(plan);
          const isCurrent = isCurrentPlan(plan.id);
          const isProcessing = processingPlanId === plan.id;

          return (
            <div
              key={plan.id}
              className={`relative bg-white border-2 rounded-lg p-6 ${
                isCurrent ? 'border-blue-500 shadow-lg' : 'border-gray-200'
              }`}
            >
              {isCurrent && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs font-medium rounded-bl-lg rounded-tr-lg">
                  Current Plan
                </div>
              )}

              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
                  <span className="text-gray-500 ml-2">
                    / {plan.duration === 'MONTHLY' ? 'month' : 'year'}
                  </span>
                </div>
              </div>

              <ul className="mt-6 space-y-3">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">
                    {plan.features.maxBranches} {plan.features.maxBranches === 1 ? 'Branch' : 'Branches'}
                  </span>
                </li>
                {plan.features.customDomain && (
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">Custom Domain</span>
                  </li>
                )}
                {plan.features.analytics && (
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">Analytics Dashboard</span>
                  </li>
                )}
                {plan.features.qrCodes && (
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">QR Code Generation</span>
                  </li>
                )}
                {plan.features.leadCapture && (
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">Lead Capture Forms</span>
                  </li>
                )}
                {plan.features.prioritySupport && (
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-700">Priority Support</span>
                  </li>
                )}
              </ul>

              <button
                onClick={() => handlePlanSelection(plan)}
                disabled={isCurrent || isProcessing}
                className={`mt-6 w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  isCurrent
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : action === 'upgrade'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : action === 'downgrade'
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } disabled:opacity-50`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : isCurrent ? (
                  'Current Plan'
                ) : action === 'upgrade' ? (
                  'Upgrade'
                ) : action === 'downgrade' ? (
                  'Downgrade'
                ) : (
                  'Subscribe'
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedPlan && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm {actionType === 'upgrade' ? 'Upgrade' : actionType === 'downgrade' ? 'Downgrade' : 'Subscription'}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {actionType === 'upgrade' && (
                <>
                  You are upgrading to <strong>{selectedPlan.name}</strong> for ₹{selectedPlan.price}/{selectedPlan.duration === 'MONTHLY' ? 'month' : 'year'}.
                  The price difference will be prorated and charged immediately.
                </>
              )}
              {actionType === 'downgrade' && (
                <>
                  You are downgrading to <strong>{selectedPlan.name}</strong> for ₹{selectedPlan.price}/{selectedPlan.duration === 'MONTHLY' ? 'month' : 'year'}.
                  The change will take effect at the end of your current billing period.
                </>
              )}
              {actionType === 'subscribe' && (
                <>
                  You are subscribing to <strong>{selectedPlan.name}</strong> for ₹{selectedPlan.price}/{selectedPlan.duration === 'MONTHLY' ? 'month' : 'year'}.
                  You will be redirected to the payment page.
                </>
              )}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                  actionType === 'upgrade'
                    ? 'bg-green-600 hover:bg-green-700'
                    : actionType === 'downgrade'
                    ? 'bg-yellow-600 hover:bg-yellow-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Confirm {actionType === 'upgrade' ? 'Upgrade' : actionType === 'downgrade' ? 'Downgrade' : 'Subscription'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

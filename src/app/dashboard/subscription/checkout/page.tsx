'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<'STRIPE' | 'RAZORPAY'>('STRIPE');

  const planId = searchParams.get('planId');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (!planId) {
      router.push('/dashboard/subscription');
      return;
    }

    fetchPlan();
  }, [user, planId, router]);

  const fetchPlan = async () => {
    try {
      const response = await fetch(`/api/subscription-plans/${planId}`);
      if (response.ok) {
        const data = await response.json();
        setPlan(data.plan);
      } else {
        alert('Plan not found');
        router.push('/dashboard/subscription');
      }
    } catch (error) {
      console.error('Failed to fetch plan:', error);
      alert('Failed to load plan details');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!plan || !user?.brandId) return;

    setProcessing(true);
    try {
      if (selectedGateway === 'STRIPE') {
        // Create Stripe payment intent
        const response = await fetch('/api/payments/stripe/create-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planId: plan.id,
            brandId: user.brandId,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Redirect to Stripe checkout or handle client secret
          alert('Stripe payment initiated. In production, this would redirect to Stripe checkout.');
          router.push('/dashboard/subscription');
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to initiate payment');
        }
      } else {
        // Create Razorpay order
        const response = await fetch('/api/payments/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planId: plan.id,
            brandId: user.brandId,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Initialize Razorpay checkout
          alert('Razorpay payment initiated. In production, this would open Razorpay checkout.');
          router.push('/dashboard/subscription');
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to initiate payment');
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to process checkout');
    } finally {
      setProcessing(false);
    }
  };

  if (loading != null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Subscription</h1>
          <p className="mt-2 text-gray-600">Review your plan and payment details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Plan Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plan Details Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Plan Details</h2>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-500">
                      {plan.duration === 'MONTHLY' ? 'Monthly' : 'Yearly'} Subscription
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">₹{plan.price}</div>
                    <div className="text-sm text-gray-500">
                      per {plan.duration === 'MONTHLY' ? 'month' : 'year'}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">Included Features:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-700">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {plan.features.maxBranches} {plan.features.maxBranches === 1 ? 'Branch' : 'Branches'}
                    </li>
                    {plan.features.customDomain && (
                      <li className="flex items-center text-sm text-gray-700">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Custom Domain Support
                      </li>
                    )}
                    {plan.features.analytics && (
                      <li className="flex items-center text-sm text-gray-700">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Analytics Dashboard
                      </li>
                    )}
                    {plan.features.qrCodes && (
                      <li className="flex items-center text-sm text-gray-700">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        QR Code Generation
                      </li>
                    )}
                    {plan.features.leadCapture && (
                      <li className="flex items-center text-sm text-gray-700">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Lead Capture Forms
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="gateway"
                    value="STRIPE"
                    checked={selectedGateway === 'STRIPE'}
                    onChange={(e) => setSelectedGateway(e.target.value as 'STRIPE')}
                    className="h-4 w-4 text-blue-600"
                  />
                  <div className="ml-3 flex-1">
                    <div className="font-medium text-gray-900">Stripe</div>
                    <div className="text-sm text-gray-500">Credit/Debit Card, International Payments</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">STRIPE</div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="gateway"
                    value="RAZORPAY"
                    checked={selectedGateway === 'RAZORPAY'}
                    onChange={(e) => setSelectedGateway(e.target.value as 'RAZORPAY')}
                    className="h-4 w-4 text-blue-600"
                  />
                  <div className="ml-3 flex-1">
                    <div className="font-medium text-gray-900">Razorpay</div>
                    <div className="text-sm text-gray-500">UPI, Cards, Net Banking, Wallets</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">RAZORPAY</div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-medium text-gray-900">{plan.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Billing</span>
                  <span className="font-medium text-gray-900">
                    {plan.duration === 'MONTHLY' ? 'Monthly' : 'Yearly'}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-base font-medium text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">₹{plan.price}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Billed {plan.duration === 'MONTHLY' ? 'monthly' : 'annually'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={processing}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {processing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Proceed to Payment'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By proceeding, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

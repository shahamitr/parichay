'use client';

import { useState } from 'react';
import { formatDate } from '@/lib/utils';

interface CurrentSubscriptionProps {
  subscription: any;
  onUpdate: () => void;
}

export default function CurrentSubscription({ subscription, onUpdate }: CurrentSubscriptionProps) {
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  if (!subscription) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No active subscription</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by choosing a subscription plan.
        </p>
      </div>
    );
  }

  const features = subscription.plan?.features || {};
  const isActive = subscription.status === 'ACTIVE';
  const isExpiringSoon = new Date(subscription.endDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const handleToggleAutoRenew = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/subscriptions/${subscription.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoRenew: !subscription.autoRenew }),
      });

      if (response.ok) {
        onUpdate();
      } else {
        alert('Failed to update auto-renewal setting');
      }
    } catch (error) {
      console.error('Error updating auto-renewal:', error);
      alert('Failed to update auto-renewal setting');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/subscriptions/${subscription.id}/cancel`, {
        method: 'POST',
      });

      if (response.ok) {
        setShowCancelModal(false);
        onUpdate();
        alert('Subscription cancelled successfully');
      } else {
        alert('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      {isExpiringSoon && isActive && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Your subscription expires on {formatDate(subscription.endDate)}.
                {!subscription.autoRenew && ' Enable auto-renewal to avoid service interruption.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Current Plan Card */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{subscription.plan?.name}</h2>
            <p className="mt-1 text-blue-100">
              {subscription.plan?.duration === 'MONTHLY' ? 'Monthly' : 'Yearly'} Plan
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              ₹{subscription.plan?.price}
            </div>
            <div className="text-sm text-blue-100">
              per {subscription.plan?.duration === 'MONTHLY' ? 'month' : 'year'}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {subscription.status}
            </span>
          </div>
          <div className="text-sm">
            <div>Started: {formatDate(subscription.startDate)}</div>
            <div>Renews: {formatDate(subscription.endDate)}</div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Plan Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-700">
              Up to {features.maxBranches} {features.maxBranches === 1 ? 'branch' : 'branches'}
            </span>
          </div>
          <div className="flex items-center">
            <svg className={`h-5 w-5 mr-2 ${features.customDomain ? 'text-green-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className={features.customDomain ? 'text-gray-700' : 'text-gray-400'}>
              Custom Domain
            </span>
          </div>
          <div className="flex items-center">
            <svg className={`h-5 w-5 mr-2 ${features.analytics ? 'text-green-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className={features.analytics ? 'text-gray-700' : 'text-gray-400'}>
              Analytics Dashboard
            </span>
          </div>
          <div className="flex items-center">
            <svg className={`h-5 w-5 mr-2 ${features.qrCodes ? 'text-green-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className={features.qrCodes ? 'text-gray-700' : 'text-gray-400'}>
              QR Code Generation
            </span>
          </div>
          <div className="flex items-center">
            <svg className={`h-5 w-5 mr-2 ${features.leadCapture ? 'text-green-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className={features.leadCapture ? 'text-gray-700' : 'text-gray-400'}>
              Lead Capture Forms
            </span>
          </div>
          {features.prioritySupport && (
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">Priority Support</span>
            </div>
          )}
        </div>
      </div>

      {/* License Key */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">License Key</h3>
        <div className="flex items-center justify-between bg-white border border-gray-300 rounded px-4 py-3">
          <code className="text-sm font-mono text-gray-700">{subscription.licenseKey}</code>
          <button
            onClick={() => navigator.clipboard.writeText(subscription.licenseKey)}
            className="ml-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription Settings</h3>

        <div className="space-y-4">
          {/* Auto-renewal toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Auto-renewal</h4>
              <p className="text-sm text-gray-500">
                Automatically renew your subscription before it expires
              </p>
            </div>
            <button
              onClick={handleToggleAutoRenew}
              disabled={loading}
              className={`${
                subscription.autoRenew ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50`}
            >
              <span
                className={`${
                  subscription.autoRenew ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none in h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              />
            </button>
          </div>

          {/* Cancel subscription */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowCancelModal(true)}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Cancel Subscription
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cancel Subscription</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to cancel your subscription? You will lose access to all premium features at the end of your billing period.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Cancelling...' : 'Cancel Subscription'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

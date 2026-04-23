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
        <div className="mx-auto h-12 w-12 text-neutral-400 dark:text-neutral-600">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">No active subscription</h3>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
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
        <div className="bg-warning-50 dark:bg-warning-900/20 border-l-4 border-warning-400 dark:border-warning-600 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-warning-400 dark:text-warning-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-warning-700 dark:text-warning-300">
                Your subscription expires on {formatDate(subscription.endDate)}.
                {!subscription.autoRenew && ' Enable auto-renewal to avoid service interruption.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Current Plan Card */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 rounded-lg shadow-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{subscription.plan?.name}</h2>
            <p className="mt-1 text-primary-100 dark:text-primary-200">
              {subscription.plan?.duration === 'MONTHLY' ? 'Monthly' : 'Yearly'} Plan
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              ₹{subscription.plan?.price}
            </div>
            <div className="text-sm text-primary-100 dark:text-primary-200">
              per {subscription.plan?.duration === 'MONTHLY' ? 'month' : 'year'}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isActive ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300' : 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-300'
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
      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">Plan Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-success-500 dark:text-success-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-neutral-700 dark:text-neutral-300">
              Up to {features.maxBranches} {features.maxBranches === 1 ? 'branch' : 'branches'}
            </span>
          </div>
          <div className="flex items-center">
            <svg className={`h-5 w-5 mr-2 ${features.customDomain ? 'text-success-500 dark:text-success-400' : 'text-neutral-300 dark:text-neutral-600'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className={features.customDomain ? 'text-neutral-700 dark:text-neutral-300' : 'text-neutral-400 dark:text-neutral-500'}>
              Custom Domain
            </span>
          </div>
          <div className="flex items-center">
            <svg className={`h-5 w-5 mr-2 ${features.analytics ? 'text-success-500 dark:text-success-400' : 'text-neutral-300 dark:text-neutral-600'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className={features.analytics ? 'text-neutral-700 dark:text-neutral-300' : 'text-neutral-400 dark:text-neutral-500'}>
              Analytics Dashboard
            </span>
          </div>
          <div className="flex items-center">
            <svg className={`h-5 w-5 mr-2 ${features.qrCodes ? 'text-success-500 dark:text-success-400' : 'text-neutral-300 dark:text-neutral-600'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className={features.qrCodes ? 'text-neutral-700 dark:text-neutral-300' : 'text-neutral-400 dark:text-neutral-500'}>
              QR Code Generation
            </span>
          </div>
          <div className="flex items-center">
            <svg className={`h-5 w-5 mr-2 ${features.leadCapture ? 'text-success-500 dark:text-success-400' : 'text-neutral-300 dark:text-neutral-600'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className={features.leadCapture ? 'text-neutral-700 dark:text-neutral-300' : 'text-neutral-400 dark:text-neutral-500'}>
              Lead Capture Forms
            </span>
          </div>
          {features.prioritySupport && (
            <div className="flex items-center">
              <svg className="h-5 w-5 text-success-500 dark:text-success-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-neutral-700 dark:text-neutral-300">Priority Support</span>
            </div>
          )}
        </div>
      </div>

      {/* License Key */}
      <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">License Key</h3>
        <div className="flex items-center justify-between bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded px-4 py-3">
          <code className="text-sm font-mono text-neutral-700 dark:text-neutral-300">{subscription.licenseKey}</code>
          <button
            onClick={() => navigator.clipboard.writeText(subscription.licenseKey)}
            className="ml-4 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">Subscription Settings</h3>

        <div className="space-y-4">
          {/* Auto-renewal toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Auto-renewal</h4>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Automatically renew your subscription before it expires
              </p>
            </div>
            <button
              onClick={handleToggleAutoRenew}
              disabled={loading}
              className={`${
                subscription.autoRenew ? 'bg-primary-600 dark:bg-primary-700' : 'bg-neutral-200 dark:bg-neutral-700'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-neutral-800 disabled:opacity-50`}
            >
              <span
                className={`${
                  subscription.autoRenew ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none in h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              />
            </button>
          </div>

          {/* Cancel subscription */}
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => setShowCancelModal(true)}
              className="text-error-600 dark:text-error-400 hover:text-error-700 dark:hover:text-error-300 text-sm font-medium"
            >
              Cancel Subscription
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-neutral-500 dark:bg-neutral-900 bg-opacity-75 dark:bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">Cancel Subscription</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              Are you sure you want to cancel your subscription? You will lose access to all premium features at the end of your billing period.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={loading}
                className="px-4 py-2 bg-error-600 dark:bg-error-700 text-white rounded-md text-sm font-medium hover:bg-error-700 dark:hover:bg-error-800 disabled:opacity-50"
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

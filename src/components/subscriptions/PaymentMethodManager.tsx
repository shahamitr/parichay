'use client';

import { useEffect, useState } from 'react';

interface PaymentMethodManagerProps {
  subscription: any;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  gateway: 'STRIPE' | 'RAZORPAY';
}

export default function PaymentMethodManager({ subscription }: PaymentMethodManagerProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (subscription != null) {
      fetchPaymentMethods();
    } else {
      setLoading(false);
    }
  }, [subscription]);

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch(`/api/subscriptions/${subscription.id}/payment-methods`);
      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data.paymentMethods || []);
      }
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (methodId: string) => {
    setProcessingId(methodId);
    try {
      const response = await fetch(`/api/subscriptions/${subscription.id}/payment-methods/${methodId}/set-default`, {
        method: 'POST',
      });

      if (response.ok) {
        await fetchPaymentMethods();
      } else {
        alert('Failed to set default payment method');
      }
    } catch (error) {
      console.error('Error setting default payment method:', error);
      alert('Failed to set default payment method');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRemove = async (methodId: string) => {
    if (!confirm('Are you sure you want to remove this payment method?')) {
      return;
    }

    setProcessingId(methodId);
    try {
      const response = await fetch(`/api/subscriptions/${subscription.id}/payment-methods/${methodId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchPaymentMethods();
      } else {
        alert('Failed to remove payment method');
      }
    } catch (error) {
      console.error('Error removing payment method:', error);
      alert('Failed to remove payment method');
    } finally {
      setProcessingId(null);
    }
  };

  const getCardBrandIcon = (brand?: string) => {
    const brandLower = brand?.toLowerCase();
    if (brandLower === 'visa') {
      return (
        <div className="w-10 h-6 bg-primary-600 dark:bg-primary-700 rounded flex items-center justify-center text-white text-xs font-bold">
          VISA
        </div>
      );
    }
    if (brandLower === 'mastercard') {
      return (
        <div className="w-10 h-6 bg-error-600 dark:bg-error-700 rounded flex items-center justify-center text-white text-xs font-bold">
          MC
        </div>
      );
    }
    if (brandLower === 'amex') {
      return (
        <div className="w-10 h-6 bg-primary-400 dark:bg-primary-500 rounded flex items-center justify-center text-white text-xs font-bold">
          AMEX
        </div>
      );
    }
    return (
      <div className="w-10 h-6 bg-neutral-400 dark:bg-neutral-600 rounded flex items-center justify-center">
        <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
        </svg>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400 mx-auto"></div>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">Loading payment methods...</p>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-neutral-400 dark:text-neutral-600">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">No payment methods</h3>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Subscribe to a plan to manage payment methods.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Payment Methods</h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Manage your payment methods for subscription billing
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 dark:bg-primary-700 hover:bg-primary-700 dark:hover:bg-primary-800"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Payment Method
        </button>
      </div>

      {/* Payment Methods List */}
      {paymentMethods.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg">
          <div className="mx-auto h-12 w-12 text-neutral-400 dark:text-neutral-600">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">No payment methods</h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Add a payment method to enable automatic billing.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`relative bg-white dark:bg-neutral-800 border-2 rounded-lg p-6 ${
                method.isDefault ? 'border-primary-500 dark:border-primary-400' : 'border-neutral-200 dark:border-neutral-700'
              }`}
            >
              {method.isDefault && (
                <div className="absolute top-0 right-0 bg-primary-500 dark:bg-primary-600 text-white px-3 py-1 text-xs font-medium rounded-bl-lg rounded-tr-lg">
                  Default
                </div>
              )}

              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getCardBrandIcon(method.brand)}
                  <div>
                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {method.type === 'card' && method.brand && (
                        <span className="capitalize">{method.brand}</span>
                      )}
                      {method.type === 'upi' && 'UPI'}
                      {method.type === 'netbanking' && 'Net Banking'}
                    </div>
                    {method.last4 && (
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        •••• {method.last4}
                      </div>
                    )}
                    {method.expiryMonth && method.expiryYear && (
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                      </div>
                    )}
                    <div className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                      via {method.gateway}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                {!method.isDefault && (
                  <button
                    onClick={() => handleSetDefault(method.id)}
                    disabled={processingId === method.id}
                    className="flex-1 px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50"
                  >
                    {processingId === method.id ? 'Setting...' : 'Set as Default'}
                  </button>
                )}
                <button
                  onClick={() => handleRemove(method.id)}
                  disabled={processingId === method.id || method.isDefault}
                  className="flex-1 px-3 py-2 border border-error-300 dark:border-error-600 rounded-md text-sm font-medium text-error-700 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 disabled:opacity-50"
                >
                  {processingId === method.id ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-400 dark:border-primary-600 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-primary-400 dark:text-primary-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-primary-700 dark:text-primary-300">
              Your default payment method will be used for automatic subscription renewals.
              All payment information is securely stored by our payment providers (Stripe/Razorpay).
            </p>
          </div>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-neutral-500 dark:bg-neutral-900 bg-opacity-75 dark:bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">Add Payment Method</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              To add a new payment method, you'll need to make a payment or update your subscription.
              Payment methods are automatically saved during the checkout process.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  window.location.href = '/admin/subscription?tab=plans';
                }}
                className="w-full px-4 py-2 bg-primary-600 dark:bg-primary-700 text-white rounded-md text-sm font-medium hover:bg-primary-700 dark:hover:bg-primary-800"
              >
                View Subscription Plans
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
              >
                Cancel
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Note: Payment methods are managed through our secure payment gateways (Stripe and Razorpay).
                We do not store your card details on our servers.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

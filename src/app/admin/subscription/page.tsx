'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRequestSigning } from '@/hooks/useRequestSigning';
import {
  CreditCard,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Star,
  Loader2,
} from 'lucide-react';

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

interface Subscription {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  licenseKey: string;
  isTrial: boolean;
  trialEndsAt?: string;
  plan: Plan;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: string;
  paidAt?: string;
  createdAt: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function SubscriptionPage() {
  const { user } = useAuth();
  const { signedFetch } = useRequestSigning();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
    loadRazorpayScript();
  }, []);

  const loadRazorpayScript = () => {
    if (document.getElementById('razorpay-script')) return;
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [plansRes, subsRes] = await Promise.all([
        fetch('/api/subscription-plans', { credentials: 'include' }),
        fetch('/api/subscriptions', { credentials: 'include' }),
      ]);

      if (plansRes.ok) {
        const data = await plansRes.json();
        setPlans(data.plans || []);
      }

      if (subsRes.ok) {
        const data = await subsRes.json();
        const subs = data.subscriptions || [];
        if (subs.length > 0) {
          setSubscription(subs[0]);
          // Fetch invoices for the subscription
          const invRes = await fetch(`/api/subscriptions/${subs[0].id}/invoices`, { credentials: 'include' });
          if (invRes.ok) {
            const invData = await invRes.json();
            setInvoices(invData.invoices || []);
          }
        }
      }
    } catch (err) {
      setError('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: Plan) => {
    if (!user) return;
    setProcessingPlan(plan.id);
    setError('');

    try {
      // 1. Create Razorpay order via signed request
      const orderRes = await signedFetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        body: { planId: plan.id, brandId: user.brandId || '' },
      });

      if (!orderRes.ok) {
        const data = await orderRes.json();
        throw new Error(data.error || 'Failed to create order');
      }

      const orderData = await orderRes.json();

      // 2. Open Razorpay checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount * 100,
        currency: orderData.currency,
        name: 'Parichay',
        description: `${plan.name} - ${plan.duration} Plan`,
        order_id: orderData.orderId,
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          // 3. Verify payment on server
          await verifyPayment(response);
        },
        prefill: {
          name: user.firstName + ' ' + user.lastName,
          email: user.email,
        },
        theme: { color: '#6366f1' },
        modal: {
          ondismiss: () => setProcessingPlan(null),
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      setError(err.message || 'Payment failed');
      setProcessingPlan(null);
    }
  };

  const verifyPayment = async (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    try {
      const verifyRes = await fetch('/api/payments/razorpay/verify', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: response.razorpay_order_id,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        }),
      });

      const data = await verifyRes.json();
      if (data.success) {
        // Refresh data
        await loadData();
        setProcessingPlan(null);
      } else {
        setError(data.error || 'Payment verification failed');
        setProcessingPlan(null);
      }
    } catch {
      setError('Payment verification failed. Please contact support.');
      setProcessingPlan(null);
    }
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    window.open(`/api/invoices/${invoiceId}/download`, '_blank');
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const isActive = subscription?.status === 'ACTIVE';
  const isTrial = subscription?.isTrial;
  const daysLeft = subscription
    ? Math.max(0, Math.ceil((new Date(subscription.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscription & Billing</h1>
        <p className="text-gray-500 mt-1">Manage your plan, view invoices, and download receipts.</p>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Current Subscription Status */}
      {subscription && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-bold text-gray-900">{subscription.plan.name}</h2>
                {isActive && (
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
                    {isTrial ? 'Trial' : 'Active'}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {isTrial
                  ? `Free trial ends in ${daysLeft} days`
                  : `Renews on ${new Date(subscription.endDate).toLocaleDateString()}`}
              </p>
              {subscription.licenseKey && (
                <p className="text-xs text-gray-400 mt-1 font-mono">
                  License: {subscription.licenseKey}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                ₹{subscription.plan.price.toLocaleString()}
                <span className="text-sm font-normal text-gray-400">/{subscription.plan.duration === 'MONTHLY' ? 'mo' : 'yr'}</span>
              </p>
              {daysLeft <= 7 && daysLeft > 0 && (
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Expires soon
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Plans */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          {subscription ? 'Change Plan' : 'Choose a Plan'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map((plan) => {
            const isCurrentPlan = subscription?.plan.id === plan.id;
            const features = plan.features;

            return (
              <div
                key={plan.id}
                className={`relative bg-white border rounded-2xl p-6 transition-all ${
                  isCurrentPlan ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-4 px-3 py-0.5 bg-indigo-600 text-white text-xs font-semibold rounded-full">
                    Current Plan
                  </div>
                )}

                <h3 className="text-lg font-bold text-gray-900 mt-1">{plan.name}</h3>
                <p className="text-3xl font-extrabold text-gray-900 mt-3">
                  ₹{plan.price.toLocaleString()}
                  <span className="text-sm font-normal text-gray-400">/{plan.duration === 'MONTHLY' ? 'mo' : 'yr'}</span>
                </p>

                <ul className="mt-5 space-y-2.5">
                  <Feature text={`${features.maxBranches} Branch${features.maxBranches > 1 ? 'es' : ''}`} />
                  {features.analytics && <Feature text="Analytics Dashboard" />}
                  {features.qrCodes && <Feature text="QR Code Generation" />}
                  {features.leadCapture && <Feature text="Lead Capture Forms" />}
                  {features.customDomain && <Feature text="Custom Domain" />}
                  {features.prioritySupport && <Feature text="Priority Support" highlight />}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={isCurrentPlan || processingPlan === plan.id}
                  className={`w-full mt-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    isCurrentPlan
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                  }`}
                >
                  {processingPlan === plan.id ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                  ) : isCurrentPlan ? (
                    'Current Plan'
                  ) : subscription ? (
                    <><ArrowRight className="w-4 h-4" /> Switch to this plan</>
                  ) : (
                    <><Zap className="w-4 h-4" /> Subscribe Now</>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoices */}
      {invoices.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Invoices</h2>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Invoice #</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">{inv.invoiceNumber}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{new Date(inv.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">₹{inv.amount.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                        inv.status === 'PAID' ? 'bg-emerald-50 text-emerald-700' :
                        inv.status === 'OVERDUE' ? 'bg-red-50 text-red-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDownloadInvoice(inv.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Feature({ text, highlight }: { text: string; highlight?: boolean }) {
  return (
    <li className="flex items-center gap-2 text-sm text-gray-600">
      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${highlight ? 'text-indigo-500' : 'text-emerald-500'}`} />
      {text}
    </li>
  );
}

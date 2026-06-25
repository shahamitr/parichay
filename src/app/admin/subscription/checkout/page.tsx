'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Check, 
  CreditCard, 
  Shield, 
  Loader2, 
  ShieldCheck, 
  Zap, 
  ChevronRight,
  Activity,
  AlertCircle
} from 'lucide-react';
import { SectionHeader, Card, Button } from '@/components/ui';
import { loadRazorpayScript } from '@/lib/payment-utils';
import { toast } from 'react-hot-toast';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: 'MONTHLY' | 'YEARLY';
  features: {
    maxBranches?: number;
    customDomain?: boolean;
    analytics?: boolean;
    qrCodes?: boolean;
    leadCapture?: boolean;
    prioritySupport?: boolean;
  };
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const planId = searchParams.get('planId');
  const queryBrandId = searchParams.get('brandId');

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(queryBrandId);
  const [gateway, setGateway] = useState<'stripe' | 'razorpay'>('razorpay');
  const [brands, setBrands] = useState<any[]>([]);

  // Fetch plan details and brand options
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // Fetch brands of user
        const brandsRes = await fetch('/api/brands');
        if (brandsRes.ok) {
          const brandsData = await brandsRes.json();
          const userBrands = brandsData.brands || [];
          setBrands(userBrands);
          
          if (!selectedBrandId && userBrands.length > 0) {
            setSelectedBrandId(userBrands[0].id);
          }
        }

        // Fetch plan detail
        if (planId) {
          const planRes = await fetch(`/api/subscription-plans/${planId}`);
          if (planRes.ok) {
            const planData = await planRes.json();
            setPlan(planData.plan);
          } else {
            toast.error('Failed to load subscription plan information.');
          }
        } else {
          toast.error('No plan ID was provided. Please select a plan first.');
        }
      } catch (error) {
        console.error('Error loading checkout parameters:', error);
        toast.error('Failed to initialize subscription checkout parameters.');
      } finally {
        setLoading(false);
      }
    }

    if (planId) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [planId, selectedBrandId]);

  const handleStripeCheckout = () => {
    toast.error('Stripe authorization node is not active in this region. Please use the Razorpay India Regional Routing protocol.');
  };

  const handleRazorpayCheckout = async () => {
    if (!plan || !selectedBrandId) {
      toast.error('Target plan or associated brand context is missing.');
      return;
    }

    try {
      setProcessing(true);

      // 1. Dynamic load of Razorpay Checkout script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to download Razorpay SDK. Please check your connectivity.');
        setProcessing(false);
        return;
      }

      // 2. Request backend order creation
      const orderRes = await fetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          brandId: selectedBrandId,
        }),
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json();
        throw new Error(errData.error || 'Failed to initialize payment gateway.');
      }

      const orderData = await orderRes.json();
      const { orderId, amount, currency, keyId } = orderData;

      // 3. Mount Razorpay Checkout options
      const options = {
        key: keyId,
        amount: amount, // returns in paise already
        currency: currency,
        name: 'Parichay Portal',
        description: `Upgrading to ${plan.name}`,
        image: '/logo.png', // Fallback or branding image
        order_id: orderId,
        handler: async function (response: any) {
          try {
            setProcessing(true);
            
            // 4. Verify transaction signature securely on the backend
            const verifyRes = await fetch('/api/payments/razorpay/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });

            if (verifyRes.ok) {
              toast.success('Capital clearing completed! Plan active.');
              router.push('/admin/subscription?tab=overview');
            } else {
              const verifyErr = await verifyRes.json();
              throw new Error(verifyErr.error || 'Cryptographic validation failed.');
            }
          } catch (verifyErr: any) {
            toast.error(verifyErr.message || 'Signature check failed. Support ticket created.');
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: `${user?.firstName || ''} ${user?.lastName || ''}`,
          email: user?.email || '',
          contact: user?.phone || '',
        },
        notes: {
          planId: plan.id,
          brandId: selectedBrandId,
          userId: user?.id,
        },
        theme: {
          color: '#6366f1', // Rich modern Indigo primary theme color
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast.error(`Transaction aborted: ${response.error.description}`);
      });
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || 'An error occurred during payment initiation.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCheckoutInit = () => {
    if (gateway === 'razorpay') {
      handleRazorpayCheckout();
    } else {
      handleStripeCheckout();
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-8 animate-pulse bg-[#141414] min-h-screen text-white">
        <div className="h-12 bg-neutral-900 border border-neutral-800 rounded-2xl w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-neutral-900 border border-neutral-800 rounded-[24px]"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!planId || !plan) {
    return (
      <div className="p-8 space-y-6 text-white min-h-screen bg-[#141414] flex flex-col justify-center items-center">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4 animate-bounce" />
        <h3 className="text-lg font-black uppercase tracking-widest">Initialization Vector Aborted</h3>
        <p className="text-neutral-500 text-sm max-w-md text-center uppercase tracking-wider font-bold">
          No valid plan reference was discovered. Please navigate back to the subscriptions portal.
        </p>
        <button 
          onClick={() => router.push('/admin/subscription')}
          className="mt-6 px-8 py-3 bg-neutral-900 border border-neutral-800 hover:border-indigo-500 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white rounded-xl transition-all"
        >
          Return to Portal
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10 bg-[#141414] min-h-screen text-white">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <button 
            onClick={() => router.push('/admin/subscription')}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Upgrade Matrix
          </button>
          <SectionHeader
            title="Subscription Settlement"
            description="Secure plan elevation and system resource allocation."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Identity Allocation Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl -mr-24 -mt-24" />
            
            <SectionHeader
              title="Identity Allocation"
              description="Reviewing selected neural plan parameters."
            />

            <div className="mt-12 space-y-8">
              <div className="flex items-center justify-between p-8 bg-neutral-950 border border-neutral-800/50 rounded-[24px]">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center text-indigo-500">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-white">{plan.name}</h3>
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                      {plan.duration === 'YEARLY' ? 'Annual Node Allocation' : 'Monthly Node Allocation'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-[12px] font-black text-indigo-500 tracking-widest uppercase">
                    ₹{plan.price.toLocaleString()} / {plan.duration === 'YEARLY' ? 'YR' : 'MO'}
                  </span>
                </div>
              </div>

              {/* Brands Context Selector */}
              {brands.length > 1 && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Target Tenant Brand</label>
                  <select 
                    value={selectedBrandId || ''} 
                    onChange={(e) => setSelectedBrandId(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-xs font-black uppercase tracking-wider text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Plan Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-neutral-950/50 border border-neutral-800/50 rounded-xl">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">
                    {plan.features.maxBranches || 0} Digital Business Cards
                  </span>
                </div>
                {plan.features.customDomain && (
                  <div className="flex items-center gap-3 p-4 bg-neutral-950/50 border border-neutral-800/50 rounded-xl">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Primary Domain Mapping</span>
                  </div>
                )}
                {plan.features.analytics && (
                  <div className="flex items-center gap-3 p-4 bg-neutral-950/50 border border-neutral-800/50 rounded-xl">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Analytical Dashboard Suite</span>
                  </div>
                )}
                {plan.features.qrCodes && (
                  <div className="flex items-center gap-3 p-4 bg-neutral-950/50 border border-neutral-800/50 rounded-xl">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Dynamic QR-Generation</span>
                  </div>
                )}
                {plan.features.leadCapture && (
                  <div className="flex items-center gap-3 p-4 bg-neutral-950/50 border border-neutral-800/50 rounded-xl">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Integrated CRM Leads Capture</span>
                  </div>
                )}
                {plan.features.prioritySupport && (
                  <div className="flex items-center gap-3 p-4 bg-neutral-950/50 border border-neutral-800/50 rounded-xl">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Vault SLA Priority Support</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Authorization Vector Gateways Selector */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-10 shadow-2xl">
            <SectionHeader
              title="Authorization Vector"
              description="Select primary capital routing gateway."
            />
            <div className="mt-10 grid gap-4">
              <label 
                onClick={() => setGateway('razorpay')}
                className={`flex items-center justify-between p-6 bg-neutral-950 border rounded-2xl cursor-pointer hover:border-indigo-500/50 transition-all group ${
                  gateway === 'razorpay' ? 'border-indigo-500' : 'border-neutral-800'
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-black uppercase tracking-widest text-white">Razorpay Node</span>
                    <span className="text-[9px] font-bold text-neutral-500 uppercase">India regional routing (UPI, cards, netbanking)</span>
                  </div>
                </div>
                <div className="w-5 h-5 border-2 border-indigo-500 rounded-full flex items-center justify-center">
                  {gateway === 'razorpay' && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />}
                </div>
              </label>

              <label 
                onClick={() => setGateway('stripe')}
                className={`flex items-center justify-between p-6 bg-neutral-950 border rounded-2xl cursor-pointer hover:border-indigo-500/50 transition-all group ${
                  gateway === 'stripe' ? 'border-indigo-500' : 'border-neutral-800'
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center text-neutral-500">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-black uppercase tracking-widest text-white">Stripe Protocol</span>
                    <span className="text-[9px] font-bold text-neutral-500 uppercase">Global settlement routing</span>
                  </div>
                </div>
                <div className="w-5 h-5 border-2 border-neutral-800 rounded-full flex items-center justify-center">
                  {gateway === 'stripe' && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />}
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Summary Ledger */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl sticky top-8">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-8">Summary Ledger</h4>
            <div className="space-y-6">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-neutral-500">Subtotal Yield</span>
                <span className="text-white">₹{plan.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-neutral-500">Tax Matrix</span>
                <span className="text-white">₹0</span>
              </div>
              <div className="pt-6 border-t border-neutral-800 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Final Settlement</span>
                <span className="text-xl font-black text-indigo-500">₹{plan.price.toLocaleString()}</span>
              </div>
              
              <button 
                onClick={handleCheckoutInit}
                disabled={processing || !selectedBrandId}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Clearing Nodes...
                  </>
                ) : (
                  'Authorize Allocation'
                )}
              </button>
              
              {!selectedBrandId && (
                <p className="text-[8px] font-bold text-center uppercase tracking-wider text-rose-500">
                  Please create a Brand before completing authorization.
                </p>
              )}
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
      <div className="p-8 bg-[#141414] min-h-screen text-white flex justify-center items-center">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

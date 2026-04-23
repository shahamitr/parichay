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
  Target
} from 'lucide-react';
import { SectionHeader, Card, Button, StatCard } from '@/components/ui';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="h-12 bg-neutral-900 border border-neutral-800 rounded-2xl w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-neutral-900 border border-neutral-800 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Upgrade Matrix
          </button>
          <SectionHeader
            title="Subscription Checkout"
            description="Authorize plan elevation and resource allocation."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/5 rounded-full blur-3xl -mr-24 -mt-24" />
            
            <SectionHeader
              title="Identity Allocation"
              description="Reviewing selected neural plan parameters."
            />

            <div className="mt-12 space-y-8">
              <div className="flex items-center justify-between p-8 bg-neutral-950 border border-neutral-800 rounded-[24px]">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center text-primary-500">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-white">Neural Pro Plan</h3>
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Enterprise grade node deployment</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-black text-primary-500 tracking-widest">₹2,999 / MO</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  '10 Satellite Nodes',
                  'Pro Analytical Suite',
                  'Vault Encryption',
                  'Primary Domain Mapping',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3 p-4 bg-neutral-950/50 border border-neutral-800/50 rounded-xl">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-10 shadow-2xl">
            <SectionHeader
              title="Authorization Vector"
              description="Select primary capital routing channel."
            />
            <div className="mt-10 grid gap-4">
              <label className="flex items-center justify-between p-6 bg-neutral-950 border border-primary-500/20 rounded-2xl cursor-pointer hover:border-primary-500/40 transition-all group">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-black uppercase tracking-widest text-white">Stripe Protocol</span>
                    <span className="text-[9px] font-bold text-neutral-500 uppercase">Global Auth Channel</span>
                  </div>
                </div>
                <div className="w-5 h-5 border-2 border-primary-500 rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-primary-500 rounded-full" />
                </div>
              </label>

              <label className="flex items-center justify-between p-6 bg-neutral-950 border border-neutral-800 rounded-2xl cursor-pointer hover:border-neutral-700 transition-all group opacity-50">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center text-neutral-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-black uppercase tracking-widest text-white">Razorpay Node</span>
                    <span className="text-[9px] font-bold text-neutral-500 uppercase">India Regional Auth</span>
                  </div>
                </div>
                <div className="w-5 h-5 border-2 border-neutral-800 rounded-full" />
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-8">Summary Ledger</h4>
            <div className="space-y-6">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-neutral-500">Subtotal Yield</span>
                <span className="text-white">₹2,999</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-neutral-500">Tax Matrix</span>
                <span className="text-white">₹0</span>
              </div>
              <div className="pt-6 border-t border-neutral-800 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Final Authorization</span>
                <span className="text-xl font-black text-primary-500">₹2,999</span>
              </div>
              <button 
                onClick={() => setProcessing(true)}
                disabled={processing}
                className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary-500/20 disabled:opacity-50"
              >
                {processing ? 'Authorizing...' : 'Initialize Payment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  );
}

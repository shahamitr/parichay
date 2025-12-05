'use client';

import { useState, useEffect } from 'react';
import { Check, Zap, Crown, Building2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import PaymentModal from './PaymentModal';

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: any;
}

interface PricingPlansProps {
  brandId?: string;
}

export default function PricingPlans({ brandId: propBrandId }: PricingPlansProps) {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');

  const brandId = propBrandId || user?.brandId;

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
      console.error('Error fetching plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPlans = plans.filter((plan) => plan.duration === billingCycle);

  const planIcons: Record<string, any> = {
    Free: Zap,
    Starter: Zap,
    Professional: Crown,
    Business: Building2,
  };

  const planColors: Record<string, string> = {
    Free: 'from-gray-500 to-gray-600',
    Starter: 'from-blue-500 to-blue-600',
    Professional: 'from-purple-500 to-purple-600',
    Business: 'from-orange-500 to-orange-600',
  };

  if (isLoading != null) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Start free, upgrade as you grow
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setBillingCycle('MONTHLY')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${billingCycle === 'MONTHLY'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600'
              }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('YEARLY')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${billingCycle === 'YEARLY'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600'
              }`}
          >
            Yearly
            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              Save 17%
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPlans.map((plan) => {
          const Icon = planIcons[plan.name.split(' ')[0]] || Zap;
          const colorClass = planColors[plan.name.split(' ')[0]] || 'from-blue-500 to-blue-600';
          const features = typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features;

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all hover:shadow-xl ${plan.name.includes('Professional')
                  ? 'border-purple-500 scale-105'
                  : 'border-gray-200'
                }`}
            >
              {/* Popular Badge */}
              {plan.name.includes('Professional') && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-6">
                {/* Icon */}
                <div className={`w-12 h-12 bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{plan.price}
                  </span>
                  <span className="text-gray-600">
                    /{billingCycle === 'MONTHLY' ? 'mo' : 'yr'}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start space-x-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">
                      {features.maxBranches} {features.maxBranches === 1 ? 'Branch' : 'Branches'}
                    </span>
                  </li>
                  {features.qrCodes && (
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">QR Code Generation</span>
                    </li>
                  )}
                  {features.analytics && (
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Analytics Dashboard</span>
                    </li>
                  )}
                  {features.leadCapture && (
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Lead Capture</span>
                    </li>
                  )}
                  {features.customDomain && (
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Custom Domain</span>
                    </li>
                  )}
                  {features.prioritySupport && (
                    <li className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Priority Support</span>
                    </li>
                  )}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => setSelectedPlan(plan)}
                  disabled={plan.price === 0}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${plan.name.includes('Professional')
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-lg'
                      : plan.price === 0
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                >
                  {plan.price === 0 ? 'Current Plan' : 'Get Started'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Modal */}
      {selectedPlan && brandId && (
        <PaymentModal
          isOpen={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
          plan={selectedPlan}
          brandId={brandId}
          onSuccess={() => {
            setSelectedPlan(null);
            // Refresh the page to show updated subscription
            window.location.reload();
          }}
        />
      )}

      {/* No Brand Warning */}
      {selectedPlan && !brandId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Create a Brand First</h3>
            <p className="text-gray-600 mb-4">
              You need to create a brand before subscribing to a plan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedPlan(null)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <a
                href="/dashboard/brands"
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700"
              >
                Create Brand
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

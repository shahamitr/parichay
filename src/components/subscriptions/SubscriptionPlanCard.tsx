'use client';

import { formatCurrency } from '@/lib/utils';

interface SubscriptionPlanFeatures {
  maxBranches: number;
  customDomain: boolean;
  analytics: boolean;
  qrCodes: boolean;
  leadCapture: boolean;
  prioritySupport?: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: 'MONTHLY' | 'YEARLY';
  features: SubscriptionPlanFeatures;
  isActive: boolean;
}

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  onSelect?: (planId: string) => void;
  isSelected?: boolean;
  currentPlan?: boolean;
}

export default function SubscriptionPlanCard({
  plan,
  onSelect,
  isSelected = false,
  currentPlan = false,
}: SubscriptionPlanCardProps) {
  const features = plan.features;

  return (
    <div
      className={`border rounded-lg p-6 ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : currentPlan
          ? 'border-green-500 bg-green-50'
          : 'border-gray-200'
      }`}
    >
      <div className="mb-4">
        <h3 className="text-xl font-bold">{plan.name}</h3>
        {currentPlan && (
          <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded">
            Current Plan
          </span>
        )}
      </div>

      <div className="mb-6">
        <div className="text-3xl font-bold">
          {formatCurrency(plan.price, 'INR')}
        </div>
        <div className="text-sm text-gray-600">
          per {plan.duration === 'MONTHLY' ? 'month' : 'year'}
        </div>
      </div>

      <div className="mb-6 space-y-3">
        <div className="flex items-center">
          <svg
            className="w-5 h-5 text-green-500 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm">
            Up to {features.maxBranches} branches
          </span>
        </div>

        {features.customDomain && (
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-green-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">Custom domain</span>
          </div>
        )}

        {features.analytics && (
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-green-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">Advanced analytics</span>
          </div>
        )}

        {features.qrCodes && (
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-green-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">QR code generation</span>
          </div>
        )}

        {features.leadCapture && (
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-green-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">Lead capture forms</span>
          </div>
        )}

        {features.prioritySupport && (
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-green-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">Priority support</span>
          </div>
        )}
      </div>

      {onSelect && !currentPlan && (
        <button
          onClick={() => onSelect(plan.id)}
          className={`w-full py-2 px-4 rounded font-semibold ${
            isSelected
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {isSelected ? 'Selected' : 'Select Plan'}
        </button>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Zap, Crown, Building2 } from 'lucide-react';

export default function PricingPreview() {
  const plans = [
    {
      name: 'Starter',
      icon: Zap,
      price: 'Free',
      period: 'Forever',
      description: 'Perfect for individuals getting started',
      features: [
        '1 Digital Business Card',
        'Basic Templates',
        'QR Code Generation',
        'Mobile Responsive',
        'Basic Analytics',
      ],
      cta: 'Start Free',
      href: '/register',
      popular: false,
      gradient: 'from-gray-600 to-gray-700',
    },
    {
      name: 'Professional',
      icon: Crown,
      price: '₹499',
      period: '/month',
      description: 'For professionals who want more',
      features: [
        'Unlimited Digital Cards',
        'Premium Templates',
        'Custom Branding',
        'Advanced Analytics',
        'Lead Capture Forms',
        'Custom Domain',
        'Priority Support',
      ],
      cta: 'Start Free Trial',
      href: '/register',
      popular: true,
      gradient: 'from-blue-600 to-purple-600',
    },
    {
      name: 'Enterprise',
      icon: Building2,
      price: 'Custom',
      period: 'Contact Sales',
      description: 'For teams and organizations',
      features: [
        'Everything in Professional',
        'Team Management',
        'White Label Solution',
        'API Access',
        'Dedicated Support',
        'Custom Integrations',
        'SLA Guarantee',
      ],
      cta: 'Contact Sales',
      href: 'https://wa.me/919054590987',
      popular: false,
      gradient: 'from-orange-600 to-red-600',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that's right for you. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div
                key={index}
                className={`relative bg-white rounded-2xl p-8 border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  plan.popular
                    ? 'border-blue-600 shadow-xl'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    {plan.period !== 'Contact Sales' && (
                      <span className="text-gray-600 ml-2">{plan.period}</span>
                    )}
                  </div>
                  {plan.period === 'Contact Sales' && (
                    <p className="text-sm text-gray-600">{plan.period}</p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`block w-full py-3 px-6 rounded-xl font-semibold text-center transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            View Detailed Pricing Comparison
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

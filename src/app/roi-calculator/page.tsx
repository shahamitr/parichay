'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calculator,
  ArrowRight,
  CheckCircle,
  TrendingDown,
  IndianRupee,
  Printer,
  Globe,
  Megaphone,
  Smartphone,
  Users,
  Star,
} from 'lucide-react';

const EXPENSE_ITEMS = [
  { id: 'visitingCards', label: 'Visiting cards (printing/year)', icon: Printer, defaultValue: 5000, hint: '500 cards × 2 batches' },
  { id: 'website', label: 'Website (hosting + domain + maintenance)', icon: Globe, defaultValue: 15000, hint: 'Basic website annual cost' },
  { id: 'googleAds', label: 'Google/Social media ads', icon: Megaphone, defaultValue: 36000, hint: '₹3,000/month average' },
  { id: 'seo', label: 'SEO / listing management', icon: TrendingDown, defaultValue: 12000, hint: 'Freelancer or agency' },
  { id: 'socialMedia', label: 'Social media management', icon: Smartphone, defaultValue: 24000, hint: '₹2,000/month' },
  { id: 'leadGen', label: 'Lead generation (Justdial, etc.)', icon: Users, defaultValue: 18000, hint: 'Annual subscription' },
];

const PARICHAY_PLANS = [
  { name: 'Starter', price: 1999, period: '/year', features: ['1 Branch', 'QR Code', 'Lead Capture', 'Mobile Profile'] },
  { name: 'Growth', price: 4999, period: '/year', features: ['5 Branches', 'Custom Domain', 'Analytics', 'Priority Support'] },
  { name: 'Business', price: 9999, period: '/year', features: ['Unlimited Branches', 'White Label', 'API Access', 'Dedicated Manager'] },
];

export default function ROICalculatorPage() {
  const [expenses, setExpenses] = useState<Record<string, number>>(
    Object.fromEntries(EXPENSE_ITEMS.map(item => [item.id, item.defaultValue]))
  );
  const [selectedPlan, setSelectedPlan] = useState(1); // Growth plan

  const totalCurrentSpend = useMemo(
    () => Object.values(expenses).reduce((sum, val) => sum + (val || 0), 0),
    [expenses]
  );

  const parichayAnnualCost = PARICHAY_PLANS[selectedPlan].price;
  const annualSavings = totalCurrentSpend - parichayAnnualCost;
  const savingsPercentage = totalCurrentSpend > 0 ? Math.round((annualSavings / totalCurrentSpend) * 100) : 0;

  const handleExpenseChange = (id: string, value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    setExpenses(prev => ({ ...prev, [id]: numValue }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100/80 flex items-center justify-between px-6 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="text-lg font-bold text-gray-900 tracking-tight">Parichay</span>
        </Link>
        <Link href="/register" className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm">
          Start Free Trial
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-sm text-green-700 font-medium mb-4">
            <Calculator className="w-4 h-4" />
            Free ROI Calculator
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            How much can your business save with Parichay?
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Enter what you currently spend on marketing and digital presence. See your potential savings instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Expense Inputs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Your Current Annual Expenses</h2>
              <div className="space-y-4">
                {EXPENSE_ITEMS.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-sm font-medium text-gray-700 block">{item.label}</label>
                      <span className="text-xs text-gray-400">{item.hint}</span>
                    </div>
                    <div className="relative w-32">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                      <input
                        type="text"
                        value={expenses[item.id]?.toLocaleString('en-IN') || ''}
                        onChange={(e) => handleExpenseChange(item.id, e.target.value)}
                        className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                <span className="text-base font-semibold text-gray-900">Total Current Spend</span>
                <span className="text-2xl font-bold text-red-600">₹{totalCurrentSpend.toLocaleString('en-IN')}/year</span>
              </div>
            </div>

            {/* Plan Selection */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose a Parichay Plan</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {PARICHAY_PLANS.map((plan, i) => (
                  <button
                    key={plan.name}
                    onClick={() => setSelectedPlan(i)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedPlan === i
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="text-sm font-semibold text-gray-900">{plan.name}</div>
                    <div className="text-lg font-bold text-primary-600 mt-1">₹{plan.price.toLocaleString('en-IN')}<span className="text-xs text-gray-500 font-normal">{plan.period}</span></div>
                    <ul className="mt-2 space-y-1">
                      {plan.features.map(f => (
                        <li key={f} className="text-xs text-gray-500 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />{f}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 sticky top-24">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Your Savings</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current spend</span>
                  <span className="text-sm font-medium text-red-600 line-through">₹{totalCurrentSpend.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Parichay ({PARICHAY_PLANS[selectedPlan].name})</span>
                  <span className="text-sm font-medium text-green-700">₹{parichayAnnualCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-green-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-900">Annual Savings</span>
                    <span className="text-2xl font-bold text-green-600">
                      {annualSavings > 0 ? `₹${annualSavings.toLocaleString('en-IN')}` : '₹0'}
                    </span>
                  </div>
                  {savingsPercentage > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      That's {savingsPercentage}% less than what you spend today!
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg border border-green-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Plus you get FREE:</h4>
                <ul className="space-y-1.5 text-sm text-gray-600">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />QR Code business card</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Lead capture forms</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Google Maps integration</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Analytics dashboard</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />WhatsApp sharing</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Mobile-optimized profile</li>
                </ul>
              </div>

              <Link
                href="/register"
                className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
              >
                Start 14-Day Free Trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-xs text-center text-gray-500 mt-2">No credit card required</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Users, Clock, ArrowRight } from 'lucide-react';
import '@/styles/slider.css';

export default function ROICalculator() {
  const [businessCards, setBusinessCards] = useState(500);
  const [events, setEvents] = useState(12);
  const [employees, setEmployees] = useState(5);
  const [results, setResults] = useState({
    traditionalCost: 0,
    parichayCost: 0,
    savings: 0,
    roi: 0,
    additionalLeads: 0,
    revenueIncrease: 0,
  });

  useEffect(() => {
    calculateROI();
  }, [businessCards, events, employees]);

  const calculateROI = () => {
    // Traditional costs
    const cardPrintingCost = businessCards * 2; // ₹2 per card
    const designCost = events * 2000; // ₹2000 per design
    const reprinting = businessCards * 0.3 * 2; // 30% reprinting
    const traditionalTotal = cardPrintingCost + designCost + reprinting;

    // Parichay costs
    const monthlySubscription = employees * 99; // ₹99 per user per month
    const annualParichay = monthlySubscription * 12;

    // Savings
    const totalSavings = traditionalTotal - annualParichay;

    // ROI calculation
    const roiPercentage = ((totalSavings / annualParichay) * 100);

    // Additional benefits
    const additionalLeads = Math.floor(businessCards * 0.15); // 15% more leads
    const avgLeadValue = 5000; // ₹5000 average lead value
    const conversionRate = 0.1; // 10% conversion
    const additionalRevenue = additionalLeads * avgLeadValue * conversionRate;

    setResults({
      traditionalCost: traditionalTotal,
      parichayCost: annualParichay,
      savings: totalSavings,
      roi: roiPercentage,
      additionalLeads,
      revenueIncrease: additionalRevenue,
    });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Calculator className="w-4 h-4" />
            ROI Calculator
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            See How Much Revenue You're Losing with Paper Cards
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Stop letting networking opportunities slip through the cracks. Calculate your missed leads and lost revenue below.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Calculator Inputs */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Calculator className="w-6 h-6 text-blue-600" />
              Your Business Details
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Business Cards Printed Annually
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="100"
                    value={businessCards}
                    onChange={(e) => setBusinessCards(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>100</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{businessCards.toLocaleString()}</span>
                    <span>5,000</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Events/Redesigns Per Year
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={events}
                    onChange={(e) => setEvents(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>1</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{events}</span>
                    <span>50</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Number of Employees
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={employees}
                    onChange={(e) => setEmployees(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>1</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{employees}</span>
                    <span>100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Facts */}
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Did You Know?</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Average business card costs ₹2-5 to print</li>
                <li>• 30% of printed cards need reprinting due to changes</li>
                <li>• Digital cards generate 40% more leads</li>
                <li>• 88% of business cards are thrown away within a week</li>
              </ul>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {/* Cost Comparison */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-600" />
                Annual Cost Comparison
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Traditional Cards</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Printing + Design + Reprinting</div>
                  </div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    ₹{results.traditionalCost.toLocaleString()}
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Parichay Digital</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Annual subscription</div>
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ₹{results.parichayCost.toLocaleString()}
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-gray-900 dark:text-white text-lg">Annual Savings</div>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      ₹{Math.max(0, results.savings).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-600 dark:text-gray-300">
                    {results.roi > 0 ? `${results.roi.toFixed(0)}% ROI` : 'Break-even in first year'}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Benefits */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Additional Benefits
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">
                    +{results.additionalLeads}
                  </div>
                  <div className="text-sm opacity-90">More Leads/Year</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">
                    ₹{(results.revenueIncrease / 1000).toFixed(0)}K+
                  </div>
                  <div className="text-sm opacity-90">Revenue Increase</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">
                    <Clock className="w-8 h-8 mx-auto mb-1" />
                  </div>
                  <div className="text-sm opacity-90">Instant Updates</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">
                    <Users className="w-8 h-8 mx-auto mb-1" />
                  </div>
                  <div className="text-sm opacity-90">Better Networking</div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="text-center">
                  <div className="text-sm opacity-90 mb-2">Total Annual Value</div>
                  <div className="text-4xl font-bold">
                    ₹{(Math.max(0, results.savings) + results.revenueIncrease).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-8">
              <a
                href="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-lg hover:-translate-y-1 transition-all group"
              >
                Start Capturing Leads Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 font-medium font-semibold">
                7-day free trial • No credit card required
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
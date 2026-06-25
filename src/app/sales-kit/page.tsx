'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, CheckCircle, MessageCircle, ArrowRight } from 'lucide-react';

const MESSAGES = [
  {
    category: 'Cold Outreach',
    messages: [
      {
        label: 'Doctor / Clinic',
        text: `Hi! 👋\n\nI noticed your clinic doesn't have a digital profile yet. Patients searching "doctor near me" on Google can't find you.\n\nParichay helps doctors create a professional online profile in 5 minutes — with your services, timings, location, and a contact form.\n\nYour patients can find you, see your specializations, and book appointments directly.\n\n👉 Learn more: {{BASE_URL}}/for/doctors\n\nWould you like to try it free for 14 days?`,
      },
      {
        label: 'Restaurant / Cafe',
        text: `Hi! 👋\n\nI came across your restaurant and thought you might find this useful.\n\nParichay lets you create a digital menu + profile page that customers can access by scanning a QR code. No app download needed.\n\nYou can update your menu anytime, collect reservations, and share your page on WhatsApp.\n\n👉 Learn more: {{BASE_URL}}/for/restaurants\n\nFree 14-day trial, no credit card required.`,
      },
      {
        label: 'General Business',
        text: `Hi! 👋\n\nI help small businesses get discovered online without spending lakhs on websites or ads.\n\nParichay creates a professional digital profile for your business — with your services, photos, location, and contact form. Setup takes 5 minutes.\n\nCustomers can find you on Google, share your profile on WhatsApp, and contact you directly.\n\n👉 See how it works: {{BASE_URL}}\n\nWould you like to try it free?`,
      },
    ],
  },
  {
    category: 'Follow-Up',
    messages: [
      {
        label: 'After Demo',
        text: `Hi {{NAME}}! 👋\n\nThanks for checking out Parichay today.\n\nHere's what you get with your profile:\n✅ Professional business page\n✅ QR code for your visiting card\n✅ Lead capture form\n✅ Google Maps integration\n✅ Analytics dashboard\n\nReady to set it up? It takes just 5 minutes:\n👉 {{BASE_URL}}/register\n\nLet me know if you need any help!`,
      },
      {
        label: 'Cost Objection',
        text: `Hi {{NAME}}!\n\nI understand budget is a concern. Let me share some perspective:\n\n❌ Visiting cards: ₹5,000/year\n❌ Basic website: ₹15,000/year\n❌ Justdial listing: ₹15,000/year\n\n✅ Parichay: ₹1,999/year (replaces all three)\n\nPlus you get lead capture, analytics, and QR codes included.\n\n👉 Calculate your savings: {{BASE_URL}}/roi-calculator\n\nWant to start with the free 14-day trial?`,
      },
    ],
  },
  {
    category: 'Referral Ask',
    messages: [
      {
        label: 'Ask Existing Customer',
        text: `Hi {{NAME}}! 👋\n\nHope your Parichay profile is working well for you.\n\nQuick question — do you know any other business owners who could benefit from a digital profile? We have a referral program where you both get a discount.\n\nJust share this link with them:\n👉 {{BASE_URL}}/register?ref={{REF_CODE}}\n\nThanks! 🙏`,
      },
    ],
  },
];

export default function SalesKitPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://parichay.com';

  const copyToClipboard = (text: string, id: string) => {
    const finalText = text
      .replace(/\{\{BASE_URL\}\}/g, baseUrl)
      .replace(/\{\{NAME\}\}/g, '[Name]')
      .replace(/\{\{REF_CODE\}\}/g, '[CODE]');

    navigator.clipboard.writeText(finalText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
        <Link href="/admin/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
          Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-gray-900">Sales Kit</h1>
          <p className="text-sm text-gray-600 mt-2">
            Ready-to-use WhatsApp messages for your sales team. Click to copy, paste in WhatsApp, personalize, and send.
          </p>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            <strong>Tip:</strong> Replace [Name] with the person's actual name before sending. Personalized messages get 3x more responses.
          </div>
        </div>

        <div className="space-y-10">
          {MESSAGES.map((category) => (
            <div key={category.category}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-600" />
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.messages.map((msg) => {
                  const id = `${category.category}-${msg.label}`;
                  const isCopied = copiedId === id;
                  return (
                    <div key={id} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <span className="text-sm font-medium text-gray-700">{msg.label}</span>
                        <button
                          onClick={() => copyToClipboard(msg.text, id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            isCopied
                              ? 'bg-green-100 text-green-700'
                              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {isCopied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {isCopied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <pre className="px-4 py-4 text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed bg-white">
                        {msg.text
                          .replace(/\{\{BASE_URL\}\}/g, baseUrl)
                          .replace(/\{\{NAME\}\}/g, '[Name]')
                          .replace(/\{\{REF_CODE\}\}/g, '[CODE]')}
                      </pre>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Links to share */}
        <div className="mt-12 p-6 bg-gray-50 rounded-xl">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Useful Links to Share</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <span className="text-gray-700">Main website</span>
              <code className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded">{baseUrl}</code>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <span className="text-gray-700">ROI Calculator</span>
              <code className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded">{baseUrl}/roi-calculator</code>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <span className="text-gray-700">Comparison page</span>
              <code className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded">{baseUrl}/compare</code>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <span className="text-gray-700">For Doctors</span>
              <code className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded">{baseUrl}/for/doctors</code>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <span className="text-gray-700">For Restaurants</span>
              <code className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded">{baseUrl}/for/restaurants</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

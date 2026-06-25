'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Gift, Copy, CheckCircle, Share2, ArrowRight } from 'lucide-react';

export default function ReferPage() {
  const [copied, setCopied] = useState(false);

  // In production, this would come from the authenticated user's referral code
  const referralLink = typeof window !== 'undefined'
    ? `${window.location.origin}/register?ref=YOUR_CODE`
    : 'https://parichay.com/register?ref=YOUR_CODE';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Hey! I've been using Parichay to manage my business's online presence and it's been great. You should try it too — free for 14 days.\n\n${referralLink}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
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
        <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
          Login
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Gift className="w-8 h-8 text-primary-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          Refer a business, earn rewards
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-lg mx-auto">
          Know a business owner who needs an online presence? Share your referral link.
          When they subscribe, you both get 10% off your next payment.
        </p>

        {/* How it works */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-xl flex items-center justify-center text-sm font-bold mb-4 shadow-sm">1</div>
            <h3 className="text-sm font-semibold text-gray-900">Share your link</h3>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">Send your unique referral link via WhatsApp, email, or any channel.</p>
          </div>
          <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-xl flex items-center justify-center text-sm font-bold mb-4 shadow-sm">2</div>
            <h3 className="text-sm font-semibold text-gray-900">They sign up</h3>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">Your friend creates their business profile using your link.</p>
          </div>
          <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-xl flex items-center justify-center text-sm font-bold mb-4 shadow-sm">3</div>
            <h3 className="text-sm font-semibold text-gray-900">Both get rewarded</h3>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">When they subscribe, you both get 10% off. No limit on referrals.</p>
          </div>
        </div>

        {/* Referral Link */}
        <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-3">Your referral link</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 truncate"
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                copied
                  ? 'bg-green-100 text-green-700'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="mt-4 flex gap-3 justify-center">
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share on WhatsApp
            </button>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Log in to get your personalized referral link with tracking.
          </p>
        </div>
      </div>
    </div>
  );
}

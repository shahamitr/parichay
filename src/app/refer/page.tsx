'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Gift, Copy, Check, Share2, Users, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ReferPage() {
  const { user, loading: authLoading } = useAuth();
  const [referralData, setReferralData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      fetch('/api/referrals', { credentials: 'include' })
        .then((r) => r.json())
        .then(setReferralData)
        .catch(() => {})
        .finally(() => setLoading(false));
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleCopy = async () => {
    if (!referralData?.referralLink) return;
    await navigator.clipboard.writeText(referralData.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    if (!referralData?.referralLink) return;
    const text = encodeURIComponent(
      `Hey! I'm using Parichay for my business digital card. It's amazing — create your professional profile in 5 minutes.\n\nSign up with my link and get 7 extra free days: ${referralData.referralLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFC] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAFAFC] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <Gift className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Refer & Earn</h1>
          <p className="text-gray-500 mb-6">Sign in to get your unique referral link and earn free subscription days.</p>
          <Link href="/login?redirect=/refer" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">
            Sign In <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFC] px-6 py-12">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-500/20">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Refer & Earn</h1>
          <p className="text-gray-500 mt-2">Share Parichay with friends. Get rewarded.</p>
        </div>

        {/* How it works */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">How it works</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center text-[11px] font-bold text-indigo-700 flex-shrink-0">1</div>
              <div>
                <p className="text-sm font-medium text-gray-900">Share your referral link</p>
                <p className="text-xs text-gray-500">Send to friends, colleagues, or businesses you know</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center text-[11px] font-bold text-indigo-700 flex-shrink-0">2</div>
              <div>
                <p className="text-sm font-medium text-gray-900">They sign up and try Parichay</p>
                <p className="text-xs text-gray-500">They get <strong>7 extra days</strong> on their free trial (21 total)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center text-[11px] font-bold text-emerald-700 flex-shrink-0">3</div>
              <div>
                <p className="text-sm font-medium text-gray-900">You get 30 free days</p>
                <p className="text-xs text-gray-500">Added to your subscription for each successful referral</p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Link */}
        {referralData && (
          <>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Your Referral Link</label>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={referralData.referralLink}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 font-mono truncate"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-1"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleWhatsAppShare}
                  className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-xl flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" /> Share on WhatsApp
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <Users className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-gray-900">{referralData.stats.totalReferred}</p>
                <p className="text-[11px] text-gray-500">Referred</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <Check className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-gray-900">{referralData.stats.successfulConversions}</p>
                <p className="text-[11px] text-gray-500">Converted</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <Clock className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-gray-900">{referralData.stats.rewardEarned}d</p>
                <p className="text-[11px] text-gray-500">Days Earned</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

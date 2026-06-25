'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/layout/AuthLayout';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSent(true);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout title="Check your email" subtitle="We've sent you a password reset link">
        <div className="text-center py-4">
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-7 h-7 text-green-600" />
          </div>
          <p className="text-[14px] text-gray-600 leading-relaxed">
            If an account exists with <strong>{email}</strong>, you'll receive a password reset link shortly.
          </p>
          <p className="text-[13px] text-gray-400 mt-4">
            Didn't receive it? Check your spam folder or try again.
          </p>
          <Link href="/login" className="mt-6 inline-flex items-center gap-2 text-[13px] font-medium text-indigo-600 hover:text-indigo-700">
            <ArrowLeft className="w-4 h-4" /> Back to sign in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset your password" subtitle="Enter your email and we'll send you a reset link">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-[13px]">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-[13px] font-medium text-gray-700 mb-1.5">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 px-4 border border-gray-200 rounded-xl text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            placeholder="you@business.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[14px] font-medium rounded-xl transition-all disabled:opacity-50 shadow-sm shadow-indigo-600/10"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading ? 'Sending...' : 'Send reset link'}
        </button>

        <p className="text-center text-[13px] text-gray-500 pt-2">
          <Link href="/login" className="text-indigo-600 font-medium hover:text-indigo-700 inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Shield } from 'lucide-react';
import AuthLayout from '@/components/layout/AuthLayout';

// Role-based redirect mapping
const ROLE_REDIRECTS: Record<string, string> = {
  SUPER_ADMIN: '/admin/dashboard',
  BRAND_MANAGER: '/admin/dashboard',
  BRANCH_ADMIN: '/admin/dashboard',
  EXECUTIVE: '/admin/dashboard',
  BUSINESS_OWNER: '/business-owner/dashboard',
  CUSTOMER: '/customer-dashboard',
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // MFA state
  const [requiresMFA, setRequiresMFA] = useState(false);
  const [mfaToken, setMfaToken] = useState('');
  const [mfaUserId, setMfaUserId] = useState('');

  const getRedirectPath = (role: string): string => {
    // Check for explicit redirect param first
    const redirectParam = searchParams.get('redirect');
    if (redirectParam) return redirectParam;
    return ROLE_REDIRECTS[role] || '/admin/dashboard';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const body: Record<string, string> = { email, password };
      if (requiresMFA && mfaToken) {
        body.mfaToken = mfaToken;
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.status === 403 && data.requiresMFA) {
        setRequiresMFA(true);
        setMfaUserId(data.userId);
        setLoading(false);
        return;
      }

      if (response.ok && data.success) {
        const redirectPath = getRedirectPath(data.user.role);
        window.location.href = redirectPath;
      } else {
        setError(data.error || 'Invalid email or password.');
        if (requiresMFA) {
          setMfaToken('');
        }
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to manage your business profile">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-[13px] flex items-start gap-2">
            <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!requiresMFA ? (
          <>
            <div>
              <label htmlFor="email" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 border border-gray-200 rounded-xl text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                placeholder="you@business.com"
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-[13px] font-medium text-gray-700">
                  Password
                </label>
                <Link href="/forgot-password" className="text-[12px] text-primary-600 hover:text-primary-700 font-medium">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-4 pr-11 border border-gray-200 rounded-xl text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div>
            <div className="px-4 py-3 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl text-[13px] mb-4">
              Enter the 6-digit code from your authenticator app.
            </div>
            <label htmlFor="mfaToken" className="block text-[13px] font-medium text-gray-700 mb-1.5">
              Verification Code
            </label>
            <input
              id="mfaToken"
              type="text"
              required
              value={mfaToken}
              onChange={(e) => setMfaToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full h-12 px-4 border border-gray-200 rounded-xl text-[18px] text-center text-gray-900 tracking-[0.3em] placeholder:text-gray-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all font-mono"
              placeholder="000000"
              maxLength={6}
              autoFocus
              autoComplete="one-time-code"
            />
            <button
              type="button"
              onClick={() => {
                setRequiresMFA(false);
                setMfaToken('');
                setError('');
              }}
              className="mt-3 text-[12px] text-gray-500 hover:text-gray-700 font-medium"
            >
              ← Back to login
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (requiresMFA && mfaToken.length < 6)}
          className="w-full h-11 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-[14px] font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-primary-600/10"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading ? 'Signing in...' : requiresMFA ? 'Verify & Sign in' : 'Sign in'}
        </button>

        <p className="text-center text-[13px] text-gray-500 pt-2">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary-600 font-medium hover:text-primary-700">
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Phone, Shield, ArrowLeft } from 'lucide-react';
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

export default function PhoneLogin() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [devOtp, setDevOtp] = useState('');
  const otpInputRef = useRef<HTMLInputElement>(null);

  // Countdown for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Auto-submit when 6 digits entered
  useEffect(() => {
    if (otp.length === 6 && step === 'otp' && !loading) {
      handleVerifyOtp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  // Format phone input for display (Indian format)
  const formatPhoneDisplay = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(raw);
    setError('');
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+91${phone}` }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send OTP');
        return;
      }

      // Store dev OTP if returned (development mode)
      if (data.devOtp) {
        setDevOtp(data.devOtp);
      }

      setStep('otp');
      setResendTimer(30);
      // Focus OTP input
      setTimeout(() => otpInputRef.current?.focus(), 100);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = useCallback(async () => {
    if (otp.length !== 6) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phone: `+91${phone}`, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid OTP');
        setOtp('');
        otpInputRef.current?.focus();
        return;
      }

      if (data.success) {
        // Redirect based on role
        const redirectPath = ROLE_REDIRECTS[data.user.role] || '/admin/dashboard';

        if (data.isNewUser) {
          // New users go to onboarding
          window.location.href = '/onboarding';
        } else {
          window.location.href = redirectPath;
        }
      }
    } catch {
      setError('Verification failed. Please try again.');
      setOtp('');
    } finally {
      setLoading(false);
    }
  }, [otp, phone]);

  const handleResend = () => {
    if (resendTimer > 0) return;
    setOtp('');
    setError('');
    handleSendOtp();
  };

  return (
    <AuthLayout title="Sign in with phone" subtitle="We'll send a verification code to your mobile number">
      {step === 'phone' ? (
        <form onSubmit={handleSendOtp} className="space-y-5">
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-[13px] flex items-start gap-2">
              <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="phone" className="block text-[13px] font-medium text-gray-700 mb-1.5">
              Mobile Number
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[14px] text-gray-500 pointer-events-none">
                <Phone className="w-4 h-4" />
                <span>+91</span>
              </div>
              <input
                id="phone"
                type="tel"
                required
                value={formatPhoneDisplay(phone)}
                onChange={handlePhoneChange}
                className="w-full h-12 pl-[90px] pr-4 border border-gray-200 rounded-xl text-[16px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                placeholder="98765 43210"
                autoComplete="tel"
                inputMode="numeric"
              />
            </div>
            <p className="mt-1.5 text-[12px] text-gray-400">
              We&apos;ll send a 6-digit OTP to this number
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || phone.length !== 10}
            className="w-full h-11 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-[14px] font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-primary-600/10"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? 'Sending...' : 'Send OTP'}
          </button>

          <p className="text-center text-[13px] text-gray-500 pt-2">
            Or{' '}
            <a href="/login" className="text-primary-600 font-medium hover:text-primary-700">
              sign in with email
            </a>
          </p>
        </form>
      ) : (
        <div className="space-y-5">
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-[13px] flex items-start gap-2">
              <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="px-4 py-3 bg-blue-50 border border-blue-100 text-blue-700 rounded-xl text-[13px]">
            OTP sent to <span className="font-medium">+91 {formatPhoneDisplay(phone)}</span>
          </div>

          {devOtp && (
            <div className="px-4 py-3 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl text-[12px]">
              Dev mode OTP: <span className="font-mono font-bold">{devOtp}</span>
            </div>
          )}

          <div>
            <label htmlFor="otp" className="block text-[13px] font-medium text-gray-700 mb-1.5">
              Verification Code
            </label>
            <input
              ref={otpInputRef}
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full h-14 px-4 border border-gray-200 rounded-xl text-[24px] text-center text-gray-900 tracking-[0.4em] placeholder:text-gray-300 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all font-mono"
              placeholder="• • • • • •"
              maxLength={6}
              autoFocus
              autoComplete="one-time-code"
              inputMode="numeric"
            />
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-2 text-[13px] text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying...</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setStep('phone');
                setOtp('');
                setError('');
                setDevOtp('');
              }}
              className="flex items-center gap-1 text-[13px] text-gray-500 hover:text-gray-700 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Change number
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={resendTimer > 0}
              className="text-[13px] text-primary-600 hover:text-primary-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}

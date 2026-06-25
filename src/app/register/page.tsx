'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/layout/AuthLayout';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    firstName: searchParams.get('name')?.split(' ')[0] || '',
    lastName: searchParams.get('name')?.split(' ').slice(1).join(' ') || '',
    email: searchParams.get('email') || '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full h-11 px-4 border border-gray-200 rounded-xl text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all";

  return (
    <AuthLayout title="Create your account" subtitle="Start your free 14-day trial today">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-[13px]">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="firstName" className="block text-[13px] font-medium text-gray-700 mb-1.5">First name</label>
            <input id="firstName" name="firstName" required value={formData.firstName} onChange={handleChange} className={inputClass} placeholder="Amit" />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-[13px] font-medium text-gray-700 mb-1.5">Last name</label>
            <input id="lastName" name="lastName" required value={formData.lastName} onChange={handleChange} className={inputClass} placeholder="Shah" />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-[13px] font-medium text-gray-700 mb-1.5">Email</label>
          <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className={inputClass} placeholder="amit@business.com" />
        </div>

        <div>
          <label htmlFor="password" className="block text-[13px] font-medium text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={handleChange} className={`${inputClass} pr-11`} placeholder="Min 8 chars, uppercase, number, symbol" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-[13px] font-medium text-gray-700 mb-1.5">Confirm password</label>
          <input id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className={inputClass} placeholder="Re-enter password" />
        </div>

        <div className="flex items-start gap-2.5 pt-1">
          <input type="checkbox" required id="terms" className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
          <label htmlFor="terms" className="text-[12px] text-gray-500 leading-relaxed">
            I agree to the <Link href="/terms-of-service" className="text-primary-600 hover:underline">Terms</Link> and <Link href="/privacy-policy" className="text-primary-600 hover:underline">Privacy Policy</Link>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-[14px] font-medium rounded-xl transition-all disabled:opacity-50 shadow-sm shadow-primary-600/10"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading ? 'Creating...' : 'Create account'}
        </button>

        <p className="text-center text-[13px] text-gray-500 pt-1">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-600 font-medium hover:text-primary-700">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

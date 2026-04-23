'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import AuthLayout from '@/components/layout/AuthLayout';
import { Loader2, ArrowRight } from 'lucide-react';

const CategorySelector = dynamic(() => import('@/components/onboarding/CategorySelector'), {
  loading: () => <div className="h-64 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-2xl" />,
  ssr: false
});

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<'register' | 'category'>('register');
  const nameParam = searchParams.get('name') || '';
  const nameParts = nameParam.trim().split(' ');
  
  const [formData, setFormData] = useState({
    firstName: nameParts[0] || '',
    lastName: nameParts.slice(1).join(' ') || '',
    email: searchParams.get('email') || '',
    password: '',
    confirmPassword: '',
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category') || null
  );
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAccessToken(data.accessToken);
        localStorage.setItem('token', data.accessToken);
        setStep('category');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryComplete = async () => {
    setLoading(true);
    if (selectedCategory && accessToken) {
      try {
        await fetch('/api/users/category', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ categoryId: selectedCategory }),
        });
      } catch (error) {
        console.error('Failed to save category:', error);
      }
    }
    router.push('/onboarding');
    setLoading(false);
  };

  const content = step === 'register' ? (
    <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
            <div className="bg-error-50 dark:bg-error-900/20 border-2 border-error-100 dark:border-error-800 text-error-700 dark:text-error-400 px-4 py-3 rounded-xl text-sm font-bold">
                {error}
            </div>
        )}

        <div className="grid grid-cols-2 gap-4">
            <div>
            <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">First Name</label>
            <input
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl outline-none focus:border-primary-500 transition-all"
                placeholder="John"
            />
            </div>
            <div>
            <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">Last Name</label>
            <input
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl outline-none focus:border-primary-500 transition-all"
                placeholder="Doe"
            />
            </div>
        </div>

        <div>
            <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">Email Address</label>
            <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl outline-none focus:border-primary-500 transition-all"
                placeholder="you@email.com"
            />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
            <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">Password</label>
            <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl outline-none focus:border-primary-500 transition-all"
                placeholder="••••••••"
            />
            </div>
            <div>
            <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">Confirm</label>
            <input
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl outline-none focus:border-primary-500 transition-all"
                placeholder="••••••••"
            />
            </div>
        </div>

        <div className="flex items-start gap-3">
            <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            <p className="text-xs text-neutral-500 font-medium leading-relaxed">
                I agree to the <Link href="/terms" className="text-primary-600 font-bold hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary-600 font-bold hover:underline">Privacy Policy</Link>.
            </p>
        </div>

        <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
            {loading ? 'CREATING ACCOUNT...' : 'START YOUR JOURNEY'}
        </button>

        <div className="text-center pt-6">
            <p className="text-neutral-600 dark:text-neutral-400 font-medium">
                Already have an account?{' '}
                <Link href="/login" className="text-primary-600 dark:text-primary-400 hover:underline font-black">
                    SIGN IN
                </Link>
            </p>
        </div>
    </form>
  ) : (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CategorySelector
            selectedCategory={selectedCategory || undefined}
            onSelect={setSelectedCategory}
            onSkip={() => router.push('/onboarding')}
        />
        <button
            onClick={handleCategoryComplete}
            disabled={!selectedCategory || loading}
            className="w-full bg-primary-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
        >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {loading ? 'SAVING...' : 'CONTINUE TO ONBOARDING'}
        </button>
    </div>
  );

  return (
    <AuthLayout 
        title={step === 'register' ? "Create Your Business ID" : "Final Step"} 
        subtitle={step === 'register' ? "Put your business on the digital map today" : "Tell us about your industry to personalize your experience"}
    >
        {content}
    </AuthLayout>
  );
}

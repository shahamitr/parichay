'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

// Toast notification component
function Toast({ message, type, onClose }: { message: string; type: 'error' | 'success' | 'warning'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    error: <XCircle className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
  };

  const colors = {
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg max-w-md ${colors[type]}`}>
        <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-2 hover:opacity-70 transition-opacity"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'warning' } | null>(null);
  const router = useRouter();

  const showToast = (message: string, type: 'error' | 'success' | 'warning') => {
    setToast({ message, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');
    setToast(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        showToast('✅ Password reset link sent! Please check your email.', 'success');
        setEmail('');
      } else {
        // Handle specific error types
        if (data.type === 'DATABASE_ERROR') {
          showToast('⚠️ Database connection failed. Please ensure the database is running and try again.', 'error');
          setError('Database is not available. Please contact support if this persists.');
        } else if (data.type === 'EMAIL_ERROR') {
          showToast('⚠️ Failed to send email. Please try again later or contact support.', 'error');
          setError('Email service is temporarily unavailable.');
        } else if (data.type === 'NETWORK_ERROR') {
          showToast('⚠️ Network error. Please check your internet connection.', 'error');
          setError(data.error || 'Network error occurred.');
        } else if (data.type === 'VALIDATION_ERROR') {
          showToast('⚠️ Invalid email address. Please check and try again.', 'error');
          setError(data.error || 'Invalid email address.');
        } else {
          showToast(data.error || 'Failed to send reset email. Please try again.', 'error');
          setError(data.error || 'Failed to send reset email');
        }
      }
    } catch (err) {
      console.error('Forgot password error:', err);

      // Network or fetch errors
      if (err instanceof TypeError && err.message.includes('fetch')) {
        showToast('⚠️ Cannot connect to server. Please check if the application is running.', 'error');
        setError('Cannot connect to server. Please try again later.');
      } else {
        showToast('⚠️ An unexpected error occurred. Please try again.', 'error');
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {message && (
            <div className="rounded-md bg-green-50 p-4">
              <p className="text-sm text-green-800">{message}</p>
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send reset link'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Back to login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

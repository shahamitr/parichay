'use client';

import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function BrandError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDbError =
    error.message?.toLowerCase().includes('connect') ||
    error.message?.toLowerCase().includes('database') ||
    error.message?.toLowerCase().includes('econnrefused');

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-7 h-7 text-orange-600" />
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-2">
          {isDbError ? 'Service Temporarily Unavailable' : 'Unable to Load Profile'}
        </h1>

        <p className="text-gray-500 text-sm mb-6">
          {isDbError
            ? 'Our service is temporarily down for maintenance. Please try again shortly.'
            : 'We couldn\'t load this business profile. It may have been removed or there\'s a temporary issue.'}
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

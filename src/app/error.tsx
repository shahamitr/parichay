'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  // Detect database connection errors
  const isDbError =
    error.message?.toLowerCase().includes('connect') ||
    error.message?.toLowerCase().includes('database') ||
    error.message?.toLowerCase().includes('prisma') ||
    error.message?.toLowerCase().includes('econnrefused') ||
    error.message?.toLowerCase().includes('3306') ||
    error.message?.toLowerCase().includes('5432');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-amber-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {isDbError ? 'Service Temporarily Unavailable' : 'Something Went Wrong'}
        </h1>

        <p className="text-gray-500 mb-8 leading-relaxed">
          {isDbError
            ? 'We\'re having trouble connecting to our database. This is usually temporary — please try again in a moment.'
            : 'An unexpected error occurred while loading this page. Our team has been notified.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left bg-white border border-gray-200 rounded-xl p-4">
            <summary className="text-sm font-medium text-gray-600 cursor-pointer">
              Error Details (dev only)
            </summary>
            <pre className="mt-3 text-xs text-red-600 whitespace-pre-wrap overflow-auto max-h-40 bg-red-50 rounded-lg p-3">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

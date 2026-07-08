'use client';

import { AlertTriangle, RefreshCw, LogOut } from 'lucide-react';

export default function AdminError({
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

  const isAuthError =
    error.message?.toLowerCase().includes('auth') ||
    error.message?.toLowerCase().includes('token') ||
    error.message?.toLowerCase().includes('unauthorized');

  return (
    <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-2">
          {isDbError
            ? 'Database Connection Error'
            : isAuthError
              ? 'Session Expired'
              : 'Something Went Wrong'}
        </h1>

        <p className="text-gray-500 text-sm mb-6">
          {isDbError
            ? 'Unable to connect to the database. Please ensure the database server is running and try again.'
            : isAuthError
              ? 'Your session has expired. Please log in again to continue.'
              : 'An error occurred in the admin panel. Try refreshing or contact support if it persists.'}
        </p>

        <div className="flex gap-3 justify-center">
          {isAuthError ? (
            <a
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log In Again
            </a>
          ) : (
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          )}
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="text-xs text-gray-400 cursor-pointer">Debug info</summary>
            <pre className="mt-2 text-[10px] text-red-500 bg-red-50 rounded-lg p-2 overflow-auto max-h-32">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

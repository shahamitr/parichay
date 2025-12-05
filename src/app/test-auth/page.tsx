'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TestAuthPage() {
  const [email, setEmail] = useState('admin@onetouch.local');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.data);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      setCurrentUser(null);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setResult({
        status: response.status,
        ok: response.ok,
        data,
      });

      if (response.ok) {
        await checkAuth();
      }
    } catch (error: any) {
      setResult({
        status: 500,
        ok: false,
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setCurrentUser(null);
      setResult(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Authentication Test Page
          </h1>

          {/* Current User Status */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Current Authentication Status
            </h2>
            {currentUser ? (
              <div className="space-y-2">
                <p className="text-green-600 font-semibold">✅ Authenticated</p>
                <p className="text-sm text-gray-700">
                  <strong>Email:</strong> {currentUser.email}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Name:</strong> {currentUser.firstName}{' '}
                  {currentUser.lastName}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Role:</strong> {currentUser.role}
                </p>
                <button
                  onClick={handleLogout}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <p className="text-red-600 font-semibold">❌ Not Authenticated</p>
            )}
          </div>

          {/* Login Form */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Test Login
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test Login'}
              </button>
            </div>
          </div>

          {/* Result Display */}
          {result && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Login Result
              </h2>
              <div
                className={`p-4 rounded-lg ${
                  result.ok ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <p className="font-semibold mb-2">
                  Status: {result.status} {result.ok ? '✅' : '❌'}
                </p>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(result.data || result.error, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Test Users */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Available Test Users
            </h2>
            <div className="space-y-2 text-sm">
              <div>
                <p className="font-semibold">Super Admin:</p>
                <p className="text-gray-600">
                  Email: admin@onetouch.local | Password: Admin@123
                </p>
              </div>
              <div>
                <p className="font-semibold">Executive:</p>
                <p className="text-gray-600">
                  Email: john.smith@demo.executive | Password: Executive@123
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Go to Login Page
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

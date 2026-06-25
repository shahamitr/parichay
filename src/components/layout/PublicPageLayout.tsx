'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const CommonFooter = dynamic(() => import('./CommonFooter'), { ssr: false });

interface PublicPageLayoutProps {
  children: React.ReactNode;
}

/**
 * Shared layout for all public-facing static pages (About, Contact, Privacy, Terms, etc.)
 * Uses the same nav and footer as the landing page for consistency.
 */
export default function PublicPageLayout({ children }: PublicPageLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
      {/* Navigation — identical to landing page */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100/60 flex items-center justify-between px-6 lg:px-10 z-50">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold text-xs">P</span>
          </div>
          <span className="text-[17px] font-semibold text-gray-900 tracking-tight">Parichay</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-gray-500">
          <Link href="/#benefits" className="hover:text-gray-900 transition-colors">Benefits</Link>
          <Link href="/#industries" className="hover:text-gray-900 transition-colors">Industries</Link>
          <Link href="/#pricing" className="hover:text-gray-900 transition-colors">Pricing</Link>
          <Link href="/about" className="hover:text-gray-900 transition-colors">About</Link>
          <Link href="/contact" className="hover:text-gray-900 transition-colors">Contact</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">
            Sign in
          </Link>
          <Link href="/register" className="h-9 px-4 flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-[13px] font-medium rounded-lg transition-all shadow-md shadow-indigo-500/20">
            Start Free
          </Link>
        </div>
      </nav>

      {/* Page content */}
      <main className="pt-16">
        {children}
      </main>

      {/* Footer */}
      <CommonFooter />
    </div>
  );
}

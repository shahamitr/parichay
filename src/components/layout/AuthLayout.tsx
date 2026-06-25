'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const BENEFITS = [
  'Professional digital profile in 5 minutes',
  'QR code & WhatsApp sharing included',
  'Instant lead notifications',
  'Analytics to track growth',
  'Free for 14 days',
];

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-white">
      {/* Left — Illustration panel (Google style: clean, bold color, minimal) */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] bg-[#f8f9ff] flex-col justify-between p-10 relative">
        {/* Top — logo */}
        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="text-[17px] font-semibold text-gray-800 tracking-[-0.01em]">Parichay</span>
        </Link>

        {/* Center — value prop */}
        <div className="relative z-10 py-8">
          <h2 className="text-[26px] font-semibold text-gray-900 leading-snug tracking-[-0.02em]">
            Put your business<br />on the map
          </h2>
          <p className="mt-4 text-[15px] text-gray-500 leading-relaxed max-w-xs">
            Create a professional digital presence that helps customers find and trust you.
          </p>

          <ul className="mt-8 space-y-3.5">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-3">
                <CheckCircle className="w-[18px] h-[18px] text-primary-500 flex-shrink-0" />
                <span className="text-[14px] text-gray-600">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom — subtle decoration */}
        <div className="text-[13px] text-gray-400">
          © {new Date().getFullYear()} Parichay
        </div>

        {/* Background decoration — subtle circles (Google style) */}
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary-100/40 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-20 right-10 w-[80px] h-[80px] bg-primary-200/30 rounded-full" />
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-[17px] font-semibold text-gray-800">Parichay</span>
            </Link>
          </div>

          <h1 className="text-[24px] font-semibold text-gray-900 tracking-[-0.02em]">{title}</h1>
          <p className="mt-2 text-[14px] text-gray-500 leading-relaxed">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

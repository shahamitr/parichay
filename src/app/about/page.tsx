import PublicPageLayout from '@/components/layout/PublicPageLayout';
import Link from 'next/link';
import { ArrowRight, Target, Users, Globe, Zap } from 'lucide-react';

export const metadata = {
  title: 'About Parichay | Business Growth Platform',
  description: 'Parichay helps businesses, professionals, and individuals build a professional digital presence and grow online.',
};

export default function AboutPage() {
  return (
    <PublicPageLayout>
      {/* Hero */}
      <section className="py-20 px-6 bg-gradient-to-b from-indigo-50/40 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Helping every business build a professional digital presence
          </h1>
          <p className="mt-5 text-[16px] text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Parichay is a business growth platform that gives individuals, professionals, small businesses, and local service providers the tools to get discovered online, build trust, and capture customers — without needing technical skills or expensive agencies.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            <p className="mt-4 text-[15px] text-gray-500 leading-relaxed">
              Millions of businesses in India exist physically but are invisible online. A doctor with 20 years of experience, a restaurant with amazing food, a consultant with deep expertise — none of them show up when customers search online.
            </p>
            <p className="mt-4 text-[15px] text-gray-500 leading-relaxed">
              We're changing that. Parichay gives every business — from a solo freelancer to a multi-branch chain — a professional digital presence they can create in 5 minutes and share anywhere.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">What We Believe</h2>
            <ul className="mt-4 space-y-4">
              {[
                { icon: Target, text: 'Every business deserves to be found by the customers looking for them' },
                { icon: Zap, text: 'Getting online should take minutes, not weeks' },
                { icon: Users, text: 'You shouldn\'t need a developer to have a professional presence' },
                { icon: Globe, text: 'Your digital identity should work everywhere — WhatsApp, Google, social media' },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-[14px] text-gray-600 leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Who uses Parichay */}
      <section className="py-16 px-6 bg-gray-50/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Who uses Parichay?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Doctors & Clinics',
              'Restaurants & Cafes',
              'Real Estate Agents',
              'Freelancers & Consultants',
              'Coaches & Trainers',
              'Salons & Spas',
              'Architects & Designers',
              'Retail Shop Owners',
              'Agencies & Firms',
            ].map((item) => (
              <div key={item} className="px-5 py-4 bg-white border border-gray-100 rounded-xl text-[14px] text-gray-700 font-medium">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900">Ready to bring your business online?</h2>
          <p className="mt-3 text-gray-500 text-[15px]">Create your profile in 5 minutes. Free for 14 days.</p>
          <Link href="/register" className="mt-6 inline-flex items-center gap-2 h-11 px-7 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[14px] font-medium rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all">
            Create My Business Profile <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </PublicPageLayout>
  );
}

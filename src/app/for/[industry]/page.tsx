import Link from 'next/link';
import { CheckCircle, ArrowRight, Users, Eye, QrCode } from 'lucide-react';
import { notFound } from 'next/navigation';
import { industryCategories } from '@/data/categories';
import { resolveDemoUrl } from '@/lib/demo-utils';

// =============================================================================
// Industry-to-category slug mapping
// =============================================================================
const INDUSTRY_CATEGORY_MAP: Record<string, string> = {
  doctors: 'healthcare-professionals',
  restaurants: 'restaurants-cafes',
  'real-estate': 'real-estate-agents',
  salons: 'fitness-wellness',
};

function getDemoUrlForIndustry(industrySlug: string): string | null {
  const categorySlug = INDUSTRY_CATEGORY_MAP[industrySlug];
  if (!categorySlug) return null;
  const category = industryCategories.find(c => c.slug === categorySlug);
  if (!category) return null;
  return resolveDemoUrl(category);
}

// =============================================================================
// Industry data — add more as needed
// =============================================================================
const INDUSTRIES: Record<string, {
  title: string;
  headline: string;
  subheadline: string;
  painPoints: string[];
  solutions: { title: string; description: string }[];
}> = {
  doctors: {
    title: 'Doctors & Clinics',
    headline: 'Patients are searching for you online. Can they find you?',
    subheadline: 'Create a professional digital profile for your clinic in 5 minutes. Get discovered by patients searching for doctors near them.',
    painPoints: [
      'Patients can\'t find your clinic on Google',
      'No easy way to share your services and timings',
      'Losing patients to clinics with better online presence',
      'Spending too much on Practo/Justdial listings',
    ],
    solutions: [
      { title: 'Professional Clinic Profile', description: 'Showcase your specializations, timings, fees, and location on a beautiful mobile page.' },
      { title: 'Patient Enquiry Forms', description: 'Patients can book appointments directly from your profile. You get instant notifications.' },
      { title: 'QR Code for Clinic', description: 'Print a QR code for your reception. Patients scan and save your details instantly.' },
      { title: 'Google Maps Integration', description: 'Help patients navigate to your clinic with embedded directions.' },
    ],
  },
  restaurants: {
    title: 'Restaurants & Cafes',
    headline: 'Your food is amazing. But can hungry customers find you?',
    subheadline: 'Put your menu, photos, location, and reviews on a single shareable page. Customers find you, see your menu, and visit.',
    painPoints: [
      'Customers can\'t find your menu online',
      'Zomato/Swiggy take 25-30% commission',
      'No way to collect direct orders or reservations',
      'Printed menus get outdated quickly',
    ],
    solutions: [
      { title: 'Digital Menu', description: 'Beautiful, always-updated menu with photos and prices. Customers scan a QR code at the table.' },
      { title: 'Direct Reservations', description: 'Customers book tables directly — no commission to any platform.' },
      { title: 'Photo Gallery', description: 'Showcase your ambiance, dishes, and events. First impressions matter.' },
      { title: 'WhatsApp Orders', description: 'Customers tap to order directly on WhatsApp. No app download needed.' },
    ],
  },
  'real-estate': {
    title: 'Real Estate Agents',
    headline: 'Your properties deserve to be seen. Not buried in listings.',
    subheadline: 'Create a professional portfolio page showcasing your properties, credentials, and client testimonials. Share via WhatsApp with one tap.',
    painPoints: [
      'Properties get lost in crowded listing sites',
      'No professional online presence beyond 99acres',
      'Hard to share multiple properties with a client',
      'No way to track which clients viewed what',
    ],
    solutions: [
      { title: 'Property Portfolio', description: 'Showcase all your listings with photos, prices, and details on one beautiful page.' },
      { title: 'Client Lead Capture', description: 'Interested buyers fill a form directly. You get their details instantly.' },
      { title: 'WhatsApp Sharing', description: 'Share your entire portfolio with a single WhatsApp message. No PDFs needed.' },
      { title: 'View Analytics', description: 'See which properties get the most views. Focus on what sells.' },
    ],
  },
  salons: {
    title: 'Salons & Spas',
    headline: 'Your salon is beautiful. Now let customers discover it online.',
    subheadline: 'Showcase your services, prices, and portfolio. Let customers book appointments directly from their phone.',
    painPoints: [
      'Customers don\'t know your full service menu',
      'No online booking — phone calls only',
      'Can\'t showcase your work (before/after photos)',
      'Losing customers to salons with better online presence',
    ],
    solutions: [
      { title: 'Service Menu with Prices', description: 'List all services with prices, duration, and descriptions. No surprises for customers.' },
      { title: 'Online Booking', description: 'Customers book their preferred time slot directly. Reduce no-shows.' },
      { title: 'Work Portfolio', description: 'Show before/after photos, hairstyles, nail art. Let your work speak.' },
      { title: 'Offers & Packages', description: 'Promote seasonal offers and packages. Drive repeat visits.' },
    ],
  },
};

// =============================================================================
// Page
// =============================================================================
export function generateStaticParams() {
  return Object.keys(INDUSTRIES).map(industry => ({ industry }));
}

export function generateMetadata({ params }: { params: { industry: string } }) {
  const data = INDUSTRIES[params.industry];
  if (!data) return { title: 'Parichay for Your Business' };
  return {
    title: `Parichay for ${data.title} | Digital Business Profile`,
    description: data.subheadline,
  };
}

export default function IndustryPage({ params }: { params: { industry: string } }) {
  const data = INDUSTRIES[params.industry];
  if (!data) notFound();

  const demoUrl = getDemoUrlForIndustry(params.industry);

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100/80 flex items-center justify-between px-6 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="text-lg font-bold text-gray-900 tracking-tight">Parichay</span>
        </Link>
        <Link href="/register" className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm">
          Start Free Trial
        </Link>
      </nav>

      {/* Hero */}
      <section className="py-20 px-6 bg-gradient-to-b from-primary-50/50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-sm font-medium text-primary-600">Parichay for {data.title}</span>
          <h1 className="mt-4 text-3xl md:text-5xl font-bold text-gray-900 leading-tight">{data.headline}</h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">{data.subheadline}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors">
              Create Your Profile — Free <ArrowRight className="w-5 h-5" />
            </Link>
            {demoUrl && (
              <Link
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-primary-600 text-primary-700 font-medium rounded-xl hover:bg-primary-50 transition-colors"
              >
                View Live Demo <Eye className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Sound familiar?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.painPoints.map(point => (
              <div key={point} className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                <span className="text-red-500 mt-0.5">✗</span>
                <span className="text-sm text-gray-700">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Here's how Parichay helps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.solutions.map(sol => (
              <div key={sol.title} className="p-6 bg-white rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold text-gray-900">{sol.title}</h3>
                </div>
                <p className="text-sm text-gray-600 ml-7">{sol.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Ready to grow your {data.title.toLowerCase()} business?</h2>
          <p className="mt-3 text-primary-100">14-day free trial. No credit card. Setup in 5 minutes.</p>
          <Link href="/register" className="mt-6 inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-xl">
            Start Free Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

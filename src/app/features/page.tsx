import PublicPageLayout from '@/components/layout/PublicPageLayout';
import Link from 'next/link';
import {
  Globe, QrCode, Users, BarChart3, MapPin, MessageCircle,
  Smartphone, Shield, Zap, Calendar, Bell, Palette,
  ArrowRight,
} from 'lucide-react';

export const metadata = {
  title: 'Features | Parichay — Business Growth Platform',
  description: 'Everything you need to build your digital presence, capture leads, and grow your business online.',
};

const FEATURES = [
  { icon: Globe, title: 'Professional Business Profile', description: 'A beautiful page showcasing your services, photos, timings, and credentials. Your digital storefront.' },
  { icon: QrCode, title: 'QR Code & Short Links', description: 'Generate a QR code instantly. Print it on cards, banners, or menus. Customers scan and see your full profile.' },
  { icon: Users, title: 'Lead Capture Forms', description: 'Built-in enquiry forms that send you instant notifications. Never miss a potential customer.' },
  { icon: BarChart3, title: 'Analytics Dashboard', description: 'See who visits your profile, which services they view, and where they come from. Data-driven growth.' },
  { icon: MapPin, title: 'Google Maps & Directions', description: 'Embedded map with one-tap directions. Make it effortless for customers to find you.' },
  { icon: MessageCircle, title: 'WhatsApp Integration', description: 'One-tap WhatsApp button on your profile. Customers message you directly — no friction.' },
  { icon: Smartphone, title: 'Mobile-First Design', description: 'Looks perfect on every device. 80% of your visitors will be on mobile — we optimize for that.' },
  { icon: Shield, title: 'Verified Business Badge', description: 'Build trust with a verified badge. Customers know you are legitimate at first glance.' },
  { icon: Calendar, title: 'Appointment Booking', description: 'Let customers book time slots directly from your profile. Reduce phone calls, increase bookings.' },
  { icon: Bell, title: 'Instant Notifications', description: 'Get email and SMS alerts the moment a lead comes in. Respond fast, close more.' },
  { icon: Palette, title: 'Custom Branding', description: 'Your colors, your logo, your domain. The profile feels like yours, not a template.' },
  { icon: Zap, title: 'Instant Updates', description: 'Change your menu, add a service, update timings — live instantly. No developer needed.' },
];

export default function FeaturesPage() {
  return (
    <PublicPageLayout>
      {/* Hero */}
      <section className="py-20 px-6 bg-gradient-to-b from-indigo-50/40 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[12px] font-semibold text-indigo-600 uppercase tracking-wider mb-3">Platform Features</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Everything you need to grow your business online
          </h1>
          <p className="mt-5 text-[16px] text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Not a website builder. A complete business growth platform — from discovery to lead capture to analytics.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="group p-6 bg-white border border-gray-100 rounded-2xl hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50/50 transition-all duration-300">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                <f.icon className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-[15px] font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-[13px] text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-gray-50/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900">See it in action</h2>
          <p className="mt-3 text-gray-500 text-[15px]">Create your profile in 5 minutes and experience all features with a 14-day free trial.</p>
          <Link href="/register" className="mt-6 inline-flex items-center gap-2 h-11 px-7 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[14px] font-medium rounded-xl shadow-lg shadow-indigo-500/20 transition-all">
            Create My Business Profile <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </PublicPageLayout>
  );
}

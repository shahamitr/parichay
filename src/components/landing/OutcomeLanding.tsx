'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  QrCode,
  Users,
  BarChart3,
  MapPin,
  MessageCircle,
  Phone,
  Star,
  Shield,
  TrendingUp,
  ChevronDown,
  Sparkles,
  Zap,
  Globe,
  Smartphone,
  Layout,
  Play,
  Award,
  Layers,
  Target,
  Rocket,
} from 'lucide-react';
import Link from 'next/link';

const CommonFooter = dynamic(() => import('../layout/CommonFooter'), { ssr: false });

// =============================================================================
// Animations
// =============================================================================
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

// =============================================================================
// Data
// =============================================================================
const BENEFITS = [
  {
    icon: Globe,
    title: 'Get Discovered Online',
    description: 'Show up when customers search. Your own unique URL — easy to share anywhere.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Shield,
    title: 'Build Instant Trust',
    description: 'Verified profile with reviews, services, and contact info that builds confidence.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Users,
    title: 'Capture Every Lead',
    description: 'Contact forms, WhatsApp integration, instant notifications. Never miss an opportunity.',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
  {
    icon: TrendingUp,
    title: 'Grow with Insights',
    description: 'Real-time analytics show what works. Know which services attract customers.',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
];

const FEATURES = [
  { icon: QrCode, title: 'QR Code Sharing', description: 'Print on cards, menus, or banners' },
  { icon: Smartphone, title: 'Mobile First', description: 'Perfect on every device automatically' },
  { icon: MessageCircle, title: 'WhatsApp Button', description: 'One-tap customer connection' },
  { icon: MapPin, title: 'Google Maps', description: 'Help customers find your location' },
  { icon: BarChart3, title: 'Live Analytics', description: 'Track views, leads, and growth' },
  { icon: Layout, title: 'Catalog & Menu', description: 'Showcase products beautifully' },
  { icon: Layers, title: 'Multi-Branch', description: 'Manage all locations in one place' },
  { icon: Target, title: 'Lead CRM', description: 'Track and convert every enquiry' },
  { icon: Award, title: 'Custom Domain', description: 'Use your own branded URL' },
];

const INDUSTRIES = [
  { name: 'Doctors & Clinics', emoji: '🏥', href: '/demo-healthcare-professionals/main' },
  { name: 'Restaurants & Cafes', emoji: '🍽️', href: '/demo-restaurants-cafes/main' },
  { name: 'Real Estate', emoji: '🏠', href: '/demo-real-estate-agents/main' },
  { name: 'Salons & Spas', emoji: '💇', href: '/demo-creatives-designers/main' },
  { name: 'Consultants', emoji: '💼', href: '/demo-freelancers-consultants/main' },
  { name: 'Corporate', emoji: '🏢', href: '/demo-corporate-professionals/main' },
  { name: 'Event Planners', emoji: '🎉', href: '/demo-event-planners/main' },
  { name: 'Education', emoji: '🎓', href: '/demo-educational-institutions/main' },
  { name: 'Sports Shops', emoji: '🏆', href: '/demo-sports-shops/main' },
  { name: 'Medical Stores', emoji: '💊', href: '/demo-medical-shops/main' },
  { name: 'Decoration Shops', emoji: '🪔', href: '/demo-decoration-shops/main' },
  { name: 'Pet Care', emoji: '🐾', href: '/demo-pet-care/main' },
  { name: 'Auto Services', emoji: '🚗', href: '/demo-automobile-services/main' },
  { name: 'Grocery Stores', emoji: '🛒', href: '/demo-grocery-stores/main' },
  { name: 'Legal Services', emoji: '⚖️', href: '/demo-legal-services/main' },
  { name: 'All Industries', emoji: '🌐', href: '/demo/industries' },
];

const STEPS = [
  { step: '01', title: 'Sign up in seconds', description: 'Enter your name and email. No credit card needed.', icon: Zap },
  { step: '02', title: 'Add your details', description: 'Services, photos, location — guided step by step.', icon: Layout },
  { step: '03', title: 'Go live & grow', description: 'Share via WhatsApp, QR code, or your unique link.', icon: Rocket },
];

const COMPARISON = [
  { feature: 'Setup time', parichay: '5 minutes', traditional: '2-4 weeks' },
  { feature: 'Annual cost', parichay: 'From ₹99/mo', traditional: '₹30,000+' },
  { feature: 'Lead capture', parichay: 'Built-in', traditional: 'Extra plugins' },
  { feature: 'WhatsApp integration', parichay: 'One tap', traditional: 'Not available' },
  { feature: 'Mobile optimized', parichay: 'Automatic', traditional: 'Extra cost' },
  { feature: 'QR code', parichay: 'Included', traditional: 'Not available' },
  { feature: 'Analytics', parichay: 'Real-time', traditional: 'Separate tool' },
  { feature: 'Updates', parichay: 'Instant', traditional: 'Wait for developer' },
];

const FAQS = [
  { q: 'Do I need technical skills?', a: 'Not at all. If you can fill a form, you can create your profile. No coding, no design skills needed.' },
  { q: 'How is this different from a website?', a: 'Parichay is a business growth platform, not just a website builder. You get lead capture, analytics, QR codes, and WhatsApp sharing — all built in.' },
  { q: 'Can I try it for free?', a: 'Yes. You get a full 14-day trial with all features. No credit card required.' },
  { q: 'What happens after the trial?', a: 'You can continue on our Individual plan at ₹99/month, or upgrade to Business at ₹199/month for more features.' },
  { q: 'Can I use my own domain?', a: 'Yes, on the Business plan you can connect your own custom domain.' },
  { q: 'How do customers find my profile?', a: 'Share your link via WhatsApp, print QR codes, add to Google Business, or share on social media.' },
];

const STATS = [
  { value: '10,000+', label: 'Profiles Created' },
  { value: '5 min', label: 'Setup Time' },
  { value: '3.2x', label: 'More Leads' },
  { value: '50+', label: 'Industries Served' },
];

// =============================================================================
// Component
// =============================================================================
export default function OutcomeLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased overflow-x-hidden">

      {/* ─── NAVIGATION ─── */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-6 lg:px-12 z-50">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="text-[18px] font-bold text-gray-900 tracking-tight">Parichay</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-gray-500">
          <a href="#benefits" className="hover:text-gray-900 transition-colors">Benefits</a>
          <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How It Works</a>
          <a href="#industries" className="hover:text-gray-900 transition-colors">Industries</a>
          <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors hidden sm:block px-4 py-2 rounded-lg hover:bg-gray-50">
            Sign in
          </Link>
          <Link
            href="/register"
            className="h-9 px-5 flex items-center bg-gray-900 hover:bg-gray-800 text-white text-[13px] font-semibold rounded-lg transition-all shadow-sm"
          >
            Start Free
          </Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="pt-32 pb-24 lg:pt-40 lg:pb-32 px-6 relative">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-slate-50 via-white to-white" />
          <div className="absolute top-32 left-[15%] w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-[100px]" />
          <div className="absolute top-48 right-[10%] w-[400px] h-[400px] bg-violet-100/30 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full mb-8">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-[12px] font-semibold text-indigo-700 tracking-wide uppercase">Trusted by 10,000+ Indian Businesses</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold tracking-[-0.04em] leading-[1.05] text-gray-900">
              Turn Every Interaction{' '}
              <br className="hidden sm:block" />
              Into a{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                Business Opportunity
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p variants={fadeUp} className="mt-6 text-lg lg:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-normal">
              Create a professional digital presence with built-in lead capture, analytics, and sharing tools. Ready in{' '}
              <strong className="text-gray-700 font-semibold">5 minutes</strong>.
            </motion.p>

            {/* CTA */}
            <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="group h-[52px] px-8 flex items-center gap-2.5 bg-gray-900 hover:bg-gray-800 text-white text-[15px] font-semibold rounded-xl transition-all shadow-xl shadow-gray-900/10 hover:shadow-2xl hover:shadow-gray-900/20 hover:-translate-y-0.5"
              >
                Create My Profile — Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/demo/industries" className="group h-[52px] px-6 flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-xl transition-all hover:bg-gray-50">
                <Play className="w-4 h-4" />
                See Live Demos
              </Link>
            </motion.div>

            {/* Trust signals */}
            <motion.div variants={fadeUp} className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[13px] text-gray-400">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" />No credit card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" />Ready in 5 minutes</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" />14-day free trial</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" />Cancel anytime</span>
            </motion.div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-20 relative max-w-4xl mx-auto"
          >
            {/* Glow */}
            <div className="absolute -inset-4 bg-gradient-to-b from-indigo-200/30 via-violet-200/20 to-transparent rounded-3xl blur-2xl" />

            {/* Browser frame */}
            <div className="relative bg-white rounded-2xl shadow-2xl shadow-gray-200/60 border border-gray-200/80 overflow-hidden">
              {/* Browser toolbar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/80">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 bg-white border border-gray-200 rounded-lg text-[11px] text-gray-400 font-mono">
                    parichay.io/the-golden-spoon
                  </div>
                </div>
              </div>

              {/* Mock content */}
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Profile Header */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        GS
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">The Golden Spoon</h3>
                        <p className="text-sm text-gray-500">Fine Dining • Mumbai, MH</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i <= 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">4.9 (128)</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div className="flex gap-2 mb-5">
                      <div className="flex items-center gap-1.5 px-3 py-2 bg-green-50 border border-green-100 rounded-lg text-xs font-medium text-green-700">
                        <Phone className="w-3.5 h-3.5" /> Call
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-lg text-xs font-medium text-emerald-700">
                        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg text-xs font-medium text-blue-700">
                        <MapPin className="w-3.5 h-3.5" /> Directions
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Popular Items</p>
                      {[
                        { name: 'Butter Chicken Thali', price: '₹320' },
                        { name: 'Paneer Tikka Platter', price: '₹280' },
                        { name: "Chef's Special Biryani", price: '₹350' },
                      ].map((item) => (
                        <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <span className="text-sm font-medium text-gray-700">{item.name}</span>
                          <span className="text-sm font-bold text-indigo-600">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Side stats */}
                  <div className="w-full sm:w-[200px] space-y-3">
                    <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                      <p className="text-2xl font-bold text-indigo-700">248</p>
                      <p className="text-xs text-indigo-600 font-medium">Profile Views Today</p>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <p className="text-2xl font-bold text-emerald-700">12</p>
                      <p className="text-xs text-emerald-600 font-medium">New Leads This Week</p>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                      <p className="text-2xl font-bold text-amber-700">4.9</p>
                      <p className="text-xs text-amber-600 font-medium">Customer Rating</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="py-16 border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="text-3xl sm:text-4xl font-extrabold text-gray-900">{s.value}</p>
                <p className="text-[13px] text-gray-500 mt-1.5 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BENEFITS ─── */}
      <section id="benefits" className="py-24 lg:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <span className="inline-block px-3 py-1.5 bg-indigo-50 text-indigo-700 text-[11px] font-bold uppercase tracking-widest rounded-full mb-5">Why Parichay</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Everything you need to grow<br className="hidden sm:block" /> your business online
              </h2>
              <p className="mt-5 text-gray-500 text-lg max-w-xl mx-auto">
                No developers. No agencies. No waiting weeks. Just results from day one.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group p-7 lg:p-8 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/80 transition-all duration-300"
              >
                <div className={`w-12 h-12 ${b.bg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <b.icon className={`w-6 h-6 ${b.color}`} />
                </div>
                <h3 className="text-[18px] font-bold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-[15px] text-gray-500 leading-relaxed">{b.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES GRID ─── */}
      <section className="py-24 px-6 bg-gray-50/80">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <span className="inline-block px-3 py-1.5 bg-violet-50 text-violet-700 text-[11px] font-bold uppercase tracking-widest rounded-full mb-5">Features</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Packed with powerful tools
              </h2>
              <p className="mt-4 text-gray-500 text-lg max-w-md mx-auto">
                Everything a growing business needs, right out of the box.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center text-center p-5 lg:p-6 bg-white border border-gray-100 rounded-2xl hover:shadow-lg hover:border-gray-200 transition-all duration-200"
              >
                <div className="w-11 h-11 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center mb-3">
                  <f.icon className="w-5 h-5 text-gray-700" />
                </div>
                <h4 className="text-[14px] font-semibold text-gray-900">{f.title}</h4>
                <p className="text-[12px] text-gray-500 mt-1">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-24 lg:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <span className="inline-block px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-widest rounded-full mb-5">How It Works</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Live in 3 simple steps
              </h2>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                  <s.icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest">Step {s.step}</span>
                <h3 className="text-lg font-bold text-gray-900 mt-2 mb-2">{s.title}</h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INDUSTRIES ─── */}
      <section id="industries" className="py-24 px-6 bg-gray-50/80">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="inline-block px-3 py-1.5 bg-orange-50 text-orange-700 text-[11px] font-bold uppercase tracking-widest rounded-full mb-5">Built For You</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Perfect for every industry
            </h2>
            <p className="mt-4 text-gray-500 max-w-lg mx-auto text-lg">
              See live demos tailored to your profession.
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {INDUSTRIES.map((ind, i) => (
              <motion.div
                key={ind.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.02 }}
              >
                <Link
                  href={ind.href}
                  className="flex items-center gap-3 p-3.5 bg-white border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-md transition-all duration-200 text-left group"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">{ind.emoji}</span>
                  <span className="text-[12px] sm:text-[13px] font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{ind.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-8">
            <Link href="/demo/industries" className="inline-flex items-center gap-2 text-[14px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              Explore all industry demos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── COMPARISON TABLE ─── */}
      <section id="pricing" className="py-24 lg:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <span className="inline-block px-3 py-1.5 bg-rose-50 text-rose-700 text-[11px] font-bold uppercase tracking-widest rounded-full mb-5">Compare</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Parichay vs Traditional Website
              </h2>
              <p className="mt-4 text-gray-500 text-lg">See why businesses are switching.</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
          >
            <div className="grid grid-cols-3 text-center py-4 bg-gray-50 border-b border-gray-200">
              <div className="text-[13px] font-semibold text-gray-500">Feature</div>
              <div className="text-[13px] font-bold text-indigo-700">Parichay</div>
              <div className="text-[13px] font-semibold text-gray-500">Traditional</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-3 text-center py-4 px-4 ${i < COMPARISON.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className="text-[13px] text-gray-600 font-medium text-left pl-4">{row.feature}</div>
                <div className="text-[13px] font-semibold text-gray-900">{row.parichay}</div>
                <div className="text-[13px] text-gray-400">{row.traditional}</div>
              </div>
            ))}
          </motion.div>

          <div className="text-center mt-10">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 h-12 px-8 bg-gray-900 hover:bg-gray-800 text-white text-[14px] font-semibold rounded-xl transition-all shadow-lg shadow-gray-900/10"
            >
              Start Your Free Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-24 px-6 bg-gray-50/80">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <span className="inline-block px-3 py-1.5 bg-cyan-50 text-cyan-700 text-[11px] font-bold uppercase tracking-widest rounded-full mb-5">FAQ</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Common questions
              </h2>
            </motion.div>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="text-[15px] font-semibold text-gray-900 pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-[14px] text-gray-500 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-24 lg:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Ready to grow your business?
            </h2>
            <p className="mt-5 text-lg text-gray-500 max-w-xl mx-auto">
              Join 10,000+ businesses who have transformed their customer acquisition with Parichay.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="group h-[52px] px-8 flex items-center justify-center gap-2.5 bg-gray-900 hover:bg-gray-800 text-white text-[15px] font-semibold rounded-xl transition-all shadow-xl shadow-gray-900/10"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="h-[52px] px-8 flex items-center justify-center text-[14px] font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
              >
                Talk to Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <CommonFooter />
    </div>
  );
}

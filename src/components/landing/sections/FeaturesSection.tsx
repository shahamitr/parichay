'use client';

import { motion } from 'framer-motion';
import {
  MessageCircle, MapPin, CreditCard, Image, Star, BarChart3,
  Globe, Link2, Clock, FileText, Share2, QrCode, Languages, Search,
} from 'lucide-react';

const features = [
  { icon: MessageCircle, title: 'WhatsApp Chat', description: 'One-tap customer connection' },
  { icon: MapPin, title: 'Google Maps', description: 'Help customers find you' },
  { icon: CreditCard, title: 'Payments', description: 'Accept payments online' },
  { icon: Image, title: 'Photo Gallery', description: 'Showcase your work' },
  { icon: Star, title: 'Reviews', description: 'Build trust with testimonials' },
  { icon: BarChart3, title: 'Analytics', description: 'Track views and leads' },
  { icon: Search, title: 'SEO Optimized', description: 'Get found on Google' },
  { icon: Globe, title: 'Custom Domain', description: 'Use your own URL' },
  { icon: Clock, title: 'Business Hours', description: 'Show when you\'re open' },
  { icon: FileText, title: 'Lead Forms', description: 'Capture customer inquiries' },
  { icon: Share2, title: 'Social Links', description: 'Connect all platforms' },
  { icon: QrCode, title: 'QR Code', description: 'Print-ready codes' },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 lg:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1.5 bg-cyan-50 text-cyan-700 text-[11px] font-bold uppercase tracking-widest rounded-full mb-5">Everything Included</span>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#0F172A]">
            One platform, every tool you need.
          </h2>
          <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">No plugins, no add-ons, no hidden costs. Everything works out of the box.</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.03, duration: 0.4 }}
              className="group p-5 bg-white border border-gray-100 rounded-2xl hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50/50 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-indigo-50 flex items-center justify-center mb-3 transition-colors">
                <f.icon className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
              </div>
              <h4 className="text-[14px] font-semibold text-[#0F172A]">{f.title}</h4>
              <p className="text-[12px] text-gray-500 mt-1">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, MapPin, Star, Calendar } from 'lucide-react';

const industries = [
  { id: 'salon', label: 'Salon', name: 'Glow Beauty Studio', tagline: 'Premium Hair & Beauty', color: '#EC4899' },
  { id: 'doctor', label: 'Doctor', name: 'Dr. Priya Sharma', tagline: 'Cardiologist • MBBS, MD', color: '#EF4444' },
  { id: 'restaurant', label: 'Restaurant', name: 'Spice Garden', tagline: 'Authentic Indian Cuisine', color: '#F59E0B' },
  { id: 'lawyer', label: 'Lawyer', name: 'Adv. Rahul Mehta', tagline: 'Corporate & Civil Law', color: '#6B7280' },
  { id: 'freelancer', label: 'Freelancer', name: 'Ankit Designs', tagline: 'UI/UX • Brand Identity', color: '#8B5CF6' },
  { id: 'gym', label: 'Gym', name: 'Iron Pulse Fitness', tagline: 'Transform Your Body', color: '#10B981' },
];

export default function LiveDemoSection() {
  const [active, setActive] = useState(0);
  const current = industries[active];

  return (
    <section id="live-demo" className="py-24 lg:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-14"
        >
          <span className="inline-block px-3 py-1.5 bg-violet-50 text-violet-700 text-[11px] font-bold uppercase tracking-widest rounded-full mb-5">Live Preview</span>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#0F172A]">
            See it in action.
          </h2>
          <p className="mt-4 text-gray-500 text-lg max-w-lg mx-auto">Click any industry to preview a business profile.</p>
        </motion.div>

        {/* Industry Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {industries.map((ind, i) => (
            <button
              key={ind.id}
              onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${
                active === i
                  ? 'bg-[#0F172A] text-white shadow-lg'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {ind.label}
            </button>
          ))}
        </div>

        {/* Phone Mockup */}
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[340px] mx-auto"
        >
          <div className="relative bg-[#0F172A] rounded-[3rem] p-3 shadow-2xl shadow-gray-900/30">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[25px] bg-[#0F172A] rounded-b-2xl z-10" />
            <div className="bg-white rounded-[2.2rem] overflow-hidden">
              {/* Header */}
              <div className="h-32 relative flex items-end p-5" style={{ background: `linear-gradient(135deg, ${current.color}, ${current.color}CC)` }}>
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative flex items-center gap-3">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg text-lg font-bold" style={{ color: current.color }}>
                    {current.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-white">{current.name}</h4>
                    <p className="text-[11px] text-white/80">{current.tagline}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex justify-around py-4 border-b border-gray-100">
                {[{ icon: Phone, label: 'Call' }, { icon: MessageCircle, label: 'Chat' }, { icon: MapPin, label: 'Map' }, { icon: Calendar, label: 'Book' }].map(a => (
                  <div key={a.label} className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                      <a.icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-[9px] text-gray-500 font-medium">{a.label}</span>
                  </div>
                ))}
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center gap-1 py-3">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                <span className="text-xs text-gray-500 ml-1">4.9</span>
              </div>

              {/* Services */}
              <div className="px-4 pb-4 space-y-2">
                {['Service One', 'Service Two', 'Service Three'].map((s, i) => (
                  <div key={s} className="flex justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-[12px] font-medium text-gray-700">{s}</span>
                    <span className="text-[12px] font-bold" style={{ color: current.color }}>₹{(i+1) * 500}</span>
                  </div>
                ))}
              </div>

              <div className="px-4 pb-5">
                <div className="w-full py-3 rounded-xl text-center text-[12px] font-semibold text-white" style={{ backgroundColor: current.color }}>
                  Contact Now
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

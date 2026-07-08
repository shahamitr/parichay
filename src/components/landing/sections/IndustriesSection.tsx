'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const industries = [
  '🏥 Doctors', '🍽️ Restaurants', '💇 Salons', '⚖️ Lawyers',
  '💼 Consultants', '🏋️ Gyms', '🎓 Tutors', '🏠 Real Estate',
  '📸 Photographers', '🎉 Event Planners', '🏢 Agencies', '🛍️ Shops',
  '🚗 Auto Services', '💊 Pharmacies', '🐾 Pet Care', '🪔 Decor',
  '🧑‍🍳 Caterers', '🧘 Yoga Studios', '🎨 Artists', '📱 Tech',
  '👨‍🏫 Coaches', '🛒 Grocery', '🏆 Sports', '🌐 All Industries',
];

export default function IndustriesSection() {
  return (
    <section className="py-24 lg:py-32 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-14"
        >
          <span className="inline-block px-3 py-1.5 bg-amber-50 text-amber-700 text-[11px] font-bold uppercase tracking-widest rounded-full mb-5">Industries</span>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#0F172A]">
            Designed for businesses of every size.
          </h2>
          <p className="mt-4 text-gray-500 text-lg">Whatever your profession, Parichay has a template for you.</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {industries.map((ind, i) => (
            <motion.div
              key={ind}
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.02 }}
              className="flex items-center gap-2 px-3.5 py-3 bg-[#FAFAFC] border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all text-[12px] font-medium text-gray-700"
            >
              {ind}
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/demo/industries" className="text-[14px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
            Explore all industry demos →
          </Link>
        </div>
      </div>
    </section>
  );
}

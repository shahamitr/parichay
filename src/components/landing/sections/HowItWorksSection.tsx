'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Wand2, Globe, Share2 } from 'lucide-react';

const steps = [
  { icon: MessageSquare, title: 'Tell us about your business', description: 'Answer a few simple questions — business name, services, contact info.', color: 'from-indigo-500 to-violet-500' },
  { icon: Wand2, title: 'AI creates your profile', description: 'Our AI designs a professional microsite with your branding, content, and layout.', color: 'from-violet-500 to-purple-500' },
  { icon: Globe, title: 'Publish instantly', description: 'Your profile goes live at a unique URL. No hosting or domain setup needed.', color: 'from-purple-500 to-cyan-500' },
  { icon: Share2, title: 'Share everywhere', description: 'WhatsApp, QR code, social media, email signature — one link does it all.', color: 'from-cyan-500 to-indigo-500' },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1.5 bg-indigo-50 text-indigo-700 text-[11px] font-bold uppercase tracking-widest rounded-full mb-5">How It Works</span>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#0F172A]">
            Live in four simple steps.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg mb-5`}>
                <step.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-2">Step {i + 1}</div>
              <h3 className="text-[16px] font-bold text-[#0F172A] mb-2">{step.title}</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

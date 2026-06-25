'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Share2, Target, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

export default function TransformationSteps() {
  const { t } = useTranslation();

  const steps = [
    {
      title: t.landing.transformation.step1,
      desc: 'Build your verified professional node in under 2 minutes.',
      icon: <UserPlus className="w-8 h-8" />,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: t.landing.transformation.step2,
      desc: 'Connect with customers instantly via a simple link or QR scan.',
      icon: <Share2 className="w-8 h-8" />,
      color: 'from-indigo-600 to-violet-600'
    },
    {
      title: t.landing.transformation.step3,
      desc: 'Transform interactions into a searchable, growing database.',
      icon: <Target className="w-8 h-8" />,
      color: 'from-violet-600 to-emerald-500'
    }
  ];

  return (
    <section className="py-32 px-6 lg:px-8 bg-[#080809]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-8">
            Invisible to <span className="text-emerald-400">Discoverable.</span>
          </h2>
          <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">
            Three simple steps to transition your offline business into the digital network.
          </p>
        </div>

        <div className="relative grid md:grid-cols-3 gap-12 lg:gap-24">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-emerald-500/20 -translate-y-1/2 z-0"></div>

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className={`w-24 h-24 rounded-[2rem] bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500 mb-8 relative`}>
                <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]"></div>
                {step.icon}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#080809] border-2 border-white/10 flex items-center justify-center text-xs font-black text-white">
                  0{i + 1}
                </div>
              </div>
              <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{step.title}</h3>
              <p className="text-slate-500 font-bold leading-relaxed px-4">{step.desc}</p>
              
              {i < 2 && (
                <div className="md:hidden mt-8 text-slate-700">
                  <ArrowRight className="w-8 h-8 rotate-90" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

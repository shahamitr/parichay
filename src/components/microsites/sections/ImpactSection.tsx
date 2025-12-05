'use client';

import { Brand, Branch } from '@/generated/prisma';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { TrendingUp, Users, MapPin, Star, Award, Target } from 'lucide-react';

interface MetricItem {
  value: string;
  label: string;
  icon?: string;
}

interface ImpactSectionProps {
  config: {
    enabled: boolean;
    metrics: MetricItem[];
  };
  brand: Brand;
  branch: Branch;
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<any>> = {
  trending: TrendingUp,
  users: Users,
  location: MapPin,
  star: Star,
  award: Award,
  target: Target,
};

// Animated counter component
function AnimatedCounter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(startValue + (end - startValue) * easeOutQuart);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

// Parse metric value to extract number and suffix
function parseMetricValue(value: string): { number: number; suffix: string } | null {
  const match = value.match(/^(\d+(?:,\d{3})*|\d+)([+%KkMm]*)$/);
  if (match != null) {
    const number = parseInt(match[1].replace(/,/g, ''), 10);
    const suffix = match[2] || '';
    return { number, suffix };
  }
  return null;
}

export default function ImpactSection({ config, brand, branch }: ImpactSectionProps) {
  if (!config.enabled || !config.metrics || config.metrics.length === 0) {
null;
  }

  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={containerRef}
      className="relative min-h-full bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-hidden border-b border-gray-200"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary-200 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-200 rounded-full blur-3xl opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mb-4 shadow-lg">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-h2 font-bold text-gray-900 mb-3">Our Impact</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full"></div>
          <p className="text-body text-gray-600 mt-4 max-w-2xl mx-auto leading-relaxed">
            Numbers that speak for themselves
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {config.metrics.map((metric, index) => {
            const IconComponent = metric.icon ? iconMap[metric.icon] || Target : Target;
            const parsedValue = parseMetricValue(metric.value);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                  {/* Gradient accent on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-primary-600" />
                    </div>

                    {/* Metric Value */}
                    <div className="text-hero font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">
                      {parsedValue ? (
                        <>
                          <AnimatedCounter end={parsedValue.number} />
                          {parsedValue.suffix}
                        </>
                      ) : (
                        metric.value
                      )}
                    </div>

                    {/* Metric Label */}
                    <p className="text-base font-medium text-gray-600 leading-tight">
                      {metric.label}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Optional CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-body text-gray-600 leading-relaxed">
            Join thousands of satisfied customers who trust {brand.name}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

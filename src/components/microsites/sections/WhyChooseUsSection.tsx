'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Award, Shield, Clock, Users, ThumbsUp, Zap,
  CheckCircle, Star, TrendingUp, Heart
} from 'lucide-react';
import { Brand, Branch } from '@/generated/prisma';

interface WhyChooseUsSectionProps {
  brand: Brand;
  branch: Branch;
  config?: {
    title?: string;
    subtitle?: string;
    features?: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
}

const iconMap: Record<string, any> = {
  award: Award,
  shield: Shield,
  clock: Clock,
  users: Users,
  thumbsUp: ThumbsUp,
  zap: Zap,
  checkCircle: CheckCircle,
  star: Star,
  trendingUp: TrendingUp,
  heart: Heart,
};

const defaultFeatures = [
  {
    icon: 'award',
    title: 'Industry Expertise',
    description: 'Years of experience delivering exceptional results for our clients.',
  },
  {
    icon: 'shield',
    title: 'Quality Guaranteed',
    description: '100% satisfaction guarantee on all our services and products.',
  },
  {
    icon: 'clock',
    title: 'On-Time Delivery',
    description: 'We respect your time and always deliver as promised.',
  },
  {
    icon: 'users',
    title: 'Dedicated Support',
    description: '24/7 customer support to assist you whenever you need.',
  },
  {
    icon: 'thumbsUp',
    title: 'Trusted by Many',
    description: 'Thousands of satisfied customers trust us with their needs.',
  },
  {
    icon: 'zap',
    title: 'Fast & Efficient',
    description: 'Quick turnaround without compromising on quality.',
  },
];

export default function WhyChooseUsSection({ brand, branch, config }: WhyChooseUsSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const colorTheme = brand.colorTheme as any;
  const primaryColor = colorTheme?.primary || '#3B82F6';
  const features = config?.features || defaultFeatures;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {config?.title || 'Why Choose Us'}
          </h2>
          <div className="w-20 h-1 mx-auto rounded-full mb-4" style={{ backgroundColor: primaryColor }} />
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            {config?.subtitle || 'Discover what makes us the preferred choice for our customers'}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || CheckCircle;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={index}
                className={`relative group transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className={`relative bg-white rounded-3xl p-8 border-2 transition-all duration-300 ${
                  isHovered
                    ? 'border-transparent shadow-2xl -translate-y-2'
                    : 'border-gray-100 shadow-sm'
                }`}>
                  {/* Gradient Background on Hover */}
                  <div
                    className={`absolute inset-0 rounded-3xl transition-opacity duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor}08 0%, ${primaryColor}03 100%)`
                    }}
                  />

                  {/* Icon */}
                  <div className="relative mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isHovered ? 'scale-110' : ''
                      }`}
                      style={{
                        backgroundColor: isHovered ? primaryColor : `${primaryColor}15`,
                      }}
                    >
                      <Icon
                        className={`w-8 h-8 transition-colors duration-300`}
                        style={{ color: isHovered ? 'white' : primaryColor }}
                      />
                    </div>

                    {/* Decorative Ring */}
                    <div
                      className={`absolute -inset-2 rounded-3xl border-2 transition-all duration-300 ${
                        isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                      }`}
                      style={{ borderColor: `${primaryColor}30` }}
                    />
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Bottom Accent Line */}
                  <div
                    className={`absolute bottom-0 left-8 right-8 h-1 rounded-full transition-all duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ backgroundColor: primaryColor }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badge */}
        <div className={`mt-16 text-center transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white text-sm font-bold"
                  style={{
                    backgroundColor: `hsl(${i * 60}, 70%, 50%)`,
                    zIndex: 5 - i
                  }}
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">Trusted by 1000+ customers</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-gray-500 ml-1">4.9/5 rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

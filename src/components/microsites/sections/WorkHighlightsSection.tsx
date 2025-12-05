'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowRight, ExternalLink, Calendar, Users, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Brand, Branch } from '@/generated/prisma';

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  category: string;
  image: string;
  description: string;
  results?: {
    metric: string;
    value: string;
  }[];
  date?: string;
}

interface WorkHighlightsSectionProps {
  brand: Brand;
  branch: Branch;
  config?: {
    title?: string;
    subtitle?: string;
    caseStudies?: CaseStudy[];
  };
}

const defaultCaseStudies: CaseStudy[] = [
  {
    id: '1',
    title: 'Digital Transformation Project',
    client: 'Tech Corp India',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
    description: 'Complete digital overhaul resulting in 200% increase in online engagement.',
    results: [
      { metric: 'Engagement', value: '+200%' },
      { metric: 'Revenue', value: '+150%' },
      { metric: 'Efficiency', value: '+80%' },
    ],
    date: 'Jan 2024',
  },
  {
    id: '2',
    title: 'Brand Identity Redesign',
    client: 'Fashion House',
    category: 'Branding',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600',
    description: 'Complete brand refresh that increased market recognition by 300%.',
    results: [
      { metric: 'Recognition', value: '+300%' },
      { metric: 'Sales', value: '+120%' },
    ],
    date: 'Dec 2023',
  },
  {
    id: '3',
    title: 'E-commerce Platform Launch',
    client: 'Retail Giants',
    category: 'E-commerce',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600',
    description: 'Built a scalable e-commerce platform handling 10K+ daily orders.',
    results: [
      { metric: 'Daily Orders', value: '10K+' },
      { metric: 'Conversion', value: '+45%' },
    ],
    date: 'Nov 2023',
  },
];

export default function WorkHighlightsSection({ brand, branch, config }: WorkHighlightsSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const colorTheme = brand.colorTheme as any;
  const primaryColor = colorTheme?.primary || '#3B82F6';
  const caseStudies = config?.caseStudies || defaultCaseStudies;

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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section ref={sectionRef} className="py-20 bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {config?.title || 'Work Highlights'}
          </h2>
          <div className="w-20 h-1 mx-auto rounded-full mb-4" style={{ backgroundColor: primaryColor }} />
          <p className="text-gray-400 max-w-md mx-auto">
            {config?.subtitle || 'Explore our successful projects and case studies'}
          </p>
        </div>

        {/* Navigation Arrows */}
        <div className="hidden md:flex justify-end gap-2 mb-6">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Case Studies Slider */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {caseStudies.map((study, index) => (
            <div
              key={study.id}
              className={`flex-shrink-0 w-[350px] snap-center transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div
                className="bg-gray-800 rounded-3xl overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300"
                onClick={() => setSelectedStudy(study)}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={study.image}
                    alt={study.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />

                  {/* Category Badge */}
                  <div
                    className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {study.category}
                  </div>

                  {/* Date */}
                  {study.date && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white">
                      <Calendar className="w-3 h-3" />
                      {study.date}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-sm text-gray-400 mb-2">{study.client}</p>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {study.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {study.description}
                  </p>

                  {/* Results */}
                  {study.results && (
                    <div className="flex flex-wrap gap-3 mb-4">
                      {study.results.slice(0, 3).map((result, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 font-bold text-sm">{result.value}</span>
                          <span className="text-gray-500 text-xs">{result.metric}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* View More */}
                  <button
                    className="flex items-center gap-2 text-sm font-medium transition-colors group-hover:gap-3"
                    style={{ color: primaryColor }}
                  >
                    View Case Study
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {caseStudies.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'w-8 bg-white' : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Case Study Modal */}
      {selectedStudy && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedStudy(null)}
        >
          <div
            className="bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image */}
            <div className="relative h-64">
              <img
                src={selectedStudy.image}
                alt={selectedStudy.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent" />
              <button
                onClick={() => setSelectedStudy(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <div
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-4"
                style={{ backgroundColor: primaryColor }}
              >
                {selectedStudy.category}
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">{selectedStudy.title}</h3>
              <p className="text-gray-400 mb-6">{selectedStudy.client}</p>

              <p className="text-gray-300 leading-relaxed mb-8">{selectedStudy.description}</p>

              {/* Results Grid */}
              {selectedStudy.results && (
                <div className="grid grid-cols-3 gap-4">
                  {selectedStudy.results.map((result, i) => (
                    <div key={i} className="bg-gray-700/50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-green-400 mb-1">{result.value}</p>
                      <p className="text-sm text-gray-400">{result.metric}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `.scrollbar-hide::-webkit-scrollbar { display: none; }` }} />
    </section>
  );
}

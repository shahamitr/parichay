'use client';

import { useState, useRef, useEffect } from 'react';
import { Brand, Branch } from '@/generated/prisma';
import { ServicesSection as ServicesConfig, ServiceItem } from '@/types/microsite';
import { Briefcase, ChevronLeft, ChevronRight, Star, MessageCircle, Phone } from 'lucide-react';

interface ServicesSectionProps {
  config: ServicesConfig;
  brand: Brand;
  branch: Branch;
}

export default function ServicesSection({ config, brand, branch }: ServicesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const contact = branch.contact as any;
  const colorTheme = brand.colorTheme as any;
  const primaryColor = colorTheme?.primary || '#3B82F6';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleInquiry = (service: ServiceItem) => {
    const message = `Hi, I'm interested in: ${service.name}`;
    if (contact.whatsapp) {
      window.open(`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    } else if (contact.phone) {
      window.location.href = `tel:${contact.phone}`;
    }
  };

  if (!config.items || config.items.length === 0) {
    return (
      <section ref={sectionRef} className="relative py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
          <div className="w-20 h-1 mx-auto rounded-full mb-8" style={{ backgroundColor: primaryColor }} />
          <div className="py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500">Services coming soon</p>
          </div>
        </div>
      </section>
    );
  }


  return (
    <section ref={sectionRef} className="relative py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h2 id="services-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Our Services
        </h2>
        <div className="w-20 h-1 mx-auto rounded-full mb-4" style={{ backgroundColor: primaryColor }} />
        <p className="text-gray-500 max-w-md mx-auto">
          Explore our range of professional services
        </p>
      </div>

      {/* Navigation Arrows */}
      <div className="hidden md:flex absolute top-1/2 left-4 right-4 justify-between pointer-events-none z-10">
        <button
          onClick={() => scroll('left')}
          className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center pointer-events-auto hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center pointer-events-auto hover:bg-gray-50 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Horizontal Slider */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-6 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {config.items.map((service, index) => (
          <div
            key={service.id || `service-${index}`}
            className={`flex-shrink-0 w-80 snap-center transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
              {/* Service Image */}
              <div className="relative h-48 overflow-hidden">
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                    <Briefcase className="w-16 h-16" style={{ color: primaryColor }} />
                  </div>
                )}
                {/* Rating Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold text-gray-900">4.9</span>
                </div>
                {/* Category Badge */}
                {service.category && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: primaryColor }}>
                    {service.category}
                  </div>
                )}
              </div>

              {/* Service Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {service.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
                  {service.description}
                </p>

                {/* Price */}
                {service.price && (
                  <div className="mb-4">
                    <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                      ₹{service.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-gray-400 text-sm ml-1">onwards</span>
                  </div>
                )}

                {/* Features */}
                {service.features && service.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.features.slice(0, 3).map((feature, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                )}

                {/* Book Now Button - Sticky inside card */}
                <button
                  onClick={() => handleInquiry(service)}
                  className="w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  style={{ backgroundColor: primaryColor }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Enquiry
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll Indicator Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {config.items.slice(0, 5).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-6' : ''
              }`}
            style={{ backgroundColor: index === activeIndex ? primaryColor : '#E5E7EB' }}
          />
        ))}
      </div>

      {/* Hide scrollbar CSS */}
      <style dangerouslySetInnerHTML={{ __html: `.scrollbar-hide::-webkit-scrollbar { display: none; }` }} />
      </div>
    </section>
  );
}

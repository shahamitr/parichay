'use client';

import { Brand, Branch } from '@/generated/prisma';
import { TestimonialsSection as TestimonialsConfig } from '@/types/microsite';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { getImageWithFallback } from '@/lib/placeholder-utils';

interface TestimonialsSectionProps {
  config: TestimonialsConfig;
  brand: Brand;
  branch: Branch;
}

// Star Rating Component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

export default function TestimonialsSection({
  config,
  brand,
  branch,
}: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  if (!config.enabled || !config.items || config.items.length === 0) {
    return null;
  }

  const testimonials = config.items;
  const hasMultiple = testimonials.length > 1;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section
      ref={containerRef}
      className="relative bg-gray-50 py-20 px-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header - Clean */}
        <div className="text-center mb-16">
          <h2 id="testimonials-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            What Our Customers Say
          </h2>
          <div className="w-16 h-1 bg-brand-primary mx-auto rounded-full"></div>
        </div>

        {/* Testimonial Carousel - Clean Design 2 */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white rounded-2xl p-10 md:p-14 shadow-sm border border-gray-100">
            {/* Testimonial Content */}
            <div>
              {/* Customer Photo */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                  <img
                    src={
                      currentTestimonial.photo ||
                      getImageWithFallback(undefined, 'avatar', currentTestimonial.name)
                    }
                    alt={currentTestimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="flex justify-center mb-6">
                <StarRating rating={currentTestimonial.rating} />
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-lg sm:text-xl text-gray-700 leading-relaxed text-center mb-8">
                "{currentTestimonial.content}"
              </blockquote>

              {/* Customer Info */}
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">
                  {currentTestimonial.name}
                </p>
                <p className="text-base text-gray-600">
                  {currentTestimonial.role}
                </p>
              </div>
            </div>

            {/* Navigation Arrows */}
            {hasMultiple && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </>
            )}
          </div>

          {/* Carousel Indicators */}
          {hasMultiple && (
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? 'w-8 bg-brand-primary'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Grid View for Multiple Testimonials - Clean */}
        {testimonials.length > 3 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
              >
                {/* Mini Rating */}
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= testimonial.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-base text-gray-700 leading-relaxed mb-4 line-clamp-4">
                  "{testimonial.content}"
                </p>

                {/* Customer */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                    <img
                      src={
                        testimonial.photo ||
                        getImageWithFallback(undefined, 'avatar', testimonial.name)
                      }
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

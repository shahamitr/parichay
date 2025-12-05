'use client';

import { useState, useEffect, useRef } from 'react';
import { Brand, Branch } from '@/generated/prisma';
import { GallerySection as GalleryConfig } from '@/types/microsite';
import { X, ChevronLeft, ChevronRight, ZoomIn, Image as ImageIcon } from 'lucide-react';

interface GallerySectionProps {
  config: GalleryConfig;
  brand: Brand;
  branch: Branch;
}

export default function GallerySection({ config, brand, branch }: GallerySectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [autoPlayIndex, setAutoPlayIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const colorTheme = brand.colorTheme as any;
  const primaryColor = colorTheme?.primary || '#3B82F6';

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

  // Auto-play slider
  useEffect(() => {
    if (!config.images || config.images.length === 0) return;
    const interval = setInterval(() => {
      setAutoPlayIndex((prev) => (prev + 1) % config.images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [config.images]);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);
  const nextImage = () => setSelectedIndex((prev) => prev !== null ? (prev + 1) % config.images.length : 0);
  const prevImage = () => setSelectedIndex((prev) => prev !== null ? (prev - 1 + config.images.length) % config.images.length : 0);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex]);

  if (!config.images || config.images.length === 0) {
    return (
      <section ref={sectionRef} className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Gallery</h2>
          <div className="w-20 h-1 mx-auto rounded-full mb-8" style={{ backgroundColor: primaryColor }} />
          <div className="py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500">Gallery coming soon</p>
          </div>
        </div>
      </section>
    );
  }


  return (
    <section ref={sectionRef} className="py-20 bg-gray-900 overflow-hidden">
      {/* Section Header */}
      <div className={`text-center mb-12 px-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h2 id="gallery-heading" className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Our Gallery
        </h2>
        <div className="w-20 h-1 mx-auto rounded-full mb-4" style={{ backgroundColor: primaryColor }} />
        <p className="text-gray-400 max-w-md mx-auto">
          Take a look at our work and facilities
        </p>
      </div>

      {/* Featured Auto-play Slider */}
      <div className={`relative mb-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="relative h-64 md:h-96 overflow-hidden rounded-3xl mx-6">
          {config.images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ${
                index === autoPlayIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            >
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          ))}
          {/* Slider Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {config.images.slice(0, 6).map((_, index) => (
              <button
                key={index}
                onClick={() => setAutoPlayIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === autoPlayIndex ? 'w-8 bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Masonry Grid */}
      <div className={`px-6 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 max-w-6xl mx-auto">
          {config.images.map((image, index) => (
            <div
              key={index}
              className="break-inside-avoid mb-4 group cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  style={{ aspectRatio: index % 3 === 0 ? '3/4' : index % 2 === 0 ? '1/1' : '4/3' }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-50 group-hover:scale-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation */}
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image with Zoom Animation */}
          <div
            className="max-w-5xl max-h-[85vh] mx-4 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={config.images[selectedIndex]}
              alt={`Gallery ${selectedIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {selectedIndex + 1} / {config.images.length}
          </div>
        </div>
      )}
    </section>
  );
}

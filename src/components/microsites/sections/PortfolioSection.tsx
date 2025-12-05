// @ts-nocheck
'use client';

import { useState } from 'react';
import { ExternalLink, Play, X, ChevronLeft, ChevronRight, Calendar, User } from 'lucide-react';
import { Brand, Branch } from '@/generated/prisma';
import { PortfolioSection as PortfolioConfig, PortfolioItem } from '@/types/microsite';

interface PortfolioSectionProps {
  config: PortfolioConfig;
  brand: Brand;
  branch: Branch;
}

export default function PortfolioSection({ config, brand, branch }: PortfolioSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!config.enabled || !config.items || config.items.length === 0) return null;

  const categories = ['all', ...config.categories];
  const filteredItems = selectedCategory === 'all'
    ? config.items
    : config.items.filter(item => item.category === selectedCategory);

  const featuredItems = filteredItems.filter(item => item.featured);
  const regularItems = filteredItems.filter(item => !item.featured);

  const openLightbox = (item: PortfolioItem) => {
    setSelectedItem(item);
    setCurrentImageIndex(0);
  };

  const closeLightbox = () => {
    setSelectedItem(null);
    setCuntImageIndex(0);
  };

  const nextImage = () => {
    if (selectedItem && selectedItem.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedItem.images.length);
    }
  };

  const prevImage = () => {
    if (selectedItem && selectedItem.images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedItem.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 id="portfolio-heading" className="text-3xl font-bold text-gray-900 mb-3">
            Our Portfolio
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our work and see what we can do for you
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 2 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        )}

        {/* Portfolio Grid */}
        <div className={`grid gap-6 ${
          config.layout === 'masonry'
            ? 'columns-1 md:columns-2 lg:columns-3 space-y-6'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {[...featuredItems, ...regularItems].map((item) => (
            <div
              key={item.id}
              className={`group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer ${
                config.layout === 'masonry' ? 'break-inside-avoid mb-6' : ''
              } ${item.featured ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => openLightbox(item)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.images[0] || '/images/placeholder-portfolio.jpg'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.videoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="w-6 h-6 text-gray-900 ml-1" />
                    </div>
                  </div>
                )}
                {item.featured && (
                  <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
                {item.images.length > 1 && (
                  <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    +{item.images.length - 1} more
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  {item.link && (
                    <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                </div>
                {item.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p>
                )}
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedItem && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              onClick={closeLightbox}
            >
              <X className="w-8 h-8" />
            </button>

            <div
              className="w-full max-w-5xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image/Video Display */}
              <div className="relative">
                {selectedItem.videoUrl ? (
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={selectedItem.videoUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
</div>
                ) : (
                  <div className="relative">
                    <img
                      src={selectedItem.images[currentImageIndex]}
                      alt={selectedItem.title}
                      className="w-full max-h-[70vh] object-contain rounded-lg"
                    />
                    {selectedItem.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {selectedItem.images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                idx === currentImageIndex ? 'bg-white' : 'bg-white/40'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="mt-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{selectedItem.title}</h3>
                {selectedItem.description && (
                  <p className="text-gray-300 mb-4">{selectedItem.description}</p>
                )}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  {selectedItem.clientName && (
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {selectedItem.clientName}
                    </span>
                  )}
                  {selectedItem.projectDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(selectedItem.projectDate).toLocaleDateString()}
                    </span>
                  )}
                  {selectedItem.link && (
                    <a
                      href={selectedItem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Project
                    </a>
                  )}
                </div>
                {selectedItem.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedItem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-white/10 text-white px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

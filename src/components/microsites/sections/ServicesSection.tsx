'use client';

import { useState, useRef, useEffect } from 'react';
import { Brand, Branch } from '@/generated/prisma';
import { ServicesSection as ServicesConfig, ServiceItem } from '@/types/microsite';
import { Briefcase, ChevronLeft, ChevronRight, Star, MessageCircle, Plus, Trash2, GripVertical, Upload, ArrowRight } from 'lucide-react';
import { useServicesLayout } from '@/lib/layout-context';

// ============================================================================
// UNIFIED SERVICES SECTION - Supports both view and edit modes
// ============================================================================

interface ServicesSectionProps {
  mode?: 'view' | 'edit';
  config: ServicesConfig;
  brand?: Brand;
  branch?: Branch;
  onChange?: (data: ServicesConfig) => void;
}

export default function ServicesSection({
  mode = 'view',
  config,
  brand,
  branch,
  onChange,
}: ServicesSectionProps) {
  if (mode === 'edit') {
    return <ServicesEditor config={config} onChange={onChange!} />;
  }
  return <ServicesView config={config} brand={brand!} branch={branch!} />;
}

// ============================================================================
// VIEW COMPONENT - Layout-aware rendering
// ============================================================================
function ServicesView({
  config,
  brand,
  branch,
}: {
  config: ServicesConfig;
  brand: Brand;
  branch: Branch;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const contact = branch.contact as any;
  const colorTheme = brand.colorTheme as any;
  const primaryColor = colorTheme?.primary || '#3B82F6';

  // Get layout configuration
  const { variant, isGrid, isCarousel, isList, isMasonry, isTabs, isFlipCards, animationClass, corners } = useServicesLayout();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -320 : 320,
        behavior: 'smooth',
      });
    }
  };

  const handleInquiry = (service: ServiceItem) => {
    const message = `Hi, I'm interested in: ${service.name}`;
    if (contact?.whatsapp) {
      window.open(`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    } else if (contact?.phone) {
      window.location.href = `tel:${contact.phone}`;
    }
  };

  // Get corner classes based on layout
  const getCornerClass = () => {
    switch (corners) {
      case 'sharp': return 'rounded-none';
      case 'rounded': return 'rounded-xl';
      case 'pill': return 'rounded-3xl';
      default: return 'rounded-xl';
    }
  };

  if (!config.items || config.items.length === 0) {
    return (
      <section ref={sectionRef} className="relative py-20 bg-gradient-to-b from-neutral-50 dark:from-neutral-900 to-white dark:to-neutral-950">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Our Services</h2>
          <div className="w-20 h-1 mx-auto rounded-full mb-8" style={{ backgroundColor: primaryColor }} />
          <div className="py-12">
            <div className={`w-20 h-20 bg-neutral-100 dark:bg-neutral-800 ${getCornerClass()} flex items-center justify-center mx-auto mb-4`}>
              <Briefcase className="w-10 h-10 text-neutral-400" />
            </div>
            <p className="text-neutral-500">Services coming soon</p>
          </div>
        </div>
      </section>
    );
  }

  // Group services by category for tabs layout
  const categories = [...new Set(config.items.map(s => s.category || 'All Services'))];
  const getServicesForTab = (category: string) =>
    config.items.filter(s => (s.category || 'All Services') === category);

  return (
    <section ref={sectionRef} className="relative py-20 bg-gradient-to-b from-neutral-50 dark:from-neutral-900 to-white dark:to-neutral-950 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Our Services</h2>
          <div className="w-20 h-1 mx-auto rounded-full mb-4" style={{ backgroundColor: primaryColor }} />
          <p className="text-neutral-500 max-w-md mx-auto">Explore our range of professional services</p>
        </div>

        {/* TABS LAYOUT */}
        {isTabs && categories.length > 1 && (
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat, idx) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(idx)}
                  className={`px-6 py-3 ${getCornerClass()} font-medium transition-all ${
                    activeTab === idx
                      ? 'text-white shadow-lg'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                  style={activeTab === idx ? { backgroundColor: primaryColor } : {}}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CAROUSEL LAYOUT (Default) */}
        {isCarousel && (
          <>
            <div className="hidden md:flex absolute top-1/2 left-4 right-4 justify-between pointer-events-none z-10">
              <button onClick={() => scroll('left')} className={`w-12 h-12 bg-white dark:bg-neutral-800 rounded-full shadow-lg flex items-center justify-center pointer-events-auto hover:bg-neutral-50 ${animationClass}`}>
                <ChevronLeft className="w-6 h-6 text-neutral-600" />
              </button>
              <button onClick={() => scroll('right')} className={`w-12 h-12 bg-white dark:bg-neutral-800 rounded-full shadow-lg flex items-center justify-center pointer-events-auto hover:bg-neutral-50 ${animationClass}`}>
                <ChevronRight className="w-6 h-6 text-neutral-600" />
              </button>
            </div>
            <div ref={scrollRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
              {config.items.map((service, index) => (
                <ServiceCard key={service.id || index} service={service} index={index} isVisible={isVisible} primaryColor={primaryColor} onInquiry={handleInquiry} cornerClass={getCornerClass()} animationClass={animationClass} variant="carousel" />
              ))}
            </div>
          </>
        )}

        {/* GRID LAYOUT */}
        {isGrid && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {config.items.map((service, index) => (
              <ServiceCard key={service.id || index} service={service} index={index} isVisible={isVisible} primaryColor={primaryColor} onInquiry={handleInquiry} cornerClass={getCornerClass()} animationClass={animationClass} variant="grid" />
            ))}
          </div>
        )}

        {/* LIST LAYOUT */}
        {isList && (
          <div className="space-y-4 max-w-3xl mx-auto">
            {config.items.map((service, index) => (
              <div
                key={service.id || index}
                className={`flex gap-6 bg-white dark:bg-neutral-900 ${getCornerClass()} shadow-lg p-4 ${animationClass} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {service.image ? (
                  <img src={service.image} alt={service.name} className={`w-24 h-24 object-cover ${getCornerClass()} flex-shrink-0`} />
                ) : (
                  <div className={`w-24 h-24 flex items-center justify-center ${getCornerClass()} flex-shrink-0`} style={{ backgroundColor: `${primaryColor}15` }}>
                    <Briefcase className="w-8 h-8" style={{ color: primaryColor }} />
                  </div>
                )}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{service.name}</h3>
                      <p className="text-neutral-500 text-sm line-clamp-2">{service.description}</p>
                    </div>
                    {service.price !== undefined && service.price > 0 && (
                      <span className="text-xl font-bold flex-shrink-0 ml-4" style={{ color: primaryColor }}>
                        ₹{service.price.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <button onClick={() => handleInquiry(service)} className={`mt-3 self-start px-4 py-2 ${getCornerClass()} text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90`} style={{ backgroundColor: primaryColor }}>
                    Enquiry <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MASONRY LAYOUT */}
        {isMasonry && (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {config.items.map((service, index) => (
              <div key={service.id || index} className="break-inside-avoid">
                <ServiceCard service={service} index={index} isVisible={isVisible} primaryColor={primaryColor} onInquiry={handleInquiry} cornerClass={getCornerClass()} animationClass={animationClass} variant="masonry" />
              </div>
            ))}
          </div>
        )}

        {/* TABS CONTENT (only show if tabs layout) */}
        {isTabs && categories.length > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getServicesForTab(categories[activeTab]).map((service, index) => (
              <ServiceCard key={service.id || index} service={service} index={index} isVisible={isVisible} primaryColor={primaryColor} onInquiry={handleInquiry} cornerClass={getCornerClass()} animationClass={animationClass} variant="grid" />
            ))}
          </div>
        )}

        {/* TABS CONTENT (fallback to grid when single category) */}
        {isTabs && categories.length <= 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {config.items.map((service, index) => (
              <ServiceCard key={service.id || index} service={service} index={index} isVisible={isVisible} primaryColor={primaryColor} onInquiry={handleInquiry} cornerClass={getCornerClass()} animationClass={animationClass} variant="grid" />
            ))}
          </div>
        )}

        {/* FLIP CARDS LAYOUT */}
        {isFlipCards && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {config.items.map((service, index) => (
              <div
                key={service.id || index}
                className={`relative h-80 cursor-pointer perspective-1000 ${animationClass}`}
                onClick={() => setFlippedCard(flippedCard === index ? null : index)}
              >
                <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${flippedCard === index ? 'rotate-y-180' : ''}`}>
                  {/* Front */}
                  <div className={`absolute inset-0 ${getCornerClass()} shadow-lg overflow-hidden backface-hidden`}>
                    {service.image ? (
                      <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                        <Briefcase className="w-20 h-20" style={{ color: primaryColor }} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-bold mb-1">{service.name}</h3>
                      {service.price !== undefined && service.price > 0 && (
                        <span className="text-lg font-semibold opacity-90">₹{service.price.toLocaleString('en-IN')}</span>
                      )}
                      <p className="text-xs mt-2 opacity-70">Click to see details</p>
                    </div>
                  </div>
                  {/* Back */}
                  <div className={`absolute inset-0 ${getCornerClass()} shadow-lg p-6 flex flex-col backface-hidden rotate-y-180`} style={{ backgroundColor: primaryColor }}>
                    <h3 className="text-xl font-bold text-white mb-3">{service.name}</h3>
                    <p className="text-white/90 text-sm flex-1">{service.description}</p>
                    {service.features && service.features.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {service.features.slice(0, 3).map((feature, i) => (
                          <li key={i} className="text-white/80 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); handleInquiry(service); }} className={`mt-4 w-full py-3 bg-white text-neutral-900 ${getCornerClass()} font-semibold flex items-center justify-center gap-2 hover:bg-neutral-100`}>
                      <MessageCircle className="w-4 h-4" />
                      Enquiry Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}} />
    </section>
  );
}

// Reusable Service Card Component
function ServiceCard({
  service,
  index,
  isVisible,
  primaryColor,
  onInquiry,
  cornerClass,
  animationClass,
  variant
}: {
  service: ServiceItem;
  index: number;
  isVisible: boolean;
  primaryColor: string;
  onInquiry: (service: ServiceItem) => void;
  cornerClass: string;
  animationClass: string;
  variant: 'carousel' | 'grid' | 'masonry';
}) {
  return (
    <div
      className={`${variant === 'carousel' ? 'flex-shrink-0 w-80 snap-center' : ''} transition-all duration-500 ${animationClass} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className={`bg-white dark:bg-neutral-900 ${cornerClass} shadow-lg overflow-hidden hover:shadow-xl transition-all group h-full flex flex-col`}>
        {/* Image */}
        <div className={`relative ${variant === 'masonry' ? 'aspect-[4/3]' : 'h-48'} overflow-hidden`}>
          {service.image ? (
            <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
              <Briefcase className="w-16 h-16" style={{ color: primaryColor }} />
            </div>
          )}
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">4.9</span>
          </div>
          {service.category && (
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: primaryColor }}>
              {service.category}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">{service.name}</h3>
          <p className="text-neutral-500 text-sm mb-4 line-clamp-2 flex-1">{service.description}</p>
          {service.price !== undefined && service.price > 0 && (
            <div className="mb-4">
              <span className="text-2xl font-bold" style={{ color: primaryColor }}>₹{service.price.toLocaleString('en-IN')}</span>
              <span className="text-neutral-400 text-sm ml-1">onwards</span>
            </div>
          )}
          <button onClick={() => onInquiry(service)} className={`w-full py-3 ${cornerClass} text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity`} style={{ backgroundColor: primaryColor }}>
            <MessageCircle className="w-4 h-4" />
            Enquiry
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EDIT COMPONENT
// ============================================================================
function ServicesEditor({
  config,
  onChange,
}: {
  config: ServicesConfig;
  onChange: (data: ServicesConfig) => void;
}) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleChange = (field: string, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const addService = () => {
    const newService: ServiceItem = {
      id: `service-${Date.now()}`,
      name: '',
      description: '',
      price: 0,
      features: [],
      category: '',
      availability: 'available',
    };
    handleChange('items', [...(config.items || []), newService]);
  };

  const removeService = (index: number) => {
    handleChange('items', config.items.filter((_, i) => i !== index));
  };

  const updateService = (index: number, field: string, value: any) => {
    const newItems = [...config.items];
    newItems[index] = { ...newItems[index], [field]: value };
    handleChange('items', newItems);
  };

  const handleImageUpload = async (index: number, file: File) => {
    setUploadingIndex(index);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'gallery');
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      updateService(index, 'image', data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newItems = [...config.items];
    const [dragged] = newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, dragged);
    handleChange('items', newItems);
    setDraggedIndex(index);
  };
  const handleDragEnd = () => setDraggedIndex(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Services Section</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">List your services, prices, and descriptions</p>
      </div>

      {/* Enable Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Enable Services Section</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Show or hide this section</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={config.enabled} onChange={(e) => handleChange('enabled', e.target.checked)} className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
        </label>
      </div>

      {config.enabled && (
        <>
          {/* Add Service Button */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Services ({config.items?.length || 0})</h3>
            <button onClick={addService} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />Add Service
            </button>
          </div>

          {/* Services List */}
          {config.items && config.items.length > 0 ? (
            <div className="space-y-4">
              {config.items.map((service, index) => (
                <div key={service.id} draggable onDragStart={() => handleDragStart(index)} onDragOver={(e) => handleDragOver(e, index)} onDragEnd={handleDragEnd} className={`bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 ${draggedIndex === index ? 'opacity-50' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className="cursor-move text-gray-400 hover:text-gray-600 mt-2"><GripVertical className="w-5 h-5" /></div>
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Name *</label>
                          <input type="text" value={service.name} onChange={(e) => updateService(index, 'name', e.target.value)} placeholder="e.g. Web Design" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹)</label>
                          <input type="number" value={service.price || ''} onChange={(e) => updateService(index, 'price', parseFloat(e.target.value) || 0)} placeholder="0" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                        <textarea value={service.description} onChange={(e) => updateService(index, 'description', e.target.value)} rows={2} placeholder="Describe your service..." className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="flex items-center gap-4">
                        {service.image && <img src={service.image} alt={service.name} className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-700" />}
                        <label className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300">
                          <Upload className="w-4 h-4 mr-2" />{uploadingIndex === index ? 'Uploading...' : 'Upload Image'}
                          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(index, e.target.files[0])} className="hidden" disabled={uploadingIndex === index} />
                        </label>
                      </div>
                    </div>
                    <button onClick={() => removeService(index)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" title="Remove service"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No services added yet</p>
              <button onClick={addService} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />Add Your First Service
              </button>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">Tips</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
              <li>Use clear, descriptive names for your services</li>
              <li>Include pricing to qualify leads upfront</li>
              <li>Add high-quality images to showcase your work</li>
              <li>Drag to reorder services by priority</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export type { ServicesSectionProps };

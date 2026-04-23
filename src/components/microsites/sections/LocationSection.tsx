'use client';

import { useState, useEffect, useRef } from 'react';
import { Brand, Branch } from '@/generated/prisma';
import { MapPin, Navigation, Phone, Clock, ExternalLink } from 'lucide-react';
import GoogleMap from '../GoogleMap';

interface LocationSectionProps {
  brand: Brand;
  branch: Branch;
  showBusinessHours?: boolean;
  showContactInfo?: boolean;
}

export default function LocationSection({
  brand,
  branch,
  showBusinessHours = true,
  showContactInfo = true
}: LocationSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const address = branch.address as any;
  const contact = branch.contact as any;
  const businessHours = branch.businessHours as any;
  const colorTheme = brand.colorTheme as any;
  const primaryColor = colorTheme?.primary || '#3B82F6';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Format business hours for display
  const formatBusinessHours = () => {
    if (!businessHours) return null;

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return days.map((day, index) => {
      const hours = businessHours[day];
      if (!hours) return null;

      return (
        <div key={day} className="flex justify-between items-center py-1">
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            {dayNames[index]}
          </span>
          <span className="text-neutral-600 dark:text-neutral-400">
            {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
          </span>
        </div>
      );
    }).filter(Boolean);
  };

  // Handle contact actions
  const handleContactAction = async (action: string, value: string) => {
    // Track analytics
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'CLICK',
          branchId: branch.id,
          brandId: brand.id,
          metadata: { action, value, section: 'location' },
        }),
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }

    // Perform action
    switch (action) {
      case 'call':
        window.open(`tel:${value}`, '_self');
        break;
      case 'whatsapp':
        const phoneNumber = value.replace(/\D/g, '');
        const message = encodeURIComponent(`Hi, I found your business location and would like to visit.`);
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
        break;
      case 'directions':
        if (address) {
          const addressString = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
          window.open(`https://maps.google.com/maps?daddr=${encodeURIComponent(addressString)}`, '_blank');
        }
        break;
    }
  };

  if (!address) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="py-16 px-6 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800"
      id="location"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Visit Our Location
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Find us easily and get directions to our {branch.name} location
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map - Takes up 2 columns on large screens */}
          <div className={`lg:col-span-2 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <GoogleMap
              address={address}
              businessName={branch.name}
              showDirectionsButton={true}
              showCopyButton={true}
              height="500px"
              primaryColor={primaryColor}
            />
          </div>

          {/* Location Info Sidebar */}
          <div className={`space-y-6 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

            {/* Address Card */}
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-start space-x-3 mb-4">
                <MapPin className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: primaryColor }} />
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    {branch.name}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {address.street}<br />
                    {address.city}, {address.state} {address.zipCode}<br />
                    {address.country}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleContactAction('directions', '')}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-white rounded-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                style={{ backgroundColor: primaryColor }}
              >
                <Navigation className="w-5 h-5" />
                <span className="font-medium">Get Directions</span>
              </button>
            </div>

            {/* Contact Info Card */}
            {showContactInfo && contact && (
              <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700">
                <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center">
                  <Phone className="w-5 h-5 mr-2" style={{ color: primaryColor }} />
                  Contact Us
                </h3>

                <div className="space-y-3">
                  {contact.phone && (
                    <button
                      onClick={() => handleContactAction('call', contact.phone)}
                      className="w-full text-left p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}20` }}>
                          <Phone className="w-5 h-5" style={{ color: primaryColor }} />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-neutral-100">Call Us</p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">{contact.phone}</p>
                        </div>
                      </div>
                    </button>
                  )}

                  {contact.whatsapp && (
                    <button
                      onClick={() => handleContactAction('whatsapp', contact.whatsapp)}
                      className="w-full text-left p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-neutral-100">WhatsApp</p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">{contact.whatsapp}</p>
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Business Hours Card */}
            {showBusinessHours && businessHours && (
              <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700">
                <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" style={{ color: primaryColor }} />
                  Business Hours
                </h3>
                <div className="space-y-2 text-sm">
                  {formatBusinessHours()}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-700 p-6 rounded-xl">
              <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    const addressString = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
                    window.open(`https://maps.google.com/maps?q=${encodeURIComponent(addressString)}`, '_blank');
                  }}
                  className="flex flex-col items-center p-3 rounded-lg hover:bg-white dark:hover:bg-neutral-600 transition-colors"
                >
                  <ExternalLink className="w-6 h-6 mb-2" style={{ color: primaryColor }} />
                  <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Open Maps</span>
                </button>

                <button
                  onClick={() => {
                    const addressString = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
                    navigator.clipboard.writeText(addressString);
                  }}
                  className="flex flex-col items-center p-3 rounded-lg hover:bg-white dark:hover:bg-neutral-600 transition-colors"
                >
                  <MapPin className="w-6 h-6 mb-2" style={{ color: primaryColor }} />
                  <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Copy Address</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
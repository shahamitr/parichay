'use client';

import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Download, MessageCircle, Share2, Briefcase, Award, Users } from 'lucide-react';
import Image from 'next/image';
import { getImageWithFallback } from '@/lib/placeholder-utils';

interface ProfileSectionProps {
  branch: any;
  brand: any;
}

export default function ProfileSection({ branch, brand }: ProfileSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const contact = branch.contact;
  const address = branch.address;
  const colorTheme = brand.colorTheme as any;
  const primaryColor = colorTheme?.primary || '#3B82F6';

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSaveContact = async () => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'VCARD_DOWNLOAD',
          branchId: branch.id,
          brandId: brand.id,
          metadata: { action: 'save_contact' },
        }),
      });

      const response = await fetch(`/api/branches/${branch.id}/vcard`);
      if (!response.ok) throw new Error('Failed to generate vCard');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${branch.name.replace(/[^a-zA-Z0-9]/g, '_')}.vcf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${brand.name} - ${branch.name}`,
        text: brand.tagline || `Check out ${brand.name}`,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Key services icons (can be customized)
  const keyServices = [
    { icon: Briefcase, label: 'Services' },
    { icon: Award, label: 'Quality' },
    { icon: Users, label: 'Support' },
  ];


  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Gradient Background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}15 0%, transparent 50%, ${primaryColor}10 100%)`,
        }}
      />

      {/* Animated Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 max-w-lg mx-auto px-6 pt-12 pb-32">
        {/* Logo with Fade-in Animation */}
        <div className={`text-center mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="relative inline-block">
            <div className="w-32 h-32 mx-auto rounded-3xl bg-white shadow-2xl p-3 transform hover:scale-105 transition-transform duration-300">
              {brand.logo ? (
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={120}
                  height={120}
                  className="w-full h-full object-contain rounded-2xl"
                />
              ) : (
                <img
                  src={getImageWithFallback(brand.logo, 'logo', brand.name)}
                  alt={brand.name}
                  className="w-full h-full object-contain rounded-2xl"
                />
              )}
            </div>
            {(branch as any).isVerified && (
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Brand Name with Slide-up Animation */}
        <div className={`text-center mb-6 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2 tracking-tight">
            {brand.name}
          </h1>
          <h2 className="text-xl text-gray-600 font-medium">{branch.name}</h2>
          {brand.tagline && (
            <p className="mt-3 text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
              {brand.tagline}
            </p>
          )}
        </div>

        {/* Key Services Icons */}
        <div className={`flex justify-center gap-8 mb-10 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {keyServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="text-center group">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-2 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: primaryColor }} />
                </div>
                <span className="text-xs text-gray-500 font-medium">{service.label}</span>
              </div>
            );
          })}
        </div>

        {/* CTA Buttons Group */}
        <div className={`space-y-4 mb-8 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Primary Actions Row */}
          <div className="flex gap-3">
            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                style={{ backgroundColor: primaryColor }}
              >
                <Phone className="w-5 h-5" />
                <span>Call Now</span>
              </a>
            )}
            {contact.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-green-500 rounded-2xl text-white font-semibold shadow-lg hover:shadow-xl hover:bg-green-600 transform hover:-translate-y-0.5 transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp</span>
              </a>
            )}
          </div>

          {/* Secondary Actions Row */}
          <div className="flex gap-3">
            <button
              onClick={handleSaveContact}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-700 font-medium transition-all duration-300"
            >
              <Download className="w-5 h-5" />
              <span>Save Contact</span>
            </button>
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-700 font-medium transition-all duration-300"
            >
              <Share2 className="w-5 h-5" />
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Contact Cards with Hover Effects */}
        <div className={`space-y-3 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                <Phone className="w-5 h-5" style={{ color: primaryColor }} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Phone</p>
                <p className="text-gray-900 font-semibold group-hover:text-blue-600 transition-colors">{contact.phone}</p>
              </div>
            </a>
          )}

          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Email</p>
                <p className="text-gray-900 font-semibold group-hover:text-purple-600 transition-colors break-all">{contact.email}</p>
              </div>
            </a>
          )}

          {address && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address.street}, ${address.city}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Location</p>
                <p className="text-gray-900 font-semibold group-hover:text-orange-600 transition-colors">
                  {address.city}, {address.state}
                </p>
              </div>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

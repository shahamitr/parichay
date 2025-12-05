// @ts-nocheck
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Phone, MessageCircle, Mail, MapPin, Download, Copy, ChecnalLink, Clock, Navigation, ChevronDown, ChevronUp
} from 'lucide-react';
import { Brand, Branch } from '@/generated/prisma';

interface SmartContactHubProps {
  brand: Brand;
  branch: Branch;
}

export default function SmartContactHub({ brand, branch }: SmartContactHubProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [vCardDownloading, setVCardDownloading] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const contact = branch.contact as any;
  const address = branch.address as any;
  const businessHours = branch.businessHours as any;
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

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveContact = async () => {
    setVCardDownloading(true);
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'VCARD_DOWNLOAD',
          branchId: branch.id,
          brandId: brand.id,
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
    } finally {
      setVCardDownloading(false);
    }
  };

  const trackClick = async (action: string) => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'CLICK',
          branchId: branch.id,
          brandId: brand.id,
          metadata: { action, section: 'smart_contact_hub' },
        }),
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  const quickActions = [
    {
      id: 'whatsapp',
      icon: MessageCircle,
      label: 'WhatsApp',
      color: '#25D366',
      bgColor: '#25D36615',
      href: contact?.whatsapp ? `https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}` : null,
    },
    {
      id: 'call',
      icon: Phone,
      label: 'Call',
      color: primaryColor,
      bgColor: `${primaryColor}15`,
      href: contact?.phone ? `tel:${contact.phone}` : null,
    },
    {
      id: 'email',
      icon: Mail,
      label: 'Email',
      color: '#EA4335',
      bgColor: '#EA433515',
      href: contact?.email ? `mailto:${contact.email}` : null,
    },
    {
      id: 'vcard',
      icon: Download,
      label: vCardDownloading ? 'Saving...' : 'Save Contact',
      color: '#6366F1',
      bgColor: '#6366F115',
      onClick: handleSaveContact,
    },
  ].filter(action => action.href || action.onClick);

  const formatBusinessHours = () => {
    if (!businessHours) return null;
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    return days.map((day, index) => {
      const hours = businessHours[day];
      const isToday = day === today;
      return (
        <div
          key={day}
          className={`flex justify-between py-2 ${isToday ? 'bg-green-50 -mx-3 px-3 rounded-lg' : ''}`}
        >
          <span className={`font-medium ${isToday ? 'text-green-700' : 'text-gray-600'}`}>
            {dayNames[index]} {isToday && <span className="text-xs">(Today)</span>}
          </span>
          <span className={isToday ? 'text-green-700 font-semibold' : 'text-gray-900'}>
            {hours?.closed ? 'Closed' : hours ? `${hours.open} - ${hours.close}` : '-'}
          </span>
        </div>
      );
    });
  };

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h2>
          <div className="w-20 h-1 mx-auto rounded-full mb-4" style={{ backgroundColor: primaryColor }} />
          <p className="text-gray-500 max-w-md mx-auto">
            Choose your preferred way to connect with us
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {quickActions.map((action) => {
            const Icon = action.icon;
            const content = (
              <div
                className="flex flex-col items-center p-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
                style={{ backgroundColor: action.bgColor }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${action.color}25` }}
                >
                  <Icon className="w-6 h-6" style={{ color: action.color }} />
                </div>
                <span className="text-sm font-semibold text-gray-700">{action.label}</span>
              </div>
            );

            if (action.onClick) {
              return (
                <button
                  key={action.id}
                  onClick={() => {
                    trackClick(action.id);
                    action.onClick?.();
                  }}
                  disabled={vCardDownloading && action.id === 'vcard'}
                >
                  {content}
                </button>
              );
            }

            return (
              <a
                key={action.id}
                href={action.href!}
                target={action.id === 'whatsapp' ? '_blank' : undefined}
                rel={action.id === 'whatsapp' ? 'noopener noreferrer' : undefined}
                onClick={() => trackClick(action.id)}
              >
                {content}
              </a>
            );
          })}
        </div>

        {/* Contact Details with Copy Animation */}
        <div className={`space-y-4 mb-10 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {contact?.phone && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                    <Phone className="w-5 h-5" style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Phone</p>
                    <p className="text-gray-900 font-semibold text-lg">{contact.phone}</p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(contact.phone, 'phone')}
                  className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-300"
                >
                  {copiedField === 'phone' ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
              {copiedField === 'phone' && (
                <div className="mt-2 text-sm text-green-600 font-medium animate-pulse">
                  ✓ Copied to clipboard!
                </div>
              )}
            </div>
          )}

          {contact?.email && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-50">
                    <Mail className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Email</p>
                    <p className="text-gray-900 font-semibold text-lg break-all">{contact.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(contact.email, 'email')}
                  className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-300"
                >
                  {copiedField === 'email' ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
              {copiedField === 'email' && (
                <div className="mt-2 text-sm text-green-600 font-medium animate-pulse">
                  ✓ Copied to clipboard!
                </div>
              )}
            </div>
          )}

          {address && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-50">
                    <MapPin className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Location</p>
                    <p className="text-gray-900 font-semibold">{address.street}</p>
                    <p className="text-gray-600 text-sm">{address.city}, {address.state} {address.zipCode}</p>
                  </div>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${address.street}, ${address.city}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick('directions')}
                  className="p-3 rounded-xl bg-orange-100 hover:bg-orange-200 transition-all duration-300"
                >
                  <Navigation className="w-5 h-5 text-orange-600" />
                </a>
              </div>

              {/* Mini Map Preview */}
              <button
                onClick={() => setMapExpanded(!mapExpanded)}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                {mapExpanded ? 'Hide Map' : 'Show Map'}
                {mapExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {mapExpanded && (
                <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 animate-in slide-in-from-top duration-300">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(`${address.street}, ${address.city}, ${address.state}`)}&output=embed`}
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Location map"
                  />
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address.street}, ${address.city}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open in Google Maps
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Business Hours */}
        {businessHours && (
          <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-50">
                <Clock className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Business Hours</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {formatBusinessHours()}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

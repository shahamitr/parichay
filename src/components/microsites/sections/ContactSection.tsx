'use client';

import { useState, useEffect, useRef } from 'react';
import { Brand, Branch } from '@/generated/prisma';
import { ContactSection as ContactConfig } from '@/types/microsite';
import { Copy, Check, Download } from 'lucide-react';
import AppointmentBooking from '../AppointmentBooking';
import LiveChatWidget from '../LiveChatWidget';
import QRCodeDisplay from '../QRCodeDisplay';

interface ContactSectionProps {
  config: ContactConfig;
  brand: Brand;
  branch: Branch;
}

export default function ContactSection({ config, brand, branch }: ContactSectionProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
      { threshold: 0.1 }
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
    }
  };

  const handleContactAction = async (action: string, value: string) => {
    // Track click analytics
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: 'CLICK',
          branchId: branch.id,
          brandId: brand.id,
          metadata: {
            action,
            value,
            section: 'contact',
          },
        }),
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }

    // Perform the action
    switch (action) {
      case 'call':
        window.open(`tel:${value}`, '_self');
        break;
      case 'whatsapp':
        const phoneNumber = value.replace(/\D/g, '');
        const message = encodeURIComponent(`Hi, I found your business on ${brand.name} and would like to know more.`);
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
        break;
      case 'email':
        const subject = encodeURIComponent(`Inquiry from ${brand.name} Microsite`);
        window.open(`mailto:${value}?subject=${subject}`, '_self');
        break;
      case 'directions':
        if (address != null) {
          const addressString = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
          window.open(`https://maps.google.com/maps?q=${encodeURIComponent(addressString)}`, '_blank');
        }
        break;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.name.trim()) {
      setSubmitStatus('error');
      return;
    }

    if (config.leadForm.fields.includes('email') && formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setSubmitStatus('error');
        return;
      }
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          branchId: branch.id,
          brandId: brand.id,
          ...formData,
          source: 'microsite_form',
          branchContact: {
            email: contact.email,
            whatsapp: contact.whatsapp,
          },
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        setFormData({});

        // Track lead submission
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventType: 'LEAD_SUBMIT',
            branchId: branch.id,
            brandId: brand.id,
            metadata: {
              source: 'microsite_form',
              fields: Object.keys(formData),
              leadId: result.leadId,
            },
          }),
        });

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatBusinessHours = () => {
    if (!businessHours) return null;

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return days.map((day, index) => {
      const hours = businessHours[day];
      if (!hours) return null;

      return (
        <div key={day} className="flex justify-between">
          <span className="font-medium">{dayNames[index]}</span>
          <span>
            {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
          </span>
        </div>
      );
    }).filter(Boolean);
  };

  return (
    <section ref={sectionRef} className="relative bg-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 id="contact-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Contact Us
          </h2>
          <div className="w-16 h-1 mx-auto rounded-full" style={{ backgroundColor: primaryColor }}></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Information */}
          <div className="space-y-6 w-full">
            {/* Contact Action Buttons - Clean */}
            <div className="w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Get in Touch
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {contact.phone && (
                  <button
                    onClick={() => handleContactAction('call', contact.phone)}
                    className="flex items-center justify-center space-x-2 px-6 py-4 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
                    aria-label="Call us"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>Call Now</span>
                  </button>
                )}

                {contact.whatsapp && (
                  <button
                    onClick={() => handleContactAction('whatsapp', contact.whatsapp)}
                    className="flex items-center justify-center space-x-2 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
                    aria-label="Contact via WhatsApp"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    <span>WhatsApp</span>
                  </button>
                )}

                {contact.email && (
                  <button
                    onClick={() => handleContactAction('email', contact.email)}
                    className="flex items-center justify-center space-x-2 px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200 font-medium"
                    aria-label="Send email"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span>Email Us</span>
                  </button>
                )}

                {address && (
                  <button
                    onClick={() => handleContactAction('directions', '')}
                    className="flex items-center justify-center space-x-2 px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200 font-medium"
                    aria-label="Get directions"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>Directions</span>
                  </button>
                )}

                {/* Save Contact Button */}
                <button
                  onClick={handleSaveContact}
                  className="flex items-center justify-center space-x-2 px-6 py-4 text-white rounded-xl transition-colors duration-200 font-medium shadow-sm hover:shadow-md sm:col-span-2"
                  style={{ backgroundColor: primaryColor }}
                  aria-label="Save contact to phone"
                >
                  <Download className="w-5 h-5" />
                  <span>Save Contact</span>
                </button>
              </div>
            </div>

            {/* Contact Details with Copy */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                {contact.phone && (
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" style={{ color: primaryColor }} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span className="text-gray-700">{contact.phone}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(contact.phone, 'phone')}
                      className="p-2 rounded-lg hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="Copy phone number"
                    >
                      {copiedField === 'phone' ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                )}

                {contact.email && (
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" style={{ color: primaryColor }} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span className="text-gray-700">{contact.email}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(contact.email, 'email')}
                      className="p-2 rounded-lg hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="Copy email"
                    >
                      {copiedField === 'email' ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                )}

                {address && (
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-brand-primary mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <div className="text-gray-700">
                      <p>{address.street}</p>
                      <p>{address.city}, {address.state} {address.zipCode}</p>
                      <p>{address.country}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Business Hours - Clean */}
            {businessHours && (
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Business Hours
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  {formatBusinessHours()}
                </div>
              </div>
            )}

            {/* QR Code Display */}
            <QRCodeDisplay
              branchId={branch.id}
              brandId={brand.id}
              branchName={branch.name}
              url={typeof window !== 'undefined' ? window.location.href : ''}
            />

          </div>

          {/* Right Column - Forms */}
          <div className="space-y-8 w-full">
            {/* Appointment Booking */}
            {config.appointmentBooking?.enabled && (
              <AppointmentBooking config={config.appointmentBooking} branch={branch} />
            )}

            {/* Contact Form - Clean Design 2 */}
            {config.leadForm?.enabled && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Send us a Message
                </h3>

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-green-800">
                    Thank you for your message! We'll get back to you soon.
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-800">
                    Sorry, there was an error. Please try again.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {config.leadForm?.fields?.map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {field.replace('_', ' ')}
                      {['name', 'email'].includes(field) && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {field === 'message' ? (
                      <textarea
                        value={formData[field] || ''}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-shadow"
                        placeholder={`Enter your ${field}`}
                      />
                    ) : (
                      <input
                        type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                        value={formData[field] || ''}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        required={['name', 'email'].includes(field)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-shadow"
                        placeholder={`Enter your ${field}`}
                      />
                    )}
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
            )}
          </div>
        </div>

        {/* Google Maps - Full Width - Always show if address exists */}
        {address && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Find Us
            </h3>
            <div className="w-full rounded-xl overflow-hidden shadow-lg" style={{ height: '450px' }}>
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(`${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`)}&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location map"
              />
            </div>
          </div>
        )}
      </div>

      {/* Live Chat Widget */}
      {config.liveChatEnabled && <LiveChatWidget config={config} />}
    </section>
  );
}
'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FileText, Send, CheckCircle, Calendar, IndianRupee, Phone, User } from 'lucide-react';
import MathCaptcha from '@/components/ui/MathCaptcha';
import HoneypotField from '@/components/ui/HoneypotField';
import { useBotProtection } from '@/hooks/useBotProtection';

interface QuoteRequestSectionProps {
  branchId: string;
  brandId: string;
  services?: string[];
  primaryColor?: string;
  businessName?: string;
}

const BUDGET_RANGES = [
  { value: 'under_5000', label: 'Under ₹5,000' },
  { value: '5000_15000', label: '₹5,000 – ₹15,000' },
  { value: '15000_50000', label: '₹15,000 – ₹50,000' },
  { value: '50000_100000', label: '₹50,000 – ₹1,00,000' },
  { value: 'above_100000', label: 'Above ₹1,00,000' },
  { value: 'flexible', label: 'Flexible / Not Sure' },
];

export default function QuoteRequestSection({
  branchId,
  brandId,
  services = [],
  primaryColor = '#4F46E5',
  businessName,
}: QuoteRequestSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  const [formData, setFormData] = useState({
    service: '',
    preferredDate: '',
    budgetRange: '',
    name: '',
    phone: '',
    notes: '',
  });
  const [captchaValid, setCaptchaValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const { honeypotProps, getFormMeta, validateBeforeSubmit } = useBotProtection('quote_url');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateBeforeSubmit()) {
      setSubmitted(true);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchId,
          brandId,
          ...formData,
          ...getFormMeta(),
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Failed to submit. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <section ref={containerRef} className="py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-sm font-semibold"
            style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
          >
            <FileText className="w-4 h-4" />
            Get a Quote
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Request a Free Quote
          </h2>
          <p className="text-sm text-gray-500">
            Tell us what you need and we'll get back to you with pricing
            {businessName && ` from ${businessName}`}
          </p>
        </motion.div>

        {/* Success State */}
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10 bg-emerald-50 border border-emerald-100 rounded-2xl"
          >
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-emerald-800 mb-2">
              Quote Request Submitted!
            </p>
            <p className="text-sm text-emerald-600">
              We'll review your requirements and get back to you shortly.
            </p>
          </motion.div>
        ) : (
          /* Form */
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5"
          >
            {/* Service Needed */}
            <div>
              <label htmlFor="quote-service" className="block text-sm font-medium text-gray-700 mb-1.5">
                Service Needed *
              </label>
              {services.length > 0 ? (
                <select
                  id="quote-service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white"
                  style={{ focusRingColor: primaryColor } as React.CSSProperties}
                >
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                  <option value="other">Other</option>
                </select>
              ) : (
                <input
                  id="quote-service"
                  name="service"
                  type="text"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  placeholder="What service do you need?"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                />
              )}
            </div>

            {/* Preferred Date */}
            <div>
              <label htmlFor="quote-date" className="block text-sm font-medium text-gray-700 mb-1.5">
                <Calendar className="w-4 h-4 inline mr-1" />
                Preferred Date
              </label>
              <input
                id="quote-date"
                name="preferredDate"
                type="date"
                value={formData.preferredDate}
                onChange={handleChange}
                min={today}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
              />
            </div>

            {/* Budget Range */}
            <div>
              <label htmlFor="quote-budget" className="block text-sm font-medium text-gray-700 mb-1.5">
                <IndianRupee className="w-4 h-4 inline mr-1" />
                Budget Range
              </label>
              <select
                id="quote-budget"
                name="budgetRange"
                value={formData.budgetRange}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white"
              >
                <option value="">Select budget range</option>
                {BUDGET_RANGES.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="quote-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                <User className="w-4 h-4 inline mr-1" />
                Your Name *
              </label>
              <input
                id="quote-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="quote-phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number *
              </label>
              <input
                id="quote-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label htmlFor="quote-notes" className="block text-sm font-medium text-gray-700 mb-1.5">
                Additional Details (optional)
              </label>
              <textarea
                id="quote-notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Any specific requirements or details..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 resize-none"
              />
            </div>

            {/* Bot Protection */}
            <HoneypotField {...honeypotProps} />
            <MathCaptcha onVerify={setCaptchaValid} />

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || !captchaValid || !formData.name || !formData.phone || !formData.service}
              className="w-full py-3.5 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Submitting...' : 'Request Quote'}
            </button>

            <p className="text-xs text-gray-400 text-center">
              We respect your privacy. Your details will only be used to respond to this request.
            </p>
          </motion.form>
        )}
      </div>
    </section>
  );
}

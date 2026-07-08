'use client';

import { useState } from 'react';
import PublicPageLayout from '@/components/layout/PublicPageLayout';
import { Mail, MessageCircle, MapPin, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <PublicPageLayout>
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Get in touch</h1>
            <p className="mt-4 text-[15px] text-gray-500 max-w-lg mx-auto">
              Have a question about Parichay? Want a demo for your team? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-gray-900">Email us</h3>
                  <p className="text-[13px] text-gray-500 mt-1">hello@parichay.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-gray-900">WhatsApp</h3>
                  <p className="text-[13px] text-gray-500 mt-1">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-gray-900">Office</h3>
                  <p className="text-[13px] text-gray-500 mt-1">Pune, Maharashtra, India</p>
                </div>
              </div>

              <div className="mt-8 p-5 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                <p className="text-[13px] text-indigo-800 leading-relaxed">
                  <strong>Response time:</strong> We typically respond within 4 hours during business hours (Mon-Sat, 9 AM - 7 PM IST).
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {status === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-[18px] font-semibold text-gray-900">Message sent!</h3>
                  <p className="text-[14px] text-gray-500 mt-2">We'll get back to you within a few hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Your name</label>
                    <input
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full h-11 px-4 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                      placeholder="Amit Shah"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Email address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full h-11 px-4 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                      placeholder="amit@business.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="h-11 px-6 flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[14px] font-medium rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}

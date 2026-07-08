'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function QuickCardOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ profileUrl: string; brand: { name: string } } | null>(null);

  const [form, setForm] = useState({
    businessName: '',
    yourName: '',
    phone: '',
    whatsapp: '',
    email: '',
    city: '',
    category: '',
    tagline: '',
    services: [''],
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const addService = () => {
    if (form.services.length < 8) {
      setForm((prev) => ({ ...prev, services: [...prev.services, ''] }));
    }
  };

  const updateService = (index: number, value: string) => {
    const updated = [...form.services];
    updated[index] = value;
    setForm((prev) => ({ ...prev, services: updated }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/quick-card', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          services: form.services.filter((s) => s.trim()),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data);
        setStep(4); // Success step
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full h-12 px-4 border border-gray-200 rounded-xl text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all";

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">Parichay</span>
          </Link>
        </div>

        {/* Progress */}
        {step < 4 && (
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex-1 h-1.5 rounded-full ${s <= step ? 'bg-indigo-600' : 'bg-gray-200'} transition-colors`} />
            ))}
          </div>
        )}

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-[13px]">{error}</div>
        )}

        {/* Step 1: Business Info */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create your digital card</h2>
              <p className="text-gray-500 text-[14px] mt-1">Takes 60 seconds. No credit card required.</p>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Business Name *</label>
              <input value={form.businessName} onChange={(e) => updateField('businessName', e.target.value)} className={inputClass} placeholder="Glow Beauty Salon" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Your Name *</label>
              <input value={form.yourName} onChange={(e) => updateField('yourName', e.target.value)} className={inputClass} placeholder="Priya Sharma" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">City *</label>
              <input value={form.city} onChange={(e) => updateField('city', e.target.value)} className={inputClass} placeholder="Mumbai" />
            </div>
            <button
              onClick={() => { if (form.businessName && form.yourName && form.city) setStep(2); else setError('Please fill all required fields'); }}
              className="w-full h-12 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Contact */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Contact details</h2>
              <p className="text-gray-500 text-[14px] mt-1">How should customers reach you?</p>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Phone Number *</label>
              <input value={form.phone} onChange={(e) => updateField('phone', e.target.value)} className={inputClass} placeholder="+91 98765 43210" type="tel" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">WhatsApp (if different)</label>
              <input value={form.whatsapp} onChange={(e) => updateField('whatsapp', e.target.value)} className={inputClass} placeholder="Same as phone if blank" type="tel" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Tagline</label>
              <input value={form.tagline} onChange={(e) => updateField('tagline', e.target.value)} className={inputClass} placeholder="Quality service since 2010" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 h-12 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50">Back</button>
              <button
                onClick={() => { if (form.phone) setStep(3); else setError('Phone number is required'); }}
                className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Services */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your services</h2>
              <p className="text-gray-500 text-[14px] mt-1">What do you offer? Add manually or let AI suggest.</p>
            </div>

            {/* AI Generate Button */}
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  const res = await fetch('/api/ai/generate-profile', {
                    method: 'POST', credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ businessName: form.businessName, category: form.category || 'business', city: form.city }),
                  });
                  const data = await res.json();
                  if (data.success && data.generated) {
                    const gen = data.generated;
                    if (gen.services) setForm((prev) => ({ ...prev, services: gen.services.map((s: any) => s.name), tagline: gen.tagline || prev.tagline }));
                  }
                } catch {} finally { setLoading(false); }
              }}
              disabled={loading}
              className="w-full py-2.5 border-2 border-dashed border-indigo-200 rounded-xl text-[13px] font-medium text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? 'Generating...' : '✨ Auto-fill with AI (recommended)'}
            </button>

            <div className="space-y-2">
              {form.services.map((s, i) => (
                <input key={i} value={s} onChange={(e) => updateService(i, e.target.value)} className={inputClass} placeholder={`Service ${i + 1}`} />
              ))}
              {form.services.length < 8 && (
                <button onClick={addService} className="text-[13px] text-indigo-600 font-medium hover:text-indigo-700">+ Add another</button>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 h-12 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50">Back</button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <><Sparkles className="w-4 h-4" /> Create Card</>}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && result && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your card is live! 🎉</h2>
              <p className="text-gray-500 mt-2">Share this link with your customers:</p>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <code className="text-[14px] font-medium text-indigo-700 break-all">
                {typeof window !== 'undefined' ? window.location.origin : ''}{result.profileUrl}
              </code>
            </div>
            <div className="flex flex-col gap-3">
              <Link href={result.profileUrl} className="h-12 flex items-center justify-center bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700">
                View My Card
              </Link>
              <Link href="/admin/dashboard" className="h-12 flex items-center justify-center border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50">
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

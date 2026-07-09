'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, Loader2, ArrowLeft, Plus, Trash2, Upload } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export default function EditBusinessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    name: '',
    tagline: '',
    logo: '',
    address: { street: '', city: '', state: '', zipCode: '', country: 'India' },
    contact: { phone: '', whatsapp: '', email: '' },
    businessHours: {} as Record<string, { open: string; close: string; closed: boolean }>,
    services: [] as Service[],
  });

  useEffect(() => {
    fetch('/api/my-business', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (data.brand) {
          const branch = data.branch || {};
          const config = branch.micrositeConfig || {};
          const services = config?.sections?.services?.items || [];
          setForm({
            name: data.brand.name || '',
            tagline: data.brand.tagline || '',
            logo: data.brand.logo || '',
            address: branch.address || { street: '', city: '', state: '', zipCode: '', country: 'India' },
            contact: branch.contact || { phone: '', whatsapp: '', email: '' },
            businessHours: branch.businessHours || getDefaultHours(),
            services,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const getDefaultHours = () => ({
    monday: { open: '09:00', close: '18:00', closed: false },
    tuesday: { open: '09:00', close: '18:00', closed: false },
    wednesday: { open: '09:00', close: '18:00', closed: false },
    thursday: { open: '09:00', close: '18:00', closed: false },
    friday: { open: '09:00', close: '18:00', closed: false },
    saturday: { open: '10:00', close: '14:00', closed: false },
    sunday: { open: '00:00', close: '00:00', closed: true },
  });

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/my-business', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('✓ Saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Save failed');
      }
    } catch {
      setMessage('Network error. Try again.');
    }
    setSaving(false);
  };

  const addService = () => {
    setForm((prev) => ({
      ...prev,
      services: [...prev.services, { id: `s${Date.now()}`, name: '', description: '', price: 0, category: '' }],
    }));
  };

  const removeService = (index: number) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const updateService = (index: number, field: string, value: string | number) => {
    setForm((prev) => {
      const services = [...prev.services];
      services[index] = { ...services[index], [field]: value };
      return { ...prev, services };
    });
  };

  const inputClass = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";
  const labelClass = "block text-xs font-medium text-gray-700 mb-1.5";

  if (loading) {
    return <div className="p-6 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/business-owner/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-4 h-4 text-gray-500" />
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Edit Business Profile</h1>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {message && (
        <div className={`px-4 py-2 rounded-lg text-sm ${message.startsWith('✓') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      {/* Basic Info */}
      <section className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-gray-900">Basic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Business Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Tagline</label>
            <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className={inputClass} placeholder="Short description" />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-gray-900">Contact Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Phone</label>
            <input value={form.contact.phone} onChange={(e) => setForm({ ...form, contact: { ...form.contact, phone: e.target.value } })} className={inputClass} type="tel" />
          </div>
          <div>
            <label className={labelClass}>WhatsApp</label>
            <input value={form.contact.whatsapp || ''} onChange={(e) => setForm({ ...form, contact: { ...form.contact, whatsapp: e.target.value } })} className={inputClass} type="tel" />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input value={form.contact.email || ''} onChange={(e) => setForm({ ...form, contact: { ...form.contact, email: e.target.value } })} className={inputClass} type="email" />
          </div>
        </div>
      </section>

      {/* Address */}
      <section className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-gray-900">Address</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>Street</label>
            <input value={form.address.street} onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>City</label>
            <input value={form.address.city} onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>State</label>
            <input value={form.address.state} onChange={(e) => setForm({ ...form, address: { ...form.address, state: e.target.value } })} className={inputClass} />
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section id="hours" className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-gray-900">Business Hours</h2>
        <div className="space-y-2">
          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
            const hours = form.businessHours[day] || { open: '09:00', close: '18:00', closed: false };
            return (
              <div key={day} className="flex items-center gap-3">
                <span className="w-24 text-xs font-medium text-gray-700 capitalize">{day}</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hours.closed}
                    onChange={(e) => setForm({ ...form, businessHours: { ...form.businessHours, [day]: { ...hours, closed: e.target.checked } } })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-xs text-gray-500">Closed</span>
                </label>
                {!hours.closed && (
                  <>
                    <input type="time" value={hours.open} onChange={(e) => setForm({ ...form, businessHours: { ...form.businessHours, [day]: { ...hours, open: e.target.value } } })} className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs" />
                    <span className="text-gray-400 text-xs">to</span>
                    <input type="time" value={hours.close} onChange={(e) => setForm({ ...form, businessHours: { ...form.businessHours, [day]: { ...hours, close: e.target.value } } })} className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs" />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">Services ({form.services.length})</h2>
          <button onClick={addService} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-lg hover:bg-indigo-100">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
        <div className="space-y-3">
          {form.services.map((service, i) => (
            <div key={service.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input value={service.name} onChange={(e) => updateService(i, 'name', e.target.value)} className={inputClass} placeholder="Service name" />
                <input value={service.description} onChange={(e) => updateService(i, 'description', e.target.value)} className={inputClass} placeholder="Description" />
                <input value={service.price || ''} onChange={(e) => updateService(i, 'price', parseInt(e.target.value) || 0)} className={inputClass} placeholder="Price (₹)" type="number" />
              </div>
              <button onClick={() => removeService(i)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {form.services.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-4">No services yet. Add your first service above.</p>
          )}
        </div>
      </section>

      {/* Save Button (bottom) */}
      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save All Changes
        </button>
      </div>
    </div>
  );
}

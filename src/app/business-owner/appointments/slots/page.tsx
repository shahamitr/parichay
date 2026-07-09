'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Calendar, Plus, Trash2, Save, CheckCircle, AlertCircle } from 'lucide-react';

interface TimeSlot {
  start: string;
  end: string;
}

interface SlotConfig {
  slotDuration: number;
  maxBookingsPerSlot: number;
  breakBetweenSlots: number;
  blockedDates: string[];
  customSlots: Record<string, TimeSlot[]>;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
const DAY_LABELS: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

const DURATION_OPTIONS = [15, 30, 45, 60];
const MAX_BOOKINGS_OPTIONS = [1, 2, 3, 4, 5];
const BREAK_OPTIONS = [0, 5, 10, 15];

const DEFAULT_CONFIG: SlotConfig = {
  slotDuration: 30,
  maxBookingsPerSlot: 1,
  breakBetweenSlots: 10,
  blockedDates: [],
  customSlots: {
    monday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }],
    tuesday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }],
    wednesday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }],
    thursday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }],
    friday: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }],
    saturday: [{ start: '10:00', end: '14:00' }],
    sunday: [],
  },
};

export default function SlotManagementPage() {
  const [config, setConfig] = useState<SlotConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set(['monday']));
  const [newBlockedDate, setNewBlockedDate] = useState('');

  useEffect(() => {
    fetchSlotConfig();
  }, []);

  const fetchSlotConfig = async () => {
    try {
      const res = await fetch('/api/my-business/slots');
      const data = await res.json();
      if (data.success && data.config) {
        setConfig({
          ...DEFAULT_CONFIG,
          ...data.config,
          customSlots: { ...DEFAULT_CONFIG.customSlots, ...(data.config.customSlots || {}) },
        });
      }
    } catch (err) {
      console.error('Failed to fetch slot config:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/my-business/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Slot configuration saved successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const toggleDay = (day: string) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) {
        next.delete(day);
      } else {
        next.add(day);
      }
      return next;
    });
  };

  const addSlot = (day: string) => {
    setConfig((prev) => ({
      ...prev,
      customSlots: {
        ...prev.customSlots,
        [day]: [...(prev.customSlots[day] || []), { start: '09:00', end: '17:00' }],
      },
    }));
  };

  const removeSlot = (day: string, index: number) => {
    setConfig((prev) => ({
      ...prev,
      customSlots: {
        ...prev.customSlots,
        [day]: prev.customSlots[day].filter((_, i) => i !== index),
      },
    }));
  };

  const updateSlot = (day: string, index: number, field: 'start' | 'end', value: string) => {
    setConfig((prev) => ({
      ...prev,
      customSlots: {
        ...prev.customSlots,
        [day]: prev.customSlots[day].map((slot, i) =>
          i === index ? { ...slot, [field]: value } : slot
        ),
      },
    }));
  };

  const addBlockedDate = () => {
    if (!newBlockedDate) return;
    if (config.blockedDates.includes(newBlockedDate)) return;

    setConfig((prev) => ({
      ...prev,
      blockedDates: [...prev.blockedDates, newBlockedDate].sort(),
    }));
    setNewBlockedDate('');
  };

  const removeBlockedDate = (date: string) => {
    setConfig((prev) => ({
      ...prev,
      blockedDates: prev.blockedDates.filter((d) => d !== date),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/business-owner/appointments" className="text-blue-600 hover:text-blue-800">
                ← Appointments
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-lg font-semibold text-gray-900">Slot Management</h1>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Configuration
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {message.text}
          </div>
        )}

        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            General Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Slot Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slot Duration
              </label>
              <div className="flex flex-wrap gap-2">
                {DURATION_OPTIONS.map((duration) => (
                  <button
                    key={duration}
                    onClick={() => setConfig((prev) => ({ ...prev, slotDuration: duration }))}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      config.slotDuration === duration
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    {duration} min
                  </button>
                ))}
              </div>
            </div>

            {/* Max Bookings Per Slot */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Bookings Per Slot
              </label>
              <div className="flex flex-wrap gap-2">
                {MAX_BOOKINGS_OPTIONS.map((max) => (
                  <button
                    key={max}
                    onClick={() => setConfig((prev) => ({ ...prev, maxBookingsPerSlot: max }))}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      config.maxBookingsPerSlot === max
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    {max}
                  </button>
                ))}
              </div>
            </div>

            {/* Break Between Slots */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Break Between Slots
              </label>
              <div className="flex flex-wrap gap-2">
                {BREAK_OPTIONS.map((brk) => (
                  <button
                    key={brk}
                    onClick={() => setConfig((prev) => ({ ...prev, breakBetweenSlots: brk }))}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      config.breakBetweenSlots === brk
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    {brk} min
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Per-Day Slot Configuration */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Weekly Schedule
          </h3>

          <div className="space-y-2">
            {DAYS.map((day) => {
              const isExpanded = expandedDays.has(day);
              const slots = config.customSlots[day] || [];

              return (
                <div key={day} className="border rounded-lg">
                  <button
                    onClick={() => toggleDay(day)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">{DAY_LABELS[day]}</span>
                      {slots.length > 0 ? (
                        <span className="text-xs text-gray-500">
                          {slots.map((s) => `${s.start}-${s.end}`).join(', ')}
                        </span>
                      ) : (
                        <span className="text-xs text-red-500">Closed</span>
                      )}
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t">
                      <div className="space-y-3 mt-3">
                        {slots.map((slot, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <input
                              type="time"
                              value={slot.start}
                              onChange={(e) => updateSlot(day, idx, 'start', e.target.value)}
                              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-gray-400">to</span>
                            <input
                              type="time"
                              value={slot.end}
                              onChange={(e) => updateSlot(day, idx, 'end', e.target.value)}
                              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              onClick={() => removeSlot(day, idx)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                              title="Remove slot"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => addSlot(day)}
                        className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Plus className="w-4 h-4" />
                        Add time slot
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Blocked Dates */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-red-600" />
            Blocked Dates (Holidays)
          </h3>

          <div className="flex items-center gap-3 mb-4">
            <input
              type="date"
              value={newBlockedDate}
              onChange={(e) => setNewBlockedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addBlockedDate}
              disabled={!newBlockedDate}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1 text-sm"
            >
              <Plus className="w-4 h-4" />
              Block Date
            </button>
          </div>

          {config.blockedDates.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {config.blockedDates.map((date) => (
                <div
                  key={date}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full text-sm"
                >
                  <span className="text-red-800">
                    {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <button
                    onClick={() => removeBlockedDate(date)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No blocked dates. Add dates when you won&apos;t be available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

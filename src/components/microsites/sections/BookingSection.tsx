'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface ServiceSlot {
  id: string;
  name: string;
  duration: number;
  price: number | null;
  description: string | null;
  color: string | null;
}

interface TimeSlot {
  time: string;
  endTime: string;
  available: boolean;
}

interface BookingSectionProps {
  branch: {
    id: string;
    name: string;
    contact?: any;
  };
  brand: {
    name: string;
    colorTheme?: any;
  };
  config?: {
    enabled?: boolean;
    title?: string;
    subtitle?: string;
  };
}

type BookingStep = 'service' | 'datetime' | 'details' | 'confirmation';

export default function BookingSection({ branch, brand, config }: BookingSectionProps) {
  const [step, setStep] = useState<BookingStep>('service');
  const [services, setServices] = useState<ServiceSlot[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceSlot | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });

  const primaryColor = brand.colorTheme?.primary || '#3B82F6';

  // Generate next 14 days for date selection
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  useEffect(() => {
    fetchServices();
  }, [branch.id]);

  useEffect(() => {
    if (selectedDate && selectedService) {
      fetchAvailability();
    }
  }, [selectedDate, selectedService]);

  const fetchServices = async () => {
    try {
      const response = await fetch(`/api/service-slots?branchId=${branch.id}`);
      const data = await response.json();
      if (data.success) {
        setServices(data.serviceSlots.filter((s: ServiceSlot) => s));
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async () => {
    try {
      const response = await fetch(
        `/api/appointments/availability?branchId=${branch.id}&date=${selectedDate}&serviceSlotId=${selectedService?.id}&duration=${selectedService?.duration}`
      );
      const data = await response.json();
      if (data.success) {
        setAvailableSlots(data.slots || []);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !formData.name || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchId: branch.id,
          serviceSlotId: selectedService.id,
          serviceName: selectedService.name,
          customerName: formData.name,
          customerPhone: formData.phone,
          customerEmail: formData.email || undefined,
          date: selectedDate,
          startTime: selectedTime,
          duration: selectedService.duration,
          notes: formData.notes || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setBookingSuccess(true);
        setStep('confirmation');
      } else {
        setError(data.error || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (!config?.enabled) {
    return null;
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: primaryColor }}></div>
          </div>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return null; // Don't show section if no services are configured
  }

  return (
    <section id="booking" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {config?.title || 'Book an Appointment'}
          </h2>
          {config?.subtitle && (
            <p className="text-gray-600 dark:text-gray-400">
              {config.subtitle}
            </p>
          )}
        </div>

        {/* Progress Steps */}
        {step !== 'confirmation' && (
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              {['service', 'datetime', 'details'].map((s, i) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      step === s
                        ? 'text-white'
                        : ['service', 'datetime', 'details'].indexOf(step) > i
                        ? 'text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}
                    style={{
                      backgroundColor:
                        step === s || ['service', 'datetime', 'details'].indexOf(step) > i
                          ? primaryColor
                          : undefined,
                    }}
                  >
                    {['service', 'datetime', 'details'].indexOf(step) > i ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  {i < 2 && (
                    <div
                      className={`w-12 h-1 mx-1 rounded ${
                        ['service', 'datetime', 'details'].indexOf(step) > i
                          ? ''
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                      style={{
                        backgroundColor:
                          ['service', 'datetime', 'details'].indexOf(step) > i
                            ? primaryColor
                            : undefined,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          {/* Step 1: Select Service */}
          {step === 'service' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Select a Service
              </h3>
              <div className="grid gap-3">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service);
                      setStep('datetime');
                    }}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                      selectedService?.id === service.id
                        ? 'border-opacity-100'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                    style={{
                      borderColor:
                        selectedService?.id === service.id ? primaryColor : undefined,
                    }}
                  >
                    <div
                      className="w-1 h-12 rounded-full"
                      style={{ backgroundColor: service.color || primaryColor }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {service.name}
                      </p>
                      {service.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                          {service.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 dark:text-gray-300">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {service.duration} mins
                        </span>
                        {service.price && (
                          <span className="font-medium">₹{service.price}</span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Date & Time */}
          {step === 'datetime' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep('service')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Select Date & Time
                </h3>
              </div>

              {/* Selected Service Summary */}
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${primaryColor}10` }}
              >
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedService?.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedService?.duration} minutes
                  {selectedService?.price && ` • ₹${selectedService.price}`}
                </p>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Select Date
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {availableDates.map((date) => (
                    <button
                      key={date}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedTime('');
                      }}
                      className={`p-2 rounded-lg text-center transition-colors ${
                        selectedDate === date
                          ? 'text-white'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      style={{
                        backgroundColor: selectedDate === date ? primaryColor : undefined,
                      }}
                    >
                      <p className="text-xs font-medium">
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </p>
                      <p className="text-lg font-bold">
                        {new Date(date).getDate()}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Available Times
                  </label>
                  {availableSlots.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      No available slots for this date
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                            selectedTime === slot.time
                              ? 'text-white'
                              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                          style={{
                            backgroundColor:
                              selectedTime === slot.time ? primaryColor : undefined,
                          }}
                        >
                          {formatTime(slot.time)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Continue Button */}
              {selectedTime && (
                <button
                  onClick={() => setStep('details')}
                  className="w-full py-3 rounded-xl text-white font-medium transition-opacity hover:opacity-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  Continue
                </button>
              )}
            </div>
          )}

          {/* Step 3: Customer Details */}
          {step === 'details' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep('datetime')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Your Details
                </h3>
              </div>

              {/* Booking Summary */}
              <div
                className="p-4 rounded-lg space-y-2"
                style={{ backgroundColor: `${primaryColor}10` }}
              >
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedService?.name}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(selectedDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatTime(selectedTime)}
                  </span>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <User className="w-4 h-4 inline mr-1" />
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': primaryColor } as any}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email for confirmation"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <MessageSquare className="w-4 h-4 inline mr-1" />
                    Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any special requests or notes"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {error && (
                  <p className="text-red-600 text-sm">{error}</p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting || !formData.name || !formData.phone}
                  className="w-full py-3 rounded-xl text-white font-medium transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: primaryColor }}
                >
                  {submitting ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 'confirmation' && bookingSuccess && (
            <div className="text-center py-8">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${primaryColor}20` }}
              >
                <Check className="w-8 h-8" style={{ color: primaryColor }} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Booking Confirmed!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We'll contact you shortly to confirm your appointment.
              </p>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-left max-w-sm mx-auto">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Service</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedService?.name}
                    </p>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDate(selectedDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Time</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatTime(selectedTime)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setStep('service');
                  setSelectedService(null);
                  setSelectedDate('');
                  setSelectedTime('');
                  setFormData({ name: '', phone: '', email: '', notes: '' });
                  setBookingSuccess(false);
                }}
                className="mt-6 px-6 py-2 rounded-lg border-2 font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                Book Another Appointment
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

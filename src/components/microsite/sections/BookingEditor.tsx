'use client';

import { Calendar, ExternalLink } from 'lucide-react';
import { BookingSection } from '@/types/microsite';
import Toggle from '@/components/ui/Toggle';
import Link from 'next/link';

interface BookingEditorProps {
  config?: BookingSection;
  onChange: (data: BookingSection) => void;
  branchId?: string;
}

export default function BookingEditor({
  config = {
    enabled: false,
    title: 'Book an Appointment',
    subtitle: 'Choose a service and schedule your visit',
  },
  onChange,
  branchId,
}: BookingEditorProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Appointment Booking
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Allow visitors to book appointments directly from your microsite
        </p>
      </div>

      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Enable Booking Section
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Show appointment booking form on your microsite
          </p>
        </div>
        <Toggle
          enabled={config.enabled}
          onChange={(enabled) => handleChange('enabled', enabled)}
        />
      </div>

      {config.enabled && (
        <>
          {/* Manage Services Link */}
          <div className="p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-primary-900 dark:text-primary-300">
                  Manage Services & Appointments
                </h4>
                <p className="text-sm text-primary-700 dark:text-primary-400 mt-1">
                  Add your services, set durations and prices, and view bookings in the Appointments dashboard.
                </p>
                <Link
                  href="/dashboard/appointments"
                  className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  Go to Appointments
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Section Title
            </label>
            <input
              type="text"
              value={config.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Book an Appointment"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Section Subtitle
            </label>
            <textarea
              value={config.subtitle || ''}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              placeholder="Choose a service and schedule your visit"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* How It Works */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              How It Works
            </h4>
            <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-decimal list-inside">
              <li>Add your services in the Appointments dashboard with duration and optional pricing</li>
              <li>Set your business hours in Branch settings</li>
              <li>Visitors can select a service, pick a date/time, and provide their details</li>
              <li>You receive the booking and can confirm, reschedule, or cancel</li>
              <li>Customers receive email notifications for status updates</li>
            </ol>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
              Tips for More Bookings
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
              <li>Keep service descriptions clear and concise</li>
              <li>Add prices to help customers make decisions</li>
              <li>Respond quickly to pending appointments</li>
              <li>Enable email notifications to stay updated</li>
              <li>Consider offering multiple service durations</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

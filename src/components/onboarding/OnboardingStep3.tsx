'use client';

import { useState } from 'react';

interface OnboardingStep3Props {
  onComplete: (data: any) => void;
  onBack: () => void;
  initialData?: any;
}

export default function OnboardingStep3({
  onComplete,
  onBack,
  initialData,
}: OnboardingStep3Props) {
  const [preferences, setPreferences] = useState({
    emailNotifications: initialData?.emailNotifications ?? true,
    smsNotifications: initialData?.smsNotifications ?? false,
    leadNotifications: initialData?.leadNotifications ?? true,
    paymentNotifications: initialData?.paymentNotifications ?? true,
    subscriptionReminders: initialData?.subscriptionReminders ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(preferences);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Set Your Preferences
      </h2>
      <p className="text-gray-600 mb-6">
        Customize your notification settings
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>

          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) =>
                  setPreferences({ ...preferences, emailNotifications: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Email Notifications</span>
                <p className="text-xs text-gray-500">Receive updates via email</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.smsNotifications}
                onChange={(e) =>
                  setPreferences({ ...preferences, smsNotifications: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">SMS Notifications</span>
                <p className="text-xs text-gray-500">Receive critical alerts via SMS</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.leadNotifications}
                onChange={(e) =>
                  setPreferences({ ...preferences, leadNotifications: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Lead Notifications</span>
                <p className="text-xs text-gray-500">Get notified when you receive new leads</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.paymentNotifications}
                onChange={(e) =>
                  setPreferences({ ...preferences, paymentNotifications: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Payment Notifications</span>
                <p className="text-xs text-gray-500">Receive payment receipts and updates</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.subscriptionReminders}
                onChange={(e) =>
                  setPreferences({ ...preferences, subscriptionReminders: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Subscription Reminders</span>
                <p className="text-xs text-gray-500">Get reminders before subscription expiry</p>
              </div>
            </label>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                You can change these preferences anytime from your profile settings.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Complete Setup
          </button>
        </div>
      </form>
    </div>
  );
}

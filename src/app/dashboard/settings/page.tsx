// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useToastHelpers } from '@/components/ui/Toast';
import { User, Bell, CreditCard, Shield, Save } from 'lucide-react';

type TabType = 'profile' | 'notifications' | 'subscription' | 'security';

export default function SettingsPage() {
  const { user } = useAuth();
  const { success, error, info, warning } = useToastHelpers();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isLoading, setIsLoading] = useState(false);

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    leadNotifications: true,
    paymentNotifications: true,
  });

  useEffect(() => {
    if (user != null) {
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: '',
      });
    }
  }, [user]);

  const tabs = [
    { id: 'profile' as TabType, label: 'Profile', icon: User },
    { id: 'notifications' as TabType, label: 'Notifications', icon: Bell },
    { id: 'subscription' as TabType, label: 'Subscription', icon: CreditCard },
    { id: 'security' as TabType, label: 'Security', icon: Shield },
  ];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="bg-white shadow-sm rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-gray-500 text-sm">Manage your account and preferences</p>
        </div>
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white shadow-sm rounded-xl p-6">
        {activeTab === 'profile' && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <label key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                  <div>
                    <span className="font-medium text-gray-900">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <p className="text-sm text-gray-500">Receive {key.toLowerCase()} updates</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                </label>
              ))}
            </div>
            <button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              <Save className="w-4 h-4" />
              {isLoading ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Subscription</h2>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
              <p className="text-sm opacity-80">Current Plan</p>
              <p className="text-2xl font-bold mt-1">Professional</p>
              <p className="text-sm opacity-80 mt-2">Valid until Dec 31, 2025</p>
            </div>
            <a href="/dashboard/subscription" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Manage Subscription
            </a>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">Change Password</h3>
              <p className="text-sm text-gray-500 mt-1">Update your password regularly for security</p>
              <button className="mt-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                Change Password
              </button>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500 mt-1">Add an extra layer of security</p>
              <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Enable 2FA
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

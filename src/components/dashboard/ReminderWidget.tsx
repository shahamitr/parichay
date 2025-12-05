// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { Bell, Clock, User, Phone, ChevronRight, AlertTriangle } from 'lucide-react';

interface Reminder {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  nextFollowUpAt: string;
  status: string;
  branch?: { name: string };
}

export default function ReminderWidget() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReminders();
    // Refresh every 5 minutes
    const interval = setInterval(fetchReminders, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchReminders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/reminders?days=3', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setReminders(data.reminders || []);
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const isOverdue = (date: string) => new Date(date) < new Date();
  const isToday = (date: string) => {
    const d = new Date(date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  };

  const todayReminders = reminders.filter(r => isToday(r.nextFollowUpAt));
  const overdueReminders = reminders.filter(r => isOverdue(r.nextFollowUpAt));
  const upcomingReminders = reminders.filter(r => !isToday(r.nextFollowUpAt) && !isOverdue(r.nextFollowUpAt));

  if (loading != null) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-orange-50 to-yellow-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-gray-900">Follow-up Reminders</h3>
          </div>
          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
            {reminders.length} pending
          </span>
        </div>
      </div>

      <div className="divide-y max-h-96 overflow-y-auto">
        {/* Overdue Section */}
        {overdueReminders.length > 0 && (
          <div className="p-3 bg-red-50">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Overdue ({overdueReminders.length})</span>
            </div>
            {overdueReminders.slice(0, 3).map(reminder => (
              <ReminderItem key={reminder.id} reminder={reminder} isOverdue />
            ))}
          </div>
        )}

        {/* Today Section */}
        {todayReminders.length > 0 && (
          <div className="p-3">
            <div className="flex items-center gap-2 text-orange-700 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Today ({todayReminders.length})</span>
            </div>
            {todayReminders.map(reminder => (
              <ReminderItem key={reminder.id} reminder={reminder} isToday />
            ))}
          </div>
        )}

        {/* Upcoming Section */}
        {upcomingReminders.length > 0 && (
          <div className="p-3">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Upcoming ({upcomingReminders.length})</span>
            </div>
            {upcomingReminders.slice(0, 5).map(reminder => (
              <ReminderItem key={reminder.id} reminder={reminder} />
            ))}
          </div>
        )}

        {reminders.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p>No upcoming follow-ups</p>
            <p className="text-sm">Schedule follow-ups from the Leads page</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {reminders.length > 0 && (
        <div className="p-3 border-t bg-gray-50">
          <a
            href="/dashboard/branches?tab=leads"
            className="flex items-center justify-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            View all leads
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
}

function ReminderItem({ reminder, isOverdue, isToday }: { reminder: Reminder; isOverdue?: boolean; isToday?: boolean }) {
  const handleCall = () => {
    if (reminder.phone) window.open(`tel:${reminder.phone}`);
  };

  return (
    <div className={`flex items-center justify-between p-2 rounded-lg mb-1 ${
      isOverdue ? 'bg-red-100' : isToday ? 'bg-orange-100' : 'bg-gray-50'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isOverdue ? 'bg-red-200' : isToday ? 'bg-orange-200' : 'bg-gray-200'
        }`}>
          <User className="w-4 h-4 text-gray-600" />
        </div>
        <div>
          <p className="font-medium text-sm text-gray-900">{reminder.name}</p>
          <p className="text-xs text-gray-500">
            {new Date(reminder.nextFollowUpAt).toLocaleString([], {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
ute: '2-digit',
            })}
          </p>
        </div>
      </div>
      {reminder.phone && (
        <button
          onClick={handleCall}
          className="p-2 hover:bg-white rounded-full transition-colors"
          title="Call"
        >
          <Phone className="w-4 h-4 text-green-600" />
        </button>
      )}
    </div>
  );
}

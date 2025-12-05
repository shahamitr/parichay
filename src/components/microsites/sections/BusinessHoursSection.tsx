'use client';

import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { Brand, Branch } from '@/generated/prisma';

interface BusinessHoursSectionProps {
  branch: Branch;
  brand: Brand;
}

interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

type BusinessHours = Record<string, DayHours>;

const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const dayLabels: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

export default function BusinessHoursSection({ branch, brand }: BusinessHoursSectionProps) {
  const businessHours = branch.businessHours as BusinessHours | null;

  if (!businessHours || Object.keys(businessHours).length === 0) {
    return null;
  }

  const getCurrentDay = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
  };

  const isCurrentlyOpen = () => {
    const currentDay = getCurrentDay();
    const todayHours = businessHours[currentDay];

    if (!todayHours || todayHours.closed) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [openHour, openMin] = todayHours.open.split(':').map(Number);
    const [closeHour, closeMin] = todayHours.close.split(':').map(Number);

    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;

    return currentTime >= openTime && currentTime <= closeTime;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const currentDay = getCurrentDay();
  const isOpen = isCurrentlyOpen();

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-primary/10 rounded-full mb-4">
            <Clock className="w-6 h-6 text-brand-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Hours</h2>

          {/* Current Status */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            isOpen
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {isOpen ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">Open Now</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                <span className="font-medium">Closed</span>
              </>
            )}
          </div>
        </div>

        {/* Hours Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {dayOrder.map((day) => {
            const hours = businessHours[day];
            const isToday = day === currentDay;

            return (
              <div
                key={day}
                className={`flex items-center justify-between px-6 py-4 border-b border-gray-100 last:border-b-0 ${
                  isToday ? 'bg-brand-primary/5' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {isToday && (
                    <span className="w-2 h-2 bg-brand-primary rounded-full"></span>
                  )}
                  <span className={`font-medium ${isToday ? 'text-brand-primary' : 'text-gray-900'}`}>
                    {dayLabels[day]}
                  </span>
                </div>

                <div className="text-right">
                  {!hours || hours.closed ? (
                    <span className="text-gray-400 font-medium">Closed</span>
                  ) : (
                    <span className={`font-medium ${isToday ? 'text-brand-primary' : 'text-gray-700'}`}>
                      {formatTime(hours.open)} - {formatTime(hours.close)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact for special hours */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Hours may vary on holidays. Contact us for special arrangements.
        </p>
      </div>
    </section>
  );
}

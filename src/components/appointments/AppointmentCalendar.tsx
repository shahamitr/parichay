'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface CalendarAppointment {
  id: string;
  serviceName: string;
  customerName: string;
  startTime: string;
  status: string;
  serviceSlot?: { color: string };
}

interface AppointmentCalendarProps {
  branchId: string;
  onDateSelect?: (date: string) => void;
  onNewAppointment?: () => void;
}

export default function AppointmentCalendar({
  branchId,
  onDateSelect,
  onNewAppointment,
}: AppointmentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Record<string, CalendarAppointment[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    fetchMonthAppointments();
  }, [branchId, year, month]);

  const fetchMonthAppointments = async () => {
    try {
      setLoading(true);
      const startDate = new Date(year, month, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

      const response = await fetch(
        `/api/appointments?branchId=${branchId}&startDate=${startDate}&endDate=${endDate}`
      );
      const data = await response.json();

      if (data.success) {
        // Group appointments by date
        const grouped: Record<string, CalendarAppointment[]> = {};
        data.appointments.forEach((apt: any) => {
          const dateKey = new Date(apt.date).toISOString().split('T')[0];
          if (!grouped[dateKey]) grouped[dateKey] = [];
          grouped[dateKey].push(apt);
        });
        setAppointments(grouped);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(year, month + (direction === 'next' ? 1 : -1), 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  // Calendar grid helpers
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const today = new Date().toISOString().split('T')[0];

  const renderCalendarDays = () => {
    const days = [];
    const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      let day: number;
      let isCurrentMonth = true;
      let dateStr: string;

      if (i < firstDayOfMonth) {
        // Previous month days
        day = daysInPrevMonth - firstDayOfMonth + i + 1;
        isCurrentMonth = false;
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevYear = month === 0 ? year - 1 : year;
        dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      } else if (i >= firstDayOfMonth + daysInMonth) {
        // Next month days
        day = i - firstDayOfMonth - daysInMonth + 1;
        isCurrentMonth = false;
        const nextMonth = month === 11 ? 0 : month + 1;
        const nextYear = month === 11 ? year + 1 : year;
        dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      } else {
        // Current month days
        day = i - firstDayOfMonth + 1;
        dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }

      const dayAppointments = appointments[dateStr] || [];
      const isToday = dateStr === today;
      const isSelected = dateStr === selectedDate;
      const isPast = dateStr < today;

      days.push(
        <div
          key={i}
          onClick={() => handleDateClick(dateStr)}
          className={`min-h-[100px] p-1 border-b border-r border-gray-200 dark:border-gray-700 cursor-pointer transition-colors ${
            isCurrentMonth
              ? 'bg-white dark:bg-gray-800'
              : 'bg-gray-50 dark:bg-gray-900/50'
          } ${
            isSelected ? 'ring-2 ring-inset ring-primary-500' : ''
          } ${
            isPast && isCurrentMonth ? 'opacity-60' : ''
          } hover:bg-gray-50 dark:hover:bg-gray-700/50`}
        >
          <div className="flex items-center justify-between mb-1">
            <span
              className={`inline-flex items-center justify-center w-7 h-7 text-sm font-medium rounded-full ${
                isToday
                  ? 'bg-primary-600 text-white'
                  : isCurrentMonth
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-400 dark:text-gray-600'
              }`}
            >
              {day}
            </span>
            {dayAppointments.length > 0 && (
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {dayAppointments.length}
              </span>
            )}
          </div>

          {/* Appointment indicators */}
          <div className="space-y-0.5">
            {dayAppointments.slice(0, 3).map((apt) => (
              <div
                key={apt.id}
                className="flex items-center gap-1 px-1 py-0.5 rounded text-xs truncate"
                style={{
                  backgroundColor: `${apt.serviceSlot?.color || '#3B82F6'}20`,
                  borderLeft: `2px solid ${apt.serviceSlot?.color || '#3B82F6'}`,
                }}
              >
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {apt.startTime}
                </span>
                <span className="truncate text-gray-600 dark:text-gray-400">
                  {apt.customerName.split(' ')[0]}
                </span>
              </div>
            ))}
            {dayAppointments.length > 3 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 pl-1">
                +{dayAppointments.length - 3} more
              </p>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {monthNames[month]} {year}
          </h2>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
          >
            Today
          </button>
        </div>

        {onNewAppointment && (
          <button
            onClick={onNewAppointment}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Appointment
          </button>
        )}
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
        {dayNames.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-7">
          {renderCalendarDays()}
        </div>
      )}

      {/* Selected Date Detail */}
      {selectedDate && appointments[selectedDate]?.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">
            {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {appointments[selectedDate].map((apt) => (
              <div
                key={apt.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <div
                  className="w-1 h-10 rounded-full"
                  style={{ backgroundColor: apt.serviceSlot?.color || '#3B82F6' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {apt.serviceName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {apt.startTime} • {apt.customerName}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    apt.status === 'CONFIRMED'
                      ? 'bg-blue-100 text-blue-800'
                      : apt.status === 'COMPLETED'
                      ? 'bg-green-100 text-green-800'
                      : apt.status === 'CANCELLED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

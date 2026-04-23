'use client';

import { useState, useEffect } from 'react';
import {
  Calendar, Clock, User, Phone, Mail,
  CheckCircle, XCircle, AlertCircle, MoreVertical,
  ChevronLeft, ChevronRight, Search, Filter
} from 'lucide-react';

interface Appointment {
  id: string;
  serviceName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes: string | null;
  serviceSlot?: {
    name: string;
    color: string;
  };
}

interface AppointmentListProps {
  branchId: string;
}

const STATUS_CONFIG = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
  CONFIRMED: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  COMPLETED: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
  NO_SHOW: { label: 'No Show', color: 'bg-gray-100 text-gray-800', icon: XCircle },
};

export default function AppointmentList({ branchId }: AppointmentListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, noShow: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, [branchId, selectedDate, statusFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      let url = `/api/appointments?branchId=${branchId}&date=${selectedDate}`;
      if (statusFilter) url += `&status=${statusFilter}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setAppointments(data.appointments);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
    setActiveMenu(null);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const filteredAppointments = appointments.filter(apt =>
    apt.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.customerPhone.includes(searchQuery) ||
    apt.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(STATUS_CONFIG).map(([key, config]) => {
          const count = stats[key.toLowerCase() as keyof typeof stats] || 0;
          return (
            <button
              key={key}
              onClick={() => setStatusFilter(statusFilter === key ? '' : key)}
              className={`p-3 rounded-lg border transition-all ${
                statusFilter === key
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{config.label}</p>
            </button>
          );
        })}
        <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
        </div>
      </div>

      {/* Date Navigation & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <button
            onClick={() => navigateDate('next')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg"
          >
            Today
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Date Header */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {formatDate(selectedDate)}
      </h3>

      {/* Appointments List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No appointments
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {statusFilter
              ? `No ${STATUS_CONFIG[statusFilter as keyof typeof STATUS_CONFIG]?.label.toLowerCase()} appointments for this date`
              : 'No appointments scheduled for this date'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAppointments.map((appointment) => {
            const statusConfig = STATUS_CONFIG[appointment.status];
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={appointment.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    {/* Time Column */}
                    <div className="text-center min-w-[60px]">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {appointment.startTime}
                      </p>
                      <p className="text-xs text-gray-500">
                        {appointment.duration} min
                      </p>
                    </div>

                    {/* Service Color Bar */}
                    <div
                      className="w-1 rounded-full"
                      style={{ backgroundColor: appointment.serviceSlot?.color || '#3B82F6' }}
                    />

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {appointment.serviceName}
                        </h4>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{appointment.customerName}</span>
                        </div>
                        <a
                          href={`tel:${appointment.customerPhone}`}
                          className="flex items-center gap-1 hover:text-primary-600"
                        >
                          <Phone className="w-4 h-4" />
                          <span>{appointment.customerPhone}</span>
                        </a>
                        {appointment.customerEmail && (
                          <a
                            href={`mailto:${appointment.customerEmail}`}
                            className="flex items-center gap-1 hover:text-primary-600"
                          >
                            <Mail className="w-4 h-4" />
                            <span className="truncate max-w-[150px]">{appointment.customerEmail}</span>
                          </a>
                        )}
                      </div>

                      {appointment.notes && (
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
                          {appointment.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveMenu(activeMenu === appointment.id ? null : appointment.id)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>

                    {activeMenu === appointment.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                        {appointment.status === 'PENDING' && (
                          <button
                            onClick={() => updateStatus(appointment.id, 'CONFIRMED')}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-blue-600"
                          >
                            Confirm Appointment
                          </button>
                        )}
                        {(appointment.status === 'PENDING' || appointment.status === 'CONFIRMED') && (
                          <>
                            <button
                              onClick={() => updateStatus(appointment.id, 'COMPLETED')}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-green-600"
                            >
                              Mark as Completed
                            </button>
                            <button
                              onClick={() => updateStatus(appointment.id, 'NO_SHOW')}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600"
                            >
                              Mark as No Show
                            </button>
                            <button
                              onClick={() => updateStatus(appointment.id, 'CANCELLED')}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600"
                            >
                              Cancel Appointment
                            </button>
                          </>
                        )}
                        <a
                          href={`https://wa.me/${appointment.customerPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          Send WhatsApp
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

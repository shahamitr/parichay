'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Plus,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  MessageSquare,
  Download
} from 'lucide-react';

interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  internalNotes?: string;
  value?: number;
  reminderSent: boolean;
  createdAt: string;
}

export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchQuery, statusFilter, dateFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      // Mock data for demo - in production, fetch from API
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          customerName: 'Sarah Johnson',
          customerPhone: '+1 (555) 123-4567',
          customerEmail: 'sarah.j@email.com',
          serviceName: 'Bridal Hair Styling',
          date: '2024-01-26',
          startTime: '10:00',
          endTime: '12:00',
          duration: 120,
          status: 'confirmed',
          notes: 'Wedding party of 6 people. Need trial run first.',
          value: 1200,
          reminderSent: true,
          createdAt: '2024-01-24T10:30:00Z'
        },
        {
          id: '2',
          customerName: 'Mike Chen',
          customerPhone: '+1 (555) 987-6543',
          customerEmail: 'mike.chen@email.com',
          serviceName: 'Business Consultation',
          date: '2024-01-25',
          startTime: '14:00',
          endTime: '15:30',
          duration: 90,
          status: 'pending',
          notes: 'Restaurant operations improvement consultation',
          value: 250,
          reminderSent: false,
          createdAt: '2024-01-24T09:15:00Z'
        },
        {
          id: '3',
          customerName: 'Emma Davis',
          customerPhone: '+1 (555) 456-7890',
          serviceName: 'Plumbing Repair',
          date: '2024-01-24',
          startTime: '09:00',
          endTime: '11:00',
          duration: 120,
          status: 'completed',
          notes: 'Kitchen sink blockage repair',
          internalNotes: 'Replaced main drain pipe. Customer very satisfied.',
          value: 350,
          reminderSent: true,
          createdAt: '2024-01-23T16:20:00Z'
        },
        {
          id: '4',
          customerName: 'David Wilson',
          customerPhone: '+1 (555) 321-0987',
          customerEmail: 'david.w@email.com',
          serviceName: 'Personal Training Session',
          date: '2024-01-27',
          startTime: '07:00',
          endTime: '08:00',
          duration: 60,
          status: 'confirmed',
          notes: 'First session - fitness assessment',
          value: 80,
          reminderSent: false,
          createdAt: '2024-01-22T14:45:00Z'
        },
        {
          id: '5',
          customerName: 'Lisa Anderson',
          customerPhone: '+1 (555) 654-3210',
          customerEmail: 'lisa.a@email.com',
          serviceName: 'Corporate Photography',
          date: '2024-01-23',
          startTime: '13:00',
          endTime: '15:00',
          duration: 120,
          status: 'cancelled',
          notes: 'Headshots for 10 employees',
          internalNotes: 'Client cancelled due to budget constraints',
          createdAt: '2024-01-21T09:30:00Z'
        }
      ];

      setAppointments(mockAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(appointment =>
        appointment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.customerPhone.includes(searchQuery) ||
        appointment.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === statusFilter);
    }

    // Date filter
    const today = new Date().toISOString().split('T')[0];
    if (dateFilter === 'today') {
      filtered = filtered.filter(appointment => appointment.date === today);
    } else if (dateFilter === 'upcoming') {
      filtered = filtered.filter(appointment => appointment.date >= today);
    } else if (dateFilter === 'past') {
      filtered = filtered.filter(appointment => appointment.date < today);
    }

    // Sort by date and time
    filtered.sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.startTime}`).getTime();
      const dateTimeB = new Date(`${b.date}T${b.startTime}`).getTime();
      return dateTimeA - dateTimeB;
    });

    setFilteredAppointments(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'no_show': return <XCircle className="w-4 h-4 text-gray-600" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no_show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    setAppointments(prev =>
      prev.map(appointment =>
        appointment.id === appointmentId
          ? { ...appointment, status: newStatus as any }
          : appointment
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/business-owner/dashboard" className="text-blue-600 hover:text-blue-800">
                ← Dashboard
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-lg font-semibold text-gray-900">Appointments</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    viewMode === 'list'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    viewMode === 'calendar'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Calendar
                </button>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4" />
                Export
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                New Appointment
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No Show</option>
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-blue-600">
              {filteredAppointments.filter(a => a.status === 'confirmed').length}
            </div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {filteredAppointments.filter(a => a.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-green-600">
              {filteredAppointments.filter(a => a.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-purple-600">
              ${filteredAppointments.reduce((sum, a) => sum + (a.value || 0), 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Appointments ({filteredAppointments.length})
            </h3>

            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900">{appointment.customerName}</h4>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(appointment.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status.replace('_', ' ')}
                          </span>
                        </div>
                        {!appointment.reminderSent && appointment.status === 'confirmed' && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                            Reminder Pending
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">{appointment.serviceName}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(appointment.date)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>{appointment.duration} min</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              <span>{appointment.customerPhone}</span>
                            </div>
                            {appointment.customerEmail && (
                              <div className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                <span>{appointment.customerEmail}</span>
                              </div>
                            )}
                            {appointment.value && (
                              <div className="flex items-center gap-1 text-green-600 font-medium">
                                <span>${appointment.value}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {appointment.notes && (
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded mb-2">
                          <strong>Notes:</strong> {appointment.notes}
                        </p>
                      )}

                      {appointment.internalNotes && (
                        <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                          <strong>Internal:</strong> {appointment.internalNotes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {appointment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Confirm"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Cancel"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {appointment.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusChange(appointment.id, 'completed')}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Mark Complete"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}

                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Phone className="w-4 h-4" />
                      </button>

                      {appointment.customerEmail && (
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                          <Mail className="w-4 h-4" />
                        </button>
                      )}

                      <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg">
                        <MessageSquare className="w-4 h-4" />
                      </button>

                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAppointments.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No appointments found</p>
                <p className="text-sm text-gray-400">
                  {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Appointments will appear here when customers book with you'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
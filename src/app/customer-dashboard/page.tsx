'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart,
  Clock,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Search,
  Filter,
  Calendar,
  User,
  Settings,
  History,
  Bookmark
} from 'lucide-react';

interface FavoriteBusiness {
  id: string;
  name: string;
  businessType: string;
  rating: number;
  distance: number;
  imageUrl?: string;
  slug: string;
  brandSlug: string;
}

interface ServiceHistoryItem {
  id: string;
  businessId: string;
  businessName: string;
  serviceType: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
  rating?: number;
  notes?: string;
}

export default function CustomerDashboard() {
  const [favorites, setFavorites] = useState<FavoriteBusiness[]>([]);
  const [serviceHistory, setServiceHistory] = useState<ServiceHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);

      // Fetch favorites (mock data for demo)
      const mockFavorites: FavoriteBusiness[] = [
        {
          id: '1',
          name: 'Elite Hair Studio',
          businessType: 'beauty',
          rating: 4.8,
          distance: 1.2,
          imageUrl: '/api/placeholder/100/100',
          slug: 'elite-hair-studio',
          brandSlug: 'elite-salon'
        },
        {
          id: '2',
          name: 'QuickFix Plumbing',
          businessType: 'service',
          rating: 4.6,
          distance: 2.1,
          slug: 'quickfix-plumbing',
          brandSlug: 'quickfix-services'
        },
        {
          id: '3',
          name: 'Fitness First Gym',
          businessType: 'fitness',
          rating: 4.7,
          distance: 0.8,
          slug: 'fitness-first',
          brandSlug: 'fitness-first-chain'
        }
      ];

      // Fetch service history (mock data for demo)
      const mockHistory: ServiceHistoryItem[] = [
        {
          id: '1',
          businessId: '1',
          businessName: 'Elite Hair Studio',
          serviceType: 'Haircut & Styling',
          date: '2024-01-20T10:00:00Z',
          status: 'completed',
          rating: 5,
          notes: 'Excellent service, very professional'
        },
        {
          id: '2',
          businessId: '2',
          businessName: 'QuickFix Plumbing',
          serviceType: 'Pipe Repair',
          date: '2024-01-15T14:30:00Z',
          status: 'completed',
          rating: 4,
          notes: 'Quick and efficient repair'
        },
        {
          id: '3',
          businessId: '4',
          businessName: 'TechCare Solutions',
          serviceType: 'Laptop Repair',
          date: '2024-01-25T11:00:00Z',
          status: 'pending'
        }
      ];

      setFavorites(mockFavorites);
      setServiceHistory(mockHistory);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getBusinessTypeIcon = (type: string) => {
    switch (type) {
      case 'beauty': return '💄';
      case 'service': return '🔧';
      case 'fitness': return '💪';
      case 'restaurant': return '🍽️';
      case 'healthcare': return '🏥';
      default: return '🏢';
    }
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
              <Link href="/" className="text-xl font-bold text-blue-600">
                Parichay
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-lg font-semibold text-gray-900">My Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/search"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Search className="w-4 h-4" />
                Find Services
              </Link>

              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-5 h-5" />
                <span className="text-sm">Guest User</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Favorite Businesses</p>
                <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Services Used</p>
                <p className="text-2xl font-bold text-gray-900">{serviceHistory.filter(h => h.status === 'completed').length}</p>
              </div>
              <History className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Services</p>
                <p className="text-2xl font-bold text-gray-900">{serviceHistory.filter(h => h.status === 'pending').length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating Given</p>
                <p className="text-2xl font-bold text-gray-900">
                  {serviceHistory.filter(h => h.rating).length > 0
                    ? (serviceHistory.filter(h => h.rating).reduce((sum, h) => sum + (h.rating || 0), 0) / serviceHistory.filter(h => h.rating).length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="border-b">
            <nav className="flex space-x-8 px-8">
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'favorites', label: 'My Favorites', icon: Heart },
                { id: 'history', label: 'Service History', icon: History },
                { id: 'settings', label: 'Preferences', icon: Settings },
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {serviceHistory.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          {getBusinessTypeIcon('service')}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.businessName}</p>
                          <p className="text-sm text-gray-600">{item.serviceType}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(item.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                      href="/search"
                      className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Search className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">Find Services</p>
                        <p className="text-sm text-blue-600">Discover nearby businesses</p>
                      </div>
                    </Link>

                    <button className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                      <Calendar className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">Book Appointment</p>
                        <p className="text-sm text-green-600">Schedule a service</p>
                      </div>
                    </button>

                    <button className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                      <Bookmark className="w-6 h-6 text-purple-600" />
                      <div>
                        <p className="font-medium text-purple-900">View Favorites</p>
                        <p className="text-sm text-purple-600">Your saved businesses</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">My Favorite Businesses</h3>
                  <Link
                    href="/search"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Find More →
                  </Link>
                </div>

                {favorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((business) => (
                      <Link
                        key={business.id}
                        href={`/business/${business.brandSlug}/${business.slug}`}
                        className="block bg-white rounded-lg border hover:shadow-md transition-shadow p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{business.name}</h4>
                            <p className="text-sm text-gray-600 capitalize">{business.businessType}</p>
                          </div>
                          <Heart className="w-5 h-5 text-red-500 fill-current" />
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{business.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{business.distance}km away</span>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <button className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                            <Phone className="w-3 h-3" />
                            Call
                          </button>
                          <button className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded text-sm">
                            <MessageCircle className="w-3 h-3" />
                            WhatsApp
                          </button>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No favorite businesses yet</p>
                    <Link
                      href="/search"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Search className="w-4 h-4" />
                      Discover Businesses
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <h3 className="text-lg font-semibold mb-6">Service History</h3>

                {serviceHistory.length > 0 ? (
                  <div className="space-y-4">
                    {serviceHistory.map((item) => (
                      <div key={item.id} className="bg-white border rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">{item.businessName}</h4>
                            <p className="text-gray-600">{item.serviceType}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(item.date).toLocaleDateString()}</span>
                          </div>
                          {item.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span>Rated {item.rating}/5</span>
                            </div>
                          )}
                        </div>

                        {item.notes && (
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                            "{item.notes}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No service history yet</p>
                    <Link
                      href="/search"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Search className="w-4 h-4" />
                      Find Services
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span>Email notifications for appointment reminders</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span>SMS notifications for service updates</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" />
                      <span>Marketing emails about new services</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Location Preferences</h3>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span>Use my location for nearby search results</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span>Show distance in search results</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span>Allow businesses to see my contact information</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="rounded" />
                      <span>Share my service history for better recommendations</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
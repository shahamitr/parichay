'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Star,
  MapPin,
  Phone,
  Globe,
  Clock,
  MessageCircle,
  Heart,
  Share2,
  Calendar,
  Camera,
  Award,
  Verified,
  Navigation,
  Mail,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

interface BusinessProfile {
  id: string;
  name: string;
  slug: string;
  businessType: string;
  serviceCategories: string[];
  priceRange: string;
  avgServicePrice: number;
  address: any;
  contact: any;
  socialMedia?: any;
  businessHours?: any;
  isVerified: boolean;
  latitude?: number;
  longitude?: number;
  rating: number;
  reviewCount: number;
  brand: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    tagline?: string;
    isVerified: boolean;
    verificationBadge?: string;
  };
  reviews?: any[];
  portfolioItems?: any[];
  offers?: any[];
  serviceSlots?: any[];
  socialProofBadges?: any[];
  videoTestimonials?: any[];
  voiceIntro?: any;
  distance?: number;
}

export default function BusinessProfilePage() {
  const params = useParams();
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    fetchBusinessProfile();
    getUserLocation();
  }, [params.brandSlug, params.branchSlug]);

  const fetchBusinessProfile = async () => {
    try {
      setLoading(true);
      // This would be a real API call
      const response = await fetch(`/api/public/business/${params.brandSlug}/${params.branchSlug}`);
      if (response.ok) {
        const data = await response.json();
        setBusiness(data.business);
        checkIfFavorited(data.business.id);
      }
    } catch (error) {
      console.error('Error fetching business profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error('Location error:', error)
      );
    }
  };

  const checkIfFavorited = (businessId: string) => {
    const favorites = JSON.parse(localStorage.getItem('favoriteBusinesses') || '[]');
    setIsFavorited(favorites.includes(businessId));
  };

  const toggleFavorite = () => {
    if (!business) return;

    const favorites = JSON.parse(localStorage.getItem('favoriteBusinesses') || '[]');
    let updatedFavorites;

    if (isFavorited) {
      updatedFavorites = favorites.filter((id: string) => id !== business.id);
    } else {
      updatedFavorites = [...favorites, business.id];
    }

    localStorage.setItem('favoriteBusinesses', JSON.stringify(updatedFavorites));
    setIsFavorited(!isFavorited);
  };

  const shareProfile = async () => {
    if (navigator.share && business) {
      try {
        await navigator.share({
          title: business.name,
          text: `Check out ${business.name} - ${business.brand.tagline}`,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
        alert('Profile link copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Profile link copied to clipboard!');
    }
  };

  const getBusinessHoursStatus = (businessHours: any) => {
    if (!businessHours) return null;

    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
    const currentTime = now.getHours() * 100 + now.getMinutes();

    const todayHours = businessHours[currentDay];
    if (!todayHours || todayHours.closed) {
      return { status: 'closed', text: 'Closed Today', color: 'text-red-600 bg-red-50' };
    }

    const openTime = parseInt(todayHours.open.replace(':', ''));
    const closeTime = parseInt(todayHours.close.replace(':', ''));

    if (currentTime >= openTime && currentTime <= closeTime) {
      return { status: 'open', text: `Open until ${todayHours.close}`, color: 'text-green-600 bg-green-50' };
    } else {
      return { status: 'closed', text: `Opens at ${todayHours.open}`, color: 'text-orange-600 bg-orange-50' };
    }
  };

  const formatAddress = (address: any) => {
    if (!address) return '';
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Business Not Found</h1>
          <p className="text-gray-600 mb-4">The business you're looking for doesn't exist.</p>
          <Link href="/search" className="text-blue-600 hover:text-blue-800">
            ← Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const hoursStatus = getBusinessHoursStatus(business.businessHours);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/search" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
              ← Back to Search
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorited
                    ? 'text-red-600 bg-red-50 hover:bg-red-100'
                    : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={shareProfile}
                className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Business Header */}
            <div className="bg-white rounded-xl shadow-sm border p-8 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{business.name}</h1>
                    {business.isVerified && (
                      <div className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        <Verified className="w-4 h-4" />
                        Verified
                      </div>
                    )}
                  </div>
                  <p className="text-lg text-gray-600 mb-2">{business.brand.name}</p>
                  {business.brand.tagline && (
                    <p className="text-gray-500 mb-4">{business.brand.tagline}</p>
                  )}

                  {/* Rating */}
                  {business.rating > 0 && (
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(business.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-lg font-semibold">{business.rating}</span>
                      </div>
                      <span className="text-gray-500">
                        ({business.reviewCount} {business.reviewCount === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  )}

                  {/* Categories */}
                  <div className="flex flex-wrap gap-2">
                    {business.serviceCategories.map((category, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-medium"
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>

                {business.brand.logo && (
                  <img
                    src={business.brand.logo}
                    alt={business.brand.name}
                    className="w-24 h-24 rounded-xl object-cover flex-shrink-0 ml-6"
                  />
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {business.contact?.phone && (
                  <a
                    href={`tel:${business.contact.phone}`}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </a>
                )}

                {business.contact?.whatsapp && (
                  <a
                    href={`https://wa.me/${business.contact.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </a>
                )}

                {business.serviceSlots && business.serviceSlots.length > 0 && (
                  <button className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                    <Calendar className="w-5 h-5" />
                    Book Appointment
                  </button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border mb-6">
              <div className="border-b">
                <nav className="flex space-x-8 px-8">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'reviews', label: `Reviews (${business.reviewCount})` },
                    { id: 'portfolio', label: 'Portfolio' },
                    { id: 'offers', label: 'Offers' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-8">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">About</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {business.brand.tagline || 'Professional services with a commitment to quality and customer satisfaction.'}
                      </p>
                    </div>

                    {business.serviceSlots && business.serviceSlots.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Services</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {business.serviceSlots.map((service: any, index: number) => (
                            <div key={index} className="border rounded-lg p-4">
                              <h4 className="font-medium text-gray-900">{service.name}</h4>
                              {service.description && (
                                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                              )}
                              {service.price && (
                                <p className="text-sm font-medium text-green-600 mt-2">
                                  ₹{service.price}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
                    {business.reviews && business.reviews.length > 0 ? (
                      <div className="space-y-4">
                        {business.reviews.map((review: any, index: number) => (
                          <div key={index} className="border-b pb-4 last:border-b-0">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                {review.reviewerName.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{review.reviewerName}</span>
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < review.rating
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-gray-600">{review.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No reviews yet. Be the first to leave a review!</p>
                    )}
                  </div>
                )}

                {activeTab === 'portfolio' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Portfolio</h3>
                    {business.portfolioItems && business.portfolioItems.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {business.portfolioItems.map((item: any, index: number) => (
                          <div key={index} className="border rounded-lg overflow-hidden">
                            {item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-48 object-cover"
                              />
                            )}
                            <div className="p-4">
                              <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
                              {item.description && (
                                <p className="text-sm text-gray-600">{item.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No portfolio items available.</p>
                    )}
                  </div>
                )}

                {activeTab === 'offers' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Current Offers</h3>
                    {business.offers && business.offers.length > 0 ? (
                      <div className="space-y-4">
                        {business.offers.map((offer: any, index: number) => (
                          <div key={index} className="border rounded-lg p-4 bg-gradient-to-r from-green-50 to-blue-50">
                            <h4 className="font-medium text-gray-900 mb-2">{offer.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{offer.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-green-600">
                                {offer.discountType === 'PERCENTAGE' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
                              </span>
                              {offer.code && (
                                <span className="bg-gray-900 text-white px-3 py-1 rounded text-sm font-mono">
                                  {offer.code}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No current offers available.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>

              <div className="space-y-4">
                {business.contact?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <a href={`tel:${business.contact.phone}`} className="text-blue-600 hover:text-blue-800">
                      {business.contact.phone}
                    </a>
                  </div>
                )}

                {business.contact?.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <a href={`mailto:${business.contact.email}`} className="text-blue-600 hover:text-blue-800">
                      {business.contact.email}
                    </a>
                  </div>
                )}

                {business.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-900">{formatAddress(business.address)}</p>
                      {business.distance && (
                        <p className="text-sm text-gray-500 mt-1">{business.distance}km away</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Business Hours */}
            {business.businessHours && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Business Hours</h3>
                  {hoursStatus && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${hoursStatus.color}`}>
                      {hoursStatus.text}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {Object.entries(business.businessHours).map(([day, hours]: [string, any]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="capitalize font-medium">{day}</span>
                      <span className="text-gray-600">
                        {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

              <div className="space-y-3">
                <button
                  onClick={() => window.open(`https://maps.google.com/?q=${formatAddress(business.address)}`, '_blank')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Navigation className="w-5 h-5 text-gray-600" />
                  <span>Get Directions</span>
                </button>

                <button
                  onClick={shareProfile}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Share2 className="w-5 h-5 text-gray-600" />
                  <span>Share Profile</span>
                </button>

                <button
                  onClick={toggleFavorite}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isFavorited
                      ? 'bg-red-50 hover:bg-red-100 text-red-700'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  <span>{isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
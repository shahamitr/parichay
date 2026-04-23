'use client';

import React from 'react';
import Link from 'next/link';
import {
  Star,
  MapPin,
  Phone,
  Globe,
  Clock,
  MessageCircle,
  ExternalLink,
  Award,
  Verified
} from 'lucide-react';

interface BusinessCardProps {
  business: {
    id: string;
    name: string;
    slug: string;
    brand: {
      name: string;
      logo?: string;
      isVerified: boolean;
      verificationBadge: string;
    };
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
    contact?: {
      phone?: string;
      email?: string;
      whatsapp?: string;
    };
    businessHours?: any;
    serviceCategories?: string[];
    businessType?: string;
    priceRange?: string;
    avgServicePrice?: number;
    distance?: number;
    rating: number;
    reviewCount: number;
    appointmentCount?: number;
    url: string;
  };
  showDistance?: boolean;
  compact?: boolean;
}

export default function BusinessCard({ business, showDistance = true, compact = false }: BusinessCardProps) {
  const getPriceDisplay = (priceRange: string, avgPrice: number) => {
    if (avgPrice) {
      return `₹${avgPrice.toLocaleString()}`;
    }
    switch (priceRange) {
      case 'budget': return '₹';
      case 'moderate': return '₹₹';
      case 'premium': return '₹₹₹';
      default: return '';
    }
  };

  const getBusinessHoursStatus = (businessHours: any) => {
    if (!businessHours) return null;

    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
    const currentTime = now.getHours() * 100 + now.getMinutes();

    const todayHours = businessHours[currentDay];
    if (!todayHours || todayHours.closed) {
      return { status: 'closed', text: 'Closed', color: 'text-red-600' };
    }

    const openTime = parseInt(todayHours.open.replace(':', ''));
    const closeTime = parseInt(todayHours.close.replace(':', ''));

    if (currentTime >= openTime && currentTime <= closeTime) {
      return { status: 'open', text: `Open until ${todayHours.close}`, color: 'text-green-600' };
    } else {
      return { status: 'closed', text: `Opens at ${todayHours.open}`, color: 'text-orange-600' };
    }
  };

  const getVerificationBadge = () => {
    if (!business.brand.isVerified) return null;

    const badgeType = business.brand.verificationBadge || 'verified';
    const badges = {
      verified: { icon: Verified, text: 'Verified', color: 'bg-green-500' },
      premium: { icon: Award, text: 'Premium', color: 'bg-purple-500' },
      trusted: { icon: Award, text: 'Trusted', color: 'bg-blue-500' }
    };

    const badge = badges[badgeType as keyof typeof badges] || badges.verified;
    const IconComponent = badge.icon;

    return (
      <div className={`absolute top-3 right-3 ${badge.color} text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
        <IconComponent className="w-3 h-3" />
        {badge.text}
      </div>
    );
  };

  const hoursStatus = getBusinessHoursStatus(business.businessHours);

  if (compact) {
    return (
      <Link
        href={business.url}
        className="block bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 p-4 relative group"
      >
        {getVerificationBadge()}

        <div className="flex items-start gap-3">
          {business.brand.logo && (
            <img
              src={business.brand.logo}
              alt={business.brand.name}
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            />
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {business.name}
            </h3>
            <p className="text-sm text-gray-600 truncate">{business.brand.name}</p>

            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              {business.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{business.rating}</span>
                </div>
              )}

              {showDistance && business.distance && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{business.distance}km</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={business.url}
      className="block bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 p-6 relative group hover:-translate-y-1"
    >
      {getVerificationBadge()}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
            {business.name}
          </h3>
          <p className="text-sm text-gray-600">{business.brand.name}</p>
          <p className="text-xs text-gray-500 capitalize mt-1">{business.businessType}</p>
        </div>

        {business.brand.logo && (
          <img
            src={business.brand.logo}
            alt={business.brand.name}
            className="w-16 h-16 rounded-xl object-cover flex-shrink-0 ml-4"
          />
        )}
      </div>

      {/* Rating and Reviews */}
      {business.rating > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(business.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-2 text-sm font-medium">{business.rating}</span>
          </div>
          <span className="text-sm text-gray-500">
            ({business.reviewCount} {business.reviewCount === 1 ? 'review' : 'reviews'})
          </span>
        </div>
      )}

      {/* Distance and Location */}
      {showDistance && business.distance && (
        <div className="flex items-center gap-1 mb-3 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{business.distance}km away</span>
          {business.address?.city && (
            <span className="text-gray-400">• {business.address.city}</span>
          )}
        </div>
      )}

      {/* Business Hours Status */}
      {hoursStatus && (
        <div className="flex items-center gap-1 mb-3 text-sm">
          <Clock className="w-4 h-4" />
          <span className={hoursStatus.color}>
            {hoursStatus.text}
          </span>
        </div>
      )}

      {/* Service Categories */}
      {business.serviceCategories && business.serviceCategories.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {business.serviceCategories.slice(0, 3).map((category, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          ))}
          {business.serviceCategories.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{business.serviceCategories.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Price Range */}
      {(business.priceRange || business.avgServicePrice) && (
        <div className="text-sm text-gray-600 mb-4">
          <span className="font-medium">Price: </span>
          <span className="text-green-600 font-semibold">
            {getPriceDisplay(business.priceRange, business.avgServicePrice)}
          </span>
        </div>
      )}

      {/* Contact Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        {business.contact?.phone && (
          <a
            href={`tel:${business.contact.phone}`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex-1 justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Phone className="w-4 h-4" />
            Call
          </a>
        )}

        {business.contact?.whatsapp && (
          <a
            href={`https://wa.me/${business.contact.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex-1 justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        )}

        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium group-hover:bg-gray-100 transition-colors flex-1 justify-center">
          <Globe className="w-4 h-4" />
          View Profile
          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </Link>
  );
}
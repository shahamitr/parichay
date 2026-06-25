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
  Verified,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

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
      return { status: 'closed', text: 'OFFLINE', color: 'text-red-400' };
    }

    const openTime = parseInt(todayHours.open.replace(':', ''));
    const closeTime = parseInt(todayHours.close.replace(':', ''));

    if (currentTime >= openTime && currentTime <= closeTime) {
      return { status: 'open', text: `ONLINE • UNTIL ${todayHours.close}`, color: 'text-emerald-400' };
    } else {
      return { status: 'closed', text: `OFFLINE • OPENS ${todayHours.open}`, color: 'text-orange-400' };
    }
  };

  const hoursStatus = getBusinessHoursStatus(business.businessHours);

  if (compact) {
    return (
      <motion.div whileHover={{ x: 10 }}>
        <Link
          href={business.url}
          className="block bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl p-4 relative group hover:border-primary-500/50 transition-all duration-500"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              {business.brand.logo ? (
                <img
                  src={business.brand.logo}
                  alt={business.brand.name}
                  className="w-12 h-12 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white font-black">
                   {business.name.charAt(0)}
                </div>
              )}
              {business.brand.isVerified && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full border-2 border-[#020617] flex items-center justify-center">
                   <ShieldCheck className="w-2 h-2 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-white text-sm uppercase tracking-widest truncate group-hover:text-primary-400 transition-colors">
                  {business.name}
                </h3>
                <ArrowUpRight className="w-4 h-4 text-neutral-600 group-hover:text-white transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
              <div className="flex items-center gap-4 mt-1 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                <span>{business.brand.name}</span>
                {showDistance && business.distance && (
                  <span className="flex items-center gap-1">
                    <Activity className="w-3 h-3" /> {business.distance}km
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="relative group"
    >
      <Link
        href={business.url}
        className="block bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 overflow-hidden transition-all duration-700 hover:border-primary-500/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        {/* Animated Background Element */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary-600/10 rounded-full blur-3xl group-hover:bg-primary-600/30 transition-all duration-700"></div>

        {/* Header */}
        <div className="flex items-start justify-between mb-8 relative z-10">
          <div className="flex-1 min-w-0">
             <div className="flex items-center gap-3 mb-2">
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black tracking-[0.2em] text-neutral-400 uppercase">
                   Node ID: {business.id.substring(0, 8)}
                </div>
                <div className="px-3 py-1 bg-emerald-600/10 border border-emerald-500/20 rounded-full text-[9px] font-black tracking-[0.2em] text-emerald-400 uppercase">
                   Local Intelligence
                </div>
                {business.brand.isVerified && (
                   <div className="flex items-center gap-1.5 px-3 py-1 bg-primary-600/10 border border-primary-500/20 rounded-full text-[9px] font-black tracking-[0.2em] text-primary-400 uppercase">
                      <ShieldCheck className="w-2.5 h-2.5" /> Verified
                   </div>
                )}
             </div>
             <h3 className="text-2xl font-black text-white tracking-tighter leading-none group-hover:text-primary-400 transition-colors uppercase">
               {business.name}
             </h3>
             <p className="text-xs font-bold text-neutral-500 mt-2 uppercase tracking-widest">{business.brand.name} • {business.businessType}</p>
          </div>

          {business.brand.logo ? (
            <div className="relative group/logo">
               <div className="absolute inset-0 bg-primary-600/20 blur-xl rounded-full opacity-0 group-hover/logo:opacity-100 transition-opacity"></div>
               <img
                 src={business.brand.logo}
                 alt={business.brand.name}
                 className="w-16 h-16 rounded-2xl object-cover relative z-10 border border-white/10 group-hover/logo:scale-110 transition-transform duration-500"
               />
            </div>
          ) : (
             <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-3xl font-black text-white">
                {business.name.charAt(0)}
             </div>
          )}
        </div>

        {/* Intel Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
           <div className="p-4 bg-white/5 border border-white/10 rounded-3xl">
              <div className="flex items-center gap-2 mb-1">
                 <Star className="w-3.5 h-3.5 text-primary-400 fill-primary-400" />
                 <span className="text-xl font-black text-white">{business.rating || '5.0'}</span>
              </div>
              <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Network Rating</p>
           </div>
           <div className="p-4 bg-white/5 border border-white/10 rounded-3xl">
              <div className="flex items-center gap-2 mb-1">
                 <Activity className="w-3.5 h-3.5 text-primary-400" />
                 <span className="text-xl font-black text-white">{business.distance || '0.0'}km</span>
              </div>
              <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Proximity</p>
           </div>
        </div>

        {/* Status & Categories */}
        <div className="space-y-4 mb-8 relative z-10">
           {hoursStatus && (
             <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${hoursStatus.status === 'open' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></div>
                <span className={`text-[10px] font-black tracking-[0.2em] ${hoursStatus.color}`}>
                  {hoursStatus.text}
                </span>
             </div>
           )}

           <div className="flex flex-wrap gap-2">
              {business.serviceCategories?.slice(0, 3).map((category, index) => (
                <span
                  key={index}
                  className="px-4 py-1.5 bg-white/5 border border-white/10 text-[10px] font-black text-neutral-400 rounded-full uppercase tracking-widest group-hover:border-primary-500/20 group-hover:text-white transition-all"
                >
                  {category}
                </span>
              ))}
           </div>
        </div>

        {/* Quick Sync Protocol */}
        <div className="flex gap-3 pt-6 border-t border-white/5 relative z-10">
          {business.contact?.phone && (
            <a
              href={`tel:${business.contact.phone}`}
              className="flex-1 flex items-center justify-center gap-3 py-4 bg-primary-600 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-primary-500 transition-all shadow-xl shadow-primary-600/20"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-4 h-4" />
              Voice
            </a>
          )}

          {business.contact?.whatsapp && (
            <a
              href={`https://wa.me/${business.contact.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-3 py-4 bg-emerald-600/20 border border-emerald-500/30 rounded-2xl text-[10px] font-black text-emerald-400 uppercase tracking-widest hover:bg-emerald-600/40 transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle className="w-4 h-4" />
              Relay
            </a>
          )}

          <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-white/10 transition-all">
             <Zap className="w-5 h-5 text-primary-400" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
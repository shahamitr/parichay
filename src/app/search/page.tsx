'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Navigation, Loader2, Sparkles, Activity, Shield, Zap, LayoutGrid, List, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import BusinessCard from '@/components/search/BusinessCard';
import SearchFilters from '@/components/search/SearchFilters';
import { getCurrentLocation } from '@/lib/location';
import { useTranslation } from '@/lib/i18n/context';

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  businessType: string;
  serviceCategories: string[];
  priceRange: string;
  avgServicePrice: number;
  address: any;
  contact: any;
  businessHours: any;
  isVerified: boolean;
  distance: number | null;
  rating: number;
  reviewCount: number;
  brand: {
    id: string;
    name: string;
    logo: string;
    slug: string;
    isVerified: boolean;
    verificationBadge: string;
  };
  url: string;
}

interface SearchMetadata {
  total: number;
  hasLocation: boolean;
  radius: number;
  query: string;
  category: string;
  businessType: string;
  priceRange: string;
}

export default function SearchPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [metadata, setMetadata] = useState<SearchMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState('');
  const [locationLoading, setLocationLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filters
  const [filters, setFilters] = useState({
    category: '',
    businessType: '',
    priceRange: '',
    radius: 10
  });
  const [showFilters, setShowFilters] = useState(false);

  // Get user location on mount
  useEffect(() => {
    const getLocation = async () => {
      setLocationLoading(true);
      try {
        const location = await getCurrentLocation();
        if (location) {
          setUserLocation(location);
        } else {
          setLocationError('Location access denied. Precision discovery disabled.');
        }
      } catch (error) {
        setLocationError('Intelligence relay failed. Discovery limited to manual search.');
      } finally {
        setLocationLoading(false);
      }
    };

    getLocation();
  }, []);

  const performSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        public: 'true',
        limit: '24',
        radius: filters.radius.toString(),
      });

      if (userLocation) {
        params.append('lat', userLocation.lat.toString());
        params.append('lng', userLocation.lng.toString());
      }

      if (filters.category) params.append('category', filters.category);
      if (filters.businessType) params.append('type', filters.businessType);
      if (filters.priceRange) params.append('price', filters.priceRange);

      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();

      if (data.success) {
        setResults(data.results);
        setMetadata(data.metadata);
      } else {
        setResults([]);
        setMetadata(null);
      }
    } catch (error) {
      setResults([]);
      setMetadata(null);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length >= 2 || filters.category || filters.businessType) {
        performSearch();
      } else if (query.length === 0 && !filters.category && !filters.businessType) {
        setResults([]);
        setMetadata(null);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, filters, userLocation]);

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.businessType) count++;
    if (filters.priceRange) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-primary-500/30 overflow-hidden">
      {/* Global Cinematic Embers Overlay */}
      <div className="fixed inset-0 pointer-events-none z-10 opacity-20">
         <div className="ember-container">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="ember" />
            ))}
         </div>
      </div>

      {/* Decorative Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-600/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

      <div className="relative z-20">
        {/* Cinematic Header Area */}
        <div className="pt-32 pb-12 px-6 lg:px-8 border-b border-white/5 bg-[#020617]/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
               <div className="space-y-4">
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary-600/10 border border-primary-500/20 rounded-full">
                     <Activity className="w-3.5 h-3.5 text-primary-400 animate-pulse" />
                     <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary-200">Intelligence Discovery Network</span>
                  </div>
                  <h1 className="text-4xl lg:text-6xl font-black tracking-tighter leading-[0.9]">
                     Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400 italic">Dominion</span>
                  </h1>
               </div>

               <div className="flex items-center gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-1.5 flex gap-1">
                     <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-neutral-500 hover:text-white'}`}
                     >
                        <LayoutGrid className="w-5 h-5" />
                     </button>
                     <button 
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-neutral-500 hover:text-white'}`}
                     >
                        <List className="w-5 h-5" />
                     </button>
                  </div>
                  <button 
                    onClick={() => setShowFilters(true)}
                    className="relative group px-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-all overflow-hidden"
                  >
                     <Filter className="w-5 h-5 text-primary-400" />
                     <span className="text-xs font-black uppercase tracking-widest">Filters</span>
                     {getActiveFilterCount() > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-[#020617]">
                           {getActiveFilterCount()}
                        </span>
                     )}
                  </button>
               </div>
            </div>

            {/* Floating Search Hub */}
            <div className="mt-12 relative group max-w-4xl">
               <div className="absolute inset-0 bg-primary-600/20 rounded-3xl blur-2xl group-focus-within:bg-primary-600/40 transition-all duration-700"></div>
               <div className="relative bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[2rem] p-2 flex flex-col md:flex-row gap-2">
                  <div className="flex-1 relative">
                     <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-400 w-6 h-6" />
                     <input 
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Scan for services, nodes, or intelligence..."
                        className="w-full pl-16 pr-6 py-6 bg-transparent text-white text-xl placeholder:text-neutral-500 outline-none font-medium"
                     />
                  </div>
                  <div className="h-auto w-px bg-white/10 hidden md:block my-3"></div>
                  <div className="md:w-64 relative flex items-center px-4">
                     <MapPin className="text-primary-400 w-5 h-5 mr-3" />
                     <div className="flex-1 text-sm font-bold truncate">
                        {locationLoading ? 'Syncing...' : userLocation ? 'Node Synchronized' : 'Precision Off'}
                     </div>
                     {userLocation ? (
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-2"></div>
                     ) : (
                        <Zap className="w-4 h-4 text-orange-400 ml-2" />
                     )}
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Results Dominion */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
           <AnimatePresence mode="wait">
              {loading && results.length === 0 ? (
                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-32 space-y-8"
                 >
                    <div className="relative">
                       <div className="w-24 h-24 border-4 border-primary-600/20 rounded-full animate-ping absolute inset-0"></div>
                       <div className="w-24 h-24 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.5em] text-primary-400">Synchronizing Network Results</p>
                 </motion.div>
              ) : results.length > 0 ? (
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6 max-w-4xl"}
                 >
                    {results.map((business, i) => (
                       <motion.div 
                          key={business.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                       >
                          <BusinessCard 
                             business={business} 
                             showDistance={!!userLocation} 
                             compact={viewMode === 'list'}
                          />
                       </motion.div>
                    ))}
                 </motion.div>
              ) : !loading && (query.length >= 2 || filters.category) ? (
                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-32 space-y-6"
                 >
                    <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-8">
                       <Shield className="w-10 h-10 text-neutral-700" />
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter">No Active Nodes Found</h2>
                    <p className="text-neutral-500 max-w-md mx-auto font-medium">Your search query yielded zero results within the current synchronization range. Adjust filters or try manual input.</p>
                    <button 
                       onClick={() => { setQuery(''); setFilters({ category: '', businessType: '', priceRange: '', radius: 10 }); }}
                       className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                       Reset Discovery Buffer
                    </button>
                 </motion.div>
              ) : (
                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-20"
                 >
                    {/* Welcome Intelligence */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                       <div className="space-y-8">
                          <h2 className="text-5xl font-black tracking-tighter leading-[0.9]">
                             Immediate <span className="text-primary-500 italic">Discovery.</span>
                          </h2>
                          <p className="text-xl text-neutral-400 font-medium leading-relaxed">
                             Access the Parichay Intelligence Network. Locate verified nodes near you and secure services with absolute velocity.
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                             {[
                                { label: 'Verified Nodes', val: '50K+' },
                                { label: 'Network Health', val: '99.9%' }
                             ].map(s => (
                                <div key={s.label} className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                                   <div className="text-3xl font-black text-white">{s.val}</div>
                                   <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mt-2">{s.label}</div>
                                </div>
                             ))}
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-6">
                          {[
                            { category: 'tiffin', label: 'Home Dining', icon: '🍱' },
                            { category: 'restaurant', label: 'Dining', icon: '🍽️' },
                            { category: 'beauty', label: 'Wellness', icon: '💄' },
                            { category: 'healthcare', label: 'Medical', icon: '🏥' },
                            { category: 'automotive', label: 'Velocity', icon: '🚗' },
                            { category: 'grocery', label: 'Essentials', icon: '🛒' },
                          ].map((item) => (
                            <button
                              key={item.category}
                              onClick={() => setFilters(prev => ({ ...prev, category: item.category }))}
                              className="group relative p-8 bg-white/5 border border-white/10 rounded-[2.5rem] hover:bg-primary-600 transition-all duration-500 overflow-hidden"
                            >
                              <div className="relative z-10">
                                 <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-500">
                                   {item.icon}
                                 </div>
                                 <div className="text-xs font-black uppercase tracking-[0.2em] text-white">
                                   {item.label}
                                 </div>
                              </div>
                              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:bg-white/20 transition-all"></div>
                            </button>
                          ))}
                       </div>
                    </div>

                    {/* Fast Lane CTA */}
                    <div className="relative p-12 rounded-[3rem] bg-gradient-to-br from-indigo-600 to-primary-600 overflow-hidden">
                       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                       <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                          <div className="space-y-4 text-center md:text-left">
                             <h3 className="text-4xl font-black tracking-tighter leading-[0.9]">Can't find a Node?</h3>
                             <p className="text-white/80 font-bold max-w-md">Broadcast your request to the entire network and let the supply come to your demand.</p>
                          </div>
                          <button className="px-12 py-6 bg-white text-primary-600 font-black rounded-2xl uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-2xl">
                             Request Fast Intel
                          </button>
                       </div>
                    </div>
                 </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      <AnimatePresence>
         {showFilters && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-[300] bg-[#020617]/90 backdrop-blur-2xl overflow-y-auto p-8"
            >
               <div className="max-w-xl mx-auto space-y-12">
                  <div className="flex items-center justify-between">
                     <h2 className="text-4xl font-black tracking-tighter uppercase">Discovery Logic</h2>
                     <button onClick={() => setShowFilters(false)} className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white font-bold text-xl">×</button>
                  </div>
                  <SearchFilters
                    isOpen={true}
                    onClose={() => setShowFilters(false)}
                    filters={filters}
                    onFiltersChange={setFilters}
                    hasLocation={!!userLocation}
                  />
                  <button 
                     onClick={() => setShowFilters(false)}
                     className="w-full py-6 bg-primary-600 text-white font-black rounded-2xl uppercase tracking-widest text-sm shadow-2xl shadow-primary-600/40"
                  >
                     Apply Parameters
                  </button>
               </div>
            </motion.div>
         )}
      </AnimatePresence>

      {/* Floating Status Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[250] bg-white/10 backdrop-blur-3xl border border-white/20 px-8 py-4 rounded-full flex items-center gap-6 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Network Active</span>
         </div>
         <div className="w-px h-4 bg-white/10"></div>
         <div className="text-[9px] font-black uppercase tracking-widest text-neutral-400">
            {metadata ? `${metadata.total} Nodes Online` : 'Scanning...'}
         </div>
         <div className="w-px h-4 bg-white/10"></div>
         <Link href="/register" className="text-[9px] font-black uppercase tracking-widest text-primary-400 hover:text-primary-300">Register Your Node</Link>
      </div>
    </div>
  );
}
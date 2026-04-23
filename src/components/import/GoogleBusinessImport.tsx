'use client';

import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  Download,
  Star,
  Clock,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GoogleBusinessImportProps {
  executiveId?: string;
  onImportComplete?: () => void;
}

export default function GoogleBusinessImport({ executiveId, onImportComplete }: GoogleBusinessImportProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<any | null>(null);
  const [importing, setImporting] = useState(false);

  // Mock search function
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Simulate API delay
    setTimeout(() => {
      setSearchResults([
        {
          id: '1',
          name: searchQuery,
          address: '123 Business Avenue, Ahmedabad, Gujarat',
          rating: 4.8,
          reviews: 124,
          phone: '+91 98765 43210',
          website: 'https://example.com',
          hours: 'Open until 9:00 PM'
        }
      ]);
      setIsSearching(false);
    }, 1500);
  };

  const handleImport = () => {
    setImporting(true);
    // Simulate import process
    setTimeout(() => {
      setImporting(false);
      if (onImportComplete) onImportComplete();
    }, 2000);
  };

  return (
    <div className="bg-white dark:bg-[#0A0A1B] rounded-2xl border border-neutral-200 dark:border-white/5 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-neutral-100 dark:border-white/5 bg-neutral-50/50 dark:bg-white/5">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-500" />
          Google Business Synchronization
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Instantly sync location, contact info, and images from Google Maps
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter business name or Google Maps URL..."
            className="w-full pl-12 pr-32 py-4 bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-neutral-900 dark:text-white"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 text-sm"
          >
            {isSearching ? 'SEARCHING...' : 'SYNC'}
          </button>
        </div>

        {/* Status / Notice */}
        {!selectedBusiness && !isSearching && searchResults.length === 0 && (
          <div className="flex items-start gap-4 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800 dark:text-amber-400">
              <p className="font-bold mb-1">Production Preview Mode</p>
              <p>The Google API is currently in read-only mode for security. You can search for businesses, but data synchronization is simulated for the demo.</p>
            </div>
          </div>
        )}

        {/* Results Area */}
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 flex flex-col items-center justify-center space-y-4"
            >
              <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-sm text-neutral-500 font-medium animate-pulse">CONNECTING TO GOOGLE CLOUD...</p>
            </motion.div>
          ) : searchResults.length > 0 && !selectedBusiness ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">Matching Locations</p>
              {searchResults.map((biz) => (
                <button
                  key={biz.id}
                  onClick={() => setSelectedBusiness(biz)}
                  className="w-full flex items-center justify-between p-4 bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl hover:border-blue-500 transition-all text-left group"
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 dark:text-white group-hover:text-blue-500 transition-colors">{biz.name}</h4>
                      <p className="text-sm text-neutral-500 truncate max-w-xs">{biz.address}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-neutral-300'}`} />
                          ))}
                        </div>
                        <span className="text-[10px] text-neutral-400 font-bold uppercase">{biz.reviews} REVIEWS</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-blue-500" />
                </button>
              ))}
            </motion.div>
          ) : selectedBusiness ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4">
                   <div className="flex items-center gap-2 bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                     <CheckCircle2 className="w-3 h-3" />
                     VERIFIED DATA
                   </div>
                 </div>
                 
                 <div className="relative z-10">
                   <h4 className="text-2xl font-black text-neutral-900 dark:text-white mb-2">{selectedBusiness.name}</h4>
                   <p className="text-neutral-600 dark:text-neutral-400 flex items-center gap-2 text-sm mb-6">
                     <MapPin className="w-4 h-4 text-blue-500" />
                     {selectedBusiness.address}
                   </p>
                   
                   <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-white/20">
                        <p className="text-[10px] font-black text-neutral-400 uppercase mb-1">Contact</p>
                        <p className="text-sm font-bold text-neutral-900 dark:text-white">{selectedBusiness.phone}</p>
                     </div>
                     <div className="p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-white/20">
                        <p className="text-[10px] font-black text-neutral-400 uppercase mb-1">Hours</p>
                        <p className="text-sm font-bold text-green-600">{selectedBusiness.hours}</p>
                     </div>
                   </div>
                 </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedBusiness(null)}
                  className="flex-1 py-4 border border-neutral-200 dark:border-white/10 rounded-xl font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/5 transition-all"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleImport}
                  disabled={importing}
                  className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-3"
                >
                  {importing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      SYNCING...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      IMPORT BUSINESS DATA
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="p-6 bg-neutral-900 dark:bg-black flex items-center justify-between border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Globe className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] font-black text-white uppercase tracking-widest">Global Sync</p>
            <p className="text-[9px] text-neutral-500 uppercase tracking-tighter">Connected to Google Business Profile API</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
           <span className="text-[10px] font-black text-green-500">API ACTIVE</span>
        </div>
      </div>
    </div>
  );
}

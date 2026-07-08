'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Tag, Clock, Copy, Check, Gift, Percent, Truck, ShoppingBag, AlertCircle } from 'lucide-react';
import { Brand, Branch } from '@/generated/prisma';
import { OffersSection as OffersConfig, Offer } from '@/types/microsite';
import toast from 'react-hot-toast';

interface OffersSectionProps {
  config: OffersConfig;
  brand: Brand;
  branch: Branch;
}

const discountIcons: Record<string, React.ReactNode> = {
  percentage: <Percent className="w-6 h-6" />,
  fixed: <Tag className="w-6 h-6" />,
  bogo: <Gift className="w-6 h-6" />,
  free_shipping: <Truck className="w-6 h-6" />,
  custom: <ShoppingBag className="w-6 h-6" />,
};

function isOfferExpired(offer: Offer): boolean {
  return new Date(offer.validUntil) < new Date();
}

export default function OffersSection({ config, brand, branch }: OffersSectionProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [claimedOffers, setClaimedOffers] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  if (!config.enabled || !config.offers || config.offers.length === 0) return null;

  // Show both active and recently expired offers (expired get a visual state)
  const visibleOffers = config.offers.filter(offer => {
    const now = new Date();
    return offer.isActive && new Date(offer.validFrom) <= now;
  });

  if (visibleOffers.length === 0) return null;

  const activeOffers = visibleOffers.filter(o => !isOfferExpired(o));
  const primaryColor = (brand as unknown as { primaryColor?: string })?.primaryColor || '#EF4444';

  const handleClaimOffer = (offer: Offer) => {
    if (isOfferExpired(offer)) return;

    setClaimedOffers((prev) => new Set([...prev, offer.id]));
    toast.success(`Offer "${offer.title}" claimed! Check your notifications.`);

    // Track claim
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'CLICK',
        branchId: branch.id,
        brandId: brand.id,
        metadata: { action: 'claim_offer', offerId: offer.id, offerTitle: offer.title },
      }),
    }).catch(() => {});
  };

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);

    // Track copy
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'CLICK',
        branchId: branch.id,
        brandId: brand.id,
        metadata: { action: 'copy_offer_code', code },
      }),
    }).catch(() => {});
  };

  const getTimeRemaining = (validUntil: string) => {
    const end = new Date(validUntil);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 7) return null;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
    return 'Ending soon!';
  };

  const getDiscountDisplay = (offer: Offer) => {
    switch (offer.discountType) {
      case 'percentage':
        return `${offer.discountValue}% OFF`;
      case 'fixed':
        return `₹${offer.discountValue} OFF`;
      case 'bogo':
        return 'Buy 1 Get 1';
      case 'free_shipping':
        return 'Free Shipping';
      default:
        return offer.title;
    }
  };

  const featuredOffers = activeOffers.filter(o => o.featured);
  const regularOffers = activeOffers.filter(o => !o.featured);
  const expiredOffers = visibleOffers.filter(o => isOfferExpired(o));

  return (
    <div ref={containerRef} className="py-12 px-4 bg-gradient-to-r from-orange-50 to-red-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-sm font-semibold"
            style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
          >
            <Tag className="w-5 h-5" />
            <span>Special Offers</span>
          </div>
          <h2 id="offers-heading" className="text-3xl font-bold text-gray-900 mb-3">
            Exclusive Deals & Discounts
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't miss out on these limited-time offers
          </p>
        </motion.div>

        {/* Featured Offers */}
        {featuredOffers.length > 0 && (
          <div className="mb-8">
            {featuredOffers.map((offer, index) => {
              const timeRemaining = getTimeRemaining(offer.validUntil);
              return (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="rounded-2xl p-1 mb-4"
                  style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}AA)` }}
                >
                  <div className="bg-white rounded-xl p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6">
                      {offer.imageUrl && (
                        <div className="md:w-1/3">
                          <img
                            src={offer.imageUrl}
                            alt={offer.title}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className={offer.imageUrl ? 'md:w-2/3' : 'w-full'}>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold mb-2">
                              {discountIcons[offer.discountType]}
                              {getDiscountDisplay(offer)}
                            </span>
                            <h3 className="text-2xl font-bold text-gray-900">{offer.title}</h3>
                          </div>
                          {timeRemaining && (
                            <span className="flex items-center gap-1 text-orange-600 text-sm font-medium">
                              <Clock className="w-4 h-4" />
                              {timeRemaining}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-4">{offer.description}</p>

                        {offer.originalPrice && offer.discountedPrice && (
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-gray-400 line-through text-lg">₹{offer.originalPrice}</span>
                            <span className="text-3xl font-bold text-green-600">₹{offer.discountedPrice}</span>
                          </div>
                        )}

                        {offer.code && (
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 font-mono text-lg font-semibold text-gray-800">
                              {offer.code}
                            </div>
                            <button
                              onClick={() => copyCode(offer.code!)}
                              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 font-medium"
                            >
                              {copiedCode === offer.code ? (
                                <>
                                  <Check className="w-5 h-5" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-5 h-5" />
                                  Copy Code
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        {offer.termsAndConditions && (
                          <p className="text-xs text-gray-500 mt-3">*{offer.termsAndConditions}</p>
                        )}

                        {/* Claim Offer Button */}
                        <div className="mt-4">
                          <button
                            onClick={() => handleClaimOffer(offer)}
                            disabled={claimedOffers.has(offer.id)}
                            className="px-8 py-3 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 shadow-md"
                            style={{ backgroundColor: primaryColor }}
                          >
                            {claimedOffers.has(offer.id) ? '✓ Offer Claimed' : 'Claim Offer'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Regular Offers Grid */}
        {regularOffers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularOffers.map((offer, index) => {
              const timeRemaining = getTimeRemaining(offer.validUntil);
              return (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {offer.imageUrl && (
                    <img
                      src={offer.imageUrl}
                      alt={offer.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold">
                        {getDiscountDisplay(offer)}
                      </span>
                      {timeRemaining && (
                        <span className="flex items-center gap-1 text-orange-600 text-xs">
                          <Clock className="w-3 h-3" />
                          {timeRemaining}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{offer.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{offer.description}</p>

                    {offer.code && (
                      <button
                        onClick={() => copyCode(offer.code!)}
                        className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 flex items-center justify-center gap-2 transition-colors mb-3"
                      >
                        {copiedCode === offer.code ? (
                          <>
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-green-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <span className="font-mono">{offer.code}</span>
                            <Copy className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}

                    {/* Claim Offer Button */}
                    <button
                      onClick={() => handleClaimOffer(offer)}
                      disabled={claimedOffers.has(offer.id)}
                      className="w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {claimedOffers.has(offer.id) ? '✓ Claimed' : 'Claim Offer'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Expired Offers */}
        {expiredOffers.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Expired Offers</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {expiredOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="relative bg-white/60 rounded-xl border border-gray-200 overflow-hidden opacity-60 grayscale"
                >
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <span className="bg-gray-900/80 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider rotate-[-5deg]">
                      Expired
                    </span>
                  </div>
                  {offer.imageUrl && (
                    <img src={offer.imageUrl} alt={offer.title} className="w-full h-32 object-cover" />
                  )}
                  <div className="p-4">
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs font-semibold mb-2">
                      {getDiscountDisplay(offer)}
                    </span>
                    <h3 className="font-semibold text-gray-600 text-sm">{offer.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Ended {new Date(offer.validUntil).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

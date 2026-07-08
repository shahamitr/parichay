'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Users,
  Share2,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  QrCode,
  ExternalLink,
  Copy,
  Check,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface StaffCard {
  id: string;
  name: string;
  role: string;
  photo: string | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  social: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  } | null;
  shareUrl: string;
  qrCodeUrl: string;
  businessName: string;
  branchName: string;
  brandLogo: string | null;
}

interface StaffCardsSectionProps {
  branchId: string;
  primaryColor?: string;
}

export default function StaffCardsSection({
  branchId,
  primaryColor = '#4F46E5',
}: StaffCardsSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  const [staffCards, setStaffCards] = useState<StaffCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<StaffCard | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/staff-cards?branchId=${branchId}`)
      .then((r) => r.json())
      .then((data) => {
        setStaffCards(data.staffCards || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [branchId]);

  const copyShareLink = async (card: StaffCard) => {
    try {
      await navigator.clipboard.writeText(card.shareUrl);
      setCopiedId(card.id);
      toast.success(`Link copied for ${card.name}`);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = async (card: StaffCard) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${card.name} — ${card.role}`,
          text: `Connect with ${card.name} at ${card.businessName}`,
          url: card.shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          copyShareLink(card);
        }
      }
    } else {
      copyShareLink(card);
    }
  };

  if (loading) {
    return (
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (staffCards.length === 0) return null;

  return (
    <section ref={containerRef} className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-sm font-semibold"
            style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
          >
            <Users className="w-4 h-4" />
            Our Team
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Connect with Our Team
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Each team member has their own digital card you can save and share
          </p>
        </motion.div>

        {/* Staff Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staffCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group"
            >
              {/* Card Header with color accent */}
              <div
                className="h-2"
                style={{ backgroundColor: primaryColor }}
              />

              <div className="p-6">
                {/* Photo + Info */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-gray-50 shadow-sm">
                    {card.photo ? (
                      <img
                        src={card.photo}
                        alt={card.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-white text-lg font-bold"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {card.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      {card.name}
                    </h3>
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: primaryColor }}
                    >
                      {card.role}
                    </p>
                    {card.bio && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{card.bio}</p>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  {card.email && (
                    <a
                      href={`mailto:${card.email}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{card.email}</span>
                    </a>
                  )}
                  {card.phone && (
                    <a
                      href={`tel:${card.phone}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{card.phone}</span>
                    </a>
                  )}
                </div>

                {/* Social Links */}
                {card.social && (
                  <div className="flex gap-2 mb-4">
                    {card.social.linkedin && (
                      <a
                        href={card.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        aria-label={`${card.name}'s LinkedIn`}
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {card.social.twitter && (
                      <a
                        href={card.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 rounded-lg hover:bg-sky-50 hover:text-sky-500 transition-colors"
                        aria-label={`${card.name}'s Twitter`}
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleShare(card)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  <button
                    onClick={() => copyShareLink(card)}
                    className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                    title="Copy link"
                  >
                    {copiedId === card.id ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedCard(card)}
                    className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                    title="Show QR Code"
                  >
                    <QrCode className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* QR Code Modal */}
        {selectedCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              <div className="text-center">
                {/* Staff photo */}
                <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden bg-gray-100 border-2 shadow-sm" style={{ borderColor: primaryColor }}>
                  {selectedCard.photo ? (
                    <img src={selectedCard.photo} alt={selectedCard.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold" style={{ backgroundColor: primaryColor }}>
                      {selectedCard.name.charAt(0)}
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900">{selectedCard.name}</h3>
                <p className="text-sm text-gray-500 mb-6">{selectedCard.role}</p>

                {/* QR Code */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4 inline-block">
                  <img
                    src={selectedCard.qrCodeUrl}
                    alt={`QR code for ${selectedCard.name}`}
                    className="w-48 h-48 mx-auto"
                  />
                </div>

                <p className="text-xs text-gray-400 mb-4">
                  Scan to view {selectedCard.name}'s digital card
                </p>

                <a
                  href={selectedCard.shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                  style={{ color: primaryColor }}
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Card Link
                </a>
              </div>
            </motion.div>
            <div className="absolute inset-0 -z-10" onClick={() => setSelectedCard(null)} />
          </div>
        )}
      </div>
    </section>
  );
}

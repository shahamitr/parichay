'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ExternalLink } from 'lucide-react';

interface WhatsAppShareProps {
  businessName: string;
  tagline?: string;
  profileUrl: string;
  primaryColor?: string;
  phone?: string;
}

export default function WhatsAppShare({
  businessName,
  tagline,
  profileUrl,
  primaryColor = '#25D366',
  phone,
}: WhatsAppShareProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getShareText = () => {
    let text = `Check out *${businessName}*`;
    if (tagline) {
      text += ` — ${tagline}`;
    }
    text += `\n\n🔗 View their profile: ${profileUrl}`;
    text += `\n\nShared via Parichay Digital Card`;
    return encodeURIComponent(text);
  };

  const getWhatsAppUrl = () => {
    const text = getShareText();
    if (phone) {
      // Direct message to a specific number
      const cleanPhone = phone.replace(/[^0-9+]/g, '');
      return `https://wa.me/${cleanPhone}?text=${text}`;
    }
    // Generic share (opens WhatsApp contact picker)
    return `https://api.whatsapp.com/send?text=${text}`;
  };

  const handleShare = () => {
    const url = getWhatsAppUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.button
      onClick={handleShare}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex items-center gap-3 px-6 py-3 rounded-full text-white font-semibold shadow-lg transition-shadow hover:shadow-xl overflow-hidden"
      style={{ backgroundColor: primaryColor }}
      aria-label={`Share ${businessName} on WhatsApp`}
    >
      {/* Animated background pulse */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0"
        style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
        animate={isHovered ? { opacity: [0, 0.3, 0] } : { opacity: 0 }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      <MessageCircle className="w-5 h-5 relative z-10" />
      <span className="relative z-10 text-sm">Share on WhatsApp</span>
      <ExternalLink className="w-4 h-4 relative z-10 opacity-70" />
    </motion.button>
  );
}

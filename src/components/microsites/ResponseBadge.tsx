'use client';

import { useState, useEffect } from 'react';
import { Zap, Clock, Mail } from 'lucide-react';

interface ResponseBadgeProps {
  brandId: string;
}

interface BadgeData {
  label: string;
  emoji: string;
  tier: 'fast' | 'good' | 'normal';
  avgMinutes: number;
}

const TIER_STYLES = {
  fast: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: Zap },
  good: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Clock },
  normal: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', icon: Mail },
};

export default function ResponseBadge({ brandId }: ResponseBadgeProps) {
  const [badge, setBadge] = useState<BadgeData | null>(null);

  useEffect(() => {
    fetch(`/api/brands/${brandId}/response-badge`)
      .then((r) => r.json())
      .then((data) => {
        if (data.badge) setBadge(data.badge);
      })
      .catch(() => {});
  }, [brandId]);

  if (!badge) return null;

  const style = TIER_STYLES[badge.tier];
  const Icon = style.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${style.bg} ${style.border} ${style.text}`}>
      <Icon className="w-3.5 h-3.5" />
      <span className="text-[11px] font-semibold">{badge.label}</span>
    </div>
  );
}

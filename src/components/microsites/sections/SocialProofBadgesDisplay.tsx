'use client';

import { useState, useEffect } from 'react';
import {
  Shield,
  Star,
  Trophy,
  BadgeCheck,
  Crown,
  Sparkles,
  ThumbsUp,
  Zap,
  Heart,
  Award,
} from 'lucide-react';

interface SocialProofBadge {
  id: string;
  type: string;
  title: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
}

interface SocialProofBadgesDisplayProps {
  branchId: string;
  position?: 'inline' | 'floating' | 'hero';
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  shield: Shield,
  star: Star,
  trophy: Trophy,
  badge: BadgeCheck,
  crown: Crown,
  sparkles: Sparkles,
  thumbsup: ThumbsUp,
  zap: Zap,
  heart: Heart,
  award: Award,
};

export default function SocialProofBadgesDisplay({
  branchId,
  position = 'inline',
}: SocialProofBadgesDisplayProps) {
  const [badges, setBadges] = useState<SocialProofBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, [branchId]);

  const fetchBadges = async () => {
    try {
      const response = await fetch(
        `/api/social-proof-badges?branchId=${branchId}&activeOnly=true`
      );
      if (response.ok) {
        const data = await response.json();
        setBadges(data.badges || []);
      }
    } catch (err) {
      console.error('Failed to fetch badges:', err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName?: string) => {
    return ICON_MAP[iconName || 'badge'] || BadgeCheck;
  };

  if (loading || badges.length === 0) {
    return null;
  }

  // Floating position (fixed on screen)
  if (position === 'floating') {
    return (
      <div className="fixed bottom-24 left-4 z-30 flex flex-col gap-2">
        {badges.slice(0, 3).map((badge) => {
          const IconComponent = getIcon(badge.icon);
          return (
            <div
              key={badge.id}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700"
              style={{ borderColor: badge.color ? `${badge.color}40` : undefined }}
              title={badge.description || badge.title}
            >
              <IconComponent
                className="w-4 h-4"
                style={{ color: badge.color || '#3b82f6' }}
              />
              <span
                className="text-xs font-medium"
                style={{ color: badge.color || '#3b82f6' }}
              >
                {badge.title}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  // Hero position (larger badges for hero section)
  if (position === 'hero') {
    return (
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {badges.map((badge) => {
          const IconComponent = getIcon(badge.icon);
          return (
            <div
              key={badge.id}
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ backgroundColor: badge.color ? `${badge.color}15` : '#3b82f615' }}
              title={badge.description || badge.title}
            >
              <IconComponent
                className="w-5 h-5"
                style={{ color: badge.color || '#3b82f6' }}
              />
              <span
                className="text-sm font-semibold"
                style={{ color: badge.color || '#3b82f6' }}
              >
                {badge.title}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  // Default inline position
  return (
    <div className="py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-center gap-4">
          {badges.map((badge) => {
            const IconComponent = getIcon(badge.icon);
            return (
              <div
                key={badge.id}
                className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow"
                style={{ borderColor: badge.color ? `${badge.color}30` : undefined }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: badge.color ? `${badge.color}15` : '#3b82f615' }}
                >
                  <IconComponent
                    className="w-5 h-5"
                    style={{ color: badge.color || '#3b82f6' }}
                  />
                </div>
                <div>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: badge.color || '#3b82f6' }}
                  >
                    {badge.title}
                  </p>
                  {badge.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {badge.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { CheckCircle, Shield, Award } from 'lucide-react';

interface VerifiedBadgeProps {
  type?: 'verified' | 'premium' | 'trusted';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export default function VerifiedBadge({
  type = 'verified',
  size = 'md',
  showLabel = true,
  className = '',
}: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const badges = {
    verified: {
      icon: CheckCircle,
      label: 'Verified Business',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    premium: {
      icon: Award,
      label: 'Premium Partner',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    trusted: {
      icon: Shield,
      label: 'Trusted Business',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
  };

  const badge = badges[type];
  const Icon = badge.icon;

  if (!showLabel) {
    return (
      <div className={`inline-flex items-center ${className}`} title={badge.label}>
        <Icon className={`${sizeClasses[size]} ${badge.color}`} />
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full border ${badge.bgColor} ${badge.borderColor} ${className}`}
    >
      <Icon className={`${sizeClasses[size]} ${badge.color}`} />
      <span className={`${textSizeClasses[size]} font-medium ${badge.color}`}>
        {badge.label}
      </span>
    </div>
  );
}

// Completion Score Badge
interface CompletionScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function CompletionScoreBadge({
  score,
  size = 'md',
  showLabel = true,
}: CompletionScoreBadgeProps) {
  const getColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <div
      className={`inline-flex items-center space-x-1 rounded-full border font-semibold ${getColor(
        score
      )} ${sizeClasses[size]}`}
    >
      <span>{score}%</span>
      {showLabel && <span className="font-normal">Complete</span>}
    </div>
  );
}

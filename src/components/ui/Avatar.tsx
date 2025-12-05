'use client';

import React, { useState } from 'react';
import { getImageWithFallback, getColorFromString } from '@/lib/placeholder-utils';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square' | 'rounded';
  className?: string;
  showInitials?: boolean;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-24 h-24 text-2xl',
  '2xl': 'w-32 h-32 text-4xl',
};

const shapeClasses = {
  circle: 'rounded-full',
  square: 'rounded-none',
  rounded: 'rounded-lg',
};

export default function Avatar({
  src,
  name,
  size = 'md',
  shape = 'circle',
  className = '',
  showInitials = true,
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get initials
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('');

  // Get consistent color for this name
  const bgColor = getColorFromString(name);

  // Determine if we should show image or initials
  const shouldShowImage = src && !imageError;

  return (
    <div
      className={`${sizeClasses[size]} ${shapeClasses[shape]} ${className} relative overflow-hidden flex items-center justify-center font-semibold text-white`}
      style={{ backgroundColor: shouldShowImage ? 'transparent' : bgColor }}
    >
      {shouldShowImage ? (
        <>
          <img
            src={src}
            alt={name}
            className={`w-full h-full object-cover ${!imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity`}
            onError={() => setImageError(true)}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && showInitials && (
            <div className="absolute inset-0 flex items-center justify-center">
              {initials}
            </div>
          )}
        </>
      ) : (
        showInitials && initials
      )}
    </div>
  );
}

// Specialized avatar components
export function UserAvatar({ user, size = 'md', className = '' }: {
  user: { firstName: string; lastName: string; avatar?: string | null };
  size?: AvatarProps['size'];
  className?: string;
}) {
  const name = `${user.firstName} ${user.lastName}`;
  return <Avatar src={user.avatar} name={name} size={size} className={className} />;
}

export function BrandAvatar({ brand, size = 'md', className = '' }: {
  brand: { name: string; logo?: string | null };
  size?: AvatarProps['size'];
  className?: string;
}) {
  return <Avatar src={brand.logo} name={brand.name} size={size} shape="rounded" className={className} />;
}

export function BranchAvatar({ branch, size = 'md', className = '' }: {
  branch: { name: string; logo?: string | null };
  size?: AvatarProps['size'];
  className?: string;
}) {
  return <Avatar src={branch.logo} name={branch.name} size={size} shape="rounded" className={className} />;
}

'use client';

import React from 'react';
import ResponsiveImage, { IMAGE_SIZES, ASPECT_RATIOS } from '@/components/ui/ResponsiveImage';

export interface AsymmetricSectionProps {
  imagePosition: 'left' | 'right';
  image: string;
  imageAlt?: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  background?: 'white' | 'gray' | 'gradient';
  className?: string;
  imageClassName?: string;
  contentClassName?: string;
}

/**
 * AsymmetricSection Component
 *
 * A layout component that creates asymmetric sections with alternating image-text layouts.
 * Implements Requirements 1.1 and 1.5 for visual hierarchy and layout enhancement.
 *
 * Features:
 * - Image-left/text-right layout
 * - Text-left/image-right layout
 * - Automatic alternation logic (use with index % 2)
 * - Fully responsive for mobile (stacks vertically)
 *
 * @example
 * ```tsx
 * <AsymmetricSection
 *   imagePosition="left"
 *   image="/path/to/image.jpg"
 *   title="Our Story"
 *   content={<p>Content here</p>}
 * />
 * ```
 */
export const AsymmetricSection = React.forwardRef<HTMLElement, AsymmetricSectionProps>(
  (
    {
      imagePosition,
      image,
      imageAlt = '',
      title,
      subtitle,
      content,
      background = 'white',
      className = '',
      imageClassName = '',
      contentClassName = '',
    },
    ref
  ) => {
    // Background styles
    const backgroundStyles = {
      white: 'bg-white',
      gray: 'bg-gray-50',
      gradient: 'bg-gradient-to-br from-primary-50/30 via-white to-accent-50/30',
    };

    // Determine layout order based on image position
    const isImageLeft = imagePosition === 'left';
    const imageOrder = isImageLeft ? 'lg:order-1' : 'lg:order-2';
    const contentOrder = isImageLeft ? 'lg:order-2' : 'lg:order-1';

    return (
      <section
        ref={ref}
        className={`
          relative py-16 md:py-20 lg:py-24 overflow-hidden
          ${backgroundStyles[background]}
          ${className}
        `}
      >
        {/* Container with max-width constraint - Requirement 1.2 */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-8 lg:gap-12 items-center">
            {/* Image Column */}
            <div className={`${imageOrder} ${imageClassName}`}>
              <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                <ResponsiveImage
                  src={image}
                  alt={imageAlt || title}
                  fill
                  aspectRatio={ASPECT_RATIOS.photo}
                  sizes={IMAGE_SIZES.hero}
                  className="transition-transform duration-500 group-hover:scale-105"
                  objectFit="cover"
                  quality={90}
                  placeholder="blur"
                />
              </div>
            </div>

            {/* Content Column */}
            <div className={`${contentOrder} ${contentClassName}`}>
              <div className="space-y-6">
                {/* Title */}
                <div className="space-y-3">
                  <h2 className="text-h2 md:text-h1 font-bold text-gray-900 leading-tight">
                    {title}
                  </h2>
                  {subtitle && (
                    <p className="text-h4 text-gray-600 font-medium">
                      {subtitle}
                    </p>
                  )}
                  {/* Decorative underline */}
                  <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></div>
                </div>

                {/* Content */}
                <div className="text-body text-gray-700 leading-relaxed space-y-4">
                  {content}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

AsymmetricSection.displayName = 'AsymmetricSection';

/**
 * Helper function to determine image position based on section index
 * Use this for automatic alternation
 *
 * @example
 * ```tsx
 * sections.map((section, index) => (
 *   <AsymmetricSection
 *     key={index}
 *     imagePosition={getAlternatingPosition(index)}
 *     {...section}
 *   />
 * ))
 * ```
 */
export function getAlternatingPosition(index: number): 'left' | 'right' {
  return index % 2 === 0 ? 'left' : 'right';
}

'use client';

import React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: '6xl' | '7xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  verticalSpacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  children: React.ReactNode;
}

/**
 * Container Component
 *
 * A responsive container component with width constraints and consistent spacing.
 * Implements Requirements 1.2 and 1.4 for container width constraints and consistent spacing.
 *
 * Features:
 * - Max-width constraint of 1280px (max-w-6xl) by default
 * - Proper horizontal padding
 * - Consistent vertical spacing between sections (64px)
 * - Responsive padding adjustments
 *
 * @example
 * ```tsx
 * <Container maxWidth="6xl" verticalSpacing="lg">
 *   <YourContent />
 * </Container>
 * ```
 */
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      maxWidth = '6xl',
      padding = 'md',
      verticalSpacing = 'lg',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    // Max-width styles - Requirement 1.2
    const maxWidthStyles = {
      '6xl': 'max-w-6xl',  // 1280px - default for optimal readability
      '7xl': 'max-w-7xl',  // 1536px - for wider layouts
      'full': 'max-w-full', // Full width
    };

    // Horizontal padding styles - Requirement 1.2
    const paddingStyles = {
      none: '',
      sm: 'px-4',                    // 16px
      md: 'px-4 sm:px-6 lg:px-8',   // 16px -> 24px -> 32px (responsive)
      lg: 'px-6 sm:px-8 lg:px-12',  // 24px -> 32px -> 48px (responsive)
    };

    // Vertical spacing styles - Requirement 1.4 (64px between sections)
    const verticalSpacingStyles = {
      none: '',
      sm: 'py-8',   // 32px
      md: 'py-12',  // 48px
      lg: 'py-16',  // 64px - default section spacing
      xl: 'py-20',  // 80px - extra spacing
    };

    return (
      <div
        ref={ref}
        className={`
          mx-auto
          ${maxWidthStyles[maxWidth]}
          ${paddingStyles[padding]}
          ${verticalSpacingStyles[verticalSpacing]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  maxWidth?: '6xl' | '7xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  verticalSpacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'white' | 'gray' | 'gradient' | 'transparent';
  className?: string;
  children: React.ReactNode;
}

/**
 * Section Component
 *
 * A semantic section wrapper with built-in Container for consistent layout.
 * Implements Requirements 1.2 and 1.4 for width constraints and spacing.
 *
 * @example
 * ```tsx
 * <Section background="gray" verticalSpacing="lg">
 *   <h2>Section Title</h2>
 *   <p>Section content</p>
 * </Section>
 * ```
 */
export const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      maxWidth = '6xl',
      padding = 'md',
      verticalSpacing = 'lg',
      background = 'white',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    // Background styles
    const backgroundStyles = {
      white: 'bg-white',
      gray: 'bg-gray-50',
      gradient: 'bg-gradient-to-br from-primary-50/30 via-white to-accent-50/30',
      transparent: 'bg-transparent',
    };

    return (
      <section
        ref={ref}
        className={`
          relative
          ${backgroundStyles[background]}
          ${className}
        `}
        {...props}
      >
        <Container
          maxWidth={maxWidth}
          padding={padding}
          verticalSpacing={verticalSpacing}
        >
          {children}
        </Container>
      </section>
    );
  }
);

Section.displayName = 'Section';

export interface SectionSpacerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * SectionSpacer Component
 *
 * A utility component for adding consistent spacing between sections.
 * Implements Requirement 1.4 for consistent vertical spacing.
 *
 * @example
 * ```tsx
 * <Section>Content 1</Section>
 * <SectionSpacer />
 * <Section>Content 2</Section>
 * ```
 */
export const SectionSpacer: React.FC<SectionSpacerProps> = ({
  size = 'lg',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'h-8',   // 32px
    md: 'h-12',  // 48px
    lg: 'h-16',  // 64px - default section spacing
    xl: 'h-20',  // 80px
  };

  return <div className={`${sizeStyles[size]} ${className}`} aria-hidden="true" />;
};

/**
 * Grid Container Component
 *
 * A responsive grid container with consistent spacing.
 *
 * @example
 * ```tsx
 * <GridContainer columns={3} gap="lg">
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </GridContainer>
 * ```
 */
export interface GridContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  children: React.ReactNode;
}

export const GridContainer = React.forwardRef<HTMLDivElement, GridContainerProps>(
  (
    {
      columns = 3,
      gap = 'lg',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    // Column styles (responsive)
    const columnStyles = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    };

    // Gap styles
    const gapStyles = {
      sm: 'gap-4',   // 16px
      md: 'gap-6',   // 24px
      lg: 'gap-8',   // 32px
      xl: 'gap-12',  // 48px
    };

    return (
      <div
        ref={ref}
        className={`
          grid
          ${columnStyles[columns]}
          ${gapStyles[gap]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GridContainer.displayName = 'GridContainer';

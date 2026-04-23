'use client';

import React, { useEffect, useRef, useState } from 'react';

// Intersection Observer Hook for scroll animations
export const useInView = (threshold = 0.1) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isInView] as const;
};

// Fade In Animation Component
export const FadeIn = ({
  children,
  delay = 0,
  duration = 600,
  className = ''
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) => {
  const [ref, isInView] = useInView();

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(20px)',
      }}
    >
      {children}
    </div>
  );
};

// Slide In Animation Component
export const SlideIn = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 600,
  className = ''
}: {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  className?: string;
}) => {
  const [ref, isInView] = useInView();

  const getTransform = () => {
    if (!isInView) {
      switch (direction) {
        case 'up': return 'translateY(40px)';
        case 'down': return 'translateY(-40px)';
        case 'left': return 'translateX(40px)';
        case 'right': return 'translateX(-40px)';
        default: return 'translateY(40px)';
      }
    }
    return 'translate(0)';
  };

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        opacity: isInView ? 1 : 0,
        transform: getTransform(),
      }}
    >
      {children}
    </div>
  );
};

// Scale In Animation Component
export const ScaleIn = ({
  children,
  delay = 0,
  duration = 600,
  className = ''
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) => {
  const [ref, isInView] = useInView();

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'scale(1)' : 'scale(0.9)',
      }}
    >
      {children}
    </div>
  );
};

// Stagger Animation Container
export const StaggerContainer = ({
  children,
  staggerDelay = 100,
  className = ''
}: {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}) => {
  const [ref, isInView] = useInView();

  return (
    <div ref={ref} className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          className="transition-all duration-600 ease-out"
          style={{
            transitionDelay: isInView ? `${index * staggerDelay}ms` : '0ms',
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

// Floating Animation Component
export const FloatingElement = ({
  children,
  intensity = 10,
  duration = 3000,
  className = ''
}: {
  children: React.ReactNode;
  intensity?: number;
  duration?: number;
  className?: string;
}) => {
  return (
    <div
      className={`animate-bounce ${className}`}
      style={{
        animationDuration: `${duration}ms`,
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
        animationDirection: 'alternate',
      }}
    >
      {children}
    </div>
  );
};

// Gradient Background Animation
export const AnimatedGradient = ({
  className = '',
  colors = ['from-blue-600', 'via-purple-600', 'to-indigo-700']
}: {
  className?: string;
  colors?: string[];
}) => {
  return (
    <div className={`bg-gradient-to-br ${colors.join(' ')} ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 animate-pulse"></div>
    </div>
  );
};

// Particle Background Effect
export const ParticleBackground = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Animated particles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-ping"></div>
      <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-white/25 rounded-full animate-bounce delay-500"></div>
      <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/20 rounded-full animate-ping delay-700"></div>
      <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-white/15 rounded-full animate-pulse delay-300"></div>
    </div>
  );
};

// Typing Animation Effect
export const TypingAnimation = ({
  text,
  speed = 100,
  className = ''
}: {
  text: string;
  speed?: number;
  className?: string;
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// Morphing Button Component
export const MorphingButton = ({
  children,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => {
  return (
    <button
      className={`
        relative overflow-hidden group
        transition-all duration-300 ease-out
        transform hover:scale-105 active:scale-95
        ${className}
      `}
      {...props}
    >
      {/* Background morphing effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:from-purple-600 group-hover:to-indigo-600"></div>

      {/* Ripple effect */}
      <div className="absolute inset-0 opacity-0 group-active:opacity-100 transition-opacity">
        <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-active:scale-100 transition-transform duration-300"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </button>
  );
};

// Loading Skeleton with Animation
export const AnimatedSkeleton = ({
  className = '',
  lines = 1
}: {
  className?: string;
  lines?: number;
}) => {
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse mb-2 last:mb-0"
          style={{
            height: '1rem',
            animationDelay: `${index * 100}ms`,
          }}
        ></div>
      ))}
    </div>
  );
};
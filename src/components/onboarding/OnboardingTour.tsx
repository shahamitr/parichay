'use client';

import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TourStep {
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
}

interface OnboardingTourProps {
  steps: TourStep[];
  onComplete?: () => void;
  onSkip?: () => void;
  storageKey?: string;
}

export default function OnboardingTour({
  steps,
  onComplete,
  onSkip,
  storageKey = 'onboarding-completed',
}: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('bottom');
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const completed = localStorage.getItem(storageKey);
    if (!completed) {
      setIsActive(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!isActive || !steps[currentStep]) return;

    const updatePosition = () => {
      const target = document.querySelector(steps[currentStep].target);
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const placement = steps[currentStep].placement || 'bottom';

      let top = 0;
      let left = 0;

      switch (placement) {
        case 'top':
          top = rect.top - 20;
          left = rect.left + rect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + 20;
          left = rect.left + rect.width / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2;
          left = rect.left - 20;
          break;
        case 'right':
          top = rect.top + rect.height / 2;
          left = rect.right + 20;
          break;
      }

      setPosition({ top, left });
      setTooltipPosition(placement);

      // Highlight target
      target.classList.add('onboarding-highlight');
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      const target = document.querySelector(steps[currentStep].target);
      target?.classList.remove('onboarding-highlight');
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [currentStep, isActive, steps]);

  const handleNext = () => {
    if (steps[currentStep].action) {
      steps[currentStep].action?.();
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(storageKey, 'true');
    setIsActive(false);
    onComplete?.();
  };

  const handleSkip = () => {
    localStorage.setItem(storageKey, 'true');
    setIsActive(false);
    onSkip?.();
  };

  if (!isActive || !steps[currentStep]) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[9998] animate-fade-in" />

      {/* Spotlight */}
      <div
        className="fixed z-[9999] pointer-events-none"
        style={{
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
          transition: 'all 0.3s ease',
        }}
      />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className={cn(
          'fixed z-[10000] w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-scale-in',
          tooltipPosition === 'top' && '-translate-x-1/2 -translate-y-full',
          tooltipPosition === 'bottom' && '-translate-x-1/2',
          tooltipPosition === 'left' && '-translate-x-full -translate-y-1/2',
          tooltipPosition === 'right' && '-translate-y-1/2'
        )}
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        {/* Arrow */}
        <div
          className={cn(
            'absolute w-3 h-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rotate-45',
            tooltipPosition === 'top' && 'bottom-[-7px] left-1/2 -translate-x-1/2 border-t-0 border-l-0',
            tooltipPosition === 'bottom' && 'top-[-7px] left-1/2 -translate-x-1/2 border-b-0 border-r-0',
            tooltipPosition === 'left' && 'right-[-7px] top-1/2 -translate-y-1/2 border-t-0 border-r-0',
            tooltipPosition === 'right' && 'left-[-7px] top-1/2 -translate-y-1/2 border-b-0 border-l-0'
          )}
        />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {steps[currentStep].title}
              </h3>
            </div>
            <button
              onClick={handleSkip}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {steps[currentStep].content}
          </p>

          {/* Progress */}
          <div className="flex gap-1 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'h-1 flex-1 rounded-full transition-all duration-300',
                  index <= currentStep
                    ? 'bg-blue-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                )}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Skip tour
            </button>
            <div className="flex gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="flex items-center gap-1 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    <Check className="w-4 h-4" />
                    Finish
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .onboarding-highlight {
          position: relative;
          z-index: 9999;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);
          border-radius: 8px;
          transition: all 0.3s ease;
        }
      `}</style>
    </>
  );
}

export function useOnboardingTour(storageKey: string = 'onboarding-completed') {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(storageKey);
    setShouldShow(!completed);
  }, [storageKey]);

  const resetTour = () => {
    localStorage.removeItem(storageKey);
    setShouldShow(true);
  };

  return { shouldShow, resetTour };
}

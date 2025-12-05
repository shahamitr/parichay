'use client';

import { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TourStep {
  target: string; // CSS selector
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

interface OnboardingTourProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export default function OnboardingTour({
  steps,
  isOpen,
  onClose,
  onComplete,
}: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  useEffect(() => {
    if (!isOpen || !step) return;

    const updatePosition = () => {
      const element = document.querySelector(step.target);
      if (!element || !tooltipRef.current) return;

      const rect = element.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      switch (step.placement || 'bottom') {
        case 'top':
          top = rect.top - tooltipRect.height - 16;
          left = rect.left + rect.width / 2 - tooltipRect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + 16;
          left = rect.left + rect.width / 2 - tooltipRect.width / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - tooltipRect.height / 2;
          left = rect.left - tooltipRect.width - 16;
          break;
        case 'right':
          top = rect.top + rect.height / 2 - tooltipRect.height / 2;
          left = rect.right + 16;
          break;
      }

      setPosition({ top, left });

      // Highlight element
      element.classList.add('onboarding-highlight');
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
      const element = document.querySelector(step.target);
      element?.classList.remove('onboarding-highlight');
    };
  }, [currentStep, isOpen, step]);

  const handleNext = () => {
    if (isLastStep != null) {
      onComplete?.();
      onClose();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleSkip = () => {
    onClose();
    setCurrentStep(0);
  };

  if (!isOpen || !step) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />

      {/* Spotlight */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .onboarding-highlight {
          position: relative;
          z-index: 9999;
          box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 0 4px rgba(59, 130, 246, 0.5);
          border-radius: 8px;
        }
      `,
        }}
      />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[5000] w-96 max-w-[calc(100vw-2rem)]"
        style={{ top: `${position.top}px`, left: `${position.left}px` }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {step.title}
              </h3>
            </div>
            <button
              onClick={handleSkip}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:bg-gray-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {step.content}
          </p>

          {/* Progress */}
          <div className="flex gap-1 mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'h-1 flex-1 rounded-full transition-colors',
                  index <= currentStep
                    ? 'bg-blue-600 dark:bg-blue-400'
                    : 'bg-gray-200 dark:bg-gray-700'
                )}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Skip tour
            </button>
            <div className="flex items-center gap-2">
              {!isFirstStep && (
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1"
              >
                {isLastStep ? 'Finish' : 'Next'}
                {!isLastStep && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Hook to manage onboarding tour state
export function useOnboardingTour(tourKey: string) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(`tour-${tourKey}`);
    if (!completed) {
      setIsOpen(true);
    }
  }, [tourKey]);

  const handleComplete = () => {
    localStorage.setItem(`tour-${tourKey}`, 'true');
    setIsOpen(false);
  };

  const reset = () => {
    localStorage.removeItem(`tour-${tourKey}`);
    setIsOpen(true);
  };

  return { isOpen, setIsOpen, handleComplete, reset };
}

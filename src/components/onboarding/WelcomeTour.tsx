'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';

interface TourStep {
  title: string;
  description: string;
  image?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Welcome to Parichay! 🎉',
    description: 'Let us show you around. In the next 60 seconds, you\'ll learn how to set up your digital business profile and start getting customers.',
  },
  {
    title: 'Step 1: Create Your Brand',
    description: 'Go to Brands → Add New Brand. Fill in your business name, logo, and colors. This takes about 2 minutes.',
  },
  {
    title: 'Step 2: Add a Branch',
    description: 'Each branch is a location or service page. Add your address, phone number, services, and photos. This becomes your microsite.',
  },
  {
    title: 'Step 3: Share Your Profile',
    description: 'Your microsite is live at parichay.com/your-brand/your-branch. Share it via WhatsApp, QR code, or add it to your Google Business listing.',
  },
  {
    title: 'Step 4: Track Your Leads',
    description: 'When customers fill your contact form, you\'ll see them in the Leads section. You\'ll also get email and SMS notifications.',
  },
  {
    title: 'You\'re All Set!',
    description: 'That\'s it! Your digital presence is ready. Customers can now find you, see your services, and contact you directly.',
  },
];

const STORAGE_KEY = 'parichay-welcome-tour-completed';

export default function WelcomeTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Show tour only if not completed before
    const completed = localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      // Small delay so the page loads first
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    setIsOpen(false);
  };

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEY, 'skipped');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];
  const isLast = currentStep === TOUR_STEPS.length - 1;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleSkip}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          {/* Progress bar */}
          <div className="h-1 bg-gray-100">
            <div
              className="h-full bg-primary-600 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
            />
          </div>

          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Content */}
          <div className="p-8">
            <div className="flex items-center gap-2 mb-4">
              {isLast ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <Sparkles className="w-6 h-6 text-primary-500" />
              )}
              <span className="text-xs text-gray-500 font-medium">
                {currentStep + 1} of {TOUR_STEPS.length}
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
          </div>

          {/* Actions */}
          <div className="px-8 pb-8 flex items-center justify-between">
            <div>
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              {currentStep === 0 && (
                <button
                  onClick={handleSkip}
                  className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Skip tour
                </button>
              )}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {isLast ? 'Get Started' : 'Next'}
              {!isLast && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

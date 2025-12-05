'use client';

import { useState } from 'react';
import { Check, ArrowRight, ArrowLeft, Sparkles, Building2, MapPin, Palette, Rocket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToastHelpers } from '@/components/ui/Toast';

interface QuickStartWizardProps {
  userRole: 'ADMIN' | 'EXECUTIVE' | 'CUSTOMER';
  onComplete?: () => void;
}

export default function QuickStartWizard({ userRole, onComplete }: QuickStartWizardProps) {
  const router = useRouter();
  const { success, error } = useToastHelpers();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Brand Info
    brandName: '',
    tagline: '',
    industry: '',

    // Branch Info
    branchName: '',
    phone: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
    },

    // Theme
    primaryColor: '#3B82F6',

    // Quick Setup
    enableQR: true,
    enableAnalytics: true,
    enableLeadCapture: true,
  });

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome!',
      description: 'Let\'s get your microsite up in 2 minutes',
      icon: Sparkles,
    },
    {
      id: 'brand',
      title: 'Brand Details',
      description: 'Tell us about your business',
      icon: Building2,
    },
    {
      id: 'branch',
      title: 'Location Info',
      description: 'Add your contact details',
      icon: MapPin,
    },
    {
      id: 'theme',
      title: 'Choose Theme',
      description: 'Pick your brand colors',
      icon: Palette,
    },
    {
      id: 'launch',
      title: 'Launch!',
      description: 'Your microsite is ready',
      icon: Rocket,
    },
  ];

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      await handleComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Create brand
      const brandResponse = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.brandName,
          tagline: formData.tagline,
          colorTheme: {
            primary: formData.primaryColor,
            secondary: adjustColor(formData.primaryColor, -20),
            accent: adjustColor(formData.primaryColor, 20),
          },
          initialBranch: {
            name: formData.branchName,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
          },
        }),
      });

      if (!brandResponse.ok) throw new Error('Failed to create brand');

      const { brand } = await brandResponse.json();

      success('🎉 Your microsite is live!');

      // Mark onboarding as complete
      localStorage.setItem('onboarding-completed', 'true');

      onComplete?.();

      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      error('Failed to create microsite. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const adjustColor = (color: string, amount: number) => {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  const isStepValid = () => {
    switch (steps[currentStep].id) {
      case 'brand':
        return formData.brandName.trim().length > 0;
      case 'branch':
        return formData.branchName && formData.phone && formData.email;
      case 'theme':
        return formData.primaryColor;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-blue-600 text-white scale-110'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <span className="text-xs mt-2 text-gray-600 hidden sm:block">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition-all ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Welcome Step */}
          {steps[currentStep].id === 'welcome' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Welcome to Parichay!
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Let's create your professional microsite in just 2 minutes. No technical skills needed!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl mb-2">⚡</div>
                  <h3 className="font-semibold text-gray-900">Quick Setup</h3>
                  <p className="text-sm text-gray-600">Just 4 simple steps</p>
                </div>
                <div className="p-4 bg-purple-50 roed-lg">
                  <div className="text-3xl mb-2">🎨</div>
                  <h3 className="font-semibold text-gray-900">Beautiful Design</h3>
                  <p className="text-sm text-gray-600">Professional templates</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl mb-2">🚀</div>
                  <h3 className="font-semibold text-gray-900">Instant Live</h3>
                  <p className="text-sm text-gray-600">Go live immediately</p>
                </div>
              </div>
            </div>
          )}

          {/* Brand Step */}
          {steps[currentStep].id === 'brand' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your business</h2>
                <p className="text-gray-600">This will be displayed on your microsite</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  placeholder="e.g., Acme Corporation"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tagline (Optional)
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g., Your trusted partner in success"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select industry</option>
                  <option value="retail">Retail</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="technology">Technology</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          )}

          {/* Branch Step */}
          {steps[currentStep].id === 'branch' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Add your location details</h2>
                <p className="text-gray-600">Help customers reach you</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.branchName}
                    onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                    placeholder="e.g., Head Office"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                    placeholder="Street address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={formData.address.city}
                      onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                      placeholder="City"
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={formData.address.state}
                      onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                      placeholder="State"
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Theme Step */}
          {steps[currentStep].id === 'theme' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose your brand color</h2>
                <p className="text-gray-600">Pick a color that represents your brand</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Blue', color: '#3B82F6' },
                  { name: 'Purple', color: '#8B5CF6' },
                  { name: 'Green', color: '#10B981' },
                  { name: 'Red', color: '#EF4444' },
                  { name: 'Orange', color: '#F59E0B' },
                  { name: 'Pink', color: '#EC4899' },
                  { name: 'Teal', color: '#14B8A6' },
                  { name: 'Indigo', color: '#6366F1' },
                ].map((theme) => (
                  <button
                    key={theme.color}
                    onClick={() => setFormData({ ...formData, primaryColor: theme.color })}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      formData.primaryColor === theme.color
                        ? 'border-gray-900 scale-105'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className="w-full h-16 rounded-lg mb-2"
                      style={{ backgroundColor: theme.color }}
                    />
                    <p className="text-sm font-medium text-gray-900">{theme.name}</p>
                  </button>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-4">Preview</h3>
                <div className="bg-white p-6 rounded-lg border-2" style={{ borderColor: formData.primaryColor }}>
                  <h4 className="text-xl font-bold mb-2" style={{ color: formData.primaryColor }}>
                    {formData.brandName || 'Your Business Name'}
                  </h4>
                  <p className="text-gray-600 mb-4">{formData.tagline || 'Your tagline here'}</p>
                  <button
                    className="px-6 py-2 rounded-lg text-white font-medium"
                    style={{ backgroundColor: formData.primaryColor }}
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Launch Step */}
          {steps[currentStep].id === 'launch' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Rocket className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Ready to Launch! 🚀
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Your microsite is configured and ready to go live. Click the button below to launch!
              </p>
              <div className="bg-blue-50 p-6 rounded-xl max-w-md mx-auto">
                <h3 className="font-semibold text-gray-900 mb-3">What's included:</h3>
                <ul className="space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Professional microsite</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>QR code for sharing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Analytics dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Lead capture forms</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepValid() || loading}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : currentStep === steps.length - 1 ? (
                <>
                  Launch Now
                  <Rocket className="w-5 h-5" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

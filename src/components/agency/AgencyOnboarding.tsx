// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Palette,
  Globe,
  CreditCard,
  Check,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const STEPS = [
  { id: 1, name: 'Agency Info', icon: Building2 },
  { id: 2, name: 'Branding', icon: Palette },
  { id: 3, name: 'Domain', icon: Globe },
  { id: 4, name: 'Plan', icon: CreditCard },
];

const PLANS = [
  {
    id: 'AGENCY_STARTER',
    name: 'Agency Starter',
    price: 99,
    clients: 10,
    features: [
      '10 client accounts',
      'Subdomain (yourname.parichay.io)',
      'Basic white-label branding',
      'Email support',
      'Monthly billing',
    ],
  },
  {
    id: 'AGENCY_PRO',
    name: 'Agency Pro',
    price: 299,
    clients: 50,
    popular: true,
    features: [
      '50 client accounts',
      'Custom domain support',
      'Full white-label branding',
      'Priority support',
      'Advanced analytics',
      'API access',
    ],
  },
  {
    id: 'AGENCY_ENTERPRISE',
    name: 'Agency Enterprise',
    price: 999,
    clients: 'Unlimited',
    features: [
      'Unlimited client accounts',
      'Multiple custom domains',
      'Complete white-label',
      'Dedicated support',
      'Custom features',
      'SLA guarantee',
    ],
  },
];

export default function AgencyOnboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Agency Info
    name: '',
    slug: '',
    supportEmail: '',
    supportPhone: '',
    website: '',

    // Step 2: Branding
    brandName: '',
    tagline: '',
    logo: '',
    favicon: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    accentColor: '#8B5CF6',

    // Step 3: Domain
    customDomain: '',

    // Step 4: Plan
    plan: 'AGENCY_PRO',
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Auto-generate slug from name
    if (field === 'name' && !formData.slug) {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }

    // Auto-fill brand name from agency name
    if (field === 'name' && !formData.brandName) {
      setFormData(prev => ({ ...prev, brandName: value }));
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        if (!formData.name || !formData.slug || !formData.supportEmail) {
          toast.error('Please fill in all required fields');
          return false;
        }
        if (!/^[a-z0-9-]+$/.test(formData.slug)) {
          toast.error('Slug must be lowercase alphanumeric with hyphens');
          return false;
        }
        return true;
      case 2:
        if (!formData.brandName || !formData.primaryColor) {
          toast.error('Please fill in all required fields');
          return false;
        }
        return true;
      case 3:
        return true; // Domain is optional
      case 4:
        if (!formData.plan) {
          toast.error('Please select a plan');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setLoading(true);
    try {
      const response = await fetch('/api/agency/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Agency created successfully!');
        router.push('/agency/dashboard');
      } else {
        toast.error(data.error || 'Failed to create agency');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error('Failed to create agency');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create Your Agency
          </h1>
          <p className="text-gray-600">
            Set up your white-label platform in just a few steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      currentStep >= step.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <p className="text-sm font-medium mt-2 text-gray-700">
                    {step.name}
                  </p>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-4 transition-colors ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {currentStep === 1 && <Step1AgencyInfo formData={formData} updateFormData={updateFormData} />}
          {currentStep === 2 && <Step2Branding formData={formData} updateFormData={updateFormData} />}
          {currentStep === 3 && <Step3Domain formData={formData} updateFormData={updateFormData} />}
          {currentStep === 4 && <Step4Plan formData={formData} updateFormData={updateFormData} />}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="inline-flex items-center gap-2 px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            {currentStep < STEPS.length ? (
              <button
                onClick={nextStep}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Agency'}
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Step1AgencyInfo({ formData, updateFormData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Agency Information</h3>
        <p className="text-gray-600 mb-6">
          Tell us about your agency
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agency Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Digital Marketing Pro"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug * <span className="text-gray-500 text-xs">(yourslug.parichay.io)</span>
          </label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => updateFormData('slug', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="dmp"
            pattern="[a-z0-9-]+"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Support Email *
          </label>
          <input
            type="email"
            required
            value={formData.supportEmail}
            onChange={(e) => updateFormData('supportEmail', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="support@agency.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Support Phone
          </label>
          <input
            type="tel"
            value={formData.supportPhone}
            onChange={(e) => updateFormData('supportPhone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => updateFormData('website', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://agency.com"
          />
        </div>
      </div>
    </div>
  );
}

function Step2Branding({ formData, updateFormData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Branding & Design</h3>
        <p className="text-gray-600 mb-6">
          Customize how your platform looks to clients
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand Name *
          </label>
          <input
            type="text"
            required
            value={formData.brandName}
            onChange={(e) => updateFormData('brandName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="DMP Solutions"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tagline
          </label>
          <input
            type="text"
            value={formData.tagline}
            onChange={(e) => updateFormData('tagline', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your Digital Success Partner"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo URL
          </label>
          <input
            type="url"
            value={formData.logo}
            onChange={(e) => updateFormData('logo', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/logo.png"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Favicon URL
          </label>
          <input
            type="url"
            value={formData.favicon}
            onChange={(e) => updateFormData('favicon', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/favicon.ico"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Color *
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={formData.primaryColor}
              onChange={(e) => updateFormData('primaryColor', e.target.value)}
              className="w-16 h-12 border border-gray-300 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={formData.primaryColor}
              onChange={(e) => updateFormData('primaryColor', e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="#3B82F6"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Secondary Color *
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={formData.secondaryColor}
              onChange={(e) => updateFormData('secondaryColor', e.target.value)}
              className="w-16 h-12 border border-gray-300 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={formData.secondaryColor}
              onChange={(e) => updateFormData('secondaryColor', e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="#10B981"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Accent Color *
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={formData.accentColor}
              onChange={(e) => updateFormData('accentColor', e.target.value)}
              className="w-16 h-12 border border-gray-300 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={formData.accentColor}
              onChange={(e) => updateFormData('accentColor', e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="#8B5CF6"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="mt-6 p-6 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium text-gray-700 mb-3">Preview</p>
        <div className="flex gap-4">
          <div
            className="w-20 h-20 rounded-lg shadow-sm"
            style={{ backgroundColor: formData.primaryColor }}
          />
          <div
            className="w-20 h-20 rounded-lg shadow-sm"
            style={{ backgroundColor: formData.secondaryColor }}
          />
          <div
            className="w-20 h-20 rounded-lg shadow-sm"
            style={{ backgroundColor: formData.accentColor }}
          />
        </div>
      </div>
    </div>
  );
}

function Step3Domain({ formData, updateFormData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Domain Setup</h3>
        <p className="text-gray-600 mb-6">
          Configure your domain settings
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Default Domain:</strong> {formData.slug}.parichay.io
        </p>
        <p className="text-xs text-blue-600 mt-1">
          This subdomain will be automatically configured for you
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Domain (Optional)
        </label>
        <input
          type="text"
          value={formData.customDomain}
          onChange={(e) => updateFormData('customDomain', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="clients.youragency.com"
        />
        <p className="text-xs text-gray-500 mt-2">
          You can add a custom domain later from settings. DNS configuration will be required.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-3">Custom Domain Setup</h4>
        <ol className="space-y-2 text-sm text-gray-600">
          <li>1. Add your custom domain in settings</li>
          <li>2. Add CNAME record pointing to your subdomain</li>
          <li>3. Wait for DNS propagation (up to 48 hours)</li>
          <li>4. SSL certificate will be automatically provisioned</li>
        </ol>
      </div>
    </div>
  );
}

function Step4Plan({ formData, updateFormData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Choose Your Plan</h3>
        <p className="text-gray-600 mb-6">
          Select the plan that fits your agency needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            onClick={() => updateFormData('plan', plan.id)}
            className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
              formData.plan === plan.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-4">
              <h4 className="text-lg font-semibold text-gray-900">{plan.name}</h4>
              <div className="mt-2">
                <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Up to {plan.clients} clients
              </p>
            </div>

            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {formData.plan === plan.id && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-3">What's Included</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• $10/month per active client (billed separately)</li>
          <li>• 14-day free trial, no credit card required</li>
          <li>• Cancel anytime, no long-term contracts</li>
          <li>• All plans include core features and updates</li>
        </ul>
      </div>
    </div>
  );
}

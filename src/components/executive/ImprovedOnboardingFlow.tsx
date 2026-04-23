'use client';

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
  Building2,
  User,
  MapPin,
  Phone,
  Mail,
  Globe,
  Palette,
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  Image,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { Input, Textarea, Select, FormField } from '@/components/ui/FormField';

// =============================================================================
// TYPES
// =============================================================================
interface OnboardingData {
  // Step 1: Brand Selection
  brandMode: 'existing' | 'new';
  brandId?: string;
  brandName?: string;
  brandSlug?: string;

  // Step 2: Branch Details
  branchName: string;
  branchSlug: string;
  description: string;

  // Step 3: Address
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  googleMapsLink?: string;

  // Step 4: Contact
  phone: string;
  email: string;
  whatsapp?: string;
  website?: string;

  // Step 5: Customization
  colorTheme: string;
  logo?: File;
  coverImage?: File;
}

interface OnboardingFlowProps {
  executiveId: string;
  brands: { id: string; name: string; slug: string }[];
  onSuccess: (branchId: string) => void;
  onCancel?: () => void;
}

type StepId = 'brand' | 'details' | 'address' | 'contact' | 'customize';

interface Step {
  id: StepId;
  title: string;
  description: string;
  icon: React.ReactNode;
}

// =============================================================================
// STEPS CONFIGURATION
// =============================================================================
const steps: Step[] = [
  {
    id: 'brand',
    title: 'Select Brand',
    description: 'Choose existing or create new',
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    id: 'details',
    title: 'Branch Details',
    description: 'Name and description',
    icon: <User className="w-5 h-5" />,
  },
  {
    id: 'address',
    title: 'Address',
    description: 'Location information',
    icon: <MapPin className="w-5 h-5" />,
  },
  {
    id: 'contact',
    title: 'Contact Info',
    description: 'Phone, email, website',
    icon: <Phone className="w-5 h-5" />,
  },
  {
    id: 'customize',
    title: 'Customize',
    description: 'Colors and branding',
    icon: <Palette className="w-5 h-5" />,
  },
];

const colorThemes = [
  { value: 'blue', label: 'Ocean Blue', color: '#3B82F6' },
  { value: 'purple', label: 'Royal Purple', color: '#8B5CF6' },
  { value: 'green', label: 'Forest Green', color: '#10B981' },
  { value: 'red', label: 'Ruby Red', color: '#EF4444' },
  { value: 'orange', label: 'Sunset Orange', color: '#F97316' },
  { value: 'pink', label: 'Rose Pink', color: '#EC4899' },
  { value: 'teal', label: 'Teal', color: '#14B8A6' },
  { value: 'indigo', label: 'Indigo', color: '#6366F1' },
];

// =============================================================================
// STEP INDICATOR
// =============================================================================
interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (index: number) => void;
}

function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="hidden md:flex items-center justify-center mb-8">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = onStepClick && index < currentStep;

        return (
          <React.Fragment key={step.id}>
            <button
              onClick={() => isClickable && onStepClick(index)}
              disabled={!isClickable}
              className={cn(
                'flex flex-col items-center group transition-all',
                isClickable && 'cursor-pointer'
              )}
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center transition-all',
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step.icon}
              </div>
              <span
                className={cn(
                  'mt-2 text-sm font-medium',
                  isCurrent
                    ? 'text-blue-600 dark:text-blue-400'
                    : isCompleted
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-500'
                )}
              >
                {step.title}
              </span>
            </button>

            {index < steps.length - 1 && (
              <div
                className={cn(
                  'w-16 h-1 mx-2 rounded-full transition-colors',
                  index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// =============================================================================
// MOBILE STEP INDICATOR
// =============================================================================
function MobileStepIndicator({ steps, currentStep }: { steps: Step[]; currentStep: number }) {
  const step = steps[currentStep];
  return (
    <div className="md:hidden mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">
          Step {currentStep + 1} of {steps.length}
        </span>
        <span className="text-sm font-medium text-blue-600">{step.title}</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

// =============================================================================
// FORM STEPS
// =============================================================================

// Step 1: Brand Selection
function BrandStep({
  data,
  brands,
  onChange,
  errors,
}: {
  data: OnboardingData;
  brands: { id: string; name: string; slug: string }[];
  onChange: (updates: Partial<OnboardingData>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Select or Create a Brand
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => onChange({ brandMode: 'existing', brandName: '', brandSlug: '' })}
            className={cn(
              'p-4 rounded-xl border-2 text-left transition-all',
              data.brandMode === 'existing'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            )}
          >
            <Building2 className={cn(
              'w-8 h-8 mb-2',
              data.brandMode === 'existing' ? 'text-blue-600' : 'text-gray-400'
            )} />
            <h4 className="font-medium text-gray-900 dark:text-white">Existing Brand</h4>
            <p className="text-sm text-gray-500">Add branch to existing brand</p>
          </button>

          <button
            type="button"
            onClick={() => onChange({ brandMode: 'new', brandId: '' })}
            className={cn(
              'p-4 rounded-xl border-2 text-left transition-all',
              data.brandMode === 'new'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            )}
          >
            <Sparkles className={cn(
              'w-8 h-8 mb-2',
              data.brandMode === 'new' ? 'text-blue-600' : 'text-gray-400'
            )} />
            <h4 className="font-medium text-gray-900 dark:text-white">New Brand</h4>
            <p className="text-sm text-gray-500">Create a new brand</p>
          </button>
        </div>

        {data.brandMode === 'existing' && (
          <FormField label="Select Brand" error={errors.brandId} required>
            <Select
              value={data.brandId || ''}
              onChange={(e) => onChange({ brandId: e.target.value })}
              options={[
                { value: '', label: 'Select a brand...' },
                ...brands.map((b) => ({ value: b.id, label: b.name })),
              ]}
              status={errors.brandId ? 'error' : 'default'}
            />
          </FormField>
        )}

        {data.brandMode === 'new' && (
          <div className="space-y-4">
            <FormField label="Brand Name" error={errors.brandName} required>
              <Input
                value={data.brandName || ''}
                onChange={(e) => {
                  const name = e.target.value;
                  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                  onChange({ brandName: name, brandSlug: slug });
                }}
                placeholder="e.g., Sunrise Restaurants"
                status={errors.brandName ? 'error' : 'default'}
              />
            </FormField>

            <FormField label="Brand Slug" error={errors.brandSlug} hint="URL-friendly identifier">
              <Input
                value={data.brandSlug || ''}
                onChange={(e) => onChange({ brandSlug: e.target.value })}
                placeholder="e.g., sunrise-restaurants"
                status={errors.brandSlug ? 'error' : 'default'}
              />
            </FormField>
          </div>
        )}
      </div>
    </div>
  );
}

// Step 2: Branch Details
function DetailsStep({
  data,
  onChange,
  errors,
}: {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Branch Information
      </h3>

      <FormField label="Branch Name" error={errors.branchName} required>
        <Input
          value={data.branchName}
          onChange={(e) => {
            const name = e.target.value;
            const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            onChange({ branchName: name, branchSlug: slug });
          }}
          placeholder="e.g., Downtown Location"
          status={errors.branchName ? 'error' : 'default'}
        />
      </FormField>

      <FormField label="Branch Slug" error={errors.branchSlug} hint="Used in the URL">
        <Input
          value={data.branchSlug}
          onChange={(e) => onChange({ branchSlug: e.target.value })}
          placeholder="e.g., downtown-location"
          status={errors.branchSlug ? 'error' : 'default'}
        />
      </FormField>

      <FormField label="Description" error={errors.description}>
        <Textarea
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Brief description of this branch location..."
          showCharCount
          maxLength={500}
        />
      </FormField>
    </div>
  );
}

// Step 3: Address
function AddressStep({
  data,
  onChange,
  errors,
}: {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Branch Address
      </h3>

      <FormField label="Street Address" error={errors.street} required>
        <Input
          value={data.street}
          onChange={(e) => onChange({ street: e.target.value })}
          placeholder="123 Main Street"
          status={errors.street ? 'error' : 'default'}
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="City" error={errors.city} required>
          <Input
            value={data.city}
            onChange={(e) => onChange({ city: e.target.value })}
            placeholder="Mumbai"
            status={errors.city ? 'error' : 'default'}
          />
        </FormField>

        <FormField label="State" error={errors.state} required>
          <Input
            value={data.state}
            onChange={(e) => onChange({ state: e.target.value })}
            placeholder="Maharashtra"
            status={errors.state ? 'error' : 'default'}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="PIN Code" error={errors.pincode} required>
          <Input
            value={data.pincode}
            onChange={(e) => onChange({ pincode: e.target.value })}
            placeholder="400001"
            status={errors.pincode ? 'error' : 'default'}
          />
        </FormField>

        <FormField label="Country" error={errors.country}>
          <Input
            value={data.country}
            onChange={(e) => onChange({ country: e.target.value })}
            placeholder="India"
          />
        </FormField>
      </div>

      <FormField label="Google Maps Link" hint="Optional - helps customers find you">
        <Input
          value={data.googleMapsLink || ''}
          onChange={(e) => onChange({ googleMapsLink: e.target.value })}
          placeholder="https://maps.google.com/..."
          leftIcon={<Globe className="w-4 h-4" />}
        />
      </FormField>
    </div>
  );
}

// Step 4: Contact
function ContactStep({
  data,
  onChange,
  errors,
}: {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Contact Information
      </h3>

      <FormField label="Phone Number" error={errors.phone} required>
        <Input
          type="tel"
          value={data.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          placeholder="+91 98765 43210"
          leftIcon={<Phone className="w-4 h-4" />}
          status={errors.phone ? 'error' : 'default'}
        />
      </FormField>

      <FormField label="Email Address" error={errors.email} required>
        <Input
          type="email"
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
          placeholder="branch@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          status={errors.email ? 'error' : 'default'}
        />
      </FormField>

      <FormField label="WhatsApp Number" hint="Optional - enable WhatsApp contact">
        <Input
          type="tel"
          value={data.whatsapp || ''}
          onChange={(e) => onChange({ whatsapp: e.target.value })}
          placeholder="+91 98765 43210"
        />
      </FormField>

      <FormField label="Website" hint="Optional">
        <Input
          type="url"
          value={data.website || ''}
          onChange={(e) => onChange({ website: e.target.value })}
          placeholder="https://www.example.com"
          leftIcon={<Globe className="w-4 h-4" />}
        />
      </FormField>
    </div>
  );
}

// Step 5: Customize
function CustomizeStep({
  data,
  onChange,
}: {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Customize Appearance
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Color Theme
        </label>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {colorThemes.map((theme) => (
            <button
              key={theme.value}
              type="button"
              onClick={() => onChange({ colorTheme: theme.value })}
              className={cn(
                'w-12 h-12 rounded-xl transition-all relative',
                data.colorTheme === theme.value && 'ring-2 ring-offset-2 ring-blue-500'
              )}
              style={{ backgroundColor: theme.color }}
              title={theme.label}
            >
              {data.colorTheme === theme.value && (
                <Check className="w-5 h-5 text-white absolute inset-0 m-auto" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Logo (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Click to upload logo</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cover Image (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
            <Image className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Click to upload cover</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN ONBOARDING FLOW
// =============================================================================
export function ImprovedOnboardingFlow({
  executiveId,
  brands,
  onSuccess,
  onCancel,
}: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [data, setData] = useState<OnboardingData>({
    brandMode: 'existing',
    branchName: '',
    branchSlug: '',
    description: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    phone: '',
    email: '',
    colorTheme: 'blue',
  });

  const handleChange = useCallback((updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    const clearedErrors = { ...errors };
    Object.keys(updates).forEach((key) => {
      delete clearedErrors[key];
    });
    setErrors(clearedErrors);
  }, [errors]);

  const validateStep = useCallback((step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Brand
        if (data.brandMode === 'existing' && !data.brandId) {
          newErrors.brandId = 'Please select a brand';
        }
        if (data.brandMode === 'new') {
          if (!data.brandName?.trim()) newErrors.brandName = 'Brand name is required';
          if (!data.brandSlug?.trim()) newErrors.brandSlug = 'Brand slug is required';
        }
        break;

      case 1: // Details
        if (!data.branchName.trim()) newErrors.branchName = 'Branch name is required';
        if (!data.branchSlug.trim()) newErrors.branchSlug = 'Branch slug is required';
        break;

      case 2: // Address
        if (!data.street.trim()) newErrors.street = 'Street address is required';
        if (!data.city.trim()) newErrors.city = 'City is required';
        if (!data.state.trim()) newErrors.state = 'State is required';
        if (!data.pincode.trim()) newErrors.pincode = 'PIN code is required';
        break;

      case 3: // Contact
        if (!data.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!data.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
          newErrors.email = 'Invalid email format';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [data]);

  const handleNext = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  }, [currentStep, validateStep]);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      // Create branch API call
      const response = await fetch('/api/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId: data.brandMode === 'existing' ? data.brandId : undefined,
          newBrand: data.brandMode === 'new' ? { name: data.brandName, slug: data.brandSlug } : undefined,
          name: data.branchName,
          slug: data.branchSlug,
          description: data.description,
          address: {
            street: data.street,
            city: data.city,
            state: data.state,
            pincode: data.pincode,
            country: data.country,
            googleMapsLink: data.googleMapsLink,
          },
          contact: {
            phone: data.phone,
            email: data.email,
            whatsapp: data.whatsapp,
            website: data.website,
          },
          colorTheme: data.colorTheme,
          executiveId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        onSuccess(result.data.id);
      } else {
        setErrors({ submit: result.error || 'Failed to create branch' });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BrandStep data={data} brands={brands} onChange={handleChange} errors={errors} />;
      case 1:
        return <DetailsStep data={data} onChange={handleChange} errors={errors} />;
      case 2:
        return <AddressStep data={data} onChange={handleChange} errors={errors} />;
      case 3:
        return <ContactStep data={data} onChange={handleChange} errors={errors} />;
      case 4:
        return <CustomizeStep data={data} onChange={handleChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Step Indicator */}
      <StepIndicator
        steps={steps}
        currentStep={currentStep}
        onStepClick={(index) => {
          if (index < currentStep) setCurrentStep(index);
        }}
      />
      <MobileStepIndicator steps={steps} currentStep={currentStep} />

      {/* Form Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
        {/* Error message */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-400">{errors.submit}</p>
          </div>
        )}

        {/* Step Content */}
        {renderStep()}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div>
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
            )}
            {currentStep === 0 && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900"
              >
                Cancel
              </button>
            )}
          </div>

          <div>
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Create Branch
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImprovedOnboardingFlow;

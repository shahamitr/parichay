'use client';

import { useState, useEffect } from 'react';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Building2,
  MapPin,
  Palette,
  Rocket,
  Upload,
  Share2,
  Globe,
  Settings,
  Smartphone,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToastHelpers } from '@/components/ui/Toast';
import { MICROSITE_TEMPLATES } from '@/lib/templates';
import Image from 'next/image';

interface QuickStartWizardProps {
  userRole: 'ADMIN' | 'EXECUTIVE' | 'CUSTOMER';
  onComplete?: () => void;
}

export default function QuickStartWizard({ userRole, onComplete }: QuickStartWizardProps) {
  const router = useRouter();
  const { success, error } = useToastHelpers();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // Brand Info
    brandName: '',
    tagline: '',
    industry: '',
    logo: '',

    // Contact Info
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

    // Social Links
    social: {
      whatsapp: '',
      instagram: '',
      facebook: '',
      linkedin: '',
    },

    // Marketing & SEO
    marketing: {
      seoTitle: '',
      seoDescription: '',
      ga4Id: '',
      pixelId: '',
    },

    // Theme
    primaryColor: '#3B82F6',

    // Quick Setup
    enableQR: true,
    enableAnalytics: true,
    enableLeadCapture: true,
  });

  // Steps configuration
  const steps = [
    { id: 'welcome', title: 'Welcome', icon: Sparkles },
    { id: 'brand', title: 'Brand Identity', icon: Building2 },
    { id: 'contact', title: 'Location', icon: MapPin },
    { id: 'social', title: 'Social', icon: Share2 },
    { id: 'marketing', title: 'Marketing', icon: Globe },
    { id: 'theme', title: 'Design', icon: Palette },
    { id: 'launch', title: 'Launch', icon: Rocket },
  ];

  // Industry-based automation: Pre-fill content when industry changes
  useEffect(() => {
    if (formData.industry) {
      const template = MICROSITE_TEMPLATES.find(t => t.category === formData.industry);
      if (template && template.defaultConfig) {
        setFormData(prev => ({
          ...prev,
          tagline: prev.tagline || template.defaultConfig.sections?.hero?.subtitle || '',
          marketing: {
            ...prev.marketing,
            seoTitle: prev.marketing.seoTitle || template.defaultConfig.seoSettings?.title || prev.brandName,
            seoDescription: prev.marketing.seoDescription || template.defaultConfig.seoSettings?.description || prev.tagline,
          },
          // Set primary color from template if not manually picked yet
          primaryColor: prev.primaryColor === '#3B82F6' ? (template.id.includes('classic') ? '#3B82F6' : prev.primaryColor) : prev.primaryColor
        }));
      }
    }
  }, [formData.industry, formData.brandName]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogoPreview(base64String);
        setFormData({ ...formData, logo: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

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
      // Find template for industry automation
      const template = MICROSITE_TEMPLATES.find(t => t.category === formData.industry) || MICROSITE_TEMPLATES[0];

      // Prepare API payload
      const payload = {
        name: formData.brandName,
        tagline: formData.tagline,
        logo: formData.logo,
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
          socialMedia: formData.social,
          micrositeConfig: {
            templateId: template.id,
            sections: template.defaultConfig.sections,
            seoSettings: {
              title: formData.marketing.seoTitle || formData.brandName,
              description: formData.marketing.seoDescription || formData.tagline,
              keywords: template.defaultConfig.seoSettings?.keywords || [],
            },
            // Marketing pixels integration
            analyticsPixels: {
              ga4: formData.marketing.ga4Id,
              metaPixel: formData.marketing.pixelId,
            }
          }
        },
      };

      const brandResponse = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!brandResponse.ok) throw new Error('Failed to create brand');

      success('🎉 Your brand & microsite are ready!');
      localStorage.setItem('onboarding-completed', 'true');
      
      await fetch('/api/user/onboarding', { method: 'POST' });
      
      onComplete?.();
      setTimeout(() => router.push('/admin'), 1500);
    } catch (err) {
      error('Failed to create project. Please try again.');
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
      case 'brand': return formData.brandName.trim().length > 0 && formData.industry !== '';
      case 'contact': return formData.branchName && formData.phone && formData.email;
      case 'theme': return formData.primaryColor;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 dark:from-primary-950 via-white dark:via-neutral-900 to-accent-50 dark:to-accent-950 flex items-center justify-center p-4">
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
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-success-500 text-white shadow-lg'
                          : isActive
                          ? 'bg-primary-600 text-white scale-110 shadow-xl'
                          : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className="text-[10px] mt-2 font-medium text-neutral-500 dark:text-neutral-400 hidden sm:block uppercase tracking-wider">
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-[2px] mx-2 ${isCompleted ? 'bg-success-500' : 'bg-neutral-200 dark:bg-neutral-800'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl p-8 md:p-12 transition-all">
          
          {/* Step: Welcome */}
          {steps[currentStep].id === 'welcome' && (
            <div className="text-center space-y-8 py-4">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-tr from-primary-600 to-accent-500 rounded-3xl rotate-12 flex items-center justify-center mx-auto shadow-2xl">
                  <Sparkles className="w-12 h-12 text-white -rotate-12" />
                </div>
                <div className="absolute -top-2 -right-2 bg-success-500 text-white p-2 rounded-full animate-bounce">
                  <Rocket className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
                  Let's make it official!
                </h2>
                <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
                  Start your professional digital journey. We've simplified the setup into a few smart steps tailored to your industry.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                {[
                  { icon: Building2, label: 'Custom Identity', color: 'text-primary-500' },
                  { icon: Share2, label: 'Instant Social', color: 'text-accent-500' },
                  { icon: Globe, label: 'SEO Booster', color: 'text-success-500' },
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800 transition-hover hover:shadow-lg">
                    <item.icon className={`w-8 h-8 mx-auto mb-3 ${item.color}`} />
                    <h3 className="font-bold text-neutral-900 dark:text-neutral-100">{item.label}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step: Brand Identity */}
          {steps[currentStep].id === 'brand' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Brand Identity</h2>
                <p className="text-neutral-500">Every big thing starts with a name and a face.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wide">
                      Business Name <span className="text-error-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.brandName}
                      onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                      placeholder="e.g., Elite Coffee Co."
                      className="w-full px-5 py-4 bg-neutral-50 dark:bg-neutral-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-lg transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wide">
                      Catchy Tagline
                    </label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      placeholder="The perfect cup, every time"
                      className="w-full px-5 py-4 bg-neutral-50 dark:bg-neutral-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wide">
                      Industry <span className="text-error-500">*</span>
                    </label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full px-5 py-4 bg-neutral-50 dark:bg-neutral-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all cursor-pointer"
                    >
                      <option value="">Select your industry</option>
                      <option value="retail">Retail & Boutique</option>
                      <option value="restaurant">Food & Dining</option>
                      <option value="healthcare">Health & Wellness</option>
                      <option value="consulting">Professional Consulting</option>
                      <option value="real-estate">Real Estate</option>
                      <option value="technology">Software & IT</option>
                      <option value="other">Other Business</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-8 bg-neutral-50 dark:bg-neutral-800 rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-700">
                  {logoPreview ? (
                    <div className="relative group">
                      <Image 
                        src={logoPreview} 
                        alt="Logo Preview" 
                        width={180} 
                        height={180} 
                        className="rounded-2xl shadow-xl object-contain bg-white p-4" 
                      />
                      <button 
                        onClick={() => {setLogoPreview(null); setFormData({...formData, logo: ''})}}
                        className="absolute -top-3 -right-3 bg-error-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ArrowLeft className="w-4 h-4 rotate-45" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8 text-neutral-400" />
                      </div>
                      <p className="text-center font-bold text-neutral-900 dark:text-neutral-100 mb-1">Company Logo</p>
                      <p className="text-center text-sm text-neutral-500 mb-6 px-4">Upload your brand mark (PNG/JPG)</p>
                      <label className="px-6 py-3 bg-white dark:bg-neutral-700 shadow-lg rounded-xl font-bold text-primary-600 dark:text-primary-400 cursor-pointer hover:scale-105 transition-all">
                        Select File
                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                      </label>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step: Location & Contact */}
          {steps[currentStep].id === 'contact' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Contact Details</h2>
                <p className="text-neutral-500">Where can your customers find you?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase">Main Branch Name</label>
                    <input
                      type="text"
                      value={formData.branchName}
                      onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                      placeholder="e.g., Downtown Showroom"
                      className="w-full px-5 py-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase">Official Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91..."
                        className="w-full px-5 py-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase">Official Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="hello@brand.com"
                        className="w-full px-5 py-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-primary-50 dark:bg-primary-900/10 rounded-3xl border border-primary-100 dark:border-primary-900/30">
                   <h3 className="flex items-center gap-2 font-bold text-primary-900 dark:text-primary-100 mb-4">
                     <MapPin className="w-5 h-5" /> Registered Address
                   </h3>
                   <div className="space-y-3">
                     <input
                       type="text"
                       value={formData.address.street}
                       onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                       placeholder="Street & Area"
                       className="w-full px-4 py-3 bg-white dark:bg-neutral-900 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                     />
                     <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={formData.address.city}
                          onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                          placeholder="City"
                          className="w-full px-4 py-3 bg-white dark:bg-neutral-900 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <input
                          type="text"
                          value={formData.address.zipCode}
                          onChange={(e) => setFormData({ ...formData, address: { ...formData.address, zipCode: e.target.value } })}
                          placeholder="ZIP Code"
                          className="w-full px-4 py-3 bg-white dark:bg-neutral-900 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                        />
                     </div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* NEW Step: Social Media */}
          {steps[currentStep].id === 'social' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Social Connectivity</h2>
                <p className="text-neutral-500">Connect your fans and followers instantly.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {[
                  { key: 'whatsapp', label: 'WhatsApp for Business', icon: Smartphone, color: 'text-green-500', placeholder: '919876543210' },
                  { key: 'instagram', label: 'Instagram Profile', icon: Share2, color: 'text-pink-500', placeholder: '@yourbrand' },
                  { key: 'facebook', label: 'Facebook Page', icon: Building2, color: 'text-blue-600', placeholder: 'facebook.com/yourbrand' },
                  { key: 'linkedin', label: 'LinkedIn Company', icon: Globe, color: 'text-indigo-600', placeholder: 'linkedin.com/company/...' },
                ].map((item) => (
                  <div key={item.key} className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                      <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-tight">{item.label}</span>
                    </div>
                    <input
                      type="text"
                      value={(formData.social as any)[item.key]}
                      onChange={(e) => setFormData({ ...formData, social: { ...formData.social, [item.key]: e.target.value } })}
                      placeholder={item.placeholder}
                      className="w-full px-5 py-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                    />
                  </div>
                ))}
              </div>
              
              <div className="p-5 bg-accent-50 dark:bg-accent-950/20 rounded-2xl flex items-start gap-4">
                <Sparkles className="w-6 h-6 text-accent-500 shrink-0 mt-1" />
                <p className="text-sm text-accent-700 dark:text-accent-300">
                  <strong>Pro Tip:</strong> WhatsApp integration is the #1 requested feature. Adding your business number here enables instant "Click-to-Chat" buttons on your microsite.
                </p>
              </div>
            </div>
          )}

          {/* NEW Step: Marketing Booster */}
          {steps[currentStep].id === 'marketing' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Marketing Booster</h2>
                <p className="text-neutral-500">Power up your search presence and tracking.</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">SEO Meta Title</label>
                    <input
                      type="text"
                      value={formData.marketing.seoTitle}
                      onChange={(e) => setFormData({ ...formData, marketing: { ...formData.marketing, seoTitle: e.target.value } })}
                      placeholder="e.g., Best Artisan Coffee in City Name"
                      className="w-full px-5 py-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">GA4 Tracking ID (Optional)</label>
                    <input
                      type="text"
                      value={formData.marketing.ga4Id}
                      onChange={(e) => setFormData({ ...formData, marketing: { ...formData.marketing, ga4Id: e.target.value } })}
                      placeholder="G-XXXXXXXXXX"
                      className="w-full px-5 py-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase tracking-widest">SEO Meta Description</label>
                  <textarea
                    value={formData.marketing.seoDescription}
                    onChange={(e) => setFormData({ ...formData, marketing: { ...formData.marketing, seoDescription: e.target.value } })}
                    placeholder="Short description for Google Search results..."
                    rows={3}
                    className="w-full px-5 py-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>
              </div>

              <div className="p-6 bg-neutral-50 dark:bg-neutral-800 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-2xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-success-600 dark:text-success-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 dark:text-neutral-100">Google Ready</h4>
                    <p className="text-xs text-neutral-500">Automated sitemap & meta-tags</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center">
                    <Settings className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 dark:text-neutral-100">Live Analytics</h4>
                    <p className="text-xs text-neutral-500">Track views, scans & conversions</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Existing Theme & Design Step */}
          {steps[currentStep].id === 'theme' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Choose your brand color</h2>
                <p className="text-neutral-500">Pick a color that defines your digital presence.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Classic Blue', color: '#3B82F6' },
                  { name: 'Royal Purple', color: '#8B5CF6' },
                  { name: 'Emerald Green', color: '#10B981' },
                  { name: 'Modern Red', color: '#EF4444' },
                  { name: 'Sunset Orange', color: '#F59E0B' },
                  { name: 'Vibrant Pink', color: '#EC4899' },
                  { name: 'Deep Teal', color: '#14B8A6' },
                  { name: 'Tech Indigo', color: '#6366F1' },
                ].map((theme) => (
                  <button
                    key={theme.color}
                    onClick={() => setFormData({ ...formData, primaryColor: theme.color })}
                    className={`p-1 rounded-[2.5rem] transition-all relative ${
                      formData.primaryColor === theme.color
                        ? 'ring-4 ring-primary-500/30'
                        : ''
                    }`}
                  >
                    <div className="p-6 rounded-[2rem] bg-neutral-50 dark:bg-neutral-800 hover:shadow-xl transition-all flex flex-col items-center">
                      <div className="w-full h-12 rounded-2xl mb-4" style={{ backgroundColor: theme.color }} />
                      <p className="text-xs font-black uppercase tracking-widest text-neutral-500">{theme.name}</p>
                    </div>
                    {formData.primaryColor === theme.color && (
                      <div className="absolute top-4 right-4 bg-primary-500 text-white rounded-full p-1 border-2 border-white dark:border-neutral-900">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-8 p-10 bg-neutral-900 rounded-[3rem] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-[100px] -mr-32 -mt-32" />
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                  <Palette className="w-6 h-6 text-primary-400" /> Real-time Preview
                </h3>
                <div className="p-8 bg-neutral-800/50 backdrop-blur-md rounded-2xl border border-neutral-700/50">
                  <div className="flex items-start gap-4 mb-6">
                    {logoPreview ? (
                      <Image src={logoPreview} alt="Logo" width={48} height={48} className="rounded-lg bg-white p-1" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: formData.primaryColor }} />
                    )}
                    <div>
                      <h4 className="text-2xl font-black">{formData.brandName || 'Business Title'}</h4>
                      <p className="text-neutral-400 font-medium">{formData.tagline || 'Tagline text'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-2 rounded-full bg-neutral-700" />
                    <div className="h-2 rounded-full bg-neutral-700" />
                    <div className="h-2 rounded-full bg-neutral-700 w-1/2" />
                  </div>
                  <div className="mt-10 flex gap-3">
                    <div className="px-6 py-3 rounded-xl font-bold flex-1 text-center" style={{ backgroundColor: formData.primaryColor }}>
                       Contact Now
                    </div>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/10">
                       <Share2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step: Launch */}
          {steps[currentStep].id === 'launch' && (
            <div className="text-center space-y-8 py-6">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-success-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <Rocket className="w-12 h-12 text-white animate-pulse" />
                </div>
                <div className="absolute inset-0 rounded-full bg-success-500 animate-ping opacity-25" />
              </div>
              <div className="space-y-4">
                <h2 className="text-5xl font-black text-neutral-900 dark:text-neutral-100">Ready to Skyrocket!</h2>
                <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
                  We've assembled your brand identity, connected your socials, and optimized your search presence.
                </p>
              </div>
              
              <div className="max-w-md mx-auto grid grid-cols-2 gap-4">
                {[
                  { label: 'Branded Microsite', icon: Smartphone },
                  { label: 'QR Scan Analytics', icon: Settings },
                  { label: 'SEO Configured', icon: Globe },
                  { label: 'WhatsApp Ready', icon: Smartphone },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                    <Check className="w-5 h-5 text-success-500" />
                    <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-8 py-4 text-neutral-500 hover:text-neutral-900 font-bold transition-all disabled:opacity-0"
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepValid() || loading}
              className="flex items-center gap-3 px-10 py-5 bg-neutral-900 dark:bg-primary-500 hover:scale-105 active:scale-95 text-white dark:text-neutral-900 rounded-[2rem] font-black text-lg transition-all shadow-2xl shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-4 border-white dark:border-neutral-900 border-t-transparent rounded-full animate-spin" />
                  Setting up...
                </>
              ) : currentStep === steps.length - 1 ? (
                <>Launch Platform <Rocket className="w-6 h-6" /></>
              ) : (
                <>Next Step <ArrowRight className="w-6 h-6" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

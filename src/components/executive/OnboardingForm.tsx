// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { Building2, MapPin, Phone, Mail, Globe, Save, CheckCircle, FileText, Download, Search } from 'lucide-react';
import MicrositePreviewModal from '@/components/preview/MicrositePreviewModal';
import GoogleBusinessImport from '@/components/import/GoogleBusinessImport';
import FileUpload from '@/components/ui/FileUpload';
import ColorThemePicker from '@/components/ui/ColorThemePicker';

interface Brand {
  id: string;
  name: string;
}

interface OnboardingFormProps {
  executiveId: string;
  onSuccess: () => void;
}

export default function OnboardingForm({ executiveId, onSuccess }: OnboardingFormProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [importMode, setImportMode] = useState<'manual' | 'google'>('manual');
  const [brandMode, setBrandMode] = useState<'existing' | 'new'>('existing');

  const [formData, setFormData] = useState({
    // Brand Details (for new brand)
    brandName: '',
    brandTagline: '',
    brandLogo: '',
    brandColors: {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#F59E0B',
    },

    // Branch Details
    brandId: '',
    branchName: '',
    slug: '',
    // Address
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    // Contact
    phone: '',
    whatsapp: '',
    email: '',
    // Social Media (optional)
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: '',
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/brands');
      const result = await response.json();

      if (result.success) {
        setBrands(result.data.brands || []);
      }
    } catch (err) {
      console.error('Error fetching brands:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleBranchNameChange = (name: string) => {
    setFormData({
      ...formData,
      branchName: name,
      slug: generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (brandMode === 'existing' && !formData.brandId) {
      setError('Please select a brand');
      return;
    }

    if (brandMode === 'new' && !formData.brandName) {
      setError('Brand name is required');
      return;
    }

    if (!formData.branchName.trim()) {
      setError('Branch name is required');
      return;
    }

    if (!formData.phone || !formData.email) {
      setError('Phone and email are required');
      return;
    }

    if (!formData.street || !formData.city || !formData.state || !formData.zipCode) {
      setError('Complete address is required');
      return;
    }

    try {
      setSubmitting(true);
      let branchId: string;

      if (brandMode === 'new') {
        // Create Brand + Initial Branch
        const brandResponse = await fetch('/api/brands', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.brandName,
            tagline: formData.brandTagline,
            logo: formData.brandLogo,
            colorTheme: formData.brandColors,
            initialBranch: {
              name: formData.branchName,
              email: formData.email,
              phone: formData.phone,
              address: {
                street: formData.street,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                country: formData.country,
              }
            }
          }),
        });

        const brandResult = await brandResponse.json();
        if (!brandResponse.ok) throw new Error(brandResult.error || 'Failed to create brand');

        // Fetch the branches for this brand to find the one we just created.
        const branchesResponse = await fetch(`/api/branches?brandId=${brandResult.brand.id}`);
        const branchesResult = await branchesResponse.json();
        // The API returns { branches: [...] } or just [...]
        const branches = Array.isArray(branchesResult) ? branchesResult : (branchesResult.branches || []);
        const createdBranch = branches[0];

        if (!createdBranch) throw new Error('Brand created but branch not found');
        branchId = createdBranch.id;

      } else {
        // Create Branch for existing Brand
        const branchResponse = await fetch('/api/branches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            brandId: formData.brandId,
            name: formData.branchName,
            slug: formData.slug,
            address: {
              street: formData.street,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              country: formData.country,
            },
            contact: {
              phone: formData.phone,
              whatsapp: formData.whatsapp || formData.phone,
              email: formData.email,
            },
            socialMedia: {
              facebook: formData.facebook || undefined,
              instagram: formData.instagram || undefined,
              linkedin: formData.linkedin || undefined,
              twitter: formData.twitter || undefined,
            },
            micrositeConfig: {
              templateId: 'modern-business',
              sections: {
                hero: {
                  enabled: true,
                  title: `Welcome to ${formData.branchName}`,
                  subtitle: 'Your trusted partner',
                  backgroundType: 'gradient',
                  animationEnabled: true,
                },
                about: { enabled: true, content: '' },
                services: { enabled: true, items: [] },
                gallery: { enabled: false, images: [] },
                contact: {
                  enabled: true,
                  showMap: true,
                  leadForm: { enabled: true, fields: ['name', 'email', 'phone', 'message'] },
                },
              },
              seoSettings: {
                title: formData.branchName,
                description: `Contact ${formData.branchName} for more information`,
                keywords: [],
              },
            },
          }),
        });

        const branchResult = await branchResponse.json();
        if (!branchResponse.ok || !branchResult.success) {
          throw new Error(branchResult.error || 'Failed to create branch');
        }
        branchId = branchResult.data.branch.id;
      }

      // Assign executive to the branch
      const assignResponse = await fetch(`/api/branches/${branchId}/assign-executive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ executiveId }),
      });

      const assignResult = await assignResponse.json();
      if (!assignResponse.ok || !assignResult.success) {
        console.error('Failed to assign executive, but branch was created');
      }

      // Success!
      setSuccess(true);
      setError(null);
      setFormData({
        brandName: '', brandTagline: '', brandLogo: '', brandColors: { primary: '#3B82F6', secondary: '#1E40AF', accent: '#F59E0B' },
        brandId: '', branchName: '', slug: '', street: '', city: '', state: '', zipCode: '', country: 'India',
        phone: '', whatsapp: '', email: '', facebook: '', instagram: '', linkedin: '', twitter: '',
      });

      setTimeout(() => { onSuccess(); }, 2000);
    } catch (err) {
      console.error('Error creating branch:', err);
      setError(err instanceof Error ? err.message : 'Failed to create branch');
    } finally {
      setSubmitting(false);
    }
  };

  if (success != null) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Onboarding Successful</h2>
        <p className="text-gray-600 mb-6">
          The brand and branch have been created and assigned to you. Redirecting...
        </p>
      </div>
    );
  }

  const getSelectedBrandName = () => {
    if (brandMode === 'new') return formData.brandName || 'New Brand';
    const brand = brands.find(b => b.id === formData.brandId);
    return brand?.name || 'Brand';
  };

  return (
    <>
      <MicrositePreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        previewData={{
          tempData: {
            brandName: getSelectedBrandName(),
            branchName: formData.branchName,
            address: {
              street: formData.street,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              country: formData.country,
            },
            contact: {
              phone: formData.phone,
              whatsapp: formData.whatsapp || formData.phone,
              email: formData.email,
            },
            socialMedia: {
              facebook: formData.facebook || undefined,
              instagram: formData.instagram || undefined,
              linkedin: formData.linkedin || undefined,
              twitter: formData.twitter || undefined,
            },
          },
        }}
        mode="preview"
      />

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Onboard New Client</h2>
          <p className="text-sm text-gray-600 mt-1">
            Create a new brand or add a branch to an existing one
          </p>

          {/* Mode Selectors */}
          <div className="mt-6 flex flex-col gap-4">
            {/* Brand Mode */}
            <div className="bg-gray-100 p-1 rounded-lg flex">
              <button
                onClick={() => setBrandMode('existing')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${brandMode === 'existing' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Existing Brand
              </button>
              <button
                onClick={() => setBrandMode('new')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${brandMode === 'new' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Create New Brand
              </button>
            </div>

            {/* Import Mode (only for existing brands or manual entry for new) */}
            <div className="flex gap-2">
              <button
                onClick={() => setImportMode('manual')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors border ${importMode === 'manual'
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <FileText className="w-4 h-4" />
                <span>Manual Entry</span>
              </button>
              <button
                onClick={() => setImportMode('google')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors border ${importMode === 'google'
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <Download className="w-4 h-4" />
                <span>Import from Google</span>
              </button>
            </div>
          </div>
        </div>

        {importMode === 'google' ? (
          <div className="p-6">
            <GoogleBusinessImport
              executiveId={executiveId}
              onImportComplete={onSuccess}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Brand Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b pb-2">
                <Search className="w-5 h-5" />
                Brand Information
              </h3>

              {brandMode === 'existing' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Brand <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.brandId}
                    onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                    required={brandMode === 'existing'}
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a brand...</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.brandName}
                      onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                      required={brandMode === 'new'}
                      placeholder="e.g., Acme Corp"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={formData.brandTagline}
                      onChange={(e) => setFormData({ ...formData, brandTagline: e.target.value })}
                      placeholder="e.g., Innovation for everyone"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand Logo
                    </label>
                    <FileUpload
                      onUpload={(url) => setFormData({ ...formData, brandLogo: url })}
                      currentUrl={formData.brandLogo}
                      accept="image/*"
                      maxSize={5}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Brand Colors
                    </label>
                    <ColorThemePicker
                      theme={formData.brandColors}
                      onChange={(theme) => setFormData(prev => ({ ...prev, brandColors: theme }))}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Branch Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b pb-2">
                <Building2 className="w-5 h-5" />
                Branch Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.branchName}
                    onChange={(e) => handleBranchNameChange(e.target.value)}
                    required
                    placeholder="e.g., Head Office"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {brandMode === 'existing' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                      placeholder="head-office"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b pb-2">
                <MapPin className="w-5 h-5" />
                Address
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  required
                  placeholder="123 Main Street"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    placeholder="Mumbai"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                    placeholder="Maharashtra"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    required
                    placeholder="400001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b pb-2">
                <Phone className="w-5 h-5" />
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="contact@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Social Media (Optional) */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b pb-2">
                <Globe className="w-5 h-5" />
                Social Media (Optional)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                  <input type="url" value={formData.facebook} onChange={(e) => setFormData({ ...formData, facebook: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                  <input type="url" value={formData.instagram} onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <input type="url" value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                  <input type="url" value={formData.twitter} onChange={(e) => setFormData({ ...formData, twitter: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handlePreview}
                disabled={(!formData.brandId && brandMode === 'existing') || (!formData.brandName && brandMode === 'new') || !formData.branchName}
                className="flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Globe className="w-5 h-5" />
                <span>Preview Microsite</span>
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-5 h-5" />
                <span>{submitting ? 'Creating...' : (brandMode === 'new' ? 'Create Brand & Branch' : 'Create Branch')}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

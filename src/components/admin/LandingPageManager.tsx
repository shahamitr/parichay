'use client';

import { useState, useEffect } from 'react';
import { useToastHelpers } from '@/components/ui/Toast';
import {
  Image,
  MessageSquare,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Star,
  ExternalLink,
  GripVertical,
  Eye,
  EyeOff,
  ListOrdered,
} from 'lucide-react';

interface ClientLogo {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  isPublished: boolean;
  displayOrder: number;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar?: string;
  content: string;
  rating: number;
  isPublished: boolean;
  displayOrder: number;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  isPublished: boolean;
  displayOrder: number;
}

interface HowItWorksStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  isPublished: boolean;
  displayOrder: number;
}

type ActiveSection = 'logos' | 'testimonials' | 'features' | 'howItWorks';

export default function LandingPageManager() {
  const { showSuccess, showError } = useToastHelpers();
  const [activeSection, setActiveSection] = useState<ActiveSection>('logos');
  const [loading, setLoading] = useState(false);

  // Data states
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [howItWorksSteps, setHowItWorksSteps] = useState<HowItWorksStep[]>([]);

  // Edit states
  const [editingLogo, setEditingLogo] = useState<Partial<ClientLogo> | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [editingFeature, setEditingFeature] = useState<Partial<Feature> | null>(null);
  const [editingStep, setEditingStep] = useState<Partial<HowItWorksStep> | null>(null);

  useEffect(() => {
    if (activeSection === 'logos') fetchLogos();
    if (activeSection === 'testimonials') fetchTestimonials();
    if (activeSection === 'features') fetchFeatures();
    if (activeSection === 'howItWorks') fetchHowItWorksSteps();
  }, [activeSection]);

  // Fetch functions
  const fetchLogos = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/client-logos', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setLogos(data.logos || []);
      }
    } catch (error) {
      console.error('Error fetching logos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/testimonials', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data.testimonials || []);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  // Logo handlers
  const handleSaveLogo = async () => {
    if (!editingLogo?.name || !editingLogo?.logoUrl) {
      showError('Name and Logo URL are required');
      return;
    }

    try {
      const isNew = !editingLogo.id;
      const url = isNew ? '/api/admin/client-logos' : `/api/admin/client-logos/${editingLogo.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editingLogo),
      });

      if (response.ok) {
        showSuccess(isNew ? 'Logo added successfully' : 'Logo updated successfully');
        setEditingLogo(null);
        fetchLogos();
      } else {
        const data = await response.json();
        showError(data.error || 'Failed to save logo');
      }
    } catch (error) {
      showError('An error occurred');
    }
  };

  const handleDeleteLogo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this logo?')) return;

    try {
      const response = await fetch(`/api/admin/client-logos/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        showSuccess('Logo deleted successfully');
        fetchLogos();
      } else {
        showError('Failed to delete logo');
      }
    } catch (error) {
      showError('An error occurred');
    }
  };

  const toggleLogoPublished = async (logo: ClientLogo) => {
    try {
      const response = await fetch(`/api/admin/client-logos/${logo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isPublished: !logo.isPublished }),
      });

      if (response.ok) {
        fetchLogos();
      }
    } catch (error) {
      showError('Failed to update logo');
    }
  };

  // Testimonial handlers
  const handleSaveTestimonial = async () => {
    if (!editingTestimonial?.name || !editingTestimonial?.content) {
      showError('Name and content are required');
      return;
    }

    try {
      const isNew = !editingTestimonial.id;
      const url = isNew ? '/api/admin/testimonials' : `/api/admin/testimonials/${editingTestimonial.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editingTestimonial),
      });

      if (response.ok) {
        showSuccess(isNew ? 'Testimonial added successfully' : 'Testimonial updated successfully');
        setEditingTestimonial(null);
        fetchTestimonials();
      } else {
        const data = await response.json();
        showError(data.error || 'Failed to save testimonial');
      }
    } catch (error) {
      showError('An error occurred');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        showSuccess('Testimonial deleted successfully');
        fetchTestimonials();
      } else {
        showError('Failed to delete testimonial');
      }
    } catch (error) {
      showError('An error occurred');
    }
  };

  const toggleTestimonialPublished = async (testimonial: Testimonial) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${testimonial.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isPublished: !testimonial.isPublished }),
      });

      if (response.ok) {
        fetchTestimonials();
      }
    } catch (error) {
      showError('Failed to update testimonial');
    }
  };

  // Feature handlers
  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/features', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setFeatures(data.features || []);
      }
    } catch (error) {
      console.error('Error fetching features:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFeature = async () => {
    if (!editingFeature?.title || !editingFeature?.description || !editingFeature?.icon) {
      showError('Title, description, and icon are required');
      return;
    }

    try {
      const isNew = !editingFeature.id;
      const url = isNew ? '/api/admin/features' : `/api/admin/features/${editingFeature.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editingFeature),
      });

      if (response.ok) {
        showSuccess(isNew ? 'Feature added successfully' : 'Feature updated successfully');
        setEditingFeature(null);
        fetchFeatures();
      } else {
        const data = await response.json();
        showError(data.error || 'Failed to save feature');
      }
    } catch (error) {
      showError('An error occurred');
    }
  };

  const handleDeleteFeature = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feature?')) return;

    try {
      const response = await fetch(`/api/admin/features/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        showSuccess('Feature deleted successfully');
        fetchFeatures();
      } else {
        showError('Failed to delete feature');
      }
    } catch (error) {
      showError('An error occurred');
    }
  };

  const toggleFeaturePublished = async (feature: Feature) => {
    try {
      const response = await fetch(`/api/admin/features/${feature.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isPublished: !feature.isPublished }),
      });

      if (response.ok) {
        fetchFeatures();
      }
    } catch (error) {
      showError('Failed to update feature');
    }
  };

  // Available icons for features
  const availableIcons = [
    { value: 'smartphone', label: 'Smartphone' },
    { value: 'zap', label: 'Zap/Lightning' },
    { value: 'share2', label: 'Share' },
    { value: 'barChart3', label: 'Analytics' },
    { value: 'lock', label: 'Lock/Security' },
    { value: 'palette', label: 'Palette/Design' },
    { value: 'qrCode', label: 'QR Code' },
    { value: 'globe', label: 'Globe/Web' },
    { value: 'messageSquare', label: 'Message/Chat' },
  ];

  // Available gradients
  const availableGradients = [
    { value: 'from-primary-500 to-primary-600', label: 'Primary' },
    { value: 'from-accent-500 to-accent-600', label: 'Accent' },
    { value: 'from-success-500 to-success-600', label: 'Success' },
    { value: 'from-warning-500 to-warning-600', label: 'Warning' },
    { value: 'from-error-500 to-error-600', label: 'Error' },
    { value: 'from-primary-500 to-accent-500', label: 'Primary to Accent' },
    { value: 'from-accent-500 to-error-500', label: 'Accent to Error' },
    { value: 'from-warning-500 to-accent-500', label: 'Warning to Accent' },
    { value: 'from-neutral-600 to-neutral-800', label: 'Neutral Dark' },
  ];

  // Available icons for How It Works
  const availableStepIcons = [
    { value: 'userPlus', label: 'User Plus / Sign Up' },
    { value: 'edit3', label: 'Edit / Customize' },
    { value: 'share2', label: 'Share' },
    { value: 'trendingUp', label: 'Trending Up / Growth' },
  ];

  // How It Works handlers
  const fetchHowItWorksSteps = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/how-it-works', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setHowItWorksSteps(data.steps || []);
      }
    } catch (error) {
      console.error('Error fetching steps:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStep = async () => {
    if (!editingStep?.title || !editingStep?.description || !editingStep?.icon) {
      showError('Title, description, and icon are required');
      return;
    }

    try {
      const isNew = !editingStep.id;
      const url = isNew ? '/api/admin/how-it-works' : `/api/admin/how-it-works/${editingStep.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editingStep),
      });

      if (response.ok) {
        showSuccess(isNew ? 'Step added successfully' : 'Step updated successfully');
        setEditingStep(null);
        fetchHowItWorksSteps();
      } else {
        const data = await response.json();
        showError(data.error || 'Failed to save step');
      }
    } catch (error) {
      showError('An error occurred');
    }
  };

  const handleDeleteStep = async (id: string) => {
    if (!confirm('Are you sure you want to delete this step?')) return;

    try {
      const response = await fetch(`/api/admin/how-it-works/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        showSuccess('Step deleted successfully');
        fetchHowItWorksSteps();
      } else {
        showError('Failed to delete step');
      }
    } catch (error) {
      showError('An error occurred');
    }
  };

  const toggleStepPublished = async (step: HowItWorksStep) => {
    try {
      const response = await fetch(`/api/admin/how-it-works/${step.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isPublished: !step.isPublished }),
      });

      if (response.ok) {
        fetchHowItWorksSteps();
      }
    } catch (error) {
      showError('Failed to update step');
    }
  };

  const sections = [
    { id: 'logos' as ActiveSection, name: 'Client Logos', icon: Image, count: logos.length },
    { id: 'testimonials' as ActiveSection, name: 'Testimonials', icon: MessageSquare, count: testimonials.length },
    { id: 'features' as ActiveSection, name: 'Features', icon: Sparkles, count: features.length },
    { id: 'howItWorks' as ActiveSection, name: 'How It Works', icon: ListOrdered, count: howItWorksSteps.length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Landing Page Content</h3>
        <p className="text-sm text-gray-400">Manage client logos, testimonials, and features displayed on the landing page</p>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 border-b border-gray-800 pb-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-amber-500 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {section.name}
              {section.count > 0 && (
                <span className={`px-1.5 py-0.5 text-xs rounded ${
                  activeSection === section.id ? 'bg-black/20' : 'bg-gray-700'
                }`}>
                  {section.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Client Logos Section */}
      {activeSection === 'logos' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-white">Client Logos</h4>
            <button
              onClick={() => setEditingLogo({ name: '', logoUrl: '', isPublished: true, displayOrder: logos.length })}
              className="flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-black rounded-lg text-sm font-medium hover:bg-amber-400"
            >
              <Plus className="w-4 h-4" />
              Add Logo
            </button>
          </div>

          {/* Edit Form */}
          {editingLogo && (
            <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 space-y-4">
              <div className="flex justify-between items-center">
                <h5 className="font-medium text-white">{editingLogo.id ? 'Edit Logo' : 'Add New Logo'}</h5>
                <button onClick={() => setEditingLogo(null)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Company Name *</label>
                  <input
                    type="text"
                    value={editingLogo.name || ''}
                    onChange={(e) => setEditingLogo({ ...editingLogo, name: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Website URL</label>
                  <input
                    type="url"
                    value={editingLogo.websiteUrl || ''}
                    onChange={(e) => setEditingLogo({ ...editingLogo, websiteUrl: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    placeholder="https://company.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Logo URL *</label>
                <input
                  type="url"
                  value={editingLogo.logoUrl || ''}
                  onChange={(e) => setEditingLogo({ ...editingLogo, logoUrl: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  placeholder="https://example.com/logo.png"
                />
              </div>
              {editingLogo.logoUrl && (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">Preview:</span>
                  <img src={editingLogo.logoUrl} alt="Preview" className="h-12 object-contain bg-white rounded p-2" />
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleSaveLogo}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black rounded-lg font-medium hover:bg-amber-400"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => setEditingLogo(null)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Logos List */}
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : logos.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No client logos yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {logos.map((logo) => (
                <div
                  key={logo.id}
                  className={`p-4 bg-gray-800/50 rounded-xl border ${
                    logo.isPublished ? 'border-gray-700' : 'border-gray-700/50 opacity-60'
                  }`}
                >
                  <div className="aspect-video bg-white rounded-lg p-4 mb-3 flex items-center justify-center">
                    <img src={logo.logoUrl} alt={logo.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white truncate">{logo.name}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleLogoPublished(logo)}
                        className="p-1 text-gray-400 hover:text-white"
                        title={logo.isPublished ? 'Unpublish' : 'Publish'}
                      >
                        {logo.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setEditingLogo(logo)}
                        className="p-1 text-gray-400 hover:text-white"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLogo(logo.id)}
                        className="p-1 text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Testimonials Section */}
      {activeSection === 'testimonials' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-white">Testimonials</h4>
            <button
              onClick={() => setEditingTestimonial({
                name: '',
                role: '',
                company: '',
                content: '',
                rating: 5,
                isPublished: false,
                displayOrder: testimonials.length,
              })}
              className="flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-black rounded-lg text-sm font-medium hover:bg-amber-400"
            >
              <Plus className="w-4 h-4" />
              Add Testimonial
            </button>
          </div>

          {/* Edit Form */}
          {editingTestimonial && (
            <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 space-y-4">
              <div className="flex justify-between items-center">
                <h5 className="font-medium text-white">{editingTestimonial.id ? 'Edit Testimonial' : 'Add New Testimonial'}</h5>
                <button onClick={() => setEditingTestimonial(null)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Name *</label>
                  <input
                    type="text"
                    value={editingTestimonial.name || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Role</label>
                  <input
                    type="text"
                    value={editingTestimonial.role || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    placeholder="CEO"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Company</label>
                  <input
                    type="text"
                    value={editingTestimonial.company || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, company: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    placeholder="Acme Corp"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Content *</label>
                <textarea
                  value={editingTestimonial.content || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, content: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  rows={3}
                  placeholder="Write the testimonial content..."
                />
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setEditingTestimonial({ ...editingTestimonial, rating: star })}
                        className="text-yellow-400"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= (editingTestimonial.rating || 5) ? 'fill-yellow-400' : 'fill-transparent'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Avatar URL</label>
                  <input
                    type="url"
                    value={editingTestimonial.avatar || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, avatar: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveTestimonial}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black rounded-lg font-medium hover:bg-amber-400"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => setEditingTestimonial(null)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Testimonials List */}
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No testimonials yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className={`p-4 bg-gray-800/50 rounded-xl border ${
                    testimonial.isPublished ? 'border-gray-700' : 'border-gray-700/50 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {testimonial.avatar ? (
                        <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        testimonial.name.charAt(0)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{testimonial.name}</span>
                        <span className="text-gray-400 text-sm">{testimonial.role} at {testimonial.company}</span>
                      </div>
                      <div className="flex gap-0.5 my-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-300 text-sm">{testimonial.content}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleTestimonialPublished(testimonial)}
                        className="p-1 text-gray-400 hover:text-white"
                        title={testimonial.isPublished ? 'Unpublish' : 'Publish'}
                      >
                        {testimonial.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setEditingTestimonial(testimonial)}
                        className="p-1 text-gray-400 hover:text-white"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTestimonial(testimonial.id)}
                        className="p-1 text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Features Section */}
      {activeSection === 'features' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-white">Features</h4>
            <button
              onClick={() => setEditingFeature({
                title: '',
                description: '',
                icon: 'zap',
                gradient: 'from-primary-500 to-primary-600',
                isPublished: true,
                displayOrder: features.length,
              })}
              className="flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-black rounded-lg text-sm font-medium hover:bg-amber-400"
            >
              <Plus className="w-4 h-4" />
              Add Feature
            </button>
          </div>

          {/* Edit Form */}
          {editingFeature && (
            <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 space-y-4">
              <div className="flex justify-between items-center">
                <h5 className="font-medium text-white">{editingFeature.id ? 'Edit Feature' : 'Add New Feature'}</h5>
                <button onClick={() => setEditingFeature(null)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Title *</label>
                  <input
                    type="text"
                    value={editingFeature.title || ''}
                    onChange={(e) => setEditingFeature({ ...editingFeature, title: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    placeholder="Feature Title"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingFeature.displayOrder || 0}
                    onChange={(e) => setEditingFeature({ ...editingFeature, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    min={0}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description *</label>
                <textarea
                  value={editingFeature.description || ''}
                  onChange={(e) => setEditingFeature({ ...editingFeature, description: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  rows={2}
                  placeholder="Feature description..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Icon *</label>
                  <select
                    value={editingFeature.icon || 'zap'}
                    onChange={(e) => setEditingFeature({ ...editingFeature, icon: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  >
                    {availableIcons.map((icon) => (
                      <option key={icon.value} value={icon.value}>{icon.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Gradient</label>
                  <select
                    value={editingFeature.gradient || 'from-primary-500 to-primary-600'}
                    onChange={(e) => setEditingFeature({ ...editingFeature, gradient: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  >
                    {availableGradients.map((gradient) => (
                      <option key={gradient.value} value={gradient.value}>{gradient.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Preview */}
              <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${editingFeature.gradient || 'from-primary-500 to-primary-600'} flex items-center justify-center shadow-lg`}>
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Preview</p>
                  <p className="text-white font-medium">{editingFeature.title || 'Feature Title'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveFeature}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black rounded-lg font-medium hover:bg-amber-400"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => setEditingFeature(null)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Features List */}
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : features.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No features yet</p>
              <p className="text-sm mt-1">Add features to display on the landing page</p>
            </div>
          ) : (
            <div className="space-y-3">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className={`p-4 bg-gray-800/50 rounded-xl border ${
                    feature.isPublished ? 'border-gray-700' : 'border-gray-700/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{feature.title}</span>
                        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">#{feature.displayOrder}</span>
                        {!feature.isPublished && (
                          <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded">Draft</span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm truncate">{feature.description}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleFeaturePublished(feature)}
                        className="p-1 text-gray-400 hover:text-white"
                        title={feature.isPublished ? 'Unpublish' : 'Publish'}
                      >
                        {feature.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setEditingFeature(feature)}
                        className="p-1 text-gray-400 hover:text-white"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFeature(feature.id)}
                        className="p-1 text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* How It Works Section */}
      {activeSection === 'howItWorks' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-white">How It Works Steps</h4>
            <button
              onClick={() => setEditingStep({
                title: '',
                description: '',
                icon: 'userPlus',
                gradient: 'from-primary-500 to-primary-600',
                isPublished: true,
                displayOrder: howItWorksSteps.length,
              })}
              className="flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-black rounded-lg text-sm font-medium hover:bg-amber-400"
            >
              <Plus className="w-4 h-4" />
              Add Step
            </button>
          </div>

          {/* Edit Form */}
          {editingStep && (
            <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 space-y-4">
              <div className="flex justify-between items-center">
                <h5 className="font-medium text-white">{editingStep.id ? 'Edit Step' : 'Add New Step'}</h5>
                <button onClick={() => setEditingStep(null)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Title *</label>
                  <input
                    type="text"
                    value={editingStep.title || ''}
                    onChange={(e) => setEditingStep({ ...editingStep, title: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    placeholder="Step Title"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingStep.displayOrder || 0}
                    onChange={(e) => setEditingStep({ ...editingStep, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    min={0}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description *</label>
                <textarea
                  value={editingStep.description || ''}
                  onChange={(e) => setEditingStep({ ...editingStep, description: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  rows={2}
                  placeholder="Step description..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Icon *</label>
                  <select
                    value={editingStep.icon || 'userPlus'}
                    onChange={(e) => setEditingStep({ ...editingStep, icon: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  >
                    {availableStepIcons.map((icon) => (
                      <option key={icon.value} value={icon.value}>{icon.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Gradient</label>
                  <select
                    value={editingStep.gradient || 'from-primary-500 to-primary-600'}
                    onChange={(e) => setEditingStep({ ...editingStep, gradient: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  >
                    {availableGradients.map((gradient) => (
                      <option key={gradient.value} value={gradient.value}>{gradient.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Preview */}
              <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${editingStep.gradient || 'from-primary-500 to-primary-600'} flex items-center justify-center shadow-lg`}>
                  <ListOrdered className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Preview</p>
                  <p className="text-white font-medium">{editingStep.title || 'Step Title'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveStep}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black rounded-lg font-medium hover:bg-amber-400"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => setEditingStep(null)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Steps List */}
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : howItWorksSteps.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <ListOrdered className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No steps yet</p>
              <p className="text-sm mt-1">Add steps to display on the landing page</p>
            </div>
          ) : (
            <div className="space-y-3">
              {howItWorksSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-4 bg-gray-800/50 rounded-xl border ${
                    step.isPublished ? 'border-gray-700' : 'border-gray-700/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg flex-shrink-0 relative`}>
                      <ListOrdered className="w-6 h-6 text-white" />
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center text-xs font-bold text-white border border-gray-700">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{step.title}</span>
                        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">#{step.displayOrder}</span>
                        {!step.isPublished && (
                          <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded">Draft</span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm truncate">{step.description}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleStepPublished(step)}
                        className="p-1 text-gray-400 hover:text-white"
                        title={step.isPublished ? 'Unpublish' : 'Publish'}
                      >
                        {step.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setEditingStep(step)}
                        className="p-1 text-gray-400 hover:text-white"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStep(step.id)}
                        className="p-1 text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

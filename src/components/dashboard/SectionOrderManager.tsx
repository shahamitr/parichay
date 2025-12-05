// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import {
  GripVertical, Eye, EyeOff, Save, RotateCcw,
  User, FileText, Briefcase, Image, Phone, Shield,
  CditCard, MessageSquare, Video, Star, TrendingUp,
  FolderOpen, UserCircle, Tag, Megaphone
} from 'lucide-react';
import { SectionOrderItem, SectionId } from '@/types/microsite';

interface SectionOrderManagerProps {
  branchId: string;
  onSave?: () => void;
}

// Section metadata
const SECTION_META: Record<SectionId, { label: string; icon: any; description: string }> = {
  hero: { label: 'Hero / Profile', icon: User, description: 'Brand identity, logo, tagline, quick CTAs' },
  about: { label: 'About Business', icon: FileText, description: 'Who we are, what we do' },
  services: { label: 'Services', icon: Briefcase, description: 'Interactive service slider with booking' },
  gallery: { label: 'Gallery', icon: Image, description: 'Visual showcase with masonry grid' },
  contact: { label: 'Contact Hub', icon: Phone, description: 'Contact info, map, lead form' },
  trustIndicators: { label: 'Certifications', icon: Shield, description: 'Awards, certifications, trust badges' },
  payment: { label: 'Payments', icon: CreditCard, description: 'UPI, QR codes, bank details' },
  feedback: { label: 'Reviews', icon: MessageSquare, description: 'Customer reviews and feedback form' },
  videos: { label: 'Videos', icon: Video, description: 'Video gallery and testimonials' },
  testimonials: { label: 'Testimonials', icon: Star, description: 'Customer testimonial carousel' },
  impact: { label: 'Impact Metrics', icon: TrendingUp, description: 'Key statistics and achievements' },
  portfolio: { label: 'Portfolio', icon: FolderOpen, description: 'Case studies and projects' },
  aboutFounder: { label: 'About Founder', icon: UserCircle, description: 'Founder bio and achievements' },
  offers: { label: 'Special Offers', icon: Tag, description: 'Discounts and promotions' },
  cta: { label: 'Call to Action', icon: Megaphone, description: 'Conversion-focused CTA section' },
};

const DEFAULT_ORDER: SectionOrderItem[] = [
  { id: 'hero', enabled: true },
  { id: 'about', enabled: true },
  { id: 'services', enabled: true },
  { id: 'gallery', enabled: true },
  { id: 'contact', enabled: true },
  { id: 'trustIndicators', enabled: false },
  { id: 'payment', enabled: true },
  { id: 'feedback', enabled: true },
  { id: 'videos', enabled: false },
  { id: 'testimonials', enabled: false },
  { id: 'impact', enabled: false },
  { id: 'portfolio', enabled: false },
  { id: 'aboutFounder', enabled: false },
  { id: 'offers', enabled: false },
  { id: 'cta', enabled: false },
];

export default function SectionOrderManager({ branchId, onSave }: SectionOrderManagerProps) {
  const [sections, setSections] = useState<SectionOrderItem[]>(DEFAULT_ORDER);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchSectionOrder();
  }, [branchId]);

  const fetchSectionOrder = async () => {
    try {
      const response = await fetch(`/api/microsites/${branchId}/sections`);
      const data = await response.json();
      if (data.success && data.data.sectionOrder) {
        setSections(data.data.sectionOrder);
      }
    } catch (error) {
      console.error('Error fetching section order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newSections = [...sections];
    const draggedItem = newSections[draggedIndex];
    newSections.splice(draggedIndex, 1);
    newSections.splice(index, 0, draggedItem);

    setSections(newSections);
    setDraggedIndex(index);
    setHasChanges(true);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const toggleSection = (index: number) => {
    const newSections = [...sections];
    newSections[index].enabled = !newSections[index].enabled;
    setSections(newSections);
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/microsites/${branchId}/sections`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionOrder: sections }),
      });

      if (response.ok) {
        setHasChanges(false);
        onSave?.();
      }
    } catch (error) {
      console.error('Error saving section order:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSections(DEFAULT_ORDER);
    setHasChanges(true);
  };

  if (loading != null) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin w-8 h-border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading sections...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Section Order</h3>
          <p className="text-sm text-gray-500">Drag to reorder, toggle to enable/disable</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Section List */}
      <div className="p-4 space-y-2">
        {sections.map((section, index) => {
          const meta = SECTION_META[section.id];
          const Icon = meta.icon;

          return (
            <div
              key={section.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-move ${
                section.enabled
                  ? 'bg-white border-gray-200 hover:border-blue-300'
                  : 'bg-gray-50 border-gray-100 opacity-60'
              } ${draggedIndex === index ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
            >
              {/* Drag Handle */}
              <div className="text-gray-400 hover:text-gray-600">
                <GripVertical className="w-5 h-5" />
              </div>

              {/* Order Number */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                section.enabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'
              }`}>
                {index + 1}
              </div>

              {/* Icon */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                section.enabled ? 'bg-blue-50' : 'bg-gray-100'
              }`}>
                <Icon className={`w-5 h-5 ${section.enabled ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${section.enabled ? 'text-gray-900' : 'text-gray-500'}`}>
                  {meta.label}
                </p>
                <p className="text-xs text-gray-400 truncate">{meta.description}</p>
              </div>

              {/* Toggle */}
              <button
                onClick={() => toggleSection(index)}
                className={`p-2 rounded-lg transition-colors ${
                  section.enabled
                    ? 'text-green-600 hover:bg-green-50'
                    : 'text-gray-400 hover:bg-gray-100'
                }`}
              >
                {section.enabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
        <p className="text-xs text-gray-500 text-center">
          {sections.filter(s => s.enabled).length} of {sections.length} sections enabled
        </p>
      </div>
    </div>
  );
}

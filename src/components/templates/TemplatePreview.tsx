'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import {
  Crown,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  Camera,
  Calendar,
  ShoppingBag,
  Award,
  MessageCircle
} from 'lucide-react';
import { MicrositeTemplate } from '@/types/template';
import { templateCategories } from '@/data/industry-templates';

interface TemplatePreviewProps {
  template: MicrositeTemplate;
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (template: MicrositeTemplate) => void;
}

export default function TemplatePreview({
  template,
  isOpen,
  onClose,
  onUseTemplate
}: TemplatePreviewProps) {
  const [activeSection, setActiveSection] = useState('hero');

  const category = templateCategories.find(cat => cat.id === template.category);
  const config = template.defaultConfig;

  // Mock preview data based on template sections
  const getPreviewContent = () => {
    const sections = config.sections || {};

    return {
      hero: sections.hero || { title: template.name, subtitle: 'Professional Business Template' },
      about: sections.about || { content: 'This is a sample about section...' },
      services: sections.services || { items: [] },
      gallery: sections.gallery || { images: [] },
      testimonials: sections.testimonials || { items: [] },
      contact: sections.contact || { enabled: true }
    };
  };

  const previewContent = getPreviewContent();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{category?.icon || '🏢'}</div>
              <div>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  {template.name}
                  {template.isPremium && <Crown className="w-5 h-5 text-yellow-500" />}
                </DialogTitle>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
            </div>
            <Button onClick={() => onUseTemplate(template)} className="bg-blue-600 hover:bg-blue-700">
              Use Template
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <div className="bg-gray-50 rounded-lg p-6 min-h-[400px]">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Template Preview</h3>
              <div className="space-y-4">
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <h4 className="text-xl font-bold text-gray-800">{previewContent.hero.title}</h4>
                  <p className="text-gray-600 mt-2">{previewContent.hero.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-semibold mb-2">About Section</h5>
                    <p className="text-sm text-gray-600">{previewContent.about.content}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-semibold mb-2">Features</h5>
                    <div className="flex flex-wrap gap-1">
                      {template.features.map((feature, index) => (
                        <Badge key={index} variant="primary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

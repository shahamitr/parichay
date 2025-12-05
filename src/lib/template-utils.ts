// @ts-nocheck
import { MicrositeTemplate } from '@/data/templates';
import { micrositeTemplates } from '@/data/templates';
import { MicrositeConfig } from '@/types/microsite';

/**
 * Apply a template to a microsite configuration
 */
export function applyTemplate(
  template: MicrositeTemplate,
  existingConfig?: Partial<MicrositeConfig>
): MicrositeConfig {
  const config: MicrositeConfig = {
    // Basic info from existing config or defaults
    name: existingConfig?.name || 'My Business',
    tagline: existingConfig?.tagline || 'Welcome to our business',
    logo: existingConfig?.logo || '',

    // Apply template theme
    theme: {
      primaryColor: template.theme.colors.primary,
      secondaryColor: template.theme.colors.secondary,
      accentColor: template.theme.colors.accent,
      backgroundColor: template.theme.colors.background,
      textColor: template.theme.colors.text,
      fontFamily: template.theme.fonts.heading,
      bodyFontFamily: template.theme.fonts.body,
    },

    // Apply template sections
    sections: template.sections.map((section, index) => ({
      id: `section-${index}`,
      type: section.type as any,
      title: section.title,
      enabled: section.enabled,
      order: section.order,
      content: getDefaultContentForSection(section.type),
      config: section.config || {},
    })),

    // Social links from existing config
    socialLinks: existingConfig?.socialLinks || {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
      youtube: '',
      whatsapp: '',
    },

    // Contact info from existing config
    contact: existingConfig?.contact || {
      email: '',
      phone: '',
      whatsapp: '',
      address: '',
    },

    // Business hours from existing config
    businessHours: existingConfig?.businessHours || {},

    // SEO settings
    seo: existingConfig?.seo || {
      title: '',
      description: '',
      keywords: [],
      ogImage: '',
    },

    // Custom CSS
    customCSS: existingConfig?.customCSS || '',

    // Analytics
    analytics: existingConfig?.analytics || {
      googleAnalyticsId: '',
      facebookPixelId: '',
    },
  };

  return config;
}

/**
 * Get default content for a section type
 */
function getDefaultContentForSection(sectionType: string): any {
  const defaults: Record<string, any> = {
    profile: {
      name: 'Your Name',
      title: 'Your Title',
      bio: 'Tell us about yourself...',
      image: '',
    },
    about: {
      heading: 'About Us',
      content: 'Share your story...',
    },
    services: {
      heading: 'Our Services',
      items: [
        { title: 'Service 1', description: 'Description...', icon: '' },
        { title: 'Service 2', description: 'Description...', icon: '' },
        { title: 'Service 3', description: 'Description...', icon: '' },
      ],
    },
    products: {
      heading: 'Our Products',
      items: [],
    },
    gallery: {
      heading: 'Gallery',
      images: [],
    },
    testimonials: {
      heading: 'What Our Clients Say',
      items: [
        { name: 'Client Name', text: 'Testimonial text...', rating: 5, image: '' },
      ],
    },
    contact: {
      heading: 'Get in Touch',
      showForm: true,
      showMap: false,
    },
    portfolio: {
      heading: 'Portfolio',
      items: [],
    },
    team: {
      heading: 'Our Team',
      members: [],
    },
    pricing: {
      heading: 'Pricing',
      plans: [],
    },
    faq: {
      heading: 'Frequently Asked Questions',
      items: [],
    },
    blog: {
      heading: 'Latest Posts',
      posts: [],
    },
  };

  return defaults[sectionType] || {};
}

/**
 * Get recommended templates based on user's industry category
 */
export function getRecommendedTemplates(categoryId: string | null): MicrositeTemplate[] {
  if (!categoryId) {
    // Return popular templates if no category selected
    return micrositeTemplates.slice(0, 6);
  }

  // Get templates for the user's category
  const categoryTemplates = micrositeTemplates.filter(
    template => template.categoryId === categoryId
  );

  // Get some templates from other categories as alternatives
  const otherTemplates = micrositeTemplates
    .filter(template => template.categoryId !== categoryId)
    .slice(0, 3);

  return [...categoryTemplates, ...otherTemplates];
}

/**
 * Get template by ID
 */
export function getTemplateById(templateId: string): MicrositeTemplate | undefined {
  return micrositeTemplates.find(template => template.id === templateId);
}

/**
 * Merge template with existing microsite config
 * Preserves user's custom content while applying template structure
 */
export function mergeTemplateWithConfig(
  template: MicrositeTemplate,
  existingConfig: MicrositeConfig
): MicrositeConfig {
  const newConfig = applyTemplate(template, existingConfig);

  // Preserve existing section content where sections match
  newConfig.sections = newConfig.sections.map(newSection => {
    const existingSection = existingConfig.sections?.find(
      s => s.type === newSection.type
    );

    if (existingSection && existingSection.content) {
      // Keep existing content but update order and config
      return {
        ...newSection,
        content: existingSection.content,
      };
    }

    return newSection;
  });

  return newConfig;
}

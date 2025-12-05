export interface TemplateSection {
  type: string;
  title: string;
  enabled: boolean;
  order: number;
  config?: Record<string, any>;
}

export interface MicrositeTemplate {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  preview: string;
  sections: TemplateSection[];
  theme: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
    layout: {
      style: 'modern' | 'classic' | 'minimal' | 'bold';
      spacing: 'compact' | 'normal' | 'spacious';
    };
  };
}

export const micrositeTemplates: MicrositeTemplate[] = [
  // Business Owners Templates
  {
    id: 'business-professional',
    name: 'Professional Business',
    categoryId: 'business-owners',
    description: 'Clean and professional template perfect for established businesses',
    preview: '/templates/business-professional.jpg',
    sections: [
      { type: 'profile', title: 'Business Profile', enabled: true, order: 1 },
      { type: 'about', title: 'About Us', enabled: true, order: 2 },
      { type: 'services', title: 'Our Services', enabled: true, order: 3 },
      { type: 'testimonials', title: 'Client Testimonials', enabled: true, order: 4 },
      { type: 'contact', title: 'Contact Us', enabled: true, order: 5 },
    ],
    theme: {
      colors: {
        primary: '#1E40AF',
        secondary: '#3B82F6',
        accent: '#60A5FA',
        background: '#FFFFFF',
        text: '#1F2937',
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
      },
      layout: {
        style: 'modern',
        spacing: 'normal',
      },
    },
  },
  {
    id: 'business-showcase',
    name: 'Business Showcase',
    categoryId: 'business-owners',
    description: 'Visual-focused template to highlight products and services',
    preview: '/templates/business-showcase.jpg',
    sections: [
      { type: 'profile', title: 'Welcome', enabled: true, order: 1 },
      { type: 'gallery', title: 'Our Work', enabled: true, order: 2 },
      { type: 'products', title: 'Products & Services', enabled: true, order: 3 },
      { type: 'testimonials', title: 'What Clients Say', enabled: true, order: 4 },
      { type: 'appointment', title: 'Book Appointment', enabled: true, order: 5 },
      { type: 'contact', title: 'Get in Touch', enabled: true, order: 6 },
    ],
    theme: {
      colors: {
        primary: '#2563EB',
        secondary: '#60A5FA',
        accent: '#DBEAFE',
        background: '#F9FAFB',
        text: '#111827',
      },
      fonts: {
        heading: 'Poppins',
        body: 'Inter',
      },
      layout: {
        style: 'bold',
        spacing: 'spacious',
      },
    },
  },

  // Corporate Professionals Templates
  {
    id: 'corporate-executive',
    name: 'Executive Profile',
    categoryId: 'corporate-professionals',
    description: 'Sophisticated template for corporate executives and managers',
    preview: '/templates/corporate-executive.jpg',
    sections: [
      { type: 'profile', title: 'Professional Profile', enabled: true, order: 1 },
      { type: 'experience', title: 'Experience', enabled: true, order: 2 },
      { type: 'achievements', title: 'Achievements', enabled: true, order: 3 },
      { type: 'social', title: 'Connect', enabled: true, order: 4 },
      { type: 'contact', title: 'Contact', enabled: true, order: 5 },
    ],
    theme: {
      colors: {
        primary: '#0F172A',
        secondary: '#334155',
        accent: '#64748B',
        background: '#FFFFFF',
        text: '#0F172A',
      },
      fonts: {
        heading: 'Playfair Display',
        body: 'Inter',
      },
      layout: {
        style: 'classic',
        spacing: 'normal',
      },
    },
  },
  {
    id: 'corporate-modern',
    name: 'Modern Professional',
    categoryId: 'corporate-professionals',
    description: 'Contemporary design for forward-thinking professionals',
    preview: '/templates/corporate-modern.jpg',
    sections: [
      { type: 'profile', title: 'About Me', enabled: true, order: 1 },
      { type: 'skills', title: 'Expertise', enabled: true, order: 2 },
      { type: 'portfolio', title: 'Projects', enabled: true, order: 3 },
      { type: 'calendar', title: 'Schedule Meeting', enabled: true, order: 4 },
      { type: 'contact', title: 'Let\'s Connect', enabled: true, order: 5 },
    ],
    theme: {
      colors: {
        primary: '#1E293B',
        secondary: '#475569',
        accent: '#94A3B8',
        background: '#F8FAFC',
        text: '#0F172A',
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
      },
      layout: {
        style: 'modern',
        spacing: 'compact',
      },
    },
  },

  // Event Planners Templates
  {
    id: 'event-elegant',
    name: 'Elegant Events',
    categoryId: 'event-planners',
    description: 'Elegant template perfect for wedding and luxury event planners',
    preview: '/templates/event-elegant.jpg',
    sections: [
      { type: 'profile', title: 'Welcome', enabled: true, order: 1 },
      { type: 'gallery', title: 'Event Gallery', enabled: true, order: 2 },
      { type: 'services', title: 'Services', enabled: true, order: 3 },
      { type: 'testimonials', title: 'Happy Clients', enabled: true, order: 4 },
      { type: 'contact', title: 'Plan Your Event', enabled: true, order: 5 },
    ],
    theme: {
      colors: {
        primary: '#DB2777',
        secondary: '#EC4899',
        accent: '#F472B6',
        background: '#FFF1F2',
        text: '#881337',
      },
      fonts: {
        heading: 'Playfair Display',
        body: 'Lato',
      },
      layout: {
        style: 'classic',
        spacing: 'spacious',
      },
    },
  },
  {
    id: 'event-vibrant',
    name: 'Vibrant Events',
    categoryId: 'event-planners',
    description: 'Bold and colorful template for dynamic event coordinators',
    preview: '/templates/event-vibrant.jpg',
    sections: [
      { type: 'profile', title: 'About Us', enabled: true, order: 1 },
      { type: 'portfolio', title: 'Past Events', enabled: true, order: 2 },
      { type: 'packages', title: 'Event Packages', enabled: true, order: 3 },
      { type: 'testimonials', title: 'Reviews', enabled: true, order: 4 },
      { type: 'booking', title: 'Book Consultation', enabled: true, order: 5 },
      { type: 'contact', title: 'Contact', enabled: true, order: 6 },
    ],
    theme: {
      colors: {
        primary: '#BE185D',
        secondary: '#F472B6',
        accent: '#FBCFE8',
        background: '#FFFFFF',
        text: '#1F2937',
      },
      fonts: {
        heading: 'Montserrat',
        body: 'Open Sans',
      },
      layout: {
        style: 'bold',
        spacing: 'normal',
      },
    },
  },

  // Freelancers & Consultants Templates
  {
    id: 'freelancer-minimal',
    name: 'Minimal Portfolio',
    categoryId: 'freelancers-consultants',
    description: 'Clean and minimal template to showcase your expertise',
    preview: '/templates/freelancer-minimal.jpg',
    sections: [
      { type: 'profile', title: 'Hi, I\'m...', enabled: true, order: 1 },
      { type: 'services', title: 'What I Do', enabled: true, order: 2 },
      { type: 'portfolio', title: 'My Work', enabled: true, order: 3 },
      { type: 'testimonials', title: 'Client Feedback', enabled: true, order: 4 },
      { type: 'contact', title: 'Work Together', enabled: true, order: 5 },
    ],
    theme: {
      colors: {
        primary: '#7C3AED',
        secondary: '#8B5CF6',
        accent: '#A78BFA',
        background: '#FAFAFA',
        text: '#18181B',
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
      },
      layout: {
        style: 'minimal',
        spacing: 'spacious',
      },
    },
  },
  {
    id: 'freelancer-dynamic',
    name: 'Dynamic Consultant',
    categoryId: 'freelancers-consultants',
    description: 'Engaging template for consultants and service providers',
    preview: '/templates/freelancer-dynamic.jpg',
    sections: [
      { type: 'profile', title: 'About', enabled: true, order: 1 },
      { type: 'expertise', title: 'Expertise', enabled: true, order: 2 },
      { type: 'case-studies', title: 'Case Studies', enabled: true, order: 3 },
      { type: 'pricing', title: 'Services & Pricing', enabled: true, order: 4 },
      { type: 'calendar', title: 'Book Consultation', enabled: true, order: 5 },
      { type: 'contact', title: 'Get in Touch', enabled: true, order: 6 },
    ],
    theme: {
      colors: {
        primary: '#6D28D9',
        secondary: '#A78BFA',
        accent: '#DDD6FE',
        background: '#FFFFFF',
        text: '#1F2937',
      },
      fonts: {
        heading: 'Poppins',
        body: 'Inter',
      },
      layout: {
        style: 'modern',
        spacing: 'normal',
      },
    },
  },

  // Educational Institutions Templates
  {
    id: 'education-academic',
    name: 'Academic Excellence',
    categoryId: 'educational-institutions',
    description: 'Professional template for schools and colleges',
    preview: '/templates/education-academic.jpg',
    sections: [
      { type: 'profile', title: 'Welcome', enabled: true, order: 1 },
      { type: 'programs', title: 'Programs', enabled: true, order: 2 },
      { type: 'faculty', title: 'Faculty', enabled: true, order: 3 },
      { type: 'gallery', title: 'Campus Life', enabled: true, order: 4 },
      { type: 'admission', title: 'Admissions', enabled: true, order: 5 },
      { type: 'contact', title: 'Contact Us', enabled: true, order: 6 },
    ],
    theme: {
      colors: {
        primary: '#059669',
        secondary: '#10B981',
        accent: '#34D399',
        background: '#FFFFFF',
        text: '#064E3B',
      },
      fonts: {
        heading: 'Merriweather',
        body: 'Open Sans',
      },
      layout: {
        style: 'classic',
        spacing: 'normal',
      },
    },
  },
  {
    id: 'education-modern',
    name: 'Modern Learning',
    categoryId: 'educational-institutions',
    description: 'Contemporary template for progressive educational institutions',
    preview: '/templates/education-modern.jpg',
    sections: [
      { type: 'profile', title: 'About Us', enabled: true, order: 1 },
      { type: 'courses', title: 'Courses', enabled: true, order: 2 },
      { type: 'achievements', title: 'Achievements', enabled: true, order: 3 },
      { type: 'testimonials', title: 'Student Success', enabled: true, order: 4 },
      { type: 'events', title: 'Events', enabled: true, order: 5 },
      { type: 'contact', title: 'Inquire Now', enabled: true, order: 6 },
    ],
    theme: {
      colors: {
        primary: '#047857',
        secondary: '#34D399',
        accent: '#A7F3D0',
        background: '#F0FDF4',
        text: '#064E3B',
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
      },
      layout: {
        style: 'modern',
        spacing: 'spacious',
      },
    },
  },

  // Creatives & Designers Templates
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    categoryId: 'creatives-designers',
    description: 'Stunning visual template for artists and designers',
    preview: '/templates/creative-portfolio.jpg',
    sections: [
      { type: 'profile', title: 'About', enabled: true, order: 1 },
      { type: 'gallery', title: 'Portfolio', enabled: true, order: 2 },
      { type: 'process', title: 'My Process', enabled: true, order: 3 },
      { type: 'testimonials', title: 'Client Love', enabled: true, order: 4 },
      { type: 'contact', title: 'Let\'s Create', enabled: true, order: 5 },
    ],
    theme: {
      colors: {
        primary: '#EA580C',
        secondary: '#F97316',
        accent: '#FB923C',
        background: '#FFFBEB',
        text: '#7C2D12',
      },
      fonts: {
        heading: 'Bebas Neue',
        body: 'Roboto',
      },
      layout: {
        style: 'bold',
        spacing: 'spacious',
      },
    },
  },
  {
    id: 'creative-minimal',
    name: 'Minimal Creative',
    categoryId: 'creatives-designers',
    description: 'Minimalist template that lets your work shine',
    preview: '/templates/creative-minimal.jpg',
    sections: [
      { type: 'profile', title: 'Hello', enabled: true, order: 1 },
      { type: 'portfolio', title: 'Work', enabled: true, order: 2 },
      { type: 'services', title: 'Services', enabled: true, order: 3 },
      { type: 'contact', title: 'Connect', enabled: true, order: 4 },
    ],
    theme: {
      colors: {
        primary: '#DC2626',
        secondary: '#F97316',
        accent: '#FBBF24',
        background: '#FFFFFF',
        text: '#1F2937',
      },
      fonts: {
        heading: 'Space Grotesk',
        body: 'Inter',
      },
      layout: {
        style: 'minimal',
        spacing: 'spacious',
      },
    },
  },
];

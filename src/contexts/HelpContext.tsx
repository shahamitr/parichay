'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface HelpItem {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'video' | 'faq' | 'feature';
  content?: string;
  videoUrl?: string;
  category: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface HelpContextType {
  isHelpOpen: boolean;
  openHelp: () => void;
  closeHelp: () => void;
  currentPageContext: string;
  setPageContext: (context: string) => void;
  helpItems: HelpItem[];
  setHelpItems: (items: HelpItem[]) => void;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export function HelpProvider({ children }: { children: ReactNode }) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [currentPageContext, setCurrentPageContext] = useState('Dashboard');
  const [helpItems, setHelpItems] = useState<HelpItem[]>([]);

  const openHelp = () => setIsHelpOpen(true);
  const closeHelp = () => setIsHelpOpen(false);
  const setPageContext = (context: string) => setCurrentPageContext(context);

  return (
    <HelpContext.Provider value={{
      isHelpOpen,
      openHelp,
      closeHelp,
      currentPageContext,
      setPageContext,
      helpItems,
      setHelpItems
    }}>
      {children}
    </HelpContext.Provider>
  );
}

export function useHelp() {
  const context = useContext(HelpContext);
  if (context === undefined) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  return context;
}

// Help content for different pages
export const helpContent = {
  'landing page': [
    {
      id: 'landing-overview',
      title: 'Welcome to Parichay',
      description: 'Learn how to get started with digital business cards and microsites',
      type: 'guide' as const,
      content: `Welcome to Parichay - Your Digital Business Card Solution!

Getting Started:
• Click "Start Free Trial" to create your account
• No credit card required for the free trial
• Setup takes less than 3 minutes
• Choose from professional templates

What You Can Do:
• Create stunning digital business cards
• Build professional microsites
• Share via QR codes or links
• Track views and engagement
• Integrate with your existing tools

Why Choose Parichay:
• Built for modern networking
• Instant lead capture
• Mobile-optimized designs
• Real-time analytics
• 24/7 support`,
      category: 'Getting Started',
      tags: ['welcome', 'overview', 'getting-started'],
      difficulty: 'beginner' as const
    },
    {
      id: 'landing-features',
      title: 'Key Features Overview',
      description: 'Explore the powerful features that make Parichay stand out',
      type: 'feature' as const,
      content: `Parichay offers comprehensive digital business solutions:

🎨 Professional Templates
• 50+ industry-specific designs
• Fully customizable layouts
• Brand color integration
• Mobile-responsive designs

📊 Advanced Analytics
• Real-time view tracking
• Geographic insights
• Device analytics
• Conversion metrics

🔗 Smart Sharing
• QR code generation
• Short link creation
• Social media integration
• Email signatures

🏢 Multi-Location Support
• Branch management
• Team collaboration
• Centralized branding
• Individual customization

💼 Business Tools
• Lead capture forms
• Contact management
• CRM integration
• Export capabilities`,
      category: 'Features',
      tags: ['features', 'capabilities', 'tools'],
      difficulty: 'beginner' as const
    },
    {
      id: 'landing-pricing',
      title: 'Pricing & Plans',
      description: 'Understanding our pricing structure and what\'s included',
      type: 'faq' as const,
      content: `Our pricing is designed to grow with your business:

Free Trial (30 Days):
• 1 digital business card
• Basic templates
• QR code sharing
• Basic analytics
• Email support

Starter Plan (₹299/month):
• 5 digital cards
• All templates
• Custom branding
• Advanced analytics
• Priority support

Professional Plan (₹599/month):
• Unlimited cards
• Team collaboration
• White-label options
• API access
• Dedicated support

Enterprise Plan (Custom):
• Custom solutions
• On-premise deployment
• Advanced integrations
• Training & onboarding
• 24/7 phone support

All plans include:
• Mobile optimization
• SSL security
• Regular backups
• High availability guarantee`,
      category: 'Pricing',
      tags: ['pricing', 'plans', 'billing'],
      difficulty: 'beginner' as const
    }
  ],

  dashboard: [
    {
      id: 'dashboard-overview',
      title: 'Dashboard Overview',
      description: 'Understanding your dashboard metrics and key performance indicators',
      type: 'guide' as const,
      content: `The dashboard provides a comprehensive view of your business performance:

• Total Cards: Shows the number of digital business cards created
• Active Users: Number of users actively using your cards
• Monthly Views: Total views your cards received this month
• Conversion Rate: Percentage of views that resulted in actions

Use the date picker to filter data for specific time periods. The charts update automatically to show trends and patterns in your data.`,
      category: 'Getting Started',
      tags: ['dashboard', 'metrics', 'overview'],
      difficulty: 'beginner' as const
    },
    {
      id: 'dashboard-analytics',
      title: 'Understanding Analytics',
      description: 'How to interpret your analytics data and make data-driven decisions',
      type: 'guide' as const,
      content: `Analytics help you understand user behavior:

1. View Patterns: See when your cards are viewed most
2. Geographic Data: Understand where your audience is located
3. Device Types: Know which devices your audience uses
4. Engagement Metrics: Track how users interact with your content

Use this data to optimize your card content and sharing strategy.`,
      category: 'Analytics',
      tags: ['analytics', 'data', 'insights'],
      difficulty: 'intermediate' as const
    }
  ],

  brands: [
    {
      id: 'brands-create',
      title: 'Creating a New Brand',
      description: 'Step-by-step guide to create and configure your brand profile',
      type: 'guide' as const,
      content: `To create a new brand:

1. Click the "Add Brand" button
2. Fill in basic information:
   • Brand Name: Your company or organization name
   • Description: Brief description of your brand
   • Industry: Select your business category
   • Website: Your official website URL

3. Upload brand assets:
   • Logo: High-quality PNG or SVG (recommended: 512x512px)
   • Cover Image: Banner image (recommended: 1200x400px)
   • Brand Colors: Primary and secondary colors

4. Configure settings:
   • Contact Information
   • Social Media Links
   • Business Hours
   • Location Details

5. Save and activate your brand

Your brand will be available for creating business cards and microsites.`,
      category: 'Brand Management',
      tags: ['brand', 'create', 'setup'],
      difficulty: 'beginner' as const
    },
    {
      id: 'brands-customize',
      title: 'Brand Customization',
      description: 'Advanced customization options for your brand appearance',
      type: 'guide' as const,
      content: `Customize your brand appearance:

• Theme Colors: Set primary, secondary, and accent colors
• Typography: Choose fonts that match your brand identity
• Layout Options: Select card and microsite layouts
• Custom CSS: Add custom styling (Pro feature)
• White Label: Remove Parichay branding (Enterprise feature)

Best Practices:
- Use consistent colors across all materials
- Choose readable fonts
- Maintain brand guidelines
- Test on different devices`,
      category: 'Customization',
      tags: ['customization', 'branding', 'design'],
      difficulty: 'intermediate' as const
    }
  ],

  branches: [
    {
      id: 'branches-overview',
      title: 'Branch Management',
      description: 'Managing multiple locations and branch-specific information',
      type: 'guide' as const,
      content: `Branches help you manage multiple locations:

• Each branch can have unique contact information
• Separate business cards for different locations
• Location-specific microsites
• Individual analytics per branch
• Custom staff assignments

Use branches for:
- Multiple office locations
- Franchise operations
- Department-specific cards
- Regional customizations`,
      category: 'Branch Management',
      tags: ['branches', 'locations', 'management'],
      difficulty: 'beginner' as const
    }
  ],

  billing: [
    {
      id: 'billing-overview',
      title: 'Billing & Invoices',
      description: 'Understanding your billing, payments, and invoice management',
      type: 'guide' as const,
      content: `Billing Management Features:

• View all invoices and payment history
• Download invoices as PDF
• Export billing data to CSV
• Track subscription status
• Manage payment methods

Invoice Details Include:
- Invoice number and date
- Billing period
- Itemized charges
- Tax information
- Payment status

Use the export feature to integrate with your accounting software.`,
      category: 'Billing',
      tags: ['billing', 'invoices', 'payments'],
      difficulty: 'beginner' as const
    }
  ],

  settings: [
    {
      id: 'settings-profile',
      title: 'Profile Settings',
      description: 'Managing your account profile and personal information',
      type: 'guide' as const,
      content: `Profile Settings allow you to:

• Update personal information
• Change profile picture
• Modify contact details
• Set notification preferences
• Configure privacy settings

Security Settings:
- Change password
- Enable two-factor authentication
- Review login sessions
- Set up backup email

Keep your profile updated for better user experience and security.`,
      category: 'Account Management',
      tags: ['profile', 'settings', 'account'],
      difficulty: 'beginner' as const
    }
  ]
};

export function getHelpForPage(page: string): HelpItem[] {
  return helpContent[page as keyof typeof helpContent] || [];
}
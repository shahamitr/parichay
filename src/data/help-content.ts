
export interface HelpSection {
    title: string;
    content: string;
}

export interface RoleGuide {
    role: 'Admin' | 'Executive';
    sections: HelpSection[];
}

export interface ModuleHelp {
    title: string;
    description: string;
    guides: RoleGuide[];
}

export const helpContent: Record<string, ModuleHelp> = {
    dashboard: {
        title: 'Dashboard Overview',
        description: 'Your central command center for managing brands, branches, and performance metrics.',
        guides: [
            {
                role: 'Admin',
                sections: [
                    {
                        title: 'Monitoring Performance',
                        content: 'View real-time analytics, including total visitors, lead generation stats, and active subscriptions. Use the charts to identify trends over time.'
                    },
                    {
                        title: 'Quick Actions',
                        content: 'Use the "Quick Actions" card to rapidly add new brands, create branches, or generate QR codes without navigating through menus.'
                    },
                    {
                        title: 'System Health',
                        content: 'Monitor the status of your subscriptions and system notifications to ensure uninterrupted service.'
                    }
                ]
            },
            {
                role: 'Executive',
                sections: [
                    {
                        title: 'Daily Overview',
                        content: 'Check your assigned branches and their performance. See how many new leads have come in today.'
                    },
                    {
                        title: 'Recent Activity',
                        content: 'Review the latest updates and notifications relevant to your assigned tasks.'
                    }
                ]
            }
        ]
    },
    brands: {
        title: 'Brand Management',
        description: 'Create and manage your digital brand identities.',
        guides: [
            {
                role: 'Admin',
                sections: [
                    {
                        title: 'Creating a Brand',
                        content: 'Click "Create Brand" to start. You will need to provide a name, logo, and color theme. This establishes the visual identity for all associated branches.'
                    },
                    {
                        title: 'Custom Domains',
                        content: 'You can link a custom domain (e.g., card.yourcompany.com) to your brand for a professional look. This requires DNS configuration.'
                    },
                    {
                        title: 'Theme Customization',
                        content: 'Adjust the primary, secondary, and accent colors to match your corporate branding. These settings propagate to all microsites.'
                    }
                ]
            },
            {
                role: 'Executive',
                sections: [
                    {
                        title: 'Viewing Brands',
                        content: 'You can view the brands you are assigned to. Use this to verify that logos and details are up to date.'
                    }
                ]
            }
        ]
    },
    branches: {
        title: 'Branch & Microsite Management',
        description: 'Manage individual location profiles and their microsite content.',
        guides: [
            {
                role: 'Admin',
                sections: [
                    {
                        title: 'Adding a Branch',
                        content: 'Add physical or digital branch locations. Each branch gets its own unique URL and QR code.'
                    },
                    {
                        title: 'Microsite Configuration',
                        content: 'Enable or disable sections (About, Services, Contact) for each branch. Customize the content to be specific to that location.'
                    },
                    {
                        title: 'Assigning Executives',
                        content: 'Assign executives to specific branches to delegate management of leads and content updates.'
                    }
                ]
            },
            {
                role: 'Executive',
                sections: [
                    {
                        title: 'Updating Content',
                        content: 'Keep branch information current. Update business hours, contact details, and service offerings regularly.'
                    },
                    {
                        title: 'Media Management',
                        content: 'Upload photos and videos to the gallery to showcase the branch environment and products.'
                    }
                ]
            }
        ]
    },
    leads: {
        title: 'Lead Management',
        description: 'Track and manage inquiries captured through your digital cards.',
        guides: [
            {
                role: 'Admin',
                sections: [
                    {
                        title: 'Lead Analytics',
                        content: 'Analyze lead sources (QR scan, Direct Link, Social Share) to understand which channels are most effective.'
                    },
                    {
                        title: 'Exporting Data',
                        content: 'Export lead data to CSV for integration with your CRM or marketing tools.'
                    }
                ]
            },
            {
                role: 'Executive',
                sections: [
                    {
                        title: 'Responding to Leads',
                        content: 'View incoming messages and contact details. Follow up promptly via phone or email directly from the dashboard.'
                    },
                    {
                        title: 'Status Tracking',
                        content: 'Mark leads as "Contacted" or "Converted" to keep the team organized.'
                    }
                ]
            }
        ]
    },
    'short-links': {
        title: 'Short Links',
        description: 'Create branded short URLs for marketing campaigns.',
        guides: [
            {
                role: 'Admin',
                sections: [
                    {
                        title: 'Creating Links',
                        content: 'Generate short, memorable URLs (e.g., yourbrand.com/sale) that redirect to specific pages or external content.'
                    },
                    {
                        title: 'Tracking Clicks',
                        content: 'Monitor click-through rates to measure the success of your marketing campaigns.'
                    }
                ]
            },
            {
                role: 'Executive',
                sections: [
                    {
                        title: 'Sharing Links',
                        content: 'Use these short links in SMS, WhatsApp, or social media posts for cleaner, trackable sharing.'
                    }
                ]
            }
        ]
    },
    social: {
        title: 'Social & Reviews',
        description: 'Manage customer reviews and social proof elements.',
        guides: [
            {
                role: 'Admin',
                sections: [
                    {
                        title: 'Review Moderation',
                        content: 'Approve or hide reviews before they appear on your public microsites. Respond to feedback to build trust.'
                    },
                    {
                        title: 'Social Proof Badges',
                        content: 'Add badges like "Verified Business" or "Top Rated" to enhance credibility.'
                    }
                ]
            },
            {
                role: 'Executive',
                sections: [
                    {
                        title: 'Monitoring Feedback',
                        content: 'Keep an eye on new reviews. Alert admins to any critical feedback that needs immediate attention.'
                    }
                ]
            }
        ]
    },
    settings: {
        title: 'Settings',
        description: 'Configure system-wide preferences and user profile settings.',
        guides: [
            {
                role: 'Admin',
                sections: [
                    {
                        title: 'User Management',
                        content: 'Invite new users, assign roles (Admin, Manager, Executive), and manage access permissions.'
                    },
                    {
                        title: 'Billing & Subscription',
                        content: 'Manage your plan, view invoices, and update payment methods.'
                    }
                ]
            },
            {
                role: 'Executive',
                sections: [
                    {
                        title: 'Profile Settings',
                        content: 'Update your personal information, change your password, and manage notification preferences.'
                    }
                ]
            }
        ]
    }
};

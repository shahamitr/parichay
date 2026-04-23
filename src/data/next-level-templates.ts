import { MicrositeTemplate } from '@/types/template';

// PHASE 1: IMMEDIATE HIGH-IMPACT TEMPLATES
export const phase1Templates: MicrositeTemplate[] = [
  // 1. AI & Tech Services Template
  {
    id: 'ai-tech-services',
    name: 'AI & Tech Solutions',
    description: 'Cutting-edge template for AI consultants, tech startups, and digital transformation services',
    category: 'technology',
    previewImage: '/templates/ai-tech-preview.jpg',
    thumbnailImage: '/templates/ai-tech-thumb.jpg',
    isPremium: true,
    features: ['AI Service Showcase', 'Case Studies', 'ROI Calculator', 'Tech Stack Display', 'Consultation Booking', 'White Papers'],
    defaultConfig: {
      templateId: 'ai-tech-services',
      seoSettings: {
        title: 'TechVision AI - Artificial Intelligence & Digital Transformation Solutions',
        description: 'Leading AI consulting firm specializing in machine learning, automation, and digital transformation. Transform your business with cutting-edge AI solutions.',
        keywords: ['artificial intelligence', 'machine learning', 'AI consulting', 'digital transformation', 'automation', 'data analytics', 'AI solutions']
      },
      sections: {
        hero: {
          enabled: true,
          title: 'TechVision AI',
          subtitle: 'Transforming Businesses with Artificial Intelligence',
          backgroundType: 'gradient',
          animationEnabled: true
        },
        about: {
          enabled: true,
          content: 'TechVision AI is a leading artificial intelligence consulting firm that helps businesses harness the power of AI to drive innovation, efficiency, and growth. Our team of AI experts, data scientists, and machine learning engineers work with organizations to implement cutting-edge AI solutions that solve real-world business challenges and create competitive advantages.'
        },
        services: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'AI Strategy Consulting',
              description: 'Comprehensive AI roadmap and implementation strategy',
              price: 50000,
              image: '/services/ai-strategy.jpg',
              features: ['AI Readiness Assessment', 'Custom AI Roadmap', 'ROI Analysis', 'Implementation Planning'],
              category: 'Consulting'
            },
            {
              id: '2',
              name: 'Machine Learning Solutions',
              description: 'Custom ML models for predictive analytics and automation',
              price: 75000,
              image: '/services/machine-learning.jpg',
              features: ['Custom ML Models', 'Predictive Analytics', 'Data Pipeline Setup', 'Model Deployment'],
              category: 'Development'
            },
            {
              id: '3',
              name: 'Process Automation',
              description: 'Intelligent automation for business processes',
              price: 40000,
              image: '/services/automation.jpg',
              features: ['RPA Implementation', 'Workflow Optimization', 'Bot Development', 'Integration Services'],
              category: 'Automation'
            },
            {
              id: '4',
              name: 'AI Training & Workshops',
              description: 'Comprehensive AI training for your team',
              price: 25000,
              image: '/services/ai-training.jpg',
              features: ['Executive Workshops', 'Technical Training', 'Hands-on Labs', 'Certification Programs'],
              category: 'Training'
            }
          ]
        },
        portfolio: {
          enabled: true,
          layout: 'grid',
          items: [
            {
              id: '1',
              title: 'Retail AI Analytics Platform',
              description: 'AI-powered customer behavior analysis for major retail chain',
              category: 'Retail AI',
              images: ['/portfolio/retail-ai.jpg'],
              featured: true,
              tags: ['Machine Learning', 'Customer Analytics', 'Retail', 'Predictive Modeling'],
              clientName: 'MegaMart Retail',
              projectDate: '2024-01-15'
            },
            {
              id: '2',
              title: 'Healthcare Diagnostic AI',
              description: 'Medical image analysis system for early disease detection',
              category: 'Healthcare AI',
              images: ['/portfolio/healthcare-ai.jpg'],
              featured: true,
              tags: ['Computer Vision', 'Medical AI', 'Deep Learning', 'Diagnostics'],
              clientName: 'City General Hospital',
              projectDate: '2024-02-20'
            }
          ],
          categories: ['Retail AI', 'Healthcare AI', 'Finance AI', 'Manufacturing AI']
        },
        testimonials: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Sarah Johnson',
              role: 'CTO, RetailTech Corp',
              content: 'TechVision AI transformed our business operations with their intelligent automation solutions. We saw 40% efficiency improvement within 3 months.',
              rating: 5,
              photo: '/testimonials/ai-client-1.jpg'
            },
            {
              id: '2',
              name: 'Dr. Rajesh Patel',
              role: 'Director, MedTech Solutions',
              content: 'Their AI diagnostic system has revolutionized our patient care. The accuracy and speed of diagnosis has improved dramatically.',
              rating: 5,
              photo: '/testimonials/ai-client-2.jpg'
            }
          ]
        },
        booking: {
          enabled: true,
          title: 'Schedule AI Consultation',
          subtitle: 'Discover how AI can transform your business'
        },
        contact: {
          enabled: true,
          showMap: true,
          leadForm: {
            enabled: true,
            fields: ['name', 'company', 'phone', 'email', 'industry', 'ai_interest', 'budget_range', 'timeline']
          }
        }
      }
    }
  },

  // 2. Mental Health & Wellness Template
  {
    id: 'mental-wellness',
    name: 'Mental Health Professional',
    description: 'Specialized template for therapists, counselors, and wellness coaches',
    category: 'healthcare',
    previewImage: '/templates/mental-wellness-preview.jpg',
    thumbnailImage: '/templates/mental-wellness-thumb.jpg',
    isPremium: false,
    features: ['Secure Appointment Booking', 'Therapy Session Types', 'Wellness Resources', 'Progress Tracking', 'Confidential Contact Forms', 'Insurance Information'],
    defaultConfig: {
      templateId: 'mental-wellness',
      seoSettings: {
        title: 'Dr. Priya Wellness - Licensed Therapist & Mental Health Counselor',
        description: 'Professional mental health counseling and therapy services. Anxiety, depression, relationship counseling, and wellness coaching in a safe, confidential environment.',
        keywords: ['mental health', 'therapy', 'counseling', 'anxiety treatment', 'depression help', 'relationship counseling', 'wellness coaching']
      },
      sections: {
        hero: {
          enabled: true,
          title: 'Dr. Priya Wellness Center',
          subtitle: 'Your Journey to Mental Wellness Starts Here',
          backgroundType: 'gradient'
        },
        about: {
          enabled: true,
          content: 'Dr. Priya Sharma is a licensed clinical psychologist with over 12 years of experience helping individuals navigate life\'s challenges. Specializing in anxiety, depression, trauma recovery, and relationship counseling, Dr. Priya provides a safe, non-judgmental space where healing and growth can flourish. Her approach combines evidence-based therapies with compassionate care to support your mental wellness journey.'
        },
        services: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Individual Therapy',
              description: 'One-on-one counseling sessions for personal growth and healing',
              price: 3000,
              image: '/services/individual-therapy.jpg',
              features: ['Cognitive Behavioral Therapy', 'Mindfulness Techniques', 'Trauma-Informed Care', 'Goal-Oriented Sessions'],
              category: 'Therapy'
            },
            {
              id: '2',
              name: 'Couples Counseling',
              description: 'Relationship therapy to strengthen bonds and resolve conflicts',
              price: 4000,
              image: '/services/couples-therapy.jpg',
              features: ['Communication Skills', 'Conflict Resolution', 'Intimacy Building', 'Relationship Strengthening'],
              category: 'Relationships'
            },
            {
              id: '3',
              name: 'Anxiety & Depression Treatment',
              description: 'Specialized treatment for anxiety disorders and depression',
              price: 3500,
              image: '/services/anxiety-treatment.jpg',
              features: ['Anxiety Management', 'Depression Recovery', 'Coping Strategies', 'Medication Coordination'],
              category: 'Specialized Care'
            },
            {
              id: '4',
              name: 'Online Therapy Sessions',
              description: 'Secure video counseling from the comfort of your home',
              price: 2500,
              image: '/services/online-therapy.jpg',
              features: ['HIPAA Compliant Platform', 'Flexible Scheduling', 'Secure Video Sessions', 'Digital Resources'],
              category: 'Telehealth'
            }
          ]
        },
        aboutFounder: {
          enabled: true,
          name: 'Dr. Priya Sharma',
          title: 'Licensed Clinical Psychologist',
          bio: 'Dr. Priya Sharma holds a Ph.D. in Clinical Psychology and is licensed to practice in multiple states. She has extensive experience in treating anxiety, depression, trauma, and relationship issues.',
          education: 'Ph.D. Clinical Psychology - University of Delhi, M.A. Psychology - Jamia Millia Islamia',
          experience: '12+ years in clinical practice, specializing in anxiety and depression treatment',
          achievements: [
            'Licensed Clinical Psychologist - State Board Certified',
            'Certified in Cognitive Behavioral Therapy (CBT)',
            'Trauma-Informed Care Specialist',
            'Published researcher in anxiety treatment methods'
          ],
          photo: '/doctors/dr-priya-wellness.jpg'
        },
        testimonials: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Anonymous Client',
              role: 'Therapy Client',
              content: 'Dr. Priya helped me overcome my anxiety and depression. Her compassionate approach and effective techniques changed my life completely.',
              rating: 5,
              photo: '/testimonials/anonymous-1.jpg'
            },
            {
              id: '2',
              name: 'Anonymous Couple',
              role: 'Couples Therapy',
              content: 'Our marriage was struggling, but Dr. Priya\'s couples counseling helped us rebuild our relationship stronger than ever.',
              rating: 5,
              photo: '/testimonials/anonymous-2.jpg'
            }
          ]
        },
        booking: {
          enabled: true,
          title: 'Schedule Your Session',
          subtitle: 'Take the first step towards better mental health'
        },
        contact: {
          enabled: true,
          showMap: false,
          leadForm: {
            enabled: true,
            fields: ['name', 'phone', 'email', 'age', 'concern_type', 'preferred_session_type', 'insurance_provider', 'preferred_time']
          }
        }
      }
    }
  },

  // 3. Home Services Professional Template
  {
    id: 'home-services-pro',
    name: 'Home Services Professional',
    description: 'Template for plumbers, electricians, cleaners, and home service providers',
    category: 'services',
    previewImage: '/templates/home-services-preview.jpg',
    thumbnailImage: '/templates/home-services-thumb.jpg',
    isPremium: false,
    features: ['Service Area Map', 'Emergency Availability', 'Before/After Gallery', 'Instant Quotes', 'License & Insurance Display', 'Customer Reviews'],
    defaultConfig: {
      templateId: 'home-services-pro',
      seoSettings: {
        title: 'QuickFix Home Services - Professional Plumbing, Electrical & Repair Services',
        description: 'Trusted home service professionals for plumbing, electrical, HVAC, and general repairs. Licensed, insured, and available 24/7 for emergencies.',
        keywords: ['home services', 'plumber', 'electrician', 'home repair', 'emergency services', 'licensed contractor', 'home maintenance']
      },
      sections: {
        hero: {
          enabled: true,
          title: 'QuickFix Home Services',
          subtitle: 'Professional Home Repairs & Maintenance - Available 24/7',
          backgroundType: 'image',
          backgroundImage: '/templates/home-services-hero.jpg'
        },
        about: {
          enabled: true,
          content: 'QuickFix Home Services has been serving homeowners for over many years with reliable, professional home repair and maintenance services. Our licensed and insured technicians are available 24/7 for emergencies and provide quality workmanship with upfront pricing. From plumbing and electrical to HVAC and general repairs, we\'re your trusted partner for all home service needs.'
        },
        services: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Plumbing Services',
              description: 'Complete plumbing solutions for residential properties',
              price: 150,
              image: '/services/plumbing.jpg',
              features: ['Leak Repairs', 'Drain Cleaning', 'Pipe Installation', 'Water Heater Service'],
              category: 'Plumbing'
            },
            {
              id: '2',
              name: 'Electrical Services',
              description: 'Licensed electrical work and safety inspections',
              price: 200,
              image: '/services/electrical.jpg',
              features: ['Wiring Installation', 'Panel Upgrades', 'Outlet Installation', 'Safety Inspections'],
              category: 'Electrical'
            },
            {
              id: '3',
              name: 'HVAC Services',
              description: 'Heating, ventilation, and air conditioning services',
              price: 180,
              image: '/services/hvac.jpg',
              features: ['AC Repair', 'Heating Installation', 'Duct Cleaning', 'Maintenance Plans'],
              category: 'HVAC'
            },
            {
              id: '4',
              name: 'Emergency Services',
              description: '24/7 emergency home repair services',
              price: 250,
              image: '/services/emergency.jpg',
              features: ['24/7 Availability', 'Rapid Response', 'Emergency Repairs', 'Water Damage Control'],
              category: 'Emergency'
            }
          ]
        },
        gallery: {
          enabled: true,
          images: [
            '/gallery/plumbing-before-after-1.jpg',
            '/gallery/electrical-installation-1.jpg',
            '/gallery/hvac-repair-1.jpg',
            '/gallery/bathroom-renovation-1.jpg',
            '/gallery/kitchen-plumbing-1.jpg',
            '/gallery/electrical-panel-upgrade-1.jpg'
          ]
        },
        trustIndicators: {
          enabled: true,
          certifications: [
            {
              id: '1',
              name: 'Licensed Contractor',
              logo: '/certifications/contractor-license.jpg',
              description: 'State Licensed General Contractor'
            },
            {
              id: '2',
              name: 'Fully Insured',
              logo: '/certifications/insurance.jpg',
              description: 'Comprehensive Liability Insurance'
            },
            {
              id: '3',
              name: 'BBB Accredited',
              logo: '/certifications/bbb.jpg',
              description: 'Better Business Bureau A+ Rating'
            }
          ]
        },
        testimonials: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Michael Chen',
              role: 'Homeowner',
              content: 'QuickFix saved the day when our water heater failed. They arrived within an hour and had it fixed professionally. Highly recommend!',
              rating: 5,
              photo: '/testimonials/homeowner-1.jpg'
            },
            {
              id: '2',
              name: 'Lisa Rodriguez',
              role: 'Property Manager',
              content: 'We use QuickFix for all our rental properties. They\'re reliable, fairly priced, and always do quality work. Great service!',
              rating: 5,
              photo: '/testimonials/homeowner-2.jpg'
            }
          ]
        },
        contact: {
          enabled: true,
          showMap: true,
          leadForm: {
            enabled: true,
            fields: ['name', 'phone', 'email', 'address', 'service_needed', 'urgency_level', 'preferred_time', 'description']
          }
        }
      }
    }
  }
];

// PHASE 2: NEXT QUARTER GROWTH MARKETS
export const phase2Templates: MicrositeTemplate[] = [
  // 4. Sustainability & Green Business Template
  {
    id: 'green-sustainability',
    name: 'Eco-Friendly Business',
    description: 'Template for renewable energy, waste management, and sustainable businesses',
    category: 'sustainability',
    previewImage: '/templates/green-sustainability-preview.jpg',
    thumbnailImage: '/templates/green-sustainability-thumb.jpg',
    isPremium: true,
    features: ['Carbon Footprint Calculator', 'Sustainability Metrics', 'Green Certifications', 'Environmental Impact Display', 'Eco-Product Catalog'],
    defaultConfig: {
      templateId: 'green-sustainability',
      seoSettings: {
        title: 'EcoGreen Solutions - Sustainable Business & Environmental Services',
        description: 'Leading provider of sustainable business solutions, renewable energy, and environmental consulting. Help your business go green and reduce carbon footprint.',
        keywords: ['sustainability', 'renewable energy', 'carbon footprint', 'green business', 'environmental consulting', 'eco-friendly', 'ESG compliance']
      },
      sections: {
        hero: {
          enabled: true,
          title: 'EcoGreen Solutions',
          subtitle: 'Building a Sustainable Future for Your Business',
          backgroundType: 'image',
          backgroundImage: '/templates/green-hero.jpg'
        },
        about: {
          enabled: true,
          content: 'EcoGreen Solutions is a pioneering sustainability consulting firm dedicated to helping businesses transition to environmentally responsible practices. We provide comprehensive solutions for carbon footprint reduction, renewable energy implementation, waste management optimization, and ESG compliance. Our mission is to create a sustainable future while driving business growth and profitability.'
        },
        services: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Carbon Footprint Assessment',
              description: 'Comprehensive analysis of your business carbon emissions',
              price: 25000,
              image: '/services/carbon-assessment.jpg',
              features: ['Emission Calculation', 'Reduction Strategies', 'Compliance Reporting', 'Monitoring Systems'],
              category: 'Assessment'
            },
            {
              id: '2',
              name: 'Renewable Energy Solutions',
              description: 'Solar, wind, and clean energy implementation',
              price: 150000,
              image: '/services/renewable-energy.jpg',
              features: ['Solar Panel Installation', 'Energy Storage Systems', 'Grid Integration', 'ROI Analysis'],
              category: 'Energy'
            },
            {
              id: '3',
              name: 'Waste Management Optimization',
              description: 'Sustainable waste reduction and recycling programs',
              price: 35000,
              image: '/services/waste-management.jpg',
              features: ['Waste Audit', 'Recycling Programs', 'Circular Economy', 'Cost Reduction'],
              category: 'Waste'
            },
            {
              id: '4',
              name: 'ESG Compliance Consulting',
              description: 'Environmental, Social, and Governance compliance',
              price: 45000,
              image: '/services/esg-compliance.jpg',
              features: ['ESG Framework', 'Sustainability Reporting', 'Stakeholder Engagement', 'Risk Assessment'],
              category: 'Compliance'
            }
          ]
        },
        impact: {
          enabled: true,
          metrics: [
            { value: '500+', label: 'Tons CO2 Reduced', icon: '🌱' },
            { value: '50MW', label: 'Clean Energy Installed', icon: '⚡' },
            { value: '200+', label: 'Businesses Transformed', icon: '🏢' },
            { value: '95%', label: 'Client Satisfaction', icon: '⭐' }
          ]
        },
        portfolio: {
          enabled: true,
          layout: 'grid',
          items: [
            {
              id: '1',
              title: 'Manufacturing Plant Solar Installation',
              description: '2MW solar installation reducing 80% energy costs',
              category: 'Renewable Energy',
              images: ['/portfolio/solar-manufacturing.jpg'],
              featured: true,
              tags: ['Solar Energy', 'Manufacturing', 'Cost Reduction', 'Sustainability'],
              clientName: 'GreenTech Manufacturing',
              projectDate: '2024-03-10'
            },
            {
              id: '2',
              title: 'Corporate Campus Sustainability',
              description: 'Complete sustainability transformation for tech campus',
              category: 'ESG Compliance',
              images: ['/portfolio/corporate-sustainability.jpg'],
              featured: true,
              tags: ['ESG', 'Corporate', 'Waste Reduction', 'Energy Efficiency'],
              clientName: 'TechCorp Industries',
              projectDate: '2024-04-15'
            }
          ],
          categories: ['Renewable Energy', 'ESG Compliance', 'Waste Management', 'Carbon Reduction']
        },
        testimonials: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'David Kumar',
              role: 'CEO, GreenTech Manufacturing',
              content: 'EcoGreen Solutions helped us achieve carbon neutrality while reducing operational costs by 30%. Their expertise is unmatched.',
              rating: 5,
              photo: '/testimonials/sustainability-client-1.jpg'
            },
            {
              id: '2',
              name: 'Maria Santos',
              role: 'Sustainability Director, TechCorp',
              content: 'Their comprehensive ESG compliance program positioned us as an industry leader in sustainability. Excellent results!',
              rating: 5,
              photo: '/testimonials/sustainability-client-2.jpg'
            }
          ]
        },
        contact: {
          enabled: true,
          showMap: true,
          leadForm: {
            enabled: true,
            fields: ['name', 'company', 'phone', 'email', 'industry', 'sustainability_goal', 'current_initiatives', 'budget_range']
          }
        }
      }
    }
  },

  // 5. Creator Economy Template
  {
    id: 'content-creator',
    name: 'Digital Creator Hub',
    description: 'Template for influencers, content creators, and digital entrepreneurs',
    category: 'creative',
    previewImage: '/templates/content-creator-preview.jpg',
    thumbnailImage: '/templates/content-creator-thumb.jpg',
    isPremium: true,
    features: ['Content Portfolio', 'Brand Collaboration Showcase', 'Monetization Options', 'Social Media Integration', 'Fan Engagement Tools', 'Media Kit Generator'],
    defaultConfig: {
      templateId: 'content-creator',
      seoSettings: {
        title: 'Alex Creative - Digital Content Creator & Influencer',
        description: 'Professional content creator specializing in lifestyle, tech, and travel content. Available for brand collaborations, sponsored content, and creative partnerships.',
        keywords: ['content creator', 'influencer', 'brand collaboration', 'social media', 'digital marketing', 'sponsored content', 'creative services']
      },
      sections: {
        hero: {
          enabled: true,
          title: 'Alex Creative',
          subtitle: 'Creating Engaging Content That Inspires & Connects',
          backgroundType: 'video',
          backgroundVideo: '/templates/creator-hero-video.mp4'
        },
        about: {
          enabled: true,
          content: 'Alex is a passionate digital content creator with over 500K followers across platforms, specializing in lifestyle, technology, and travel content. With 5+ years of experience in content creation and brand partnerships, Alex creates authentic, engaging content that resonates with audiences and drives meaningful results for brand collaborators.'
        },
        services: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Sponsored Content Creation',
              description: 'High-quality sponsored posts and videos for brands',
              price: 15000,
              image: '/services/sponsored-content.jpg',
              features: ['Custom Content Creation', 'Multi-Platform Publishing', 'Performance Analytics', 'Brand Guidelines Compliance'],
              category: 'Content'
            },
            {
              id: '2',
              name: 'Brand Ambassador Programs',
              description: 'Long-term brand partnership and representation',
              price: 50000,
              image: '/services/brand-ambassador.jpg',
              features: ['Monthly Content Calendar', 'Event Appearances', 'Product Integration', 'Audience Engagement'],
              category: 'Partnership'
            },
            {
              id: '3',
              name: 'Content Strategy Consulting',
              description: 'Strategic guidance for content marketing success',
              price: 25000,
              image: '/services/content-strategy.jpg',
              features: ['Content Audit', 'Strategy Development', 'Platform Optimization', 'Growth Planning'],
              category: 'Consulting'
            },
            {
              id: '4',
              name: 'Photography & Videography',
              description: 'Professional visual content creation services',
              price: 20000,
              image: '/services/photography.jpg',
              features: ['Product Photography', 'Lifestyle Shoots', 'Video Production', 'Post-Production Editing'],
              category: 'Production'
            }
          ]
        },
        portfolio: {
          enabled: true,
          layout: 'masonry',
          items: [
            {
              id: '1',
              title: 'Tech Product Launch Campaign',
              description: 'Multi-platform campaign for smartphone launch',
              category: 'Tech Content',
              images: ['/portfolio/tech-campaign.jpg'],
              featured: true,
              tags: ['Technology', 'Product Launch', 'Video Content', 'Social Media'],
              clientName: 'TechBrand Mobile',
              projectDate: '2024-05-20'
            },
            {
              id: '2',
              title: 'Travel Destination Series',
              description: 'Immersive travel content for tourism board',
              category: 'Travel Content',
              images: ['/portfolio/travel-series.jpg'],
              featured: true,
              tags: ['Travel', 'Tourism', 'Storytelling', 'Photography'],
              clientName: 'Visit Paradise Tourism',
              projectDate: '2024-06-10'
            }
          ],
          categories: ['Tech Content', 'Lifestyle Content', 'Travel Content', 'Brand Collaborations']
        },
        impact: {
          enabled: true,
          metrics: [
            { value: '500K+', label: 'Total Followers', icon: '👥' },
            { value: '2M+', label: 'Monthly Reach', icon: '📈' },
            { value: '8.5%', label: 'Engagement Rate', icon: '❤️' },
            { value: '100+', label: 'Brand Partnerships', icon: '🤝' }
          ]
        },
        testimonials: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Jennifer Park',
              role: 'Marketing Director, TechBrand',
              content: 'Alex\'s content perfectly captured our brand essence. The campaign exceeded all engagement metrics and drove significant sales.',
              rating: 5,
              photo: '/testimonials/creator-client-1.jpg'
            },
            {
              id: '2',
              name: 'Carlos Rodriguez',
              role: 'Brand Manager, Lifestyle Co.',
              content: 'Working with Alex was seamless. Professional, creative, and delivered content that truly resonated with our target audience.',
              rating: 5,
              photo: '/testimonials/creator-client-2.jpg'
            }
          ]
        },
        contact: {
          enabled: true,
          showMap: false,
          leadForm: {
            enabled: true,
            fields: ['name', 'company', 'phone', 'email', 'collaboration_type', 'budget_range', 'timeline', 'campaign_details']
          }
        }
      }
    }
  },

  // 6. Pet Care & Veterinary Template
  {
    id: 'pet-veterinary',
    name: 'Pet Care Professional',
    description: 'Template for veterinarians, pet grooming, and animal care services',
    category: 'pet-care',
    previewImage: '/templates/pet-veterinary-preview.jpg',
    thumbnailImage: '/templates/pet-veterinary-thumb.jpg',
    isPremium: false,
    features: ['Pet Health Records', 'Appointment Booking', 'Emergency Care Info', 'Pet Care Tips', 'Vaccination Schedules', 'Pet Insurance Integration'],
    defaultConfig: {
      templateId: 'pet-veterinary',
      seoSettings: {
        title: 'Paws & Care Veterinary Clinic - Complete Pet Healthcare Services',
        description: 'Comprehensive veterinary care for dogs, cats, and exotic pets. Emergency services, preventive care, surgery, and grooming in a caring environment.',
        keywords: ['veterinarian', 'pet care', 'animal hospital', 'dog care', 'cat care', 'pet grooming', 'emergency vet', 'pet vaccination']
      },
      sections: {
        hero: {
          enabled: true,
          title: 'Paws & Care Veterinary Clinic',
          subtitle: 'Compassionate Care for Your Beloved Pets',
          backgroundType: 'image',
          backgroundImage: '/templates/pet-care-hero.jpg'
        },
        about: {
          enabled: true,
          content: 'Paws & Care Veterinary Clinic has been providing exceptional pet healthcare for over 20 years. Our team of experienced veterinarians and caring staff are dedicated to keeping your furry, feathered, and scaled family members healthy and happy. We offer comprehensive services from routine check-ups to emergency care, all in a warm, welcoming environment designed with your pet\'s comfort in mind.'
        },
        services: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Wellness Examinations',
              description: 'Comprehensive health check-ups for preventive care',
              price: 1500,
              image: '/services/pet-wellness.jpg',
              features: ['Physical Examination', 'Vaccination Updates', 'Health Screening', 'Nutritional Counseling'],
              category: 'Preventive Care'
            },
            {
              id: '2',
              name: 'Emergency Services',
              description: '24/7 emergency veterinary care for critical situations',
              price: 5000,
              image: '/services/pet-emergency.jpg',
              features: ['24/7 Availability', 'Critical Care', 'Emergency Surgery', 'Intensive Monitoring'],
              category: 'Emergency'
            },
            {
              id: '3',
              name: 'Pet Grooming',
              description: 'Professional grooming services for all breeds',
              price: 2000,
              image: '/services/pet-grooming.jpg',
              features: ['Full Service Grooming', 'Nail Trimming', 'Ear Cleaning', 'Flea & Tick Treatment'],
              category: 'Grooming'
            },
            {
              id: '4',
              name: 'Dental Care',
              description: 'Complete dental health services for pets',
              price: 3500,
              image: '/services/pet-dental.jpg',
              features: ['Dental Cleaning', 'Tooth Extraction', 'Oral Surgery', 'Dental X-rays'],
              category: 'Dental'
            }
          ]
        },
        team: {
          enabled: true,
          title: 'Our Caring Team',
          subtitle: 'Experienced veterinarians and staff who love animals',
          members: [
            {
              id: '1',
              name: 'Dr. Anjali Verma',
              role: 'Chief Veterinarian',
              bio: 'DVM with 15+ years experience in small animal medicine and surgery',
              photo: '/team/vet-1.jpg',
              email: 'dr.anjali@pawscare.com'
            },
            {
              id: '2',
              name: 'Dr. Rohit Singh',
              role: 'Emergency Veterinarian',
              bio: 'Specialist in emergency and critical care medicine',
              photo: '/team/vet-2.jpg',
              email: 'dr.rohit@pawscare.com'
            }
          ]
        },
        gallery: {
          enabled: true,
          images: [
            '/gallery/clinic-reception.jpg',
            '/gallery/examination-room.jpg',
            '/gallery/surgery-suite.jpg',
            '/gallery/grooming-area.jpg',
            '/gallery/recovery-room.jpg',
            '/gallery/happy-pets.jpg'
          ]
        },
        testimonials: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Ravi Sharma',
              role: 'Dog Owner',
              content: 'Dr. Anjali saved my dog\'s life during an emergency. The care and compassion shown by the entire team was incredible. Highly recommend!',
              rating: 5,
              photo: '/testimonials/pet-owner-1.jpg'
            },
            {
              id: '2',
              name: 'Meera Patel',
              role: 'Cat Owner',
              content: 'Best veterinary clinic in the city! My cats receive excellent care here. The staff is knowledgeable and truly cares about animals.',
              rating: 5,
              photo: '/testimonials/pet-owner-2.jpg'
            }
          ]
        },
        booking: {
          enabled: true,
          title: 'Schedule Pet Appointment',
          subtitle: 'Book a visit for your furry friend'
        },
        contact: {
          enabled: true,
          showMap: true,
          leadForm: {
            enabled: true,
            fields: ['owner_name', 'phone', 'email', 'pet_name', 'pet_type', 'pet_age', 'service_needed', 'preferred_date', 'emergency']
          }
        }
      }
    }
  }
];
// PHASE 3: FUTURE-READY PREMIUM TEMPLATES
export const phase3Templates: MicrositeTemplate[] = [
  // 7. Coworking Space Template
  {
    id: 'coworking-space',
    name: 'Modern Coworking Space',
    description: 'Template for coworking spaces, shared offices, and flexible workspaces',
    category: 'real-estate',
    previewImage: '/templates/coworking-preview.jpg',
    thumbnailImage: '/templates/coworking-thumb.jpg',
    isPremium: true,
    features: ['Space Booking System', 'Membership Plans', 'Virtual Tour', 'Community Events', 'Amenities Showcase', 'Hot Desk Availability'],
    defaultConfig: {
      templateId: 'coworking-space',
      seoSettings: {
        title: 'WorkHub Coworking - Premium Flexible Workspace & Office Solutions',
        description: 'Modern coworking space with flexible memberships, private offices, meeting rooms, and vibrant community. Perfect for freelancers, startups, and remote teams.',
        keywords: ['coworking space', 'shared office', 'flexible workspace', 'hot desk', 'private office', 'meeting rooms', 'business center']
      },
      sections: {
        hero: {
          enabled: true,
          title: 'WorkHub Coworking',
          subtitle: 'Where Innovation Meets Collaboration',
          backgroundType: 'image',
          backgroundImage: '/templates/coworking-hero.jpg'
        },
        about: {
          enabled: true,
          content: 'WorkHub Coworking is a premium flexible workspace designed for modern professionals, entrepreneurs, and growing businesses. Our thoughtfully designed spaces foster creativity, productivity, and meaningful connections. With state-of-the-art amenities, flexible membership options, and a vibrant community of like-minded professionals, WorkHub is more than just an office – it\'s where your best work happens.'
        },
        services: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Hot Desk Membership',
              description: 'Flexible desk access in our open workspace',
              price: 8000,
              image: '/services/hot-desk.jpg',
              features: ['24/7 Access', 'High-Speed WiFi', 'Printing Services', 'Coffee & Tea'],
              category: 'Flexible'
            },
            {
              id: '2',
              name: 'Dedicated Desk',
              description: 'Your own desk in our collaborative environment',
              price: 15000,
              image: '/services/dedicated-desk.jpg',
              features: ['Personal Storage', 'Desk Customization', 'Mail Handling', 'Priority Booking'],
              category: 'Dedicated'
            },
            {
              id: '3',
              name: 'Private Office',
              description: 'Fully furnished private offices for teams',
              price: 35000,
              image: '/services/private-office.jpg',
              features: ['Lockable Office', 'Custom Branding', 'Meeting Room Credits', 'Reception Services'],
              category: 'Private'
            },
            {
              id: '4',
              name: 'Meeting Rooms',
              description: 'Professional meeting and conference rooms',
              price: 1500,
              image: '/services/meeting-room.jpg',
              features: ['AV Equipment', 'Video Conferencing', 'Whiteboard', 'Catering Options'],
              category: 'Meetings'
            }
          ]
        },
        gallery: {
          enabled: true,
          images: [
            '/gallery/coworking-open-space.jpg',
            '/gallery/private-offices.jpg',
            '/gallery/meeting-room-1.jpg',
            '/gallery/lounge-area.jpg',
            '/gallery/phone-booths.jpg',
            '/gallery/event-space.jpg'
          ]
        },
        offers: {
          enabled: true,
          offers: [
            {
              id: '1',
              title: 'New Member Special',
              description: 'First month 50% off for new members',
              discountType: 'percentage',
              discountValue: 50,
              validFrom: '2024-01-01',
              validUntil: '2024-12-31',
              isActive: true,
              featured: true,
              imageUrl: '/offers/new-member-coworking.jpg'
            },
            {
              id: '2',
              title: 'Annual Membership Discount',
              description: '2 months free with annual membership',
              discountType: 'custom',
              validFrom: '2024-01-01',
              validUntil: '2024-12-31',
              isActive: true,
              featured: false,
              imageUrl: '/offers/annual-membership.jpg'
            }
          ]
        },
        testimonials: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Startup Founder',
              role: 'Tech Entrepreneur',
              content: 'WorkHub provided the perfect environment for our startup to grow. The community and networking opportunities are invaluable.',
              rating: 5,
              photo: '/testimonials/coworking-member-1.jpg'
            },
            {
              id: '2',
              name: 'Freelance Designer',
              role: 'Creative Professional',
              content: 'Love the creative atmosphere and professional amenities. It\'s the perfect balance of collaboration and focus.',
              rating: 5,
              photo: '/testimonials/coworking-member-2.jpg'
            }
          ]
        },
        booking: {
          enabled: true,
          title: 'Book a Tour',
          subtitle: 'Experience WorkHub before you commit'
        },
        contact: {
          enabled: true,
          showMap: true,
          leadForm: {
            enabled: true,
            fields: ['name', 'company', 'phone', 'email', 'membership_interest', 'team_size', 'move_in_date', 'tour_preference']
          }
        }
      }
    }
  },

  // 8. EdTech & Online Learning Template
  {
    id: 'edtech-learning',
    name: 'Online Learning Platform',
    description: 'Template for online courses, tutoring, and educational services',
    category: 'education',
    previewImage: '/templates/edtech-preview.jpg',
    thumbnailImage: '/templates/edtech-thumb.jpg',
    isPremium: true,
    features: ['Course Catalog', 'Instructor Profiles', 'Student Progress Tracking', 'Live Class Scheduling', 'Certification Display', 'Learning Resources'],
    defaultConfig: {
      templateId: 'edtech-learning',
      seoSettings: {
        title: 'LearnTech Academy - Online Courses & Professional Development',
        description: 'Transform your career with our comprehensive online courses. Expert instructors, hands-on projects, and industry-recognized certifications.',
        keywords: ['online learning', 'online courses', 'professional development', 'certification', 'skill development', 'e-learning', 'digital education']
      },
      sections: {
        hero: {
          enabled: true,
          title: 'LearnTech Academy',
          subtitle: 'Master New Skills, Advance Your Career',
          backgroundType: 'gradient'
        },
        about: {
          enabled: true,
          content: 'LearnTech Academy is a leading online education platform offering comprehensive courses in technology, business, and creative fields. Our expert instructors, interactive learning experiences, and industry-relevant curriculum help professionals and students acquire in-demand skills and advance their careers. With flexible scheduling and lifetime access to course materials, learning has never been more accessible.'
        },
        services: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Web Development Bootcamp',
              description: 'Complete full-stack web development program',
              price: 45000,
              image: '/courses/web-development.jpg',
              features: ['HTML/CSS/JavaScript', 'React & Node.js', 'Database Design', 'Portfolio Projects'],
              category: 'Technology'
            },
            {
              id: '2',
              name: 'Digital Marketing Mastery',
              description: 'Comprehensive digital marketing certification course',
              price: 25000,
              image: '/courses/digital-marketing.jpg',
              features: ['SEO & SEM', 'Social Media Marketing', 'Content Strategy', 'Analytics & ROI'],
              category: 'Marketing'
            },
            {
              id: '3',
              name: 'Data Science & Analytics',
              description: 'Master data analysis and machine learning',
              price: 55000,
              image: '/courses/data-science.jpg',
              features: ['Python & R Programming', 'Statistical Analysis', 'Machine Learning', 'Data Visualization'],
              category: 'Data Science'
            },
            {
              id: '4',
              name: 'UX/UI Design Fundamentals',
              description: 'Complete user experience and interface design course',
              price: 35000,
              image: '/courses/ux-ui-design.jpg',
              features: ['Design Thinking', 'Prototyping Tools', 'User Research', 'Portfolio Development'],
              category: 'Design'
            }
          ]
        },
        team: {
          enabled: true,
          title: 'Expert Instructors',
          subtitle: 'Learn from industry professionals and thought leaders',
          members: [
            {
              id: '1',
              name: 'Rahul Gupta',
              role: 'Senior Full-Stack Developer',
              bio: 'Former Google engineer with 10+ years experience in web development',
              photo: '/instructors/rahul-gupta.jpg'
            },
            {
              id: '2',
              name: 'Priya Sharma',
              role: 'Digital Marketing Expert',
              bio: 'Marketing director with expertise in growth hacking and brand building',
              photo: '/instructors/priya-sharma.jpg'
            }
          ]
        },
        impact: {
          enabled: true,
          metrics: [
            { value: 'Growing', label: 'Students Enrolled', icon: '👨‍🎓' },
            { value: '50+', label: 'Expert Instructors', icon: '👩‍🏫' },
            { value: '95%', label: 'Completion Rate', icon: '📈' },
            { value: '4.8/5', label: 'Average Rating', icon: '⭐' }
          ]
        },
        testimonials: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Amit Kumar',
              role: 'Software Developer',
              content: 'The web development bootcamp completely transformed my career. I landed a developer job within 3 months of completing the course.',
              rating: 5,
              photo: '/testimonials/student-1.jpg'
            },
            {
              id: '2',
              name: 'Sneha Patel',
              role: 'Marketing Manager',
              content: 'Excellent course content and supportive instructors. The digital marketing course helped me get promoted at work.',
              rating: 5,
              photo: '/testimonials/student-2.jpg'
            }
          ]
        },
        contact: {
          enabled: true,
          showMap: false,
          leadForm: {
            enabled: true,
            fields: ['name', 'phone', 'email', 'course_interest', 'experience_level', 'career_goal', 'preferred_schedule']
          }
        }
      }
    }
  },

  // 9. Luxury Services Template
  {
    id: 'luxury-concierge',
    name: 'Luxury Concierge Services',
    description: 'High-end template for luxury services, personal concierge, and VIP experiences',
    category: 'luxury',
    previewImage: '/templates/luxury-concierge-preview.jpg',
    thumbnailImage: '/templates/luxury-concierge-thumb.jpg',
    isPremium: true,
    features: ['Exclusive Service Catalog', 'VIP Membership Tiers', 'Personal Concierge Booking', 'Luxury Experience Gallery', 'Client Testimonials', 'Confidential Inquiries'],
    defaultConfig: {
      templateId: 'luxury-concierge',
      seoSettings: {
        title: 'Elite Concierge - Luxury Lifestyle & Personal Concierge Services',
        description: 'Exclusive concierge services for discerning clients. Personal assistance, luxury experiences, and bespoke solutions for the affluent lifestyle.',
        keywords: ['luxury concierge', 'personal assistant', 'VIP services', 'luxury lifestyle', 'exclusive experiences', 'high-end services', 'elite concierge']
      },
      sections: {
        hero: {
          enabled: true,
          title: 'Elite Concierge',
          subtitle: 'Exceptional Service for Exceptional Lives',
          backgroundType: 'image',
          backgroundImage: '/templates/luxury-hero.jpg'
        },
        about: {
          enabled: true,
          content: 'Elite Concierge provides unparalleled luxury lifestyle management and personal concierge services to discerning clients worldwide. Our dedicated team of professionals specializes in creating extraordinary experiences, managing complex logistics, and providing discreet, personalized assistance. From exclusive event planning to travel arrangements and daily lifestyle management, we ensure every detail exceeds expectations.'
        },
        services: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Personal Concierge Services',
              description: 'Dedicated personal assistant for daily lifestyle management',
              price: 150000,
              image: '/services/personal-concierge.jpg',
              features: ['24/7 Availability', 'Personal Shopping', 'Appointment Scheduling', 'Travel Coordination'],
              category: 'Personal'
            },
            {
              id: '2',
              name: 'Exclusive Event Planning',
              description: 'Bespoke event planning for luxury celebrations',
              price: 500000,
              image: '/services/luxury-events.jpg',
              features: ['Venue Selection', 'Celebrity Entertainment', 'Gourmet Catering', 'Complete Event Management'],
              category: 'Events'
            },
            {
              id: '3',
              name: 'Luxury Travel Experiences',
              description: 'Curated luxury travel and unique experiences',
              price: 300000,
              image: '/services/luxury-travel.jpg',
              features: ['Private Jet Arrangements', 'Exclusive Accommodations', 'VIP Access', 'Custom Itineraries'],
              category: 'Travel'
            },
            {
              id: '4',
              name: 'Lifestyle Management',
              description: 'Comprehensive lifestyle and household management',
              price: 200000,
              image: '/services/lifestyle-management.jpg',
              features: ['Property Management', 'Staff Coordination', 'Vendor Relations', 'Maintenance Oversight'],
              category: 'Lifestyle'
            }
          ]
        },
        portfolio: {
          enabled: true,
          layout: 'grid',
          items: [
            {
              id: '1',
              title: 'Exclusive Yacht Wedding',
              description: 'Luxury wedding celebration on private yacht in Monaco',
              category: 'Luxury Events',
              images: ['/portfolio/yacht-wedding.jpg'],
              featured: true,
              tags: ['Wedding', 'Yacht', 'Monaco', 'Exclusive'],
              clientName: 'Confidential',
              projectDate: '2024-07-15'
            },
            {
              id: '2',
              title: 'Private Island Retreat',
              description: 'Exclusive family vacation on private Caribbean island',
              category: 'Luxury Travel',
              images: ['/portfolio/private-island.jpg'],
              featured: true,
              tags: ['Private Island', 'Caribbean', 'Family Retreat', 'Exclusive'],
              clientName: 'Confidential',
              projectDate: '2024-08-20'
            }
          ],
          categories: ['Luxury Events', 'Luxury Travel', 'Personal Services', 'Lifestyle Management']
        },
        testimonials: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Anonymous Client',
              role: 'Business Executive',
              content: 'Elite Concierge has transformed how I manage my personal and professional life. Their attention to detail and discretion is unmatched.',
              rating: 5,
              photo: '/testimonials/luxury-client-1.jpg'
            },
            {
              id: '2',
              name: 'Confidential Client',
              role: 'Entrepreneur',
              content: 'The level of service and exclusivity they provide is extraordinary. They consistently exceed expectations with every request.',
              rating: 5,
              photo: '/testimonials/luxury-client-2.jpg'
            }
          ]
        },
        contact: {
          enabled: true,
          showMap: false,
          leadForm: {
            enabled: true,
            fields: ['name', 'phone', 'email', 'service_interest', 'budget_range', 'confidentiality_level', 'preferred_contact_method']
          }
        }
      }
    }
  }
];
// PHASE 4: EMERGING COMPETITIVE EDGE TEMPLATES
export const phase4Templates: MicrositeTemplate[] = [
  // 10. Senior Care & Eldercare Template
  {
    id: 'senior-eldercare',
    name: 'Senior Care Services',
    description: 'Template for eldercare, assisted living, and senior services',
    category: 'healthcare',
    previewImage: '/templates/senior-care-preview.jpg',
    thumbnailImage: '/templates/senior-care-thumb.jpg',
    isPremium: false,
    features: ['Care Services Overview', 'Staff Credentials', 'Family Communication Portal', 'Health Monitoring', 'Activity Schedules', 'Emergency Contacts'],
    defaultConfig: {
      templateId: 'senior-eldercare',
      seoSettings: {
        title: 'Golden Years Care - Compassionate Senior Care & Assisted Living Services',
        description: 'Dedicated senior care services providing compassionate assistance, health monitoring, and quality of life enhancement for elderly residents.',
        keywords: ['senior care', 'eldercare', 'assisted living', 'elderly care', 'nursing care', 'senior services', 'aging in place']
      },
      sections: {
        hero: {
          enabled: true,
          title: 'Golden Years Care',
          subtitle: 'Compassionate Care for Your Loved Ones',
          backgroundType: 'image',
          backgroundImage: '/templates/senior-care-hero.jpg'
        },
        about: {
          enabled: true,
          content: 'Golden Years Care is dedicated to providing exceptional senior care services that honor the dignity, independence, and well-being of every resident. Our compassionate team of certified caregivers, nurses, and support staff work together to create a warm, safe, and engaging environment where seniors can thrive. We understand that each individual has unique needs, and we tailor our care plans accordingly.'
        },
        services: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Personal Care Assistance',
              description: 'Daily living assistance and personal care support',
              price: 25000,
              image: '/services/personal-care.jpg',
              features: ['Bathing & Grooming', 'Medication Management', 'Mobility Assistance', 'Meal Preparation'],
              category: 'Personal Care'
            },
            {
              id: '2',
              name: 'Health Monitoring',
              description: 'Comprehensive health monitoring and medical coordination',
              price: 15000,
              image: '/services/health-monitoring.jpg',
              features: ['Vital Signs Monitoring', 'Medical Appointments', 'Health Records', 'Emergency Response'],
              category: 'Healthcare'
            },
            {
              id: '3',
              name: 'Social Activities',
              description: 'Engaging activities and social programs',
              price: 8000,
              image: '/services/social-activities.jpg',
              features: ['Group Activities', 'Exercise Programs', 'Cultural Events', 'Hobby Clubs'],
              category: 'Activities'
            },
            {
              id: '4',
              name: 'Memory Care',
              description: 'Specialized care for dementia and Alzheimer\'s patients',
              price: 35000,
              image: '/services/memory-care.jpg',
              features: ['Cognitive Stimulation', 'Behavioral Support', 'Safe Environment', 'Family Education'],
              category: 'Specialized'
            }
          ]
        },
        team: {
          enabled: true,
          title: 'Our Caring Team',
          subtitle: 'Experienced professionals dedicated to senior care',
          members: [
            {
              id: '1',
              name: 'Nurse Sunita Sharma',
              role: 'Director of Nursing',
              bio: 'RN with 20+ years experience in geriatric care and nursing management',
              photo: '/team/nurse-sunita.jpg'
            },
            {
              id: '2',
              name: 'Dr. Rajesh Kumar',
              role: 'Medical Director',
              bio: 'Geriatrician specializing in elderly care and age-related conditions',
              photo: '/team/dr-rajesh-senior.jpg'
            }
          ]
        },
        gallery: {
          enabled: true,
          images: [
            '/gallery/senior-dining-room.jpg',
            '/gallery/activity-room.jpg',
            '/gallery/garden-area.jpg',
            '/gallery/medical-room.jpg',
            '/gallery/recreation-area.jpg',
            '/gallery/senior-residents.jpg'
          ]
        },
        testimonials: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Ravi Patel',
              role: 'Family Member',
              content: 'Golden Years Care has been a blessing for our family. Mom is happy, healthy, and well-cared for. The staff treats her like family.',
              rating: 5,
              photo: '/testimonials/family-member-1.jpg'
            },
            {
              id: '2',
              name: 'Meera Singh',
              role: 'Daughter',
              content: 'The level of care and attention my father receives is exceptional. I have complete peace of mind knowing he\'s in good hands.',
              rating: 5,
              photo: '/testimonials/family-member-2.jpg'
            }
          ]
        },
        contact: {
          enabled: true,
          showMap: true,
          leadForm: {
            enabled: true,
            fields: ['family_contact_name', 'phone', 'email', 'senior_name', 'senior_age', 'care_needs', 'preferred_visit_date', 'insurance_info']
          }
        }
      }
    }
  },

  // 11. Crypto & Blockchain Services Template
  {
    id: 'crypto-blockchain',
    name: 'Blockchain Solutions',
    description: 'Template for crypto consultants, blockchain developers, and DeFi services',
    category: 'fintech',
    previewImage: '/templates/crypto-blockchain-preview.jpg',
    thumbnailImage: '/templates/crypto-blockchain-thumb.jpg',
    isPremium: true,
    features: ['Blockchain Portfolio', 'Crypto Consulting Services', 'DeFi Solutions', 'Smart Contract Development', 'Security Audits', 'Token Economics'],
    defaultConfig: {
      templateId: 'crypto-blockchain',
      seoSettings: {
        title: 'CryptoTech Solutions - Blockchain Development & Cryptocurrency Consulting',
        description: 'Leading blockchain development and cryptocurrency consulting firm. Smart contracts, DeFi solutions, and enterprise blockchain implementation.',
        keywords: ['blockchain development', 'cryptocurrency', 'smart contracts', 'DeFi', 'crypto consulting', 'blockchain solutions', 'Web3 development']
      },
      sections: {
        hero: {
          enabled: true,
          title: 'CryptoTech Solutions',
          subtitle: 'Building the Future with Blockchain Technology',
          backgroundType: 'gradient'
        },
        about: {
          enabled: true,
          content: 'CryptoTech Solutions is a pioneering blockchain development and cryptocurrency consulting firm at the forefront of Web3 innovation. Our team of blockchain architects, smart contract developers, and crypto economists help businesses and individuals navigate the decentralized future. From enterprise blockchain implementation to DeFi protocol development, we deliver cutting-edge solutions that drive digital transformation.'
        },
        services: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Smart Contract Development',
              description: 'Custom smart contract development and deployment',
              price: 100000,
              image: '/services/smart-contracts.jpg',
              features: ['Solidity Development', 'Contract Auditing', 'Gas Optimization', 'Multi-chain Deployment'],
              category: 'Development'
            },
            {
              id: '2',
              name: 'DeFi Protocol Development',
              description: 'Decentralized finance protocol and dApp development',
              price: 250000,
              image: '/services/defi-development.jpg',
              features: ['Yield Farming', 'Liquidity Pools', 'Governance Tokens', 'Cross-chain Integration'],
              category: 'DeFi'
            },
            {
              id: '3',
              name: 'Blockchain Consulting',
              description: 'Strategic blockchain consulting and implementation',
              price: 75000,
              image: '/services/blockchain-consulting.jpg',
              features: ['Technology Assessment', 'Implementation Strategy', 'Regulatory Compliance', 'Team Training'],
              category: 'Consulting'
            },
            {
              id: '4',
              name: 'NFT Marketplace Development',
              description: 'Custom NFT marketplace and minting platform',
              price: 150000,
              image: '/services/nft-marketplace.jpg',
              features: ['Marketplace Development', 'Minting Platform', 'Royalty Management', 'Multi-chain Support'],
              category: 'NFT'
            }
          ]
        },
        portfolio: {
          enabled: true,
          layout: 'grid',
          items: [
            {
              id: '1',
              title: 'DeFi Lending Protocol',
              description: 'Decentralized lending platform with $50M+ TVL',
              category: 'DeFi Development',
              images: ['/portfolio/defi-lending.jpg'],
              featured: true,
              tags: ['DeFi', 'Lending', 'Smart Contracts', 'Ethereum'],
              clientName: 'DeFi Innovations',
              projectDate: '2024-09-10'
            },
            {
              id: '2',
              title: 'Enterprise Blockchain Solution',
              description: 'Supply chain transparency blockchain for Fortune 500 company',
              category: 'Enterprise Blockchain',
              images: ['/portfolio/enterprise-blockchain.jpg'],
              featured: true,
              tags: ['Enterprise', 'Supply Chain', 'Hyperledger', 'Transparency'],
              clientName: 'Global Manufacturing Corp',
              projectDate: '2024-10-05'
            }
          ],
          categories: ['DeFi Development', 'Enterprise Blockchain', 'NFT Solutions', 'Smart Contracts']
        },
        testimonials: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Alex Thompson',
              role: 'CTO, DeFi Innovations',
              content: 'CryptoTech delivered a robust DeFi protocol that exceeded our expectations. Their expertise in smart contract security is unmatched.',
              rating: 5,
              photo: '/testimonials/crypto-client-1.jpg'
            },
            {
              id: '2',
              name: 'Sarah Kim',
              role: 'Blockchain Lead, TechCorp',
              content: 'Their blockchain consulting helped us implement a successful enterprise solution. Professional, knowledgeable, and reliable.',
              rating: 5,
              photo: '/testimonials/crypto-client-2.jpg'
            }
          ]
        },
        contact: {
          enabled: true,
          showMap: false,
          leadForm: {
            enabled: true,
            fields: ['name', 'company', 'phone', 'email', 'project_type', 'blockchain_platform', 'budget_range', 'timeline', 'technical_requirements']
          }
        }
      }
    }
  },

  // 12. Virtual Reality & Metaverse Template
  {
    id: 'vr-metaverse',
    name: 'VR/AR Experience Center',
    description: 'Template for VR arcades, AR developers, and metaverse services',
    category: 'technology',
    previewImage: '/templates/vr-metaverse-preview.jpg',
    thumbnailImage: '/templates/vr-metaverse-thumb.jpg',
    isPremium: true,
    features: ['360° Experience Previews', 'VR Equipment Showcase', 'Experience Booking', 'Virtual Tours', 'AR App Portfolio', 'Metaverse Consulting'],
    defaultConfig: {
      templateId: 'vr-metaverse',
      seoSettings: {
        title: 'VRWorld Experience Center - Virtual Reality & Augmented Reality Solutions',
        description: 'Immersive VR/AR experiences, metaverse development, and virtual reality arcade. Step into the future of digital interaction and entertainment.',
        keywords: ['virtual reality', 'augmented reality', 'VR arcade', 'metaverse', 'immersive experiences', 'VR development', 'AR applications']
      },
      sections: {
        hero: {
          enabled: true,
          title: 'VRWorld Experience Center',
          subtitle: 'Step Into the Future of Reality',
          backgroundType: 'video',
          backgroundVideo: '/templates/vr-hero-video.mp4'
        },
        about: {
          enabled: true,
          content: 'VRWorld Experience Center is a cutting-edge virtual and augmented reality facility that brings the impossible to life. Our state-of-the-art VR arcade, AR development services, and metaverse consulting help individuals and businesses explore new dimensions of digital interaction. From immersive gaming experiences to enterprise training solutions, we\'re pioneering the future of reality.'
        },
        services: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'VR Gaming Experiences',
              description: 'Immersive virtual reality gaming and entertainment',
              price: 1500,
              image: '/services/vr-gaming.jpg',
              features: ['Latest VR Headsets', 'Multiplayer Experiences', 'Adventure Games', 'Simulation Experiences'],
              category: 'Entertainment'
            },
            {
              id: '2',
              name: 'AR App Development',
              description: 'Custom augmented reality application development',
              price: 200000,
              image: '/services/ar-development.jpg',
              features: ['Mobile AR Apps', 'Industrial AR Solutions', 'Marketing AR Campaigns', 'Educational AR Tools'],
              category: 'Development'
            },
            {
              id: '3',
              name: 'Metaverse Consulting',
              description: 'Strategic consulting for metaverse presence and development',
              price: 150000,
              image: '/services/metaverse-consulting.jpg',
              features: ['Metaverse Strategy', 'Virtual World Design', 'NFT Integration', 'Community Building'],
              category: 'Consulting'
            },
            {
              id: '4',
              name: 'VR Training Solutions',
              description: 'Enterprise VR training and simulation programs',
              price: 300000,
              image: '/services/vr-training.jpg',
              features: ['Safety Training', 'Skill Development', 'Remote Collaboration', 'Performance Analytics'],
              category: 'Enterprise'
            }
          ]
        },
        gallery: {
          enabled: true,
          images: [
            '/gallery/vr-arcade-floor.jpg',
            '/gallery/vr-headset-setup.jpg',
            '/gallery/ar-demonstration.jpg',
            '/gallery/group-vr-experience.jpg',
            '/gallery/vr-training-session.jpg',
            '/gallery/metaverse-showcase.jpg'
          ]
        },
        portfolio: {
          enabled: true,
          layout: 'grid',
          items: [
            {
              id: '1',
              title: 'Corporate VR Training Platform',
              description: 'Immersive safety training for manufacturing company',
              category: 'VR Training',
              images: ['/portfolio/vr-training-platform.jpg'],
              featured: true,
              tags: ['VR Training', 'Safety', 'Manufacturing', 'Enterprise'],
              clientName: 'Industrial Safety Corp',
              projectDate: '2024-11-15'
            },
            {
              id: '2',
              title: 'AR Shopping Experience',
              description: 'Augmented reality try-before-you-buy retail solution',
              category: 'AR Development',
              images: ['/portfolio/ar-shopping.jpg'],
              featured: true,
              tags: ['AR', 'Retail', 'Shopping', 'Mobile App'],
              clientName: 'Fashion Forward Retail',
              projectDate: '2024-12-01'
            }
          ],
          categories: ['VR Entertainment', 'AR Development', 'VR Training', 'Metaverse Solutions']
        },
        testimonials: {
          enabled: true,
          items: [
            {
              id: '1',
              name: 'Gaming Enthusiast',
              role: 'VR Arcade Customer',
              content: 'Mind-blowing experiences! The VR games are incredibly realistic and immersive. Best entertainment venue in the city!',
              rating: 5,
              photo: '/testimonials/vr-customer-1.jpg'
            },
            {
              id: '2',
              name: 'Corporate Trainer',
              role: 'Training Manager',
              content: 'The VR training solution revolutionized our safety programs. Employees are more engaged and retain information better.',
              rating: 5,
              photo: '/testimonials/vr-client-1.jpg'
            }
          ]
        },
        booking: {
          enabled: true,
          title: 'Book VR Experience',
          subtitle: 'Reserve your slot in the virtual world'
        },
        contact: {
          enabled: true,
          showMap: true,
          leadForm: {
            enabled: true,
            fields: ['name', 'phone', 'email', 'experience_type', 'group_size', 'preferred_date', 'special_requirements', 'budget_range']
          }
        }
      }
    }
  }
];
// KEY DIFFERENTIATORS & ADVANCED FEATURES
export const keyDifferentiators = {
  // AI-Powered Features
  aiFeatures: {
    smartContentGeneration: {
      name: 'AI Content Generator',
      description: 'Automatically generate compelling content for any business type',
      implementation: 'OpenAI GPT integration for dynamic content creation',
      benefits: ['Saves 80% content creation time', 'SEO-optimized content', 'Industry-specific messaging']
    },
    intelligentChatbots: {
      name: 'AI-Powered Chatbots',
      description: 'Smart chatbots that understand context and provide relevant responses',
      implementation: 'Natural language processing with business-specific training',
      benefits: ['24/7 customer support', 'Lead qualification', 'Appointment booking']
    },
    predictiveAnalytics: {
      name: 'Predictive Business Analytics',
      description: 'AI-driven insights for business growth and customer behavior',
      implementation: 'Machine learning models for pattern recognition',
      benefits: ['Forecast trends', 'Optimize pricing', 'Improve conversion rates']
    }
  },

  // Sustainability Metrics
  sustainabilityFeatures: {
    carbonFootprintTracker: {
      name: 'Carbon Footprint Calculator',
      description: 'Real-time tracking of business environmental impact',
      implementation: 'Integration with utility APIs and emission databases',
      benefits: ['ESG compliance', 'Cost reduction', 'Brand reputation']
    },
    greenCertifications: {
      name: 'Green Certification Display',
      description: 'Showcase environmental certifications and achievements',
      implementation: 'Automated verification with certification bodies',
      benefits: ['Build trust', 'Attract eco-conscious customers', 'Competitive advantage']
    },
    sustainabilityReporting: {
      name: 'Automated Sustainability Reports',
      description: 'Generate comprehensive sustainability reports',
      implementation: 'Data aggregation and automated report generation',
      benefits: ['Regulatory compliance', 'Stakeholder transparency', 'Performance tracking']
    }
  },

  // Mobile-First Design
  mobileOptimization: {
    progressiveWebApp: {
      name: 'Progressive Web App (PWA)',
      description: 'App-like experience that works offline and loads instantly',
      implementation: 'Service workers, app manifest, and caching strategies',
      benefits: ['Faster loading', 'Offline functionality', 'App store distribution']
    },
    touchOptimizedUI: {
      name: 'Touch-Optimized Interface',
      description: 'Intuitive touch gestures and mobile-first interactions',
      implementation: 'Responsive design with touch-friendly elements',
      benefits: ['Better user experience', 'Higher engagement', 'Reduced bounce rate']
    },
    mobilePayments: {
      name: 'Mobile Payment Integration',
      description: 'Seamless mobile payment options including digital wallets',
      implementation: 'Integration with Apple Pay, Google Pay, and UPI',
      benefits: ['Faster checkout', 'Higher conversion', 'Better user experience']
    }
  },

  // Voice Search Optimization
  voiceFeatures: {
    voiceSearchSEO: {
      name: 'Voice Search Optimization',
      description: 'Optimized content for voice search queries',
      implementation: 'Natural language content and schema markup',
      benefits: ['Higher voice search rankings', 'Increased visibility', 'Future-ready SEO']
    },
    voiceCommands: {
      name: 'Voice Navigation',
      description: 'Voice-controlled website navigation and search',
      implementation: 'Web Speech API integration',
      benefits: ['Accessibility compliance', 'Hands-free browsing', 'Innovative user experience']
    },
    audioContent: {
      name: 'Audio Content Integration',
      description: 'Podcast-style content and audio descriptions',
      implementation: 'Text-to-speech and audio player integration',
      benefits: ['Accessibility', 'Multi-modal content', 'Increased engagement']
    }
  },

  // Accessibility Compliance
  accessibilityFeatures: {
    wcagCompliance: {
      name: 'WCAG 2.1 AA Compliance',
      description: 'Full accessibility compliance for all users',
      implementation: 'Semantic HTML, ARIA labels, keyboard navigation',
      benefits: ['Legal compliance', 'Inclusive design', 'Broader audience reach']
    },
    screenReaderSupport: {
      name: 'Screen Reader Optimization',
      description: 'Optimized for assistive technologies',
      implementation: 'Proper heading structure and alt text',
      benefits: ['Visually impaired accessibility', 'Better SEO', 'Inclusive experience']
    },
    keyboardNavigation: {
      name: 'Full Keyboard Navigation',
      description: 'Complete website functionality via keyboard',
      implementation: 'Tab order optimization and focus management',
      benefits: ['Motor disability support', 'Power user efficiency', 'Accessibility compliance']
    }
  },

  // Real-Time Features
  realTimeFeatures: {
    liveChat: {
      name: 'Real-Time Live Chat',
      description: 'Instant customer communication with typing indicators',
      implementation: 'WebSocket connections and real-time messaging',
      benefits: ['Immediate support', 'Higher conversion', 'Customer satisfaction']
    },
    instantBooking: {
      name: 'Real-Time Booking System',
      description: 'Live availability and instant confirmation',
      implementation: 'Real-time calendar sync and notification system',
      benefits: ['Reduced no-shows', 'Better scheduling', 'Improved efficiency']
    },
    liveUpdates: {
      name: 'Live Status Updates',
      description: 'Real-time business status and availability',
      implementation: 'WebSocket updates and push notifications',
      benefits: ['Current information', 'Better customer experience', 'Reduced inquiries']
    }
  },

  // Advanced Analytics
  analyticsFeatures: {
    heatmapAnalytics: {
      name: 'User Behavior Heatmaps',
      description: 'Visual representation of user interactions',
      implementation: 'Click tracking and scroll depth analysis',
      benefits: ['Optimize layout', 'Improve UX', 'Increase conversions']
    },
    conversionTracking: {
      name: 'Advanced Conversion Tracking',
      description: 'Multi-touchpoint conversion attribution',
      implementation: 'Event tracking and funnel analysis',
      benefits: ['ROI measurement', 'Marketing optimization', 'Data-driven decisions']
    },
    predictiveInsights: {
      name: 'Predictive Customer Insights',
      description: 'AI-powered customer behavior predictions',
      implementation: 'Machine learning models and data analysis',
      benefits: ['Proactive marketing', 'Customer retention', 'Revenue optimization']
    }
  },

  // Social Proof Integration
  socialProofFeatures: {
    realTimeReviews: {
      name: 'Real-Time Review Integration',
      description: 'Live reviews from multiple platforms',
      implementation: 'API integration with Google, Facebook, Yelp',
      benefits: ['Fresh content', 'Build trust', 'Improve SEO']
    },
    socialMediaFeed: {
      name: 'Live Social Media Feed',
      description: 'Real-time social media content display',
      implementation: 'Social media API integration',
      benefits: ['Dynamic content', 'Social engagement', 'Brand consistency']
    },
    userGeneratedContent: {
      name: 'User-Generated Content Showcase',
      description: 'Customer photos and videos integration',
      implementation: 'Hashtag tracking and content curation',
      benefits: ['Authentic marketing', 'Community building', 'Increased engagement']
    }
  }
};

// Template Categories with Next-Level Features
export const nextLevelCategories = [
  {
    id: 'technology',
    name: 'Technology & AI',
    description: 'Templates for tech companies, AI services, and digital transformation',
    icon: '🤖',
    count: 3,
    trending: true,
    features: ['AI Integration', 'Tech Stack Display', 'API Documentation', 'Developer Tools']
  },
  {
    id: 'sustainability',
    name: 'Sustainability & Green',
    description: 'Templates for eco-friendly businesses and environmental services',
    icon: '🌱',
    count: 1,
    trending: true,
    features: ['Carbon Tracking', 'ESG Compliance', 'Green Certifications', 'Impact Metrics']
  },
  {
    id: 'creative',
    name: 'Creator Economy',
    description: 'Templates for content creators, influencers, and digital entrepreneurs',
    icon: '🎨',
    count: 1,
    trending: true,
    features: ['Portfolio Showcase', 'Brand Collaborations', 'Social Integration', 'Monetization Tools']
  },
  {
    id: 'services',
    name: 'Professional Services',
    description: 'Templates for service providers and professional consultants',
    icon: '🔧',
    count: 1,
    trending: false,
    features: ['Service Booking', 'Quote Generation', 'Before/After Gallery', 'License Display']
  },
  {
    id: 'pet-care',
    name: 'Pet Care & Veterinary',
    description: 'Templates for veterinarians, pet grooming, and animal services',
    icon: '🐾',
    count: 1,
    trending: false,
    features: ['Pet Records', 'Emergency Care', 'Vaccination Tracking', 'Pet Insurance']
  },
  {
    id: 'real-estate',
    name: 'Real Estate & Coworking',
    description: 'Templates for real estate, coworking spaces, and property services',
    icon: '🏢',
    count: 1,
    trending: true,
    features: ['Space Booking', 'Virtual Tours', 'Membership Plans', 'Community Features']
  },
  {
    id: 'education',
    name: 'Education & Learning',
    description: 'Templates for online courses, tutoring, and educational services',
    icon: '📚',
    count: 1,
    trending: true,
    features: ['Course Catalog', 'Progress Tracking', 'Certification', 'Live Classes']
  },
  {
    id: 'luxury',
    name: 'Luxury & Premium',
    description: 'Templates for luxury services and high-end experiences',
    icon: '💎',
    count: 1,
    trending: false,
    features: ['Exclusive Services', 'VIP Membership', 'Confidential Inquiries', 'Premium Experience']
  },
  {
    id: 'fintech',
    name: 'FinTech & Blockchain',
    description: 'Templates for cryptocurrency, blockchain, and financial technology',
    icon: '₿',
    count: 1,
    trending: true,
    features: ['Blockchain Portfolio', 'Smart Contracts', 'DeFi Integration', 'Crypto Consulting']
  }
];

// Export all templates combined
export const allNextLevelTemplates: MicrositeTemplate[] = [
  ...phase1Templates,
  ...phase2Templates,
  ...phase3Templates,
  ...phase4Templates
];

// Helper functions
export function getTemplatesByPhase(phase: 1 | 2 | 3 | 4): MicrositeTemplate[] {
  switch (phase) {
    case 1: return phase1Templates;
    case 2: return phase2Templates;
    case 3: return phase3Templates;
    case 4: return phase4Templates;
    default: return [];
  }
}

export function getNextLevelTemplateById(id: string): MicrositeTemplate | undefined {
  return allNextLevelTemplates.find(template => template.id === id);
}

export function getNextLevelTemplatesByCategory(category: string): MicrositeTemplate[] {
  return allNextLevelTemplates.filter(template => template.category === category);
}

export function getPremiumNextLevelTemplates(): MicrositeTemplate[] {
  return allNextLevelTemplates.filter(template => template.isPremium);
}

export function getFreeNextLevelTemplates(): MicrositeTemplate[] {
  return allNextLevelTemplates.filter(template => !template.isPremium);
}

export function getTrendingTemplates(): MicrositeTemplate[] {
  const trendingCategories = nextLevelCategories
    .filter(cat => cat.trending)
    .map(cat => cat.id);

  return allNextLevelTemplates.filter(template =>
    trendingCategories.includes(template.category)
  );
}
/**
 * Example usage of the new content sections
 *
 * This file demonstrates how to configure and use the four new premium sections:
 * - ImpactSection
 * - TestimonialsSection
 * - CTASection
 * - TrustIndicatorsSection
 */

import { MicrositeConfig } from '@/types/microsite';

// Example 1: Complete configuration with all new sections
export const exampleConfigComplete: Partial<MicrositeConfig> = {
  sections: {
    // Impact/Metrics Section
    impact: {
      enabled: true,
      metrics: [
        {
          value: "1500+",
          label: "Happy Clients",
          icon: "users"
        },
        {
          value: "25",
          label: "Years Experience",
          icon: "award"
        },
        {
          value: "99%",
          label: "Satisfaction Rate",
          icon: "star"
        },
        {
          value: "150+",
          label: "Locations Worldwide",
          icon: "location"
        }
      ]
    },

    // Testimonials Section
    testimonials: {
      enabled: true,
      items: [
        {
          id: "testimonial-1",
          name: "John Smith",
          role: "CEO, Tech Innovations Inc.",
          photo: "https://example.com/photos/john-smith.jpg",
          content: "Working with this team has been an absolute game-changer for our business. Their professionalism and attention to detail are unmatched.",
          rating: 5
        },
        {
          id: "testimonial-2",
          name: "Sarah Johnson",
          role: "Marketing Director, Global Solutions",
          photo: "https://example.com/photos/sarah-johnson.jpg",
          content: "Exceptional service from start to finish. They understood our needs and delivered beyond our expectations. Highly recommended!",
          rating: 5
        },
        {
          id: "testimonial-3",
          name: "Michael Chen",
          role: "Founder, StartupHub",
          photo: "https://example.com/photos/michael-chen.jpg",
          content: "The best decision we made was partnering with them. Their expertise and dedication have helped us grow exponentially.",
          rating: 5
        }
      ]
    },

    // Trust Indicators Section
    trustIndicators: {
      enabled: true,
      certifications: [
        {
          id: "cert-1",
          name: "ISO 9001:2015 Certified",
          logo: "https://example.com/logos/iso-9001.png",
          description: "Quality Management System"
        },
        {
          id: "cert-2",
          name: "Best Service Award 2024",
          logo: "https://example.com/logos/award-2024.png",
          description: "Industry Excellence Recognition"
        },
        {
          id: "cert-3",
          name: "Green Business Certified",
          logo: "https://example.com/logos/green-cert.png",
          description: "Environmental Sustainability"
        },
        {
          id: "cert-4",
          name: "Customer Choice Award",
          logo: "https://example.com/logos/customer-choice.png",
          description: "Top Rated by Customers"
        }
      ],
      partners: [
        {
          id: "partner-1",
          name: "Google Partner",
          logo: "https://example.com/logos/google-partner.png"
        },
        {
          id: "partner-2",
          name: "Microsoft Partner",
          logo: "https://example.com/logos/microsoft-partner.png"
        },
        {
          id: "partner-3",
          name: "AWS Partner",
          logo: "https://example.com/logos/aws-partner.png"
        },
        {
          id: "partner-4",
          name: "Salesforce Partner",
          logo: "https://example.com/logos/salesforce-partner.png"
        },
        {
          id: "partner-5",
          name: "Adobe Partner",
          logo: "https://example.com/logos/adobe-partner.png"
        }
      ]
    },

    // CTA Section
    cta: {
      enabled: true,
      title: "Ready to Transform Your Business?",
      subtitle: "Join thousands of satisfied customers and experience the difference today",
      buttonText: "Get Started Now",
      buttonLink: "#contact",
      backgroundType: "gradient"
    }
  } as any
};

// Example 2: Minimal configuration (only essential fields)
export const exampleConfigMinimal: Partial<MicrositeConfig> = {
  sections: {
    impact: {
      enabled: true,
      metrics: [
        { value: "100+", label: "Clients", icon: "users" },
        { value: "5", label: "Years", icon: "award" }
      ]
    },

    testimonials: {
      enabled: true,
      items: [
        {
          id: "1",
          name: "Jane Doe",
          role: "Business Owner",
          content: "Great service!",
          rating: 5
        }
      ]
    },

    cta: {
      enabled: true,
      title: "Get Started Today",
      subtitle: "Contact us for a free consultation",
      buttonText: "Contact Us",
      buttonLink: "#contact",
      backgroundType: "gradient"
    }
  } as any
};

// Example 3: CTA with image background
export const exampleConfigImageCTA: Partial<MicrositeConfig> = {
  sections: {
    cta: {
      enabled: true,
      title: "Experience Excellence",
      subtitle: "Let us help you achieve your goals",
      buttonText: "Learn More",
      buttonLink: "https://example.com/learn-more",
      backgroundType: "image",
      backgroundImage: "https://example.com/backgrounds/office-team.jpg"
    }
  } as any
};

// Example 4: Different metric value formats
export const exampleMetricFormats: Partial<MicrositeConfig> = {
  sections: {
    impact: {
      enabled: true,
      metrics: [
        { value: "1500+", label: "Projects Completed", icon: "target" },
        { value: "98%", label: "Client Satisfaction", icon: "star" },
        { value: "2.5K", label: "Active Users", icon: "users" },
        { value: "50M", label: "Revenue Generated", icon: "trending" },
        { value: "24/7", label: "Support Available", icon: "award" },
        { value: "15", label: "Countries Served", icon: "location" }
      ]
    }
  } as any
};

// Example 5: Trust indicators without logos (uses fallback icons)
export const exampleTrustNoLogos: Partial<MicrositeConfig> = {
  sections: {
    trustIndicators: {
      enabled: true,
      certifications: [
        {
          id: "1",
          name: "Quality Certified",
          description: "Meets industry standards"
        },
        {
          id: "2",
          name: "Excellence Award",
          description: "Top performer 2024"
        }
      ],
      partners: [
        {
          id: "1",
          name: "Industry Association Member"
        },
        {
          id: "2",
          name: "Chamber of Commerce"
        }
      ]
    }
  } as any
};

// Example 6: Restaurant/Food Business
export const exampleRestaurant: Partial<MicrositeConfig> = {
  sections: {
    impact: {
      enabled: true,
      metrics: [
        { value: "10K+", label: "Happy Diners", icon: "users" },
        { value: "15", label: "Years Serving", icon: "award" },
        { value: "4.9", label: "Average Rating", icon: "star" },
        { value: "3", label: "Locations", icon: "location" }
      ]
    },

    testimonials: {
      enabled: true,
      items: [
        {
          id: "1",
          name: "Emily Rodriguez",
          role: "Food Blogger",
          content: "The best dining experience in town! Fresh ingredients, amazing flavors, and impeccable service.",
          rating: 5
        },
        {
          id: "2",
          name: "David Park",
          role: "Regular Customer",
          content: "My family's favorite restaurant. The atmosphere is perfect and the food is consistently excellent.",
          rating: 5
        }
      ]
    },

    trustIndicators: {
      enabled: true,
      certifications: [
        {
          id: "1",
          name: "Health & Safety A+ Rating",
          description: "Certified by Health Department"
        },
        {
          id: "2",
          name: "Best Restaurant 2024",
          description: "City's Choice Award"
        }
      ],
      partners: [
        {
          id: "1",
          name: "Local Farmers Association"
        },
        {
          id: "2",
          name: "Sustainable Seafood Partner"
        }
      ]
    },

    cta: {
      enabled: true,
      title: "Reserve Your Table Today",
      subtitle: "Experience culinary excellence in a warm, welcoming atmosphere",
      buttonText: "Make a Reservation",
      buttonLink: "#contact",
      backgroundType: "gradient"
    }
  } as any
};

// Example 7: Professional Services (Law Firm, Consulting, etc.)
export const exampleProfessionalServices: Partial<MicrositeConfig> = {
  sections: {
    impact: {
      enabled: true,
      metrics: [
        { value: "500+", label: "Cases Won", icon: "award" },
        { value: "30", label: "Years Combined Experience", icon: "trending" },
        { value: "95%", label: "Success Rate", icon: "star" },
        { value: "100%", label: "Client Satisfaction", icon: "users" }
      ]
    },

    testimonials: {
      enabled: true,
      items: [
        {
          id: "1",
          name: "Robert Thompson",
          role: "Business Owner",
          content: "Their expertise and dedication made all the difference in our case. Professional, responsive, and results-driven.",
          rating: 5
        }
      ]
    },

    trustIndicators: {
      enabled: true,
      certifications: [
        {
          id: "1",
          name: "Bar Association Member",
          description: "Licensed & Certified"
        },
        {
          id: "2",
          name: "Top Rated Professional",
          description: "Industry Recognition"
        }
      ],
      partners: []
    },

    cta: {
      enabled: true,
      title: "Get Expert Legal Advice",
      subtitle: "Schedule a free consultation with our experienced team",
      buttonText: "Book Consultation",
      buttonLink: "#contact",
      backgroundType: "gradient"
    }
  } as any
};

/**
 * Usage in MicrositeRenderer:
 *
 * The sections are automatically rendered when enabled in the config.
 * Simply update your branch's micrositeConfig with the desired section configuration.
 *
 * Example:
 * ```typescript
 * const updatedConfig = {
 *   ...existingConfig,
 *   sections: {
 *     ...existingConfig.sections,
 *     impact: exampleConfigComplete.sections.impact,
 *     testimonials: exampleConfigComplete.sections.testimonials,
 *     cta: exampleConfigComplete.sections.cta,
 *     trustIndicators: exampleConfigComplete.sections.trustIndicators
 *   }
 * };
 * ```
 */

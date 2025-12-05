import { Branch, Brand } from '../generated/prisma';

// Arc configuration for decorative elements
export interface ArcConfig {
  enabled: boolean;
  color?: string; // Defaults to brand primary color if not specified
  size?: 'small' | 'medium' | 'large';
  position?: 'top' | 'bottom' | 'both';
}

// Section identifiers for ordering
export type SectionId =
  | 'hero'
  | 'about'
  | 'services'
  | 'priceList'
  | 'gallery'
  | 'contact'
  | 'payment'
  | 'feedback'
  | 'trustIndicators'
  | 'videos'
  | 'testimonials'
  | 'impact'
  | 'portfolio'
  | 'aboutFounder'
  | 'offers'
  | 'cta'
  | 'businessHours'
  | 'faq'
  | 'team';

// Section order item
export interface SectionOrderItem {
  id: SectionId;
  enabled: boolean;
}

// Microsite configuration interfaces
export interface MicrositeConfig {
  templateId: string;
  // Section order - defines which sections appear and in what order
  sectionOrder?: SectionOrderItem[];
  sections: {
    hero?: HeroSection;
    about?: AboutSection;
    services?: ServicesSection;
    gallery?: GallerySection;
    videos?: VideosSection;
    contact?: ContactSection;
    feedback?: FeedbackSection;
    payment?: PaymentSection;
    impact?: ImpactSection;
    testimonials?: TestimonialsSection;
    cta?: CTASection;
    trustIndicators?: TrustIndicatorsSection;
    aboutFounder?: AboutFounderSection;
    // Social & Network Layer
    socialProof?: SocialProofSection;
    reviews?: ReviewsSection;
    videoTestimonials?: VideoTestimonialsSection;
    // Premium Features
    portfolio?: PortfolioSection;
    offers?: OffersSection;
  };
  seoSettings: SEOSettings;
  // Premium Theme Settings
  themeSettings?: ThemeSettings;
  // Voice Intro
  voiceIntro?: VoiceIntroConfig;
  // WhatsApp Catalogue
  whatsappCatalogue?: WhatsAppCatalogueConfig;
}

// About Founder Section
export interface AboutFounderSection {
  enabled: boolean;
  name?: string;
  title?: string;
  photo?: string;
  bio?: string;
  achievements?: string[];
  education?: string;
  experience?: string;
  quote?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    email?: string;
  };
}

export interface HeroSection {
  enabled: boolean;
  title: string;
  subtitle: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  backgroundType?: 'image' | 'video' | 'gradient';
  animationEnabled?: boolean;
}

export interface AboutSection {
  enabled: boolean;
  content: string;
}

export interface ServicesSection {
  enabled: boolean;
  items: ServiceItem[];
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  image?: string;
  price?: number;
  features?: string[];
  category?: string;
  availability?: 'available' | 'limited' | 'out_of_stock';
}

export interface GallerySection {
  enabled: boolean;
  images: string[];
}

export interface VideosSection {
  enabled: boolean;
  videos: string[];
}

export interface FeedbackSection {
  enabled: boolean;
}

export interface PaymentSection {
  enabled: boolean;
  upiId?: string;
  qrCode?: string;
  bankDetails?: {
    accountName?: string;
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    branch?: string;
  };
  acceptedMethods?: string[];
}

export interface ContactSection {
  enabled: boolean;
  showMap: boolean;
  leadForm: LeadFormConfig;
  appointmentBooking?: AppointmentBookingConfig;
  liveChatEnabled?: boolean;
  liveChatProvider?: 'tawk' | 'intercom' | 'crisp' | 'custom';
  liveChatConfig?: {
    widgetId?: string;
    customScript?: string;
  };
}

export interface AppointmentBookingConfig {
  enabled: boolean;
  provider?: 'calendly' | 'custom';
  calendlyUrl?: string;
  availableSlots?: {
    day: string;
    slots: string[];
  }[];
}

export interface LeadFormConfig {
  enabled: boolean;
  fields: string[];
}

export interface ImpactSection {
  enabled: boolean;
  metrics: MetricItem[];
}

export interface MetricItem {
  value: string;
  label: string;
  icon?: string;
}

export interface TestimonialsSection {
  enabled: boolean;
  items: TestimonialItem[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  photo?: string;
  content: string;
  rating: number;
}

export interface CTASection {
  enabled: boolean;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  backgroundType: 'gradient' | 'image';
  backgroundImage?: string;
}

export interface TrustIndicatorsSection {
  enabled: boolean;
  certifications: TrustIndicatorItem[];
  partners: TrustIndicatorItem[];
}

export interface TrustIndicatorItem {
  id: string;
  name: string;
  logo?: string;
  description?: string;
}

// ============================================
// SOCIAL & NETWORK LAYER
// ============================================

export interface SocialProofSection {
  enabled: boolean;
  badges: SocialProofBadge[];
  shareButtons: ShareButtonConfig;
}

export interface SocialProofBadge {
  id: string;
  type: 'verified' | 'trusted' | 'top_seller' | 'premium' | 'featured' | 'recommended' | 'custom';
  label: string;
  icon?: string;
  color?: string;
  earnedAt?: string;
  expiresAt?: string;
}

export interface ShareButtonConfig {
  enabled: boolean;
  platforms: ('whatsapp' | 'linkedin' | 'twitter' | 'instagram' | 'facebook' | 'email' | 'copy')[];
  customMessage?: string;
}

export interface ReviewsSection {
  enabled: boolean;
  allowPublicReviews: boolean;
  moderationEnabled: boolean;
  displayCount: number;
  reviews: PublicReview[];
}

export interface PublicReview {
  id: string;
  authorName: string;
  authorPhoto?: string;
  authorCompany?: string;
  rating: number;
  title?: string;
  content: string;
  date: string;
  verified: boolean;
  helpful: number;
  response?: {
    content: string;
    date: string;
  };
}

export interface VideoTestimonialsSection {
  enabled: boolean;
  videos: VideoTestimonial[];
}

export interface VideoTestimonial {
  id: string;
  authorName: string;
  authorRole?: string;
  authorCompany?: string;
  authorPhoto?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  transcript?: string;
  featured: boolean;
}

// ============================================
// PREMIUM FEATURES
// ============================================

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'auto';
  customColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
    cardBackground?: string;
  };
  fontFamily?: string;
  borderRadius?: 'none' | 'small' | 'medium' | 'large' | 'full';
  animations?: boolean;
  glassmorphism?: boolean;
}

export interface VoiceIntroConfig {
  enabled: boolean;
  audioUrl?: string;
  autoPlay: boolean;
  showTranscript: boolean;
  transcript?: string;
  duration?: number;
}

export interface WhatsAppCatalogueConfig {
  enabled: boolean;
  businessPhoneNumber?: string;
  catalogueId?: string;
  autoSync: boolean;
  lastSyncAt?: string;
  products: WhatsAppProduct[];
}

export interface WhatsAppProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  imageUrl?: string;
  availability: 'in_stock' | 'out_of_stock' | 'preorder';
  whatsappProductId?: string;
}

export interface PortfolioSection {
  enabled: boolean;
  layout: 'grid' | 'masonry' | 'carousel';
  items: PortfolioItem[];
  categories: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  images: string[];
  videoUrl?: string;
  clientName?: string;
  projectDate?: string;
  tags: string[];
  featured: boolean;
  link?: string;
}

export interface OffersSection {
  enabled: boolean;
  offers: Offer[];
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'bogo' | 'free_shipping' | 'custom';
  discountValue?: number;
  originalPrice?: number;
  discountedPrice?: number;
  code?: string;
  imageUrl?: string;
  validFrom: string;
  validUntil: string;
  termsAndConditions?: string;
  maxRedemptions?: number;
  currentRedemptions: number;
  isActive: boolean;
  featured: boolean;
}

export interface SEOSettings {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

// Microsite data for rendering
export interface MicrositeData {
  brand: Brand;
  branch: Branch & {
    address: Address;
    contact: Contact;
    socialMedia?: SocialMedia;
    businessHours?: BusinessHours;
    micrositeConfig: MicrositeConfig;
  };
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Contact {
  phone: string;
  whatsapp?: string;
  email: string;
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
}

export interface BusinessHours {
  [day: string]: {
    open: string;
    close: string;
    closed: boolean;
  };
}

// Template interfaces
export interface MicrositeTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  previewImage: string;
  defaultConfig: Partial<MicrositeConfig>;
}

// API response types
export interface MicrositeResponse {
  success: boolean;
  data?: MicrositeData;
  error?: string;
}

export interface ConfigUpdateResponse {
  success: boolean;
  config?: MicrositeConfig;
  error?: string;
}
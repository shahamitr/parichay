/**
 * Industry-Specific Microsite Content Generator
 *
 * Generates realistic microsite configuration for each of the 11 industry categories.
 * For categories with matching templates in industry-templates.ts, adapts the template content.
 * For categories without templates, generates industry-appropriate placeholder content.
 *
 * Every generated config includes: hero, about, services (≥3), gallery (≥4),
 * team (≥2), testimonials (≥2), booking, contact — all with enabled: true.
 */

import { industryTemplates } from '../src/data/industry-templates.js';

// ---------------------------------------------------------------------------
// Template category mapping: category slug → industry-templates.ts category
// ---------------------------------------------------------------------------

const CATEGORY_TO_TEMPLATE: Record<string, string> = {
  'healthcare-professionals': 'healthcare',
  'restaurants-cafes': 'restaurant',
  'fitness-wellness': 'fitness',
  'creatives-designers': 'beauty',
};

// ---------------------------------------------------------------------------
// Industry-specific placeholder content for categories without templates
// ---------------------------------------------------------------------------

interface PlaceholderContent {
  aboutContent: string;
  services: Array<{
    id: string;
    name: string;
    description: string;
    price?: number;
    category: string;
    features: string[];
  }>;
  galleryImages: string[];
  team: Array<{
    id: string;
    name: string;
    role: string;
    bio: string;
    photo: string;
  }>;
  testimonials: Array<{
    id: string;
    name: string;
    role: string;
    content: string;
    rating: number;
  }>;
  bookingTitle: string;
  bookingSubtitle: string;
  contactFields: string[];
}

const PLACEHOLDER_CONTENT: Record<string, PlaceholderContent> = {
  'business-owners': {
    aboutContent:
      'Pinnacle Enterprises is a forward-thinking business consultancy helping entrepreneurs scale their ventures. With a proven track record of driving growth across diverse industries, we combine strategic insight with hands-on execution to deliver measurable results for our clients.',
    services: [
      { id: 's1', name: 'Business Strategy', description: 'Comprehensive strategic planning for growth', price: 15000, category: 'Consulting', features: ['Market Analysis', 'Growth Roadmap', 'Competitive Positioning', 'Revenue Optimization'] },
      { id: 's2', name: 'Operations Management', description: 'Streamline your business operations', price: 12000, category: 'Operations', features: ['Process Audit', 'Workflow Automation', 'Cost Reduction', 'Performance Metrics'] },
      { id: 's3', name: 'Financial Advisory', description: 'Expert financial planning and analysis', price: 10000, category: 'Finance', features: ['Cash Flow Management', 'Investment Planning', 'Tax Strategy', 'Financial Reporting'] },
      { id: 's4', name: 'Marketing Solutions', description: 'Data-driven marketing strategies', price: 8000, category: 'Marketing', features: ['Brand Strategy', 'Digital Marketing', 'Lead Generation', 'Analytics & ROI'] },
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80',
    ],
    team: [
      { id: 't1', name: 'Rajiv Malhotra', role: 'Founder & CEO', bio: 'Serial entrepreneur with 20+ years building and scaling businesses across Asia', photo: 'https://ui-avatars.com/api/?name=Rajiv+Malhotra&size=200' },
      { id: 't2', name: 'Sunita Kapoor', role: 'Chief Strategy Officer', bio: 'Former McKinsey consultant specializing in growth strategy for SMEs', photo: 'https://ui-avatars.com/api/?name=Sunita+Kapoor&size=200' },
      { id: 't3', name: 'Arjun Nair', role: 'Head of Operations', bio: 'Operations expert with a track record of improving efficiency by 40%+', photo: 'https://ui-avatars.com/api/?name=Arjun+Nair&size=200' },
    ],
    testimonials: [
      { id: 'r1', name: 'Deepak Sinha', role: 'CEO, TechVentures', content: 'Pinnacle helped us double our revenue in 18 months. Their strategic guidance was invaluable.', rating: 5 },
      { id: 'r2', name: 'Meera Joshi', role: 'Founder, GreenLeaf Organics', content: 'The operations overhaul they implemented saved us 30% in costs. Highly professional team.', rating: 5 },
    ],
    bookingTitle: 'Schedule a Consultation',
    bookingSubtitle: 'Let us help you take your business to the next level',
    contactFields: ['name', 'email', 'phone', 'company', 'message'],
  },

  'corporate-professionals': {
    aboutContent:
      'Apex Corporate Solutions delivers premium corporate training, executive coaching, and organizational development services. We partner with Fortune 500 companies and ambitious startups alike to build high-performing teams and cultivate leadership excellence.',
    services: [
      { id: 's1', name: 'Executive Coaching', description: 'One-on-one leadership development for C-suite executives', price: 25000, category: 'Leadership', features: ['360° Assessment', 'Personal Development Plan', 'Monthly Sessions', 'Progress Tracking'] },
      { id: 's2', name: 'Corporate Training', description: 'Customized training programs for teams', price: 50000, category: 'Training', features: ['Needs Assessment', 'Custom Curriculum', 'Interactive Workshops', 'Post-Training Support'] },
      { id: 's3', name: 'Team Building', description: 'Engaging team-building experiences', price: 20000, category: 'Development', features: ['Outdoor Activities', 'Problem-Solving Challenges', 'Communication Exercises', 'Debrief Sessions'] },
      { id: 's4', name: 'Change Management', description: 'Navigate organizational transitions smoothly', price: 35000, category: 'Consulting', features: ['Impact Assessment', 'Stakeholder Alignment', 'Communication Strategy', 'Adoption Tracking'] },
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80',
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
    ],
    team: [
      { id: 't1', name: 'Vikram Rao', role: 'Managing Director', bio: 'Former VP at Deloitte with 25 years in corporate consulting', photo: 'https://ui-avatars.com/api/?name=Vikram+Rao&size=200' },
      { id: 't2', name: 'Ananya Deshmukh', role: 'Head of Training', bio: 'Certified executive coach with expertise in leadership development', photo: 'https://ui-avatars.com/api/?name=Ananya+Deshmukh&size=200' },
    ],
    testimonials: [
      { id: 'r1', name: 'Sanjay Mehta', role: 'VP HR, Infosys', content: 'Apex transformed our leadership pipeline. The executive coaching program delivered measurable results within 6 months.', rating: 5 },
      { id: 'r2', name: 'Priya Iyer', role: 'Director, Wipro', content: 'Their corporate training workshops are engaging and practical. Our team productivity improved significantly.', rating: 5 },
    ],
    bookingTitle: 'Book a Discovery Call',
    bookingSubtitle: 'Explore how we can elevate your organization',
    contactFields: ['name', 'email', 'phone', 'company', 'role', 'message'],
  },

  'event-planners': {
    aboutContent:
      'Stellar Events Co. is a full-service event planning company specializing in weddings, corporate events, and milestone celebrations. From intimate gatherings to grand galas, we bring your vision to life with meticulous attention to detail and creative flair.',
    services: [
      { id: 's1', name: 'Wedding Planning', description: 'Complete wedding planning and coordination', price: 100000, category: 'Weddings', features: ['Venue Selection', 'Vendor Management', 'Décor & Styling', 'Day-of Coordination'] },
      { id: 's2', name: 'Corporate Events', description: 'Professional corporate event management', price: 75000, category: 'Corporate', features: ['Conference Planning', 'Product Launches', 'Team Retreats', 'Award Ceremonies'] },
      { id: 's3', name: 'Birthday Celebrations', description: 'Memorable birthday party planning', price: 30000, category: 'Social', features: ['Theme Design', 'Entertainment Booking', 'Catering Coordination', 'Photography'] },
      { id: 's4', name: 'Destination Events', description: 'Curated destination event experiences', price: 200000, category: 'Premium', features: ['Location Scouting', 'Travel Logistics', 'Local Vendor Network', 'Guest Management'] },
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
    ],
    team: [
      { id: 't1', name: 'Kavita Reddy', role: 'Founder & Creative Director', bio: 'Award-winning event planner with 12+ years and 500+ events delivered', photo: 'https://ui-avatars.com/api/?name=Kavita+Reddy&size=200' },
      { id: 't2', name: 'Rohan Bhatia', role: 'Operations Manager', bio: 'Logistics expert ensuring flawless event execution every time', photo: 'https://ui-avatars.com/api/?name=Rohan+Bhatia&size=200' },
      { id: 't3', name: 'Nisha Agarwal', role: 'Décor Specialist', bio: 'Interior designer turned event stylist with an eye for stunning aesthetics', photo: 'https://ui-avatars.com/api/?name=Nisha+Agarwal&size=200' },
    ],
    testimonials: [
      { id: 'r1', name: 'Aisha Khan', role: 'Bride', content: 'Stellar Events made our wedding absolutely magical. Every detail was perfect and stress-free for us.', rating: 5 },
      { id: 'r2', name: 'Rahul Verma', role: 'Marketing Director, TCS', content: 'Our annual conference was flawlessly executed. The team handled everything from A to Z professionally.', rating: 5 },
    ],
    bookingTitle: 'Plan Your Event',
    bookingSubtitle: 'Tell us about your dream event and we will make it happen',
    contactFields: ['name', 'email', 'phone', 'event_type', 'event_date', 'guest_count', 'message'],
  },

  'freelancers-consultants': {
    aboutContent:
      'ProConsult Hub connects businesses with top-tier independent consultants across strategy, technology, and operations. Our curated network of vetted professionals delivers enterprise-grade expertise with the agility and cost-effectiveness of freelance engagement.',
    services: [
      { id: 's1', name: 'Strategy Consulting', description: 'Business strategy and market entry advisory', price: 15000, category: 'Strategy', features: ['Market Research', 'Business Model Design', 'Go-to-Market Strategy', 'Competitive Analysis'] },
      { id: 's2', name: 'Technology Consulting', description: 'Digital transformation and tech advisory', price: 18000, category: 'Technology', features: ['Architecture Review', 'Cloud Migration', 'Tech Stack Selection', 'Security Audit'] },
      { id: 's3', name: 'Project Management', description: 'End-to-end project delivery', price: 12000, category: 'Delivery', features: ['Agile Coaching', 'Resource Planning', 'Risk Management', 'Stakeholder Reporting'] },
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80',
    ],
    team: [
      { id: 't1', name: 'Aditya Sharma', role: 'Founder & Lead Consultant', bio: 'Ex-BCG consultant with 15 years of cross-industry advisory experience', photo: 'https://ui-avatars.com/api/?name=Aditya+Sharma&size=200' },
      { id: 't2', name: 'Divya Menon', role: 'Technology Lead', bio: 'Full-stack architect with expertise in cloud-native solutions and AI', photo: 'https://ui-avatars.com/api/?name=Divya+Menon&size=200' },
    ],
    testimonials: [
      { id: 'r1', name: 'Karan Patel', role: 'CTO, FinEdge', content: 'ProConsult helped us architect our cloud migration. Their consultant was embedded in our team and delivered beyond expectations.', rating: 5 },
      { id: 'r2', name: 'Sneha Gupta', role: 'CEO, StyleBox', content: 'The strategy engagement was transformative. We pivoted our business model and saw 3x growth in 12 months.', rating: 5 },
    ],
    bookingTitle: 'Book a Consultation',
    bookingSubtitle: 'Connect with the right expert for your challenge',
    contactFields: ['name', 'email', 'phone', 'company', 'project_type', 'message'],
  },

  'educational-institutions': {
    aboutContent:
      'Bright Horizons Academy is a progressive educational institution committed to nurturing curious minds and building future leaders. Our holistic curriculum blends academic rigor with creative exploration, preparing students for success in an ever-changing world.',
    services: [
      { id: 's1', name: 'Primary Education (K-5)', description: 'Foundation years with a focus on curiosity and creativity', category: 'Academic', features: ['STEM Curriculum', 'Arts Integration', 'Language Development', 'Physical Education'] },
      { id: 's2', name: 'Secondary Education (6-12)', description: 'Comprehensive secondary program preparing students for higher education', category: 'Academic', features: ['Advanced Placement', 'Lab Sciences', 'Humanities', 'Career Counseling'] },
      { id: 's3', name: 'Extracurricular Programs', description: 'Enrichment activities beyond the classroom', category: 'Enrichment', features: ['Robotics Club', 'Debate Team', 'Music & Drama', 'Sports Academy'] },
      { id: 's4', name: 'Summer Camps', description: 'Engaging summer programs for skill development', price: 15000, category: 'Seasonal', features: ['Coding Bootcamp', 'Art Workshop', 'Science Exploration', 'Leadership Camp'] },
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
      'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
    ],
    team: [
      { id: 't1', name: 'Dr. Lakshmi Narayan', role: 'Principal', bio: 'PhD in Education with 20+ years leading progressive schools', photo: 'https://ui-avatars.com/api/?name=Lakshmi+Narayan&size=200' },
      { id: 't2', name: 'Amit Chandra', role: 'Vice Principal & STEM Lead', bio: 'Former IIT professor passionate about making science accessible to young minds', photo: 'https://ui-avatars.com/api/?name=Amit+Chandra&size=200' },
      { id: 't3', name: 'Fatima Sheikh', role: 'Head of Arts & Humanities', bio: 'Published author and educator fostering creativity in students for 15 years', photo: 'https://ui-avatars.com/api/?name=Fatima+Sheikh&size=200' },
    ],
    testimonials: [
      { id: 'r1', name: 'Pooja Agarwal', role: 'Parent', content: 'Bright Horizons has been transformative for our daughter. The teachers genuinely care and the curriculum is outstanding.', rating: 5 },
      { id: 'r2', name: 'Suresh Kumar', role: 'Parent', content: 'The balance of academics and extracurriculars is perfect. Our son has thrived here both academically and socially.', rating: 5 },
    ],
    bookingTitle: 'Schedule a Campus Visit',
    bookingSubtitle: 'Experience our campus and meet our faculty',
    contactFields: ['name', 'email', 'phone', 'child_grade', 'message'],
  },

  'real-estate-agents': {
    aboutContent:
      'Prime Realty Group is a premier real estate agency specializing in residential and commercial properties. With deep local market knowledge and a client-first approach, we help buyers find their dream homes and sellers maximize their property value.',
    services: [
      { id: 's1', name: 'Residential Sales', description: 'Buy or sell your home with expert guidance', category: 'Sales', features: ['Market Valuation', 'Professional Staging', 'Virtual Tours', 'Negotiation Support'] },
      { id: 's2', name: 'Commercial Leasing', description: 'Find the perfect commercial space for your business', category: 'Commercial', features: ['Space Planning', 'Lease Negotiation', 'Market Analysis', 'Tenant Representation'] },
      { id: 's3', name: 'Property Management', description: 'Hassle-free property management services', price: 5000, category: 'Management', features: ['Tenant Screening', 'Rent Collection', 'Maintenance Coordination', 'Financial Reporting'] },
      { id: 's4', name: 'Investment Advisory', description: 'Real estate investment consulting', category: 'Advisory', features: ['Portfolio Analysis', 'ROI Projections', 'Market Trends', 'Due Diligence'] },
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6191da95b8?w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
    ],
    team: [
      { id: 't1', name: 'Nikhil Oberoi', role: 'Founder & Principal Broker', bio: 'Licensed broker with 18 years and ₹500Cr+ in transactions closed', photo: 'https://ui-avatars.com/api/?name=Nikhil+Oberoi&size=200' },
      { id: 't2', name: 'Prerna Saxena', role: 'Senior Sales Agent', bio: 'Top-performing agent specializing in luxury residential properties', photo: 'https://ui-avatars.com/api/?name=Prerna+Saxena&size=200' },
    ],
    testimonials: [
      { id: 'r1', name: 'Amit Bhasin', role: 'Homebuyer', content: 'Prime Realty found us our dream apartment within our budget. Nikhil and team made the entire process seamless.', rating: 5 },
      { id: 'r2', name: 'Rekha Sharma', role: 'Property Investor', content: 'Their investment advisory helped me build a portfolio that generates consistent rental income. Truly knowledgeable team.', rating: 5 },
    ],
    bookingTitle: 'Schedule a Property Viewing',
    bookingSubtitle: 'Let us show you your next home or investment',
    contactFields: ['name', 'email', 'phone', 'property_type', 'budget_range', 'message'],
  },

  'legal-services': {
    aboutContent:
      'Sterling Law Associates is a full-service law firm providing expert legal counsel across corporate, civil, and criminal law. Our team of experienced attorneys combines deep legal expertise with a pragmatic approach to deliver favorable outcomes for our clients.',
    services: [
      { id: 's1', name: 'Corporate Law', description: 'Business formation, contracts, and compliance', price: 20000, category: 'Corporate', features: ['Company Registration', 'Contract Drafting', 'Regulatory Compliance', 'M&A Advisory'] },
      { id: 's2', name: 'Civil Litigation', description: 'Dispute resolution and civil court representation', price: 15000, category: 'Litigation', features: ['Case Assessment', 'Court Representation', 'Mediation', 'Settlement Negotiation'] },
      { id: 's3', name: 'Family Law', description: 'Sensitive handling of family legal matters', price: 12000, category: 'Family', features: ['Divorce Proceedings', 'Child Custody', 'Property Division', 'Prenuptial Agreements'] },
      { id: 's4', name: 'Intellectual Property', description: 'Protect your innovations and creative works', price: 18000, category: 'IP', features: ['Patent Filing', 'Trademark Registration', 'Copyright Protection', 'IP Litigation'] },
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
      'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800&q=80',
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
    ],
    team: [
      { id: 't1', name: 'Adv. Ramesh Iyer', role: 'Senior Partner', bio: 'Supreme Court advocate with 25+ years in corporate and constitutional law', photo: 'https://ui-avatars.com/api/?name=Ramesh+Iyer&size=200' },
      { id: 't2', name: 'Adv. Neelam Gupta', role: 'Partner — Family Law', bio: 'Compassionate family law specialist with a 95% success rate in custody cases', photo: 'https://ui-avatars.com/api/?name=Neelam+Gupta&size=200' },
      { id: 't3', name: 'Adv. Siddharth Jain', role: 'Associate — IP Law', bio: 'Tech-savvy IP attorney helping startups protect their innovations', photo: 'https://ui-avatars.com/api/?name=Siddharth+Jain&size=200' },
    ],
    testimonials: [
      { id: 'r1', name: 'Vivek Khanna', role: 'CEO, NovaTech', content: 'Sterling handled our company incorporation and IP filings flawlessly. Their corporate team is sharp and responsive.', rating: 5 },
      { id: 'r2', name: 'Anjali Mishra', role: 'Client', content: 'During a difficult family matter, Adv. Gupta provided compassionate and effective legal support. Forever grateful.', rating: 5 },
    ],
    bookingTitle: 'Book a Legal Consultation',
    bookingSubtitle: 'Confidential consultation with our experienced attorneys',
    contactFields: ['name', 'email', 'phone', 'case_type', 'message'],
  },
};


// ---------------------------------------------------------------------------
// Fallback helpers
// ---------------------------------------------------------------------------

function buildFallbackServices() {
  return [
    { id: 's1', name: 'Core Service', description: 'Our flagship offering', price: 5000, category: 'primary', features: ['Professional', 'Reliable', 'Affordable'] },
    { id: 's2', name: 'Premium Service', description: 'Enhanced experience', price: 10000, category: 'premium', features: ['Priority support', 'Custom solutions', 'Dedicated team'] },
    { id: 's3', name: 'Consultation', description: 'Expert guidance', price: 2000, category: 'advisory', features: ['1-on-1 session', 'Action plan', 'Follow-up'] },
  ];
}

function buildFallbackGallery() {
  return [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
  ];
}

function buildFallbackTeam() {
  return [
    { id: 't1', name: 'Alex Johnson', role: 'Founder & CEO', bio: 'Visionary leader with 15+ years of experience', photo: 'https://ui-avatars.com/api/?name=Alex+Johnson&size=200' },
    { id: 't2', name: 'Priya Sharma', role: 'Operations Head', bio: 'Expert in streamlining business processes', photo: 'https://ui-avatars.com/api/?name=Priya+Sharma&size=200' },
  ];
}

function buildFallbackTestimonials() {
  return [
    { id: 'r1', name: 'Rahul Verma', role: 'Client', content: 'Outstanding service and professionalism. Highly recommended!', rating: 5 },
    { id: 'r2', name: 'Anita Desai', role: 'Partner', content: 'A pleasure to work with. They truly understand our needs.', rating: 5 },
  ];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Ensure a sections object has all required sections with minimum thresholds */
function ensureMinimumContent(
  sections: Record<string, unknown>,
  businessName: string,
  tagline: string,
): Record<string, unknown> {
  const s = { ...sections } as Record<string, Record<string, unknown>>;

  // Hero: must have title = businessName, subtitle = tagline
  if (!s.hero || typeof s.hero !== 'object') {
    s.hero = { enabled: true, title: businessName, subtitle: tagline, backgroundType: 'gradient', animationEnabled: true };
  } else {
    s.hero = { ...s.hero, enabled: true, title: businessName, subtitle: tagline };
  }

  // About
  if (!s.about || typeof s.about !== 'object') {
    s.about = { enabled: true, content: `Welcome to ${businessName}. ${tagline}.` };
  } else {
    s.about = { ...s.about, enabled: true };
  }

  // Services: ≥3 items
  if (!s.services || typeof s.services !== 'object') {
    s.services = { enabled: true, items: buildFallbackServices() };
  } else {
    s.services = { ...s.services, enabled: true };
    const items = (s.services as Record<string, unknown>).items;
    if (!Array.isArray(items) || items.length < 3) {
      (s.services as Record<string, unknown>).items = buildFallbackServices();
    }
  }

  // Gallery: ≥4 images
  if (!s.gallery || typeof s.gallery !== 'object') {
    s.gallery = { enabled: true, images: buildFallbackGallery() };
  } else {
    s.gallery = { ...s.gallery, enabled: true };
    const images = (s.gallery as Record<string, unknown>).images;
    if (!Array.isArray(images) || images.length < 4) {
      (s.gallery as Record<string, unknown>).images = buildFallbackGallery();
    }
  }

  // Team: ≥2 members
  if (!s.team || typeof s.team !== 'object') {
    s.team = { enabled: true, title: 'Our Team', subtitle: 'Meet the experts', members: buildFallbackTeam() };
  } else {
    s.team = { ...s.team, enabled: true };
    const members = (s.team as Record<string, unknown>).members;
    if (!Array.isArray(members) || members.length < 2) {
      (s.team as Record<string, unknown>).members = buildFallbackTeam();
    }
  }

  // Testimonials: ≥2 items
  if (!s.testimonials || typeof s.testimonials !== 'object') {
    s.testimonials = { enabled: true, items: buildFallbackTestimonials() };
  } else {
    s.testimonials = { ...s.testimonials, enabled: true };
    const items = (s.testimonials as Record<string, unknown>).items;
    if (!Array.isArray(items) || items.length < 2) {
      (s.testimonials as Record<string, unknown>).items = buildFallbackTestimonials();
    }
  }

  // Booking
  if (!s.booking || typeof s.booking !== 'object') {
    s.booking = { enabled: true, title: 'Book an Appointment', subtitle: 'Schedule a session with us' };
  } else {
    s.booking = { ...s.booking, enabled: true };
  }

  // Contact
  if (!s.contact || typeof s.contact !== 'object') {
    s.contact = { enabled: true, showMap: true, leadForm: { enabled: true, fields: ['name', 'email', 'phone', 'message'] } };
  } else {
    s.contact = { ...s.contact, enabled: true };
  }

  return s;
}

// ---------------------------------------------------------------------------
// Build config from an industry template
// ---------------------------------------------------------------------------

function buildFromTemplate(
  templateCategory: string,
  businessName: string,
  tagline: string,
): Record<string, unknown> | null {
  const templates = industryTemplates.filter(t => t.category === templateCategory);
  if (templates.length === 0) return null;

  // Pick the first (primary) template for the category
  const template = templates[0];
  const config = template.defaultConfig;

  // Deep clone sections to avoid mutating the original
  const sections = JSON.parse(JSON.stringify(config.sections)) as Record<string, unknown>;

  // Override hero with provided business name and tagline
  const ensuredSections = ensureMinimumContent(sections, businessName, tagline);

  return {
    templateId: config.templateId,
    seoSettings: {
      title: `${businessName} — ${tagline}`,
      description: `Welcome to ${businessName}. ${tagline}.`,
      keywords: config.seoSettings?.keywords ?? [businessName.toLowerCase()],
    },
    sections: ensuredSections,
  };
}

// ---------------------------------------------------------------------------
// Build config from placeholder content
// ---------------------------------------------------------------------------

function buildFromPlaceholder(
  categorySlug: string,
  businessName: string,
  tagline: string,
): Record<string, unknown> {
  const placeholder = PLACEHOLDER_CONTENT[categorySlug];

  if (!placeholder) {
    // Ultimate fallback for unknown categories
    return {
      templateId: 'modern-business',
      seoSettings: {
        title: `${businessName} — ${tagline}`,
        description: `Welcome to ${businessName}. ${tagline}.`,
        keywords: [businessName.toLowerCase()],
      },
      sections: ensureMinimumContent({}, businessName, tagline),
    };
  }

  const sections: Record<string, unknown> = {
    hero: {
      enabled: true,
      title: businessName,
      subtitle: tagline,
      backgroundType: 'gradient',
      animationEnabled: true,
    },
    about: {
      enabled: true,
      content: placeholder.aboutContent,
    },
    services: {
      enabled: true,
      items: placeholder.services,
    },
    gallery: {
      enabled: true,
      images: placeholder.galleryImages,
    },
    team: {
      enabled: true,
      title: 'Our Team',
      subtitle: 'Meet the experts behind our success',
      members: placeholder.team,
    },
    testimonials: {
      enabled: true,
      items: placeholder.testimonials,
    },
    booking: {
      enabled: true,
      title: placeholder.bookingTitle,
      subtitle: placeholder.bookingSubtitle,
    },
    contact: {
      enabled: true,
      showMap: true,
      leadForm: {
        enabled: true,
        fields: placeholder.contactFields,
      },
    },
  };

  // Ensure minimum content thresholds are always met
  const ensuredSections = ensureMinimumContent(sections, businessName, tagline);

  return {
    templateId: 'modern-business',
    seoSettings: {
      title: `${businessName} — ${tagline}`,
      description: `Welcome to ${businessName}. ${tagline}.`,
      keywords: [businessName.toLowerCase(), categorySlug.replace(/-/g, ' ')],
    },
    sections: ensuredSections,
  };
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Generate microsite configuration for a given industry category.
 *
 * 1. If the category slug maps to a template category in industry-templates.ts,
 *    adapts that template's defaultConfig.sections.
 * 2. Otherwise, generates realistic placeholder content specific to the industry.
 * 3. Always ensures minimum content thresholds are met.
 *
 * @param categorySlug - The industry category slug (e.g., 'healthcare-professionals')
 * @param businessName - The demo business name (used as hero title)
 * @param tagline - The demo tagline (used as hero subtitle)
 * @returns A micrositeConfig object ready for the Branch model's micrositeConfig field
 */
export function generateMicrositeContent(
  categorySlug: string,
  businessName: string,
  tagline: string,
): Record<string, unknown> {
  // Check if this category has a matching template
  const templateCategory = CATEGORY_TO_TEMPLATE[categorySlug];

  if (templateCategory) {
    const fromTemplate = buildFromTemplate(templateCategory, businessName, tagline);
    if (fromTemplate) return fromTemplate;
  }

  // No template match — use placeholder content
  return buildFromPlaceholder(categorySlug, businessName, tagline);
}

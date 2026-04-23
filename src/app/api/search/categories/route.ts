import { NextResponse } from 'next/server';

// Predefined service categories for the marketplace
export const SERVICE_CATEGORIES = [
  // Home Services
  { id: 'plumbing', name: 'Plumbing', icon: '🔧', group: 'Home Services' },
  { id: 'electrical', name: 'Electrical', icon: '⚡', group: 'Home Services' },
  { id: 'cleaning', name: 'Cleaning', icon: '🧹', group: 'Home Services' },
  { id: 'gardening', name: 'Gardening', icon: '🌱', group: 'Home Services' },
  { id: 'painting', name: 'Painting', icon: '🎨', group: 'Home Services' },
  { id: 'carpentry', name: 'Carpentry', icon: '🔨', group: 'Home Services' },

  // Professional Services
  { id: 'accounting', name: 'Accounting', icon: '📊', group: 'Professional Services' },
  { id: 'legal', name: 'Legal', icon: '⚖️', group: 'Professional Services' },
  { id: 'consulting', name: 'Consulting', icon: '💼', group: 'Professional Services' },
  { id: 'marketing', name: 'Marketing', icon: '📢', group: 'Professional Services' },

  // Health & Wellness
  { id: 'healthcare', name: 'Healthcare', icon: '🏥', group: 'Health & Wellness' },
  { id: 'fitness', name: 'Fitness', icon: '💪', group: 'Health & Wellness' },
  { id: 'beauty', name: 'Beauty', icon: '💄', group: 'Health & Wellness' },
  { id: 'spa', name: 'Spa', icon: '🧘', group: 'Health & Wellness' },

  // Food & Dining
  { id: 'restaurant', name: 'Restaurant', icon: '🍽️', group: 'Food & Dining' },
  { id: 'catering', name: 'Catering', icon: '🍴', group: 'Food & Dining' },
  { id: 'bakery', name: 'Bakery', icon: '🍰', group: 'Food & Dining' },
  { id: 'cafe', name: 'Cafe', icon: '☕', group: 'Food & Dining' },

  // Retail
  { id: 'clothing', name: 'Clothing', icon: '👕', group: 'Retail' },
  { id: 'electronics', name: 'Electronics', icon: '📱', group: 'Retail' },
  { id: 'jewelry', name: 'Jewelry', icon: '💎', group: 'Retail' },
  { id: 'books', name: 'Books', icon: '📚', group: 'Retail' },

  // Automotive
  { id: 'auto-repair', name: 'Auto Repair', icon: '🔧', group: 'Automotive' },
  { id: 'car-wash', name: 'Car Wash', icon: '🚗', group: 'Automotive' },
  { id: 'auto-parts', name: 'Auto Parts', icon: '⚙️', group: 'Automotive' },

  // Education
  { id: 'it-services', name: 'IT Services', icon: '💻', group: 'Technology' },

  { id: 'web-design', name: 'Web Design', icon: '🌐', group: 'Technology' },
  { id: 'software', name: 'Software', icon: '⚡', group: 'Technology' }
];

export async function GET() {
  try {
    // Group categories by their group
    const groupedCategories = SERVICE_CATEGORIES.reduce((acc, category) => {
      if (!acc[category.group]) {
        acc[category.group] = [];
      }
      acc[category.group].push(category);
      return acc;
    }, {} as Record<string, typeof SERVICE_CATEGORIES>);

    return NextResponse.json({
      success: true,
      categories: SERVICE_CATEGORIES,
      grouped: groupedCategories,
      total: SERVICE_CATEGORIES.length
    });
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json({
      error: 'Failed to fetch categories',
      success: false
    }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, getAuthUser } from '@/lib/auth';

interface InsightData {
  category: string;
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  trend?: 'up' | 'down' | 'stable';
  priority?: 'high' | 'medium' | 'low';
  suggestion?: string;
}

interface BusinessInsights {
  profileCompleteness: {
    score: number;
    suggestions: string[];
  };
  trafficAnalysis: {
    peakHours: { hour: number; count: number }[];
    peakDays: { day: string; count: number }[];
    bestPostingTime: string;
  };
  conversionMetrics: {
    viewToLeadRate: number;
    avgResponseTime: number | null;
    industryAvgResponseTime: number;
  };
  sectionPerformance: {
    name: string;
    clicks: number;
    percentage: number;
  }[];
  weekOverWeek: {
    views: { current: number; previous: number; change: number };
    leads: { current: number; previous: number; change: number };
    conversions: { current: number; previous: number; change: number };
  };
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    action?: string;
  }[];
}

/**
 * GET /api/analytics/insights
 * Generate AI-powered business insights based on analytics data
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await getAuthUser(token);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const brandId = searchParams.get('brandId') || user.brandId;

    if (!brandId) {
      return NextResponse.json({ error: 'Brand ID required' }, { status: 400 });
    }

    // Calculate date ranges
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Build where clause
    const whereClause: any = { brandId };
    if (branchId) {
      whereClause.branchId = branchId;
    }

    // Fetch data in parallel
    const [
      currentWeekViews,
      previousWeekViews,
      currentWeekLeads,
      previousWeekLeads,
      allTimeLeads,
      clickEvents,
      branch,
      hourlyViews,
    ] = await Promise.all([
      // Current week views
      prisma.analyticsEvent.count({
        where: {
          ...whereClause,
          eventType: 'PAGE_VIEW',
          createdAt: { gte: weekAgo },
        },
      }),
      // Previous week views
      prisma.analyticsEvent.count({
        where: {
          ...whereClause,
          eventType: 'PAGE_VIEW',
          createdAt: { gte: twoWeeksAgo, lt: weekAgo },
        },
      }),
      // Current week leads
      prisma.lead.count({
        where: {
          branch: branchId ? { id: branchId } : { brandId },
          createdAt: { gte: weekAgo },
        },
      }),
      // Previous week leads
      prisma.lead.count({
        where: {
          branch: branchId ? { id: branchId } : { brandId },
          createdAt: { gte: twoWeeksAgo, lt: weekAgo },
        },
      }),
      // All leads for conversion calculation
      prisma.lead.findMany({
        where: {
          branch: branchId ? { id: branchId } : { brandId },
        },
        select: {
          createdAt: true,
          lastContactedAt: true,
          status: true,
        },
      }),
      // Click events for section performance
      prisma.analyticsEvent.findMany({
        where: {
          ...whereClause,
          eventType: 'CLICK',
          createdAt: { gte: weekAgo },
        },
        select: {
          metadata: true,
        },
      }),
      // Branch for profile completeness
      branchId
        ? prisma.branch.findUnique({
            where: { id: branchId },
            select: {
              micrositeConfig: true,
              contact: true,
              address: true,
              socialMedia: true,
              businessHours: true,
            },
          })
        : null,
      // Hourly view distribution
      prisma.analyticsEvent.findMany({
        where: {
          ...whereClause,
          eventType: 'PAGE_VIEW',
          createdAt: { gte: weekAgo },
        },
        select: {
          createdAt: true,
        },
      }),
    ]);

    // Calculate profile completeness
    const profileCompleteness = calculateProfileCompleteness(branch);

    // Calculate traffic analysis
    const trafficAnalysis = analyzeTraffic(hourlyViews);

    // Calculate conversion metrics
    const totalViews = currentWeekViews + previousWeekViews;
    const viewToLeadRate = totalViews > 0 ? (allTimeLeads.length / totalViews) * 100 : 0;

    // Calculate average response time
    const responseTimes = allTimeLeads
      .filter(l => l.lastContactedAt && l.createdAt)
      .map(l => (l.lastContactedAt!.getTime() - l.createdAt.getTime()) / (1000 * 60 * 60)); // hours
    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : null;

    // Calculate section performance
    const sectionPerformance = analyzeSectionClicks(clickEvents);

    // Calculate week-over-week changes
    const weekOverWeek = {
      views: {
        current: currentWeekViews,
        previous: previousWeekViews,
        change: previousWeekViews > 0
          ? ((currentWeekViews - previousWeekViews) / previousWeekViews) * 100
          : currentWeekViews > 0 ? 100 : 0,
      },
      leads: {
        current: currentWeekLeads,
        previous: previousWeekLeads,
        change: previousWeekLeads > 0
          ? ((currentWeekLeads - previousWeekLeads) / previousWeekLeads) * 100
          : currentWeekLeads > 0 ? 100 : 0,
      },
      conversions: {
        current: allTimeLeads.filter(l => l.status === 'CONVERTED').length,
        previous: 0, // Would need historical data
        change: 0,
      },
    };

    // Generate AI recommendations
    const recommendations = generateRecommendations({
      profileCompleteness,
      viewToLeadRate,
      avgResponseTime,
      weekOverWeek,
      sectionPerformance,
      trafficAnalysis,
    });

    const insights: BusinessInsights = {
      profileCompleteness,
      trafficAnalysis,
      conversionMetrics: {
        viewToLeadRate: Math.round(viewToLeadRate * 100) / 100,
        avgResponseTime: avgResponseTime ? Math.round(avgResponseTime * 10) / 10 : null,
        industryAvgResponseTime: 24, // 24 hours industry standard
      },
      sectionPerformance,
      weekOverWeek,
      recommendations,
    };

    return NextResponse.json({
      success: true,
      insights,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateProfileCompleteness(branch: any): { score: number; suggestions: string[] } {
  if (!branch) {
    return { score: 0, suggestions: ['Select a branch to see profile completeness'] };
  }

  const suggestions: string[] = [];
  let totalFields = 0;
  let completedFields = 0;

  // Check contact info
  const contact = branch.contact as any;
  totalFields += 3;
  if (contact?.phone) completedFields++; else suggestions.push('Add a phone number');
  if (contact?.email) completedFields++; else suggestions.push('Add an email address');
  if (contact?.whatsapp) completedFields++; else suggestions.push('Add WhatsApp number for better engagement');

  // Check address
  const address = branch.address as any;
  totalFields += 2;
  if (address?.street) completedFields++;
  if (address?.city && address?.state) completedFields++;
  if (!address?.street || !address?.city) suggestions.push('Complete your address information');

  // Check social media
  const social = branch.socialMedia as any;
  totalFields += 2;
  const socialCount = [social?.facebook, social?.instagram, social?.linkedin, social?.twitter]
    .filter(Boolean).length;
  if (socialCount >= 2) completedFields += 2;
  else if (socialCount === 1) completedFields += 1;
  if (socialCount < 2) suggestions.push('Add more social media links');

  // Check business hours
  totalFields += 1;
  if (branch.businessHours) completedFields++;
  else suggestions.push('Add business hours');

  // Check microsite config
  const config = branch.micrositeConfig as any;
  if (config?.sections) {
    totalFields += 4;
    if (config.sections.hero?.enabled && config.sections.hero?.title) completedFields++;
    else suggestions.push('Complete your hero section with title and subtitle');
    if (config.sections.about?.enabled && config.sections.about?.content) completedFields++;
    else suggestions.push('Add an about section');
    if (config.sections.services?.enabled && config.sections.services?.items?.length > 0) completedFields++;
    else suggestions.push('Add your services/products');
    if (config.sections.gallery?.enabled && config.sections.gallery?.images?.length > 0) completedFields++;
    else suggestions.push('Add photos to your gallery');
  }

  const score = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;

  return {
    score,
    suggestions: suggestions.slice(0, 5), // Top 5 suggestions
  };
}

function analyzeTraffic(views: { createdAt: Date }[]): {
  peakHours: { hour: number; count: number }[];
  peakDays: { day: string; count: number }[];
  bestPostingTime: string;
} {
  const hourCounts: Record<number, number> = {};
  const dayCounts: Record<number, number> = {};
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  views.forEach(view => {
    const hour = view.createdAt.getHours();
    const day = view.createdAt.getDay();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });

  const peakHours = Object.entries(hourCounts)
    .map(([hour, count]) => ({ hour: parseInt(hour), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const peakDays = Object.entries(dayCounts)
    .map(([day, count]) => ({ day: dayNames[parseInt(day)], count }))
    .sort((a, b) => b.count - a.count);

  // Best posting time is 1 hour before peak hour
  const bestHour = peakHours.length > 0 ? (peakHours[0].hour - 1 + 24) % 24 : 10;
  const bestDay = peakDays.length > 0 ? peakDays[0].day : 'Monday';
  const bestPostingTime = `${bestDay}s around ${bestHour}:00`;

  return { peakHours, peakDays, bestPostingTime };
}

function analyzeSectionClicks(clicks: { metadata: any }[]): {
  name: string;
  clicks: number;
  percentage: number;
}[] {
  const sectionCounts: Record<string, number> = {};
  let totalClicks = 0;

  clicks.forEach(click => {
    const section = click.metadata?.section || click.metadata?.action || 'unknown';
    sectionCounts[section] = (sectionCounts[section] || 0) + 1;
    totalClicks++;
  });

  return Object.entries(sectionCounts)
    .map(([name, clicks]) => ({
      name: formatSectionName(name),
      clicks,
      percentage: totalClicks > 0 ? Math.round((clicks / totalClicks) * 100) : 0,
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 8);
}

function formatSectionName(name: string): string {
  const mapping: Record<string, string> = {
    'call': 'Call Button',
    'whatsapp': 'WhatsApp',
    'directions': 'Directions',
    'share': 'Share',
    'hero': 'Hero Section',
    'about': 'About',
    'services': 'Services',
    'gallery': 'Gallery',
    'contact': 'Contact Form',
    'save_contact': 'Save Contact',
  };
  return mapping[name] || name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' ');
}

function generateRecommendations(data: {
  profileCompleteness: { score: number; suggestions: string[] };
  viewToLeadRate: number;
  avgResponseTime: number | null;
  weekOverWeek: any;
  sectionPerformance: any[];
  trafficAnalysis: any;
}): { priority: 'high' | 'medium' | 'low'; title: string; description: string; action?: string }[] {
  const recommendations: { priority: 'high' | 'medium' | 'low'; title: string; description: string; action?: string }[] = [];

  // Profile completeness recommendations
  if (data.profileCompleteness.score < 50) {
    recommendations.push({
      priority: 'high',
      title: 'Complete Your Profile',
      description: `Your profile is only ${data.profileCompleteness.score}% complete. Complete profiles get 3x more leads.`,
      action: 'Go to Settings',
    });
  } else if (data.profileCompleteness.score < 80) {
    recommendations.push({
      priority: 'medium',
      title: 'Improve Profile Completeness',
      description: `Your profile is ${data.profileCompleteness.score}% complete. ${data.profileCompleteness.suggestions[0]}`,
    });
  }

  // Conversion rate recommendations
  if (data.viewToLeadRate < 2) {
    recommendations.push({
      priority: 'high',
      title: 'Improve Lead Capture',
      description: 'Your conversion rate is below average. Consider adding a compelling call-to-action or offer.',
      action: 'Add CTA',
    });
  }

  // Response time recommendations
  if (data.avgResponseTime && data.avgResponseTime > 24) {
    recommendations.push({
      priority: 'high',
      title: 'Respond Faster to Leads',
      description: `Your average response time is ${Math.round(data.avgResponseTime)} hours. Industry best is under 24 hours.`,
    });
  }

  // Traffic recommendations
  if (data.weekOverWeek.views.change < -20) {
    recommendations.push({
      priority: 'medium',
      title: 'Traffic is Declining',
      description: `Views are down ${Math.abs(Math.round(data.weekOverWeek.views.change))}% this week. Share your profile more actively.`,
      action: 'Share Profile',
    });
  }

  // Best posting time
  if (data.trafficAnalysis.bestPostingTime) {
    recommendations.push({
      priority: 'low',
      title: 'Best Time to Post',
      description: `Your audience is most active on ${data.trafficAnalysis.bestPostingTime}. Post offers or updates then.`,
    });
  }

  // Section engagement
  if (data.sectionPerformance.length > 0) {
    const topSection = data.sectionPerformance[0];
    recommendations.push({
      priority: 'low',
      title: `${topSection.name} is Popular`,
      description: `${topSection.percentage}% of clicks go to ${topSection.name}. Keep this section updated!`,
    });
  }

  // Gallery recommendation
  const galleryClicks = data.sectionPerformance.find(s => s.name.toLowerCase().includes('gallery'));
  if (!galleryClicks) {
    recommendations.push({
      priority: 'medium',
      title: 'Add Gallery Photos',
      description: 'Profiles with galleries get 40% more engagement. Add photos of your work.',
      action: 'Add Photos',
    });
  }

  return recommendations.slice(0, 6);
}

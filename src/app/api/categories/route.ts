
import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const categories = await prisma.industryCategory.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description, icon, features, benefits, useCases, colorScheme } = body;

    // Basic validation
    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    const category = await prisma.industryCategory.create({
      data: {
        name,
        slug,
        description: description || '',
        icon: icon || 'briefcase',
        features: features || [],
        benefits: benefits || [],
        useCases: useCases || [],
        colorScheme: colorScheme || { primary: '#000000', secondary: '#333333', accent: '#666666' },
      },
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

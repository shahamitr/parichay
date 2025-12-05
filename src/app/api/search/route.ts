
import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query || query.length < 2) {
            return NextResponse.json({ results: [] });
        }

        // 1. Brands
        const brands = await prisma.brand.findMany({
            where: {
                OR: [
                    { name: { contains: query } },
                ],
            },
            take: 5,
            select: { id: true, name: true, logo: true },
        });

        // 2. Branches
        const branches = await prisma.branch.findMany({
            where: {
                OR: [
                    { name: { contains: query } },
                ],
            },
            take: 5,
            select: { id: true, name: true, brand: { select: { name: true } } },
        });

        // 3. Leads
        const leads = await prisma.lead.findMany({
            where: {
                OR: [
                    { name: { contains: query } },
                    { email: { contains: query } },
                    { phone: { contains: query } },
                ],
            },
            take: 5,
            select: { id: true, name: true, email: true, branch: { select: { name: true } } },
        });

        // Format results
        const results = [
            ...brands.map(b => ({ type: 'brand', id: b.id, title: b.name, subtitle: 'Brand', url: `/dashboard/brands?id=${b.id}` })),
            ...branches?.map(b => ({ type: 'branch', id: b.id, title: b.name, subtitle: `Branch • ${b.brand.name}`, url: `/dashboard/branches/${b.id}` })),
            ...leads.map(l => ({ type: 'lead', id: l.id, title: l.name, subtitle: `Lead • ${l.email}`, url: `/dashboard/leads/${l.id}` })),
        ];

        return NextResponse.json({ results });
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }
}

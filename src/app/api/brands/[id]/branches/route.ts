
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthenticatedUser(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Verify access
        if (user.role !== 'SUPER_ADMIN' && user.brandId !== id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const branches = await prisma.branch.findMany({
            where: { brandId: id },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                slug: true,
                address: true,
                contact: true,
                isActive: true,
                createdAt: true,
                _count: {
                    select: {
                        leads: true
                    }
                }
            }
        });

        return NextResponse.json({ branches });
    } catch (error) {
        console.error('Error fetching branches:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

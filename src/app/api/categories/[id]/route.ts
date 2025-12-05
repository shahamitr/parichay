
import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { id } = params;

        const category = await prisma.industryCategory.update({
            where: { id },
            data: body,
        });

        return NextResponse.json({ success: true, data: category });
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update category' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        await prisma.industryCategory.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete category' },
            { status: 500 }
        );
    }
}


import { getApiDocs } from '@/lib/swagger';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/docs:
 *   get:
 *     tags:
 *       - Documentation
 *     summary: Get OpenAPI specification
 *     description: Returns the complete OpenAPI 3.0 specification for the Parichay API
 *     responses:
 *       200:
 *         description: OpenAPI specification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
export async function GET() {
    try {
        const spec = getApiDocs();
        return NextResponse.json(spec);
    } catch (error) {
        console.error('Error generating API docs:', error);
        return NextResponse.json(
            { error: 'Failed to generate API documentation' },
            { status: 500 }
        );
    }
}

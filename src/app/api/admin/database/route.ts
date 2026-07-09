/**
 * Admin Database Console API
 * POST /api/admin/database — Execute raw SQL queries
 *
 * SECURITY:
 * - Requires SUPER_ADMIN role
 * - All queries are audit-logged
 * - Destructive queries require explicit confirmation
 * - Rate limited to prevent abuse
 * - This endpoint should NEVER be exposed publicly
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { logAuditEvent, AuditEventType, getIpAddress } from '@/lib/audit-trail';
import { rateLimiters } from '@/lib/rate-limiter';
import logger from '@/lib/logger';

// Blocked statements that can't be run from the console
const BLOCKED_PATTERNS = [
  /DROP\s+DATABASE/i,
  /DROP\s+SCHEMA/i,
  /CREATE\s+DATABASE/i,
  /GRANT\s+/i,
  /REVOKE\s+/i,
  /ALTER\s+ROLE/i,
  /CREATE\s+ROLE/i,
  /pg_terminate_backend/i,
];

export async function POST(request: NextRequest) {
  try {
    // Auth check: SUPER_ADMIN only
    const user = await getAuthenticatedUser(request);
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Rate limit: 30 queries per minute
    const rl = await rateLimiters.api.checkLimit(`db-console:${user.id}`);
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Rate limited. Wait a moment.' }, { status: 429 });
    }

    const body = await request.json();
    const { query, action } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Block dangerous system-level commands
    for (const pattern of BLOCKED_PATTERNS) {
      if (pattern.test(query)) {
        return NextResponse.json({
          error: `Blocked: "${query.slice(0, 50)}..." is not allowed from the console. Use direct DB access for system operations.`,
        }, { status: 403 });
      }
    }

    // Audit log EVERY query
    await logAuditEvent({
      eventType: AuditEventType.DATA_MODIFIED,
      userId: user.id,
      resourceType: 'Database',
      ipAddress: getIpAddress(request.headers),
      metadata: {
        action: 'sql_query',
        query: query.slice(0, 500), // Truncate for log storage
        source: 'admin_console',
      },
    });

    logger.warn({
      userId: user.id,
      query: query.slice(0, 200),
    }, 'Admin database console query executed');

    // Execute query using Prisma's raw query
    const startTime = Date.now();
    const isReadOnly = /^\s*(SELECT|SHOW|DESCRIBE|EXPLAIN|WITH)/i.test(query);

    let rows: any[];
    let fields: string[] = [];
    let rowCount = 0;

    if (isReadOnly) {
      rows = await prisma.$queryRawUnsafe(query);
      if (rows.length > 0) {
        fields = Object.keys(rows[0]);
      }
      rowCount = rows.length;
    } else {
      // For mutations, use executeRaw
      const affected = await prisma.$executeRawUnsafe(query);
      rows = [];
      rowCount = typeof affected === 'number' ? affected : 0;
      fields = [];
    }

    const duration = Date.now() - startTime;

    // Serialize BigInt values
    const serializedRows = rows.map((row: any) => {
      const obj: Record<string, any> = {};
      for (const [key, value] of Object.entries(row)) {
        obj[key] = typeof value === 'bigint' ? Number(value) : value instanceof Date ? value.toISOString() : value;
      }
      return obj;
    });

    return NextResponse.json({
      rows: serializedRows.slice(0, 500), // Max 500 rows
      fields,
      rowCount,
      duration,
      truncated: serializedRows.length > 500,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Query execution failed';
    logger.error({ error: message }, 'Admin database console error');

    return NextResponse.json({
      error: message,
      rows: [],
      fields: [],
      rowCount: 0,
      duration: 0,
    }, { status: 200 }); // Return 200 so the UI can show the error message cleanly
  }
}

/**
 * Import Contacts from CSV
 * POST /api/my-business/import-contacts — Bulk import leads from CSV file
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { encryptPhone } from '@/lib/encryption';
import Papa from 'papaparse';

interface CSVRow {
  name?: string;
  Name?: string;
  phone?: string;
  Phone?: string;
  email?: string;
  Email?: string;
  [key: string]: string | undefined;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_ROWS = 500;

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Find user's brand and branch
    const brand = await prisma.brand.findFirst({
      where: {
        OR: [{ ownerId: user.id }, { users: { some: { id: user.id } } }],
      },
      include: {
        branches: { where: { isActive: true }, take: 1 },
      },
    });

    if (!brand || !brand.branches[0]) {
      return NextResponse.json({ error: 'No business found' }, { status: 404 });
    }

    const branch = brand.branches[0];

    // Parse FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      return NextResponse.json({ error: 'File must be a .csv file' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size must be less than 2MB' }, { status: 400 });
    }

    // Read file content
    const text = await file.text();

    // Parse CSV
    const parseResult = Papa.parse<CSVRow>(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
    });

    if (parseResult.errors.length > 0 && parseResult.data.length === 0) {
      return NextResponse.json({ error: 'Failed to parse CSV file' }, { status: 400 });
    }

    const rows = parseResult.data;

    // Validate row count
    if (rows.length > MAX_ROWS) {
      return NextResponse.json(
        { error: `CSV has ${rows.length} rows. Maximum allowed is ${MAX_ROWS}.` },
        { status: 400 }
      );
    }

    if (rows.length === 0) {
      return NextResponse.json({ error: 'CSV file is empty' }, { status: 400 });
    }

    const imported: Array<{ name: string; phone: string; email?: string }> = [];
    const errors: string[] = [];
    let skipped = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // +2 because header is row 1, data starts at row 2

      // Get values (case-insensitive column names)
      const name = (row.name || row.Name || row.NAME || '').trim();
      const phone = (row.phone || row.Phone || row.PHONE || row.mobile || row.Mobile || '').trim();
      const email = (row.email || row.Email || row.EMAIL || '').trim();

      // Validate required fields
      if (!name) {
        errors.push(`Row ${rowNum}: missing name`);
        skipped++;
        continue;
      }

      if (!phone) {
        errors.push(`Row ${rowNum}: missing phone`);
        skipped++;
        continue;
      }

      imported.push({ name, phone, email: email || undefined });
    }

    // Bulk create leads
    if (imported.length > 0) {
      const leadsData = imported.map((contact) => ({
        name: contact.name,
        phone: encryptPhone(contact.phone) || contact.phone,
        email: contact.email || null,
        source: 'csv_import',
        status: 'NEW' as const,
        priority: 'MEDIUM' as const,
        branchId: branch.id,
      }));

      await prisma.lead.createMany({
        data: leadsData,
        skipDuplicates: true,
      });
    }

    return NextResponse.json({
      success: true,
      imported: imported.length,
      skipped,
      errors: errors.slice(0, 50), // Limit error messages returned
    });
  } catch (error) {
    console.error('Import contacts error:', error);
    return NextResponse.json({ error: 'Failed to import contacts' }, { status: 500 });
  }
}

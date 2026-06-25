import { NextResponse } from 'next/server';

/**
 * GET /api/changelog — Returns the latest product updates.
 * This is a static list maintained in code. For a CMS-backed approach,
 * move this to a database table.
 */

interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  title: string;
  description: string;
  type: 'feature' | 'improvement' | 'fix';
}

const CHANGELOG: ChangelogEntry[] = [
  {
    id: '7',
    version: '2.4.0',
    date: '2026-05-29',
    title: 'Voucher & Discount System',
    description: 'Apply voucher codes at checkout to get discounts on subscription plans.',
    type: 'feature',
  },
  {
    id: '6',
    version: '2.3.0',
    date: '2026-05-28',
    title: '14-Day Free Trial',
    description: 'Try any premium plan free for 14 days. No credit card required.',
    type: 'feature',
  },
  {
    id: '5',
    version: '2.2.0',
    date: '2026-05-25',
    title: 'Audit Log Viewer',
    description: 'Super Admins can now view all security and compliance events in a dedicated dashboard.',
    type: 'feature',
  },
  {
    id: '4',
    version: '2.1.0',
    date: '2026-05-20',
    title: 'Improved User Management',
    description: 'Server-side pagination, bulk actions, soft delete, and CSV export for user management.',
    type: 'improvement',
  },
  {
    id: '3',
    version: '2.0.0',
    date: '2026-05-15',
    title: 'Design Refresh',
    description: 'Clean, professional light theme for the admin panel. Easier to read, faster to use.',
    type: 'improvement',
  },
  {
    id: '2',
    version: '1.5.0',
    date: '2026-05-01',
    title: 'WhatsApp Share Button',
    description: 'Share your microsite directly via WhatsApp with a single tap.',
    type: 'feature',
  },
  {
    id: '1',
    version: '1.0.0',
    date: '2026-04-01',
    title: 'Platform Launch',
    description: 'Parichay is live! Create your digital business profile and start getting discovered.',
    type: 'feature',
  },
];

export async function GET() {
  return NextResponse.json({ changelog: CHANGELOG });
}

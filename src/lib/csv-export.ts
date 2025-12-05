// @ts-nocheck
/**
 * CSV Export Utility
 * Handles CSV generation for analytics and leads data
 */

import Papa from 'papaparse';

export interface CSVExportOptions {
  filename: string;
  data: any[];
  fields?: string[];
}

/**
 * Generate and download CSV file
 */
export function downloadCSV(options: CSVExportOptions): void {
  const { filename, data, fields } = options;

  // Generate CSV string
  const csv = Papa.unparse(data, {
    fields,
    header: true,
  });

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format analytics data for CSV export
 */
export function formatAnalyticsForCSV(events: any[]): any[] {
  return events.map((event) => ({
    Date: new Date(event.createdAt).toLocaleString(),
    'Event Type': event.eventType,
    'User Agent': event.userAgent || 'N/A',
    'IP Address': event.ipAddress || 'N/A',
    Country: event.location?.country || 'N/A',
    City: event.location?.city || 'N/A',
    Metadata: JSON.stringify(event.metadata || {}),
  }));
}

/**
 * Format leads data for CSV export
 */
export function formatLeadsForCSV(leads: any[]): any[] {
  return leads.map((lead) => ({
    Date: new Date(lead.createdAt).toLocaleString(),
    Name: lead.name,
    Email: lead.email || 'N/A',
    Phone: lead.phone || 'N/A',
    Message: lead.message || 'N/A',
    Source: lead.source,
    Branch: lead.branch?.name || 'N/A',
  }));
}

/**
 * Generate CSV string from data
 */
export function generateCSVString(data: any[], fields?: string[]): string {
  return Papa.unparse(data, {
    fields,
    header: true,
  });
}

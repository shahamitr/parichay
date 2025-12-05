'use client';

/**
 * Export Panel Component
 * Provides UI for exporting analytics and leads data
 */

import { useState } from 'react';

interface ExportPanelProps {
  branchId?: string;
  brandId?: string;
}

export default function ExportPanel({ branchId, brandId }: ExportPanelProps) {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  const [exportType, setExportType] = useState<'analytics' | 'leads'>('analytics');
  const [eventType, setEventType] = useState<string>('');

  const handleExport = async () => {
    try {
      setExporting(true);
      setError(null);

      const params = new URLSearchParams();
      if (branchId) params.append('branchId', branchId);
      if (brandId) params.append('brandId', brandId);
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);
      if (exportType === 'analytics' && eventType) {
        params.append('eventType', eventType);
      }

      const endpoint =
        exportType === 'analytics'
          ? `/api/analytics/export?${params.toString()}`
          : `/api/leads/export?${params.toString()}`;

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Failed to export data');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${exportType}_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold">Export Data</h3>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Export Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Export Type
          </label>
          <select
            value={exportType}
            onChange={(e) => setExportType(e.target.value as 'analytics' | 'leads')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="analytics">Analytics Events</option>
            <option value="leads">Leads</option>
          </select>
        </div>

        {/* Event Type Filter (for analytics only) */}
        {exportType === 'analytics' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Type (Optional)
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Events</option>
              <option value="PAGE_VIEW">Page Views</option>
              <option value="CLICK">Clicks</option>
              <option value="QR_SCAN">QR Scans</option>
              <option value="LEAD_SUBMIT">Lead Submissions</option>
            </select>
          </div>
        )}

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={exporting}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {exporting ? 'Exporting...' : 'Export to CSV'}
        </button>

        {/* Info Text */}
        <p className="text-sm text-gray-500">
          Export data will be downloaded as a CSV file. You can open it in Excel,
          Google Sheets, or any spreadsheet application.
        </p>
      </div>
    </div>
  );
}

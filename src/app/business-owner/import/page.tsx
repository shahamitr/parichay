'use client';

import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Upload, FileText, Download, AlertCircle, CheckCircle, X } from 'lucide-react';

interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: string[];
}

interface PreviewRow {
  name: string;
  phone: string;
  email: string;
}

export default function ImportContactsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewRow[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parsePreview = (text: string) => {
    const lines = text.split('\n').filter((line) => line.trim());
    if (lines.length < 2) {
      setError('CSV file appears empty or has no data rows');
      return;
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const nameIdx = headers.findIndex((h) => h === 'name');
    const phoneIdx = headers.findIndex((h) => h === 'phone' || h === 'mobile');
    const emailIdx = headers.findIndex((h) => h === 'email');

    if (nameIdx === -1 || phoneIdx === -1) {
      setError('CSV must have "Name" and "Phone" columns');
      return;
    }

    const dataLines = lines.slice(1);
    setTotalRows(dataLines.length);

    const previewRows: PreviewRow[] = dataLines.slice(0, 5).map((line) => {
      const cols = line.split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
      return {
        name: cols[nameIdx] || '',
        phone: cols[phoneIdx] || '',
        email: emailIdx >= 0 ? cols[emailIdx] || '' : '',
      };
    });

    setPreview(previewRows);
    setError(null);
  };

  const handleFile = useCallback((selectedFile: File) => {
    setResult(null);
    setError(null);
    setPreview([]);

    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a .csv file');
      return;
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      setError('File size must be less than 2MB');
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parsePreview(text);
    };
    reader.readAsText(selectedFile);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFile(droppedFile);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/my-business/import-contacts', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Import failed');
        return;
      }

      setResult(data);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  const downloadSampleCSV = () => {
    const csv = 'Name,Phone,Email\nJohn Doe,+919876543210,john@example.com\nJane Smith,+919876543211,jane@example.com\nRahul Sharma,+919876543212,\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-contacts.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setFile(null);
    setPreview([]);
    setTotalRows(0);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/business-owner/dashboard" className="text-blue-600 hover:text-blue-800">
                ← Dashboard
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-lg font-semibold text-gray-900">Import Contacts</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">CSV Format Instructions</h3>
              <p className="text-sm text-blue-700 mt-1">
                Your CSV should have columns: <strong>Name</strong>, <strong>Phone</strong>, <strong>Email</strong> (optional).
                Each row needs at least a name and phone number.
              </p>
              <button
                onClick={downloadSampleCSV}
                className="mt-2 inline-flex items-center gap-1 text-sm text-blue-700 hover:text-blue-900 font-medium"
              >
                <Download className="w-4 h-4" />
                Download sample CSV template
              </button>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        {!result && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                dragOver
                  ? 'border-blue-500 bg-blue-50'
                  : file
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={(e) => {
                  const selected = e.target.files?.[0];
                  if (selected) handleFile(selected);
                }}
                className="hidden"
              />
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-8 h-8 text-green-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB • {totalRows} rows detected
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      resetForm();
                    }}
                    className="ml-4 p-1 text-gray-400 hover:text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium">
                    Drag & drop your CSV file here
                  </p>
                  <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                  <p className="text-xs text-gray-400 mt-3">Max 500 rows • Max 2MB • .csv only</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Preview */}
        {preview.length > 0 && !result && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <h3 className="font-medium text-gray-900 mb-4">
              Preview (first {preview.length} of {totalRows} rows)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-gray-600">#</th>
                    <th className="text-left py-2 px-3 text-gray-600">Name</th>
                    <th className="text-left py-2 px-3 text-gray-600">Phone</th>
                    <th className="text-left py-2 px-3 text-gray-600">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, idx) => (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="py-2 px-3 text-gray-400">{idx + 1}</td>
                      <td className="py-2 px-3 text-gray-900">{row.name || <span className="text-red-500">—</span>}</td>
                      <td className="py-2 px-3 text-gray-900">{row.phone || <span className="text-red-500">—</span>}</td>
                      <td className="py-2 px-3 text-gray-500">{row.email || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {totalRows} contacts will be imported as new leads
              </p>
              <button
                onClick={handleImport}
                disabled={importing}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {importing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Import {totalRows} Contacts
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Import Complete</h3>
                <p className="text-sm text-gray-500">Your contacts have been added as leads</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-700">{result.imported}</p>
                <p className="text-sm text-green-600">Imported</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-yellow-700">{result.skipped}</p>
                <p className="text-sm text-yellow-600">Skipped</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-red-700">{result.errors.length}</p>
                <p className="text-sm text-red-600">Errors</p>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-700 mb-2">Error Details</h4>
                <ul className="text-sm text-gray-600 space-y-1 max-h-40 overflow-y-auto">
                  {result.errors.map((err, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Import More
              </button>
              <Link
                href="/business-owner/leads"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View Leads
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

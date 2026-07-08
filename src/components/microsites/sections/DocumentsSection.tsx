'use client';

import { FileText, Download, ExternalLink } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  url: string;
  type: string; // pdf, doc, etc.
  size?: string;
}

interface DocumentsSectionProps {
  documents: Document[];
  primaryColor?: string;
}

export default function DocumentsSection({ documents, primaryColor = '#4F46E5' }: DocumentsSectionProps) {
  if (!documents || documents.length === 0) return null;

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('doc') || type.includes('word')) return '📝';
    if (type.includes('xls') || type.includes('sheet')) return '📊';
    if (type.includes('ppt') || type.includes('presentation')) return '📽️';
    return '📎';
  };

  return (
    <section className="py-10 px-4">
      <div className="max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">Documents & Downloads</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Brochures, menus, catalogs, and more</p>

        <div className="space-y-3">
          {documents.map((doc) => (
            <a
              key={doc.id}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all group"
            >
              <div className="w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center text-lg group-hover:scale-105 transition-transform">
                {getFileIcon(doc.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-gray-900 truncate">{doc.name}</p>
                <p className="text-[12px] text-gray-500">{doc.type.toUpperCase()}{doc.size ? ` • ${doc.size}` : ''}</p>
              </div>
              <Download className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors flex-shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

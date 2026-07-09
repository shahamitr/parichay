'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, Copy, Send, Users, CheckCircle, ExternalLink, Info } from 'lucide-react';

interface Recipient {
  id: string;
  name: string;
  phone: string;
  status: string;
  waLink: string;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Leads' },
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'QUALIFIED', label: 'Qualified' },
  { value: 'CONVERTED', label: 'Converted' },
];

const DEFAULT_TEMPLATE = `Hi {name}! 👋

We have an exciting update for you from our business.

Thank you for being a valued customer!

Reply to this message if you'd like to know more.`;

export default function BroadcastPage() {
  const [message, setMessage] = useState(DEFAULT_TEMPLATE);
  const [filterStatus, setFilterStatus] = useState('');
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState(false);

  const fetchRecipients = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/my-business/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, filterStatus }),
      });

      const data = await response.json();
      if (data.success) {
        setRecipients(data.recipients || []);
        setTotalLeads(data.totalLeads || 0);
        setGenerated(true);
      }
    } catch (err) {
      console.error('Failed to fetch recipients:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = async () => {
    const plainMessage = message.replace(/\{name\}/gi, '');
    await navigator.clipboard.writeText(plainMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openWhatsApp = () => {
    const plainMessage = message.replace(/\{name\}/gi, '');
    const encoded = encodeURIComponent(plainMessage);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
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
              <h1 className="text-lg font-semibold text-gray-900">WhatsApp Broadcast</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instructions */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-900">How to Broadcast</h3>
              <ol className="text-sm text-green-700 mt-1 list-decimal list-inside space-y-1">
                <li>Compose your message below (use {'{name}'} for personalization)</li>
                <li>Copy the message</li>
                <li>Open WhatsApp → Broadcast Lists → New List</li>
                <li>Select your contacts and paste the message</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message Composer */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-600" />
                Compose Message
              </h3>

              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setGenerated(false);
                }}
                rows={8}
                placeholder="Type your broadcast message..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
              />

              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-gray-500">
                  Use <code className="bg-gray-100 px-1 rounded">{'{name}'}</code> to personalize with recipient&apos;s name
                </p>
                <p className="text-xs text-gray-400">{message.length}/4096</p>
              </div>

              {/* Filter */}
              <div className="mt-4 pt-4 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter Recipients
                </label>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setFilterStatus(opt.value);
                        setGenerated(false);
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        filterStatus === opt.value
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={fetchRecipients}
                  disabled={loading || !message.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <Users className="w-4 h-4" />
                  )}
                  Preview Recipients
                </button>

                <button
                  onClick={copyMessage}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Message
                    </>
                  )}
                </button>

                <button
                  onClick={openWhatsApp}
                  className="px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20BD5A] flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Open WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* Recipients Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Recipients
                {generated && (
                  <span className="ml-auto text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {recipients.length}
                  </span>
                )}
              </h3>

              {!generated ? (
                <p className="text-sm text-gray-500">
                  Click &quot;Preview Recipients&quot; to see who will receive this broadcast.
                </p>
              ) : recipients.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No leads found matching your filter.
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {recipients.map((r) => (
                    <div key={r.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{r.name}</p>
                        <p className="text-xs text-gray-500">{r.phone}</p>
                      </div>
                      <a
                        href={r.waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                        title="Send individually"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

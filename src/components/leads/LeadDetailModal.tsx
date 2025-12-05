'use client';

import { useState } from 'react';
import { X, Save, Phone, Mail, MessageSquare, Calendar, Tag, User, Clock, CheckCircle } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  message?: string;
  source: string;
  status: string;
  notes?: string;
  tags?: string[];
  nextFollowUpAt?: string;
  createdAt: string;
  branch?: { name: string };
}

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
  onSave: (updatedLead: Partial<Lead>) => Promise<void>;
}

const statusOptions = [
  { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-700' },
  { value: 'contacted', label: 'Contacted', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'qualified', label: 'Qualified', color: 'bg-purple-100 text-purple-700' },
  { value: 'converted', label: 'Converted', color: 'bg-green-100 text-green-700' },
  { value: 'lost', label: 'Lost', color: 'bg-red-100 text-red-700' },
];

export default function LeadDetailModal({ lead, onClose, onSave }: LeadDetailModalProps) {
  const [status, setStatus] = useState(lead.status || 'new');
  const [notes, setNotes] = useState(lead.notes || '');
  const [tags, setTags] = useState<string[]>(lead.tags || []);
  const [newTag, setNewTag] = useState('');
  const [nextFollowUpAt, setNextFollowUpAt] = useState(
    lead.nextFollowUpAt ? new Date(lead.nextFollowUpAt).toISOString().slice(0, 16) : ''
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        id: lead.id,
        status,
        notes,
        tags,
        nextFollowUpAt: nextFollowUpAt ? new Date(nextFollowUpAt).toISOString() : undefined,
      });
      onClose();
    } catch (error) {
      console.error('Error saving lead:', error);
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleCall = () => {
    if (lead.phone) window.open(`tel:${lead.phone}`);
  };

  const handleWhatsApp = () => {
    if (lead.phone) {
      const phone = lead.phone.replace(/\D/g, '');
      window.open(`https://wa.me/${phone}`);
    }
  };

  const handleEmail = () => {
    if (lead.email) window.open(`mailto:${lead.email}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{lead.name}</h2>
              <p className="text-sm text-gray-500">Lead from {lead.source}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Actions */}
          <div className="flex gap-3">
            {lead.phone && (
              <>
                <button
                  onClick={handleCall}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Phone className="w-4 h-4" />
                  Call
                </button>
                <button
                  onClick={handleWhatsApp}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp
                </button>
              </>
            )}
            {lead.email && (
              <button
                onClick={handleEmail}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
            )}
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            {lead.phone && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Phone</p>
                <p className="font-medium">{lead.phone}</p>
              </div>
            )}
            {lead.email && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="font-medium">{lead.email}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 mb-1">Created</p>
              <p className="font-medium">{new Date(lead.createdAt).toLocaleDateString()}</p>
            </div>
            {lead.branch && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Branch</p>
                <p className="font-medium">{lead.branch.name}</p>
              </div>
            )}
          </div>

          {/* Message */}
          {lead.message && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <div className="p-4 bg-gray-50 rounded-lg text-gray-700">{lead.message}</div>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatus(option.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    status === option.value
                      ? option.color + ' ring-2 ring-offset-2 ring-current'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === option.value && <CheckCircle className="w-4 h-4 inline mr-1" />}
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Follow-up Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Next Follow-up
            </label>
            <input
              type="datetime-local"
              value={nextFollowUpAt}
              onChange={(e) => setNextFollowUpAt(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-blue-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                placeholder="Add tag..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addTag}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Add
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes & Remarks</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Add notes about this lead, conversation history, preferences..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

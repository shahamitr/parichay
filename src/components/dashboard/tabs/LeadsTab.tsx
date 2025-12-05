'use client';

import { useState, useEffect } from 'react';
import { Users, Mail, Phone, Calendar, Filter, Download, Search, Clock, Tag, ChevronDown, Bell } from 'lucide-react';
import LeadDetailModal from '@/components/leads/LeadDetailModal';

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

interface LeadsTabProps {
  brandId?: string | null;
  branchId?: string | null;
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  qualified: 'bg-purple-100 text-purple-700',
  converted: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700',
};

export default function LeadsTab({ brandId, branchId }: LeadsTabProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, [brandId, branchId]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (brandId) params.append('brandId', brandId);
      if (branchId) params.append('branchId', branchId);

      const response = await fetch(`/api/leads?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads || []);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLead = async (updatedLead: Partial<Lead>) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/leads/${updatedLead.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedLead),
    });

    if (response.ok) {
      fetchLeads();
    } else {
      throw new Error('Failed to update lead');
    }
  };

  const exportLeads = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Status', 'Source', 'Branch', 'Created', 'Notes'].join(','),
      ...filteredLeads.map(lead => [
        lead.name,
        lead.email || '',
        lead.phone || '',
        lead.status || 'new',
        lead.source,
        lead.branch?.name || '',
        new Date(lead.createdAt).toLocaleDateString(),
        (lead.notes || '').replace(/,/g, ';'),
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Get leads with upcoming follow-ups
  const upcomingFollowUps = leads.filter(lead => {
    if (!lead.nextFollowUpAt) return false;
    const followUp = new Date(lead.nextFollowUpAt);
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    return followUp >= now && followUp <= tomorrow;
  });

  if (loading != null) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading leads...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Follow-up Reminders Banner */}
      {upcomingFollowUps.length > 0 && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2 text-orange-700 mb-2">
            <Bell className="w-5 h-5" />
            <span className="font-semibold">Upcoming Follow-ups ({upcomingFollowUps.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {upcomingFollowUps.slice(0, 5).map(lead => (
              <button
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className="px-3 py-1 bg-white border border-orange-200 rounded-full text-sm hover:bg-orange-100"
              >
                {lead.name} - {new Date(lead.nextFollowUpAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              {statusFilter === 'all' ? 'All Status' : statusFilter}
              <ChevronDown className="w-4 h-4" />
            </button>
            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                {['all', 'new', 'contacted', 'qualified', 'converted', 'lost'].map(status => (
                  <button
                    key={status}
                    onClick={() => { setStatusFilter(status); setShowFilterMenu(false); }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${statusFilter === status ? 'bg-blue-50 text-blue-600' : ''}`}
                  >
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={exportLeads}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-2xl font-bold text-blue-700">{leads.length}</p>
          <p className="text-sm text-blue-600">Total</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <p className="text-2xl font-bold text-yellow-700">
            {leads.filter(l => l.status === 'new' || !l.status).length}
          </p>
          <p className="text-sm text-yellow-600">New</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-2xl font-bold text-purple-700">
            {leads.filter(l => l.status === 'contacted').length}
          </p>
          <p className="text-sm text-purple-600">Contacted</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-2xl font-bold text-green-700">
            {leads.filter(l => l.status === 'converted').length}
          </p>
          <p className="text-sm text-green-600">Converted</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <p className="text-2xl font-bold text-orange-700">{upcomingFollowUps.length}</p>
          <p className="text-sm text-orange-600">Follow-ups Today</p>
        </div>
      </div>

      {/* Leads List */}
      {filteredLeads.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Contact</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Follow-up</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Tags</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{lead.name}</span>
                        {lead.notes && (
                          <p className="text-xs text-gray-500 truncate max-w-[150px]">{lead.notes}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      {lead.email && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="w-3 h-3" />
                          {lead.email}
                        </div>
                      )}
                      {lead.phone && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="w-3 h-3" />
                          {lead.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${statusColors[lead.status] || statusColors.new}`}>
                      {(lead.status || 'new').charAt(0).toUpperCase() + (lead.status || 'new').slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {lead.nextFollowUpAt ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="w-3 h-3 text-orange-500" />
                        <span className={new Date(lead.nextFollowUpAt) < new Date() ? 'text-red-600' : 'text-gray-600'}>
                          {new Date(lead.nextFollowUpAt).toLocaleDateString()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {lead.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                      {(lead.tags?.length || 0) > 2 && (
                        <span className="text-xs text-gray-400">+{lead.tags!.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No leads found</p>
          <p className="text-sm text-gray-400 mt-1">Leads will appear here when visitors submit forms</p>
        </div>
      )}

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onSave={handleSaveLead}
        />
      )}
    </div>
  );
}

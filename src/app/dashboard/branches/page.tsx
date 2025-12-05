'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useSearchParams } from 'next/navigation';
import BranchList from '@/components/branches/BranchList';
import BranchForm from '@/components/branches/BranchForm';
import {
  MapPin,
  Users,
  Link2,
  Star,
  QrCode,
  Plus,
  LayoutGrid,
  List,
} from 'lucide-react';

// Import feature components (we'll create lightweight versions)
import LeadsTab from '@/components/dashboard/tabs/LeadsTab';
import ShortLinksTab from '@/components/dashboard/tabs/ShortLinksTab';
import SocialTab from '@/components/dashboard/tabs/SocialTab';
import QRCodesTab from '@/components/dashboard/tabs/QRCodesTab';

type TabType = 'branches' | 'leads' | 'links' | 'social' | 'qrcodes';

export default function BranchesPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('branches');
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    if (user?.brandId) {
      setSelectedBrandId(user.brandId);
    } else if (user?.role === 'SUPER_ADMIN') {
      fetchBrands();
    }

    // Check URL params for tab
    const tab = searchParams.get('tab') as TabType;
    if (tab && ['branches', 'leads', 'links', 'social', 'qrcodes'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [user, searchParams]);

  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/brands', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBrands(data.brands);
        // Default to first brand if none selected
        if (data.brands.length > 0 && !selectedBrandId) {
          setSelectedBrandId(data.brands[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const handleBranchSaved = () => {
    setShowForm(false);
    setEditingBranch(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleEditBranch = (branch: any) => {
    setEditingBranch(branch);
    setShowForm(true);
  };

  const tabs = [
    { id: 'branches' as TabType, label: 'Branches', icon: MapPin, count: null },
    { id: 'leads' as TabType, label: 'Leads', icon: Users, count: null },
    { id: 'links' as TabType, label: 'Short Links', icon: Link2, count: null },
    { id: 'social' as TabType, label: 'Reviews', icon: Star, count: null },
    { id: 'qrcodes' as TabType, label: 'QR Codes', icon: QrCode, count: null },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="bg-white shadow-sm rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Branch Management</h1>
              <p className="mt-1 text-gray-500 text-sm">
                Manage branches, leads, links, reviews, and QR codes
              </p>
            </div>

            <div className="flex items-center gap-3">
              {user.role === 'SUPER_ADMIN' && (
                <select
                  value={selectedBrandId || ''}
                  onChange={(e) => setSelectedBrandId(e.target.value)}
                  className="block w-48 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              )}

              {activeTab === 'branches' && selectedBrandId && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Branch
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Branch Form Modal */}
      {showForm && (
        <BranchForm
          branch={editingBranch}
          defaultBrandId={selectedBrandId}
          onSave={handleBranchSaved}
          onCancel={() => {
            setShowForm(false);
            setEditingBranch(null);
          }}
        />
      )}

      {/* Tab Content */}
      <div className="bg-white shadow-sm rounded-xl">
        {activeTab === 'branches' && (
          <BranchList
            key={refreshKey}
            brandId={selectedBrandId}
            onEditBranch={handleEditBranch}
          />
        )}

        {activeTab === 'leads' && (
          <LeadsTab brandId={selectedBrandId} branchId={selectedBranchId} />
        )}

        {activeTab === 'links' && (
          <ShortLinksTab brandId={selectedBrandId} branchId={selectedBranchId} />
        )}

        {activeTab === 'social' && (
          <SocialTab brandId={selectedBrandId} branchId={selectedBranchId} />
        )}

        {activeTab === 'qrcodes' && (
          <QRCodesTab brandId={selectedBrandId} branchId={selectedBranchId} />
        )}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { MapPin, Users, Eye, QrCode } from 'lucide-react';

interface Stats {
  totalBranches: number;
  totalLeads: number;
  totalViews: number;
  totalScans: number;
}

interface DashboardStatsProps {
  brandId: string;
}

export default function DashboardStats({ brandId }: DashboardStatsProps) {
  const [stats, setStats] = useState<Stats>({
    totalBranches: 0,
    totalLeads: 0,
    totalViews: 0,
    totalScans: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [brandId]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Fetch branches count
      const branchesResponse = await fetch(`/api/branches?brandId=${brandId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const branchesData = await branchesResponse.json();

      // For now, we'll use mock data for analytics
      // In a real implementation, you'd fetch from analytics API
      setStats({
        totalBranches: branchesData.branches?.length || 0,
        totalLeads: Math.floor(Math.random() * 100) + 50,
        totalViews: Math.floor(Math.random() * 1000) + 500,
        totalScans: Math.floor(Math.random() * 200) + 100,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading != null) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 overflow-hidden border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      name: 'Total Branches',
      value: stats.totalBranches,
      icon: MapPin,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      name: 'Total Leads',
      value: stats.totalLeads,
      icon: Users,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      name: 'Page Views',
      value: stats.totalViews,
      icon: Eye,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      name: 'QR Scans',
      value: stats.totalScans,
      icon: QrCode,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-normal text-gray-600 dark:text-gray-300 mb-4">Overview</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="bg-white dark:bg-gray-800 overflow-hidden border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {item.name}
                    </p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                      {item.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${item.bgColor}`}>
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
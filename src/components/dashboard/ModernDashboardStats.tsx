// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { StatCard } from '@/components/ui/GlassCard';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import MiniChart from '@/components/ui/MiniChart';
import { Users, TrendingUp, DollarSign, Eye, MapPin, Link2 } from 'lucide-react';

interface DashboardStatsProps {
  brandId?: string;
}

export default function ModernDashboardStats({ brandId }: DashboardStatsProps) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBranches: 0,
    totalLeads: 0,
    totalViews: 0,
    revenue: 0,
    activeLinks: 0,
    usersTrend: [] as number[],
    leadsTrend: [] as number[],
    viewsTrend: [] as number[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [brandId]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = brandId
        ? `/api/analytics/stats?brandId=${brandId}`
        : '/api/analytics/stats';

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* Total Users */}
      <div className="relative">
        <StatCard
          title="Total Users"
          value={<AnimatedCounter value={stats.totalUsers} />}
          change={12}
          trend="up"
          icon={<Users className="w-6 h-6" />}
          loading={loading}
        />
        {stats.usersTrend.length > 0 && (
          <div className="absolute bottom-4 right-4">
            <MiniChart data={stats.usersTrend} color="#3B82F6" width={80} height={30} />
          </div>
        )}
      </div>

      {/* Total Branches */}
      <StatCard
        title="Branches"
        value={<AnimatedCounter value={stats.totalBranches} />}
        change={5}
        trend="up"
        icon={<MapPin className="w-6 h-6" />}
        loading={loading}
      />

      {/* Total Leads */}
      <div className="relative">
        <StatCard
          title="Total Leads"
          value={<AnimatedCounter value={stats.totalLeads} />}
          change={18}
          trend="up"
          icon={<TrendingUp className="w-6 h-6" />}
          loading={loading}
        />
        {stats.leadsTrend.length > 0 && (
          <div className="absolute bottom-4 right-4">
            <MiniChart data={stats.leadsTrend} color="#10B981" width={80} height={30} fill />
          </div>
        )}
      </div>

      {/* Total Views */}
      <div className="relative">
        <StatCard
          title="Page Views"
          value={<AnimatedCounter value={stats.totalViews} />}
          change={-3}
          trend="down"
          icon={<Eye className="w-6 h-6" />}
          loading={loading}
        />
        {stats.viewsTrend.length > 0 && (
          <div className="absolute bottom-4 right-4">
            <MiniChart data={stats.viewsTrend} color="#8B5CF6" width={80} height={30} />
          </div>
        )}
      </div>

      {/* Revenue */}
      <StatCard
        title="Revenue"
        value={<AnimatedCounter value={stats.revenue} />}
        prefix="₹"
        change={25}
        trend="up"
        icon={<DollarSign className="w-6 h-6" />}
        loading={loading}
      />

      {/* Active Links */}
      <StatCard
        title="Active Links"
        value={<AnimatedCounter value={stats.activeLinks} />}
        change={8}
        trend="up"
        icon={<Link2 className="w-6 h-6" />}
        loading={loading}
      />
    </div>
  );
}

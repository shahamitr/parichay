'use client';

import { useState, useEffect } from 'react';
import { usePageHelp } from '@/hooks/usePageHelp';
import { StatCard, SectionHeader, Card, Button } from '@/components/ui';
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  Crown,
  Shield,
  User,
  Edit,
  Trash2,
  UserCheck,
  Clock
} from 'lucide-react';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'EXECUTIVE' | 'USER';
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
  brandName?: string;
}

export default function UsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Initialize help for this page
  usePageHelp({ pageContext: 'Users' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 800));

      setUsers([
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@techcorp.com',
          phone: '+91 98765 43210',
          role: 'ADMIN',
          status: 'active',
          lastLogin: '2024-01-22T10:30:00Z',
          createdAt: '2024-01-15',
          brandName: 'TechCorp Solutions'
        },
        {
          id: '2',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah@greenenergy.com',
          phone: '+91 98765 43211',
          role: 'EXECUTIVE',
          status: 'active',
          lastLogin: '2024-01-22T09:15:00Z',
          createdAt: '2024-01-20',
          brandName: 'Green Energy Ltd'
        },
        {
          id: '3',
          firstName: 'Mike',
          lastName: 'Wilson',
          email: 'mike@creative.com',
          role: 'USER',
          status: 'inactive',
          createdAt: '2024-02-01',
          brandName: 'Creative Studio'
        }
      ]);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.brandName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="h-12 bg-neutral-900 border border-neutral-800 rounded-2xl w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-neutral-900 border border-neutral-800 rounded-2xl"></div>
          ))}
        </div>
        <div className="h-96 bg-neutral-900 border border-neutral-800 rounded-2xl"></div>
      </div>
    );
  }

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    executives: users.filter(u => u.role === 'EXECUTIVE').length
  };

  return (
    <div className="p-8 space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <SectionHeader
          title="Network Management"
          description="Control user access, permissions and roles across the ecosystem."
        />
        <button className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary-500/20">
          <Plus className="w-4 h-4" />
          Add New Member
        </button>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Members"
          value={userStats.total}
          icon={Users}
          color="primary"
        />
        <StatCard
          title="Active Status"
          value={userStats.active}
          icon={UserCheck}
          description={`${Math.round((userStats.active / userStats.total) * 100)}% Engagement`}
          color="emerald"
        />
        <StatCard
          title="System Admins"
          value={userStats.admins}
          icon={Crown}
          color="amber"
        />
        <StatCard
          title="Onboarding Leads"
          value={userStats.executives}
          icon={Shield}
          color="purple"
        />
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-600 w-4 h-4" />
          <input
            type="text"
            placeholder="FILTER BY NAME, EMAIL OR BRAND..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 w-full bg-neutral-900 border border-neutral-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 focus:ring-0 transition-all placeholder:text-neutral-700"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600 hidden md:block">Filter by role</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-6 py-3 bg-neutral-900 border border-neutral-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 focus:ring-0 transition-all"
          >
            <option value="all">Global Access</option>
            <option value="ADMIN">System Admins</option>
            <option value="EXECUTIVE">Account Executives</option>
            <option value="USER">Standard Users</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-neutral-950 border border-neutral-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Users className="w-10 h-10 text-neutral-800" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-2">No matching members</h3>
            <p className="text-xs font-medium text-neutral-600">Adjust your filters to see more results</p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-950/50">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500 border-b border-neutral-800">Identity</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500 border-b border-neutral-800">Connection</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500 border-b border-neutral-800">Privilege</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500 border-b border-neutral-800">Security</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500 border-b border-neutral-800 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-neutral-800/30 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-lg group-hover:scale-110 transition-transform">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black uppercase tracking-tight text-white group-hover:text-primary-500 transition-colors">
                            {user.firstName} {user.lastName}
                          </span>
                          {user.brandName && (
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-0.5">{user.brandName}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400">
                          <Mail className="w-3 h-3 text-primary-500/50" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400">
                            <Phone className="w-3 h-3 text-primary-500/50" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${
                          user.role === 'ADMIN' ? 'bg-amber-500/10 text-amber-500' :
                          user.role === 'EXECUTIVE' ? 'bg-primary-500/10 text-primary-500' :
                          'bg-neutral-800 text-neutral-500'
                        }`}>
                          {user.role === 'ADMIN' ? <Crown className="w-3 h-3" /> :
                           user.role === 'EXECUTIVE' ? <Shield className="w-3 h-3" /> :
                           <User className="w-3 h-3" />}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest w-fit ${
                          user.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}>
                          {user.status === 'active' ? 'Authorized' : 'Restricted'}
                        </span>
                        <div className="flex items-center gap-2 text-[9px] font-bold text-neutral-600 uppercase">
                          <Clock className="w-3 h-3" />
                          {user.lastLogin ? `Last active ${new Date(user.lastLogin).toLocaleDateString()}` : 'Never accessed'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-500 hover:text-white hover:border-neutral-700 transition-all">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-500 hover:text-red-500 hover:border-red-500/30 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
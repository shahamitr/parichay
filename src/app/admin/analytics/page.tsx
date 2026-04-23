'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Users,
  Eye,
  TrendingUp,
  Download,
  Clock,
  Globe,
  ArrowUpRight,
  MousePointer,
  Share2,
  Target,
  Activity,
  Zap,
  Filter
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { StatCard, ProgressBar, SectionHeader } from '@/components/ui';

type TabType = 'overview' | 'traffic' | 'leads' | 'performance';

// Mock data for charts
const trafficData = [
  { name: 'Mon', views: 1200, visitors: 800 },
  { name: 'Tue', views: 1800, visitors: 1100 },
  { name: 'Wed', views: 2200, visitors: 1400 },
  { name: 'Thu', views: 1900, visitors: 1200 },
  { name: 'Fri', views: 2800, visitors: 1800 },
  { name: 'Sat', views: 2400, visitors: 1600 },
  { name: 'Sun', views: 1600, visitors: 1000 },
];

const leadsData = [
  { name: 'Week 1', leads: 45, converted: 12 },
  { name: 'Week 2', leads: 62, converted: 18 },
  { name: 'Week 3', leads: 58, converted: 15 },
  { name: 'Week 4', leads: 78, converted: 24 },
];

const deviceData = [
  { name: 'Mobile', value: 65, color: '#3B82F6' },
  { name: 'Desktop', value: 28, color: '#8B5CF6' },
  { name: 'Tablet', value: 7, color: '#F59E0B' },
];

const sourceData = [
  { name: 'Direct', visits: 4200 },
  { name: 'Social', visits: 2800 },
  { name: 'Search', visits: 2400 },
  { name: 'Referral', visits: 1800 },
  { name: 'Email', visits: 1200 },
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [dateRange, setDateRange] = useState('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [dateRange, activeTab]);

  const tabs = [
    { id: 'overview' as TabType, name: 'Quantum Overview', icon: BarChart3 },
    { id: 'traffic' as TabType, name: 'Traffic Streams', icon: Eye },
    { id: 'leads' as TabType, name: 'Conversion Labs', icon: Users },
    { id: 'performance' as TabType, name: 'Velocity Metrics', icon: Activity },
  ];

  if (loading) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="h-12 bg-neutral-900 border border-neutral-800 rounded-2xl w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-neutral-900 border border-neutral-800 rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[400px] bg-neutral-900 border border-neutral-800 rounded-[32px]"></div>
          <div className="h-[400px] bg-neutral-900 border border-neutral-800 rounded-[32px]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <SectionHeader
          title="Intelligence Hub"
          description="Real-time data visualization and ecosystem performance analytics."
        />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-white focus:ring-0 outline-none cursor-pointer"
            >
              <option value="7d">Last 7 Cycles</option>
              <option value="30d">Last 30 Cycles</option>
              <option value="90d">Quarterly View</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
            <Download className="w-4 h-4" />
            Export Intelligence
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Impressions"
          value="1.2M"
          icon={<Eye className="w-5 h-5" />}
          trend={{ value: 12, label: "growth", isPositive: true }}
          color="primary"
        />
        <StatCard
          title="Conversion Node"
          value="8.4%"
          icon={<Target className="w-5 h-5" />}
          trend={{ value: 3.2, label: "optimizing", isPositive: true }}
          color="emerald"
        />
        <StatCard
          title="Active Sessions"
          value="2,840"
          icon={<Zap className="w-5 h-5" />}
          color="amber"
        />
        <StatCard
          title="Bounce Protocol"
          value="24.1%"
          icon={<Activity className="w-5 h-5" />}
          trend={{ value: 1.5, label: "reduction", isPositive: false }}
          color="rose"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-neutral-800 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-8 py-5 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-500 bg-primary-500/5'
                : 'border-transparent text-neutral-600 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {activeTab === 'overview' && (
            <>
              <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-colors" />
                <SectionHeader
                  title="Traffic Dynamics"
                  description="Real-time flow of unique identifiers and impressions."
                />
                <div className="h-[300px] mt-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trafficData}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 800 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 800 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1f2937', borderRadius: '16px', fontSize: '10px', fontWeight: 800 }}
                        itemStyle={{ color: '#fff', textTransform: 'uppercase' }}
                      />
                      <Area type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={4} fillOpacity={1} fill="url(#colorViews)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors" />
                <SectionHeader
                  title="Conversion Sources"
                  description="Attribution matrix for ecosystem growth."
                />
                <div className="h-[300px] mt-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sourceData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 800 }} />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 800 }} width={80} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1f2937', borderRadius: '16px', fontSize: '10px', fontWeight: 800 }}
                      />
                      <Bar dataKey="visits" fill="#10B981" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl">
                <SectionHeader
                  title="Device Spectrum"
                  description="Hardware profile of the active network."
                />
                <div className="h-[250px] mt-8 flex items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={10}
                        dataKey="value"
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1f2937', borderRadius: '16px', fontSize: '10px', fontWeight: 800 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-4 pr-8">
                    {deviceData.map((item) => (
                      <div key={item.name} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{item.name}</span>
                        <span className="text-[10px] font-black text-white">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl">
                <SectionHeader
                  title="Velocity Performance"
                  description="Response protocols and efficiency benchmarks."
                />
                <div className="space-y-8 mt-10">
                  <ProgressBar label="Conversion Velocity" value={28.5} color="orange" showValue />
                  <ProgressBar label="Protocol Response Rate" value={85.2} color="green" showValue />
                  <ProgressBar label="Network Health Score" value={78} color="blue" showValue valuePrefix="7.8/10" />
                </div>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

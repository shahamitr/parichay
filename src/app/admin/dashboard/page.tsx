import { StatCard, SectionHeader, Card } from '@/components/ui';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalBrands: 0,
    totalBranches: 0,
    totalUsers: 0,
    totalViews: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
  });

  // Initialize help for this page
  usePageHelp({ pageContext: 'Dashboard' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Simulate API calls with mock data
      await new Promise(resolve => setTimeout(resolve, 800));

      setStats({
        totalBrands: 12,
        totalBranches: 45,
        totalUsers: 156,
        totalViews: 2847,
        monthlyRevenue: 45600,
        conversionRate: 12.5,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Rise & Shine';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="h-12 bg-neutral-900 border border-neutral-800 rounded-2xl w-1/3 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-neutral-900 border border-neutral-800 rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="h-64 bg-neutral-900 border border-neutral-800 rounded-2xl"></div>
          <div className="lg:col-span-2 h-64 bg-neutral-900 border border-neutral-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-500 mb-2">Systems Overview</p>
          <h1 className="text-4xl font-black text-white tracking-tight">
            {getGreeting()}, <span className="text-neutral-500">{user?.firstName || 'Admin'}</span>
          </h1>
          <p className="text-neutral-500 text-sm font-medium mt-2">Global network performance and metrics for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.</p>
        </div>
        
        <div className="flex items-center gap-3 px-5 py-3 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl">
          <Calendar className="w-4 h-4 text-primary-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard
          title="Active Brands"
          value={stats.totalBrands}
          icon={Building2}
          trend={{ value: 12, label: "vs last month", isPositive: true }}
          color="primary"
        />
        <StatCard
          title="Total Branches"
          value={stats.totalBranches}
          icon={GitBranch}
          trend={{ value: 8, label: "newly added", isPositive: true }}
          color="emerald"
        />
        <StatCard
          title="Active Users"
          value={stats.totalUsers}
          icon={Users}
          trend={{ value: 15, label: "growth rate", isPositive: true }}
          color="purple"
        />
        <StatCard
          title="Total Traffic"
          value={stats.totalViews}
          icon={Eye}
          trend={{ value: 15, label: "page views", isPositive: true }}
          color="amber"
        />
        <StatCard
          title="Net Revenue"
          value={`₹${(stats.monthlyRevenue / 1000).toFixed(0)}K`}
          icon={DollarSign}
          trend={{ value: 12, label: "vs target", isPositive: true }}
          color="rose"
        />
        <StatCard
          title="Conversion"
          value={`${stats.conversionRate}%`}
          icon={TrendingUp}
          trend={{ value: 2.1, label: "improvement", isPositive: true }}
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-colors" />
          
          <SectionHeader
            title="Command Center"
            description="Core administrative tasks"
          />
          
          <div className="grid grid-cols-1 gap-4 mt-8">
            {[
              { label: 'Register New Brand', icon: Building2, href: '/admin/brands', color: 'bg-primary-500' },
              { label: 'Add System Branch', icon: GitBranch, href: '/admin/branches', color: 'bg-emerald-500' },
              { label: 'Manage Network Users', icon: Users, href: '/admin/users', color: 'bg-purple-500' },
              { label: 'Financial Audit', icon: DollarSign, href: '/admin/billing', color: 'bg-rose-500' },
            ].map((action, i) => (
              <button
                key={i}
                onClick={() => router.push(action.href)}
                className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-950 border border-neutral-800/50 hover:border-primary-500/50 hover:bg-neutral-800/50 transition-all group/btn"
              >
                <div className={`w-10 h-10 rounded-xl ${action.color}/10 flex items-center justify-center text-white group-hover/btn:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-neutral-400 group-hover/btn:text-white transition-colors">
                  {action.label}
                </span>
                <TrendingUp className="w-4 h-4 ml-auto text-neutral-800 group-hover/btn:text-primary-500" />
              </button>
            ))}
          </div>
        </div>

        {/* Performance Overview */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
          
          <SectionHeader
            title="Infrastructure Health"
            description="Global system performance metrics"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {[
              { label: 'Network Uptime', value: '98.5%', desc: 'Last 30 days', icon: Activity, color: 'text-emerald-500' },
              { label: 'Avg Latency', value: '2.3s', desc: 'Global average', icon: TrendingUp, color: 'text-primary-500' },
              { label: 'Trust Score', value: '4.8/5', desc: '1,234 reviews', icon: Eye, color: 'text-purple-500' },
            ].map((metric, i) => (
              <div key={i} className="p-8 rounded-3xl bg-neutral-950 border border-neutral-800/50 hover:bg-neutral-900 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-3 rounded-2xl bg-neutral-900 border border-neutral-800 ${metric.color}`}>
                    <metric.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-600">Metric Active</span>
                </div>
                <p className="text-4xl font-black text-white mb-2">{metric.value}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{metric.label}</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="h-1 flex-1 bg-neutral-900 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 w-3/4 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  </div>
                  <span className="text-[8px] font-black text-neutral-600 uppercase">{metric.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

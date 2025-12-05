'use client';

import { useState } from 'react';
import { TrendingUp, Users, Eye, MousePointer, Clock, MapPin, Smartphone, Globe } from 'lucide-react';
import { BarChart, LineChart, DonutChart, StatCard, Heatmap } from '@/components/dashboard/DataVisualization';

export default function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState('7d');

  const visitorData = [
    { label: 'Mon', value: 245 },
    { label: 'Tue', value: 312 },
    { label: 'Wed', value: 189 },
    { label: 'Thu', value: 421 },
    { label: 'Fri', value: 356 },
    { label: 'Sat', value: 289 },
    { label: 'Sun', value: 198 },
  ];

  const deviceData = [
    { label: 'Mobile', value: 65, color: '#3b82f6' },
    { label: 'Desktop', value: 28, color: '#8b5cf6' },
    { label: 'Tablet', value: 7, color: '#ec4899' },
  ];

  const locationData = [
    { label: 'USA', value: 45, color: 'bg-blue-500' },
    { label: 'UK', value: 23, color: 'bg-blue-500' },
    { label: 'Canada', value: 18, color: 'bg-blue-500' },
    { label: 'Australia', value: 14, color: 'bg-blue-500' },
  ];

  const engagementHeatmap = [
    [45, 67, 34, 89, 23, 56, 78],
    [56, 34, 78, 45, 67, 34, 56],
    [34, 89, 23, 67, 45, 78, 34],
    [78, 23, 56, 34, 89, 23, 67],
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Analytics</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Visitors"
          value={2010}
          change={12.5}
          trend="up"
          icon={<Users className="w-6 h-6 text-blue-600" />}
          color="blue"
        />
        <StatCard
          title="Page Views"
          value={8456}
          change={8.3}
          trend="up"
          icon={<Eye className="w-6 h-6 text-green-600" />}
          color="green"
        />
        <StatCard
          title="Avg. Session"
          value="3m 24s"
          change={-2.1}
          trend="down"
          icon={<Clock className="w-6 h-6 text-purple-600" />}
          color="purple"
        />
        <StatCard
          title="Bounce Rate"
          value="42.3%"
          change={-5.2}
          trend="up"
          icon={<MousePointer className="w-6 h-6 text-orange-600" />}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">Visitor Trend</h3>
          <LineChart data={visitorData} height={250} color="blue" />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">Device Distribution</h3>
          <div className="flex justify-center">
            <DonutChart data={deviceData} size={250} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">Top Locations</h3>
          <BarChart data={locationData} height={250} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">Engagement Heatmap</h3>
          <Heatmap
            data={engagementHeatmap}
            rows={['Week 1', 'Week 2', 'Week 3', 'Week 4']}
            cols={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4">Real-time Activity</h3>
        <div className="space-y-3">
          {[
            { user: 'John Doe', action: 'Viewed microsite', location: 'New York, USA', time: '2 min ago' },
            { user: 'Jane Smith', action: 'Scanned QR code', location: 'London, UK', time: '5 min ago' },
            { user: 'Bob Johnson', action: 'Downloaded vCard', location: 'Toronto, Canada', time: '8 min ago' },
            { user: 'Alice Brown', action: 'Clicked contact', location: 'Sydney, Australia', time: '12 min ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {activity.user.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{activity.user}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{activity.action}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {activity.location}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

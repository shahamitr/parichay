// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import {
  DollarSign,
  Download,
  CreditCard,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

export default function BillingManagement() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(1);

  const fetchBillingData = async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/agency/billing?page=${pageNum}`);
      const billingData = await response.json();

      if (response.ok) {
        setData(billingData);
        setPage(pageNum);
      } else {
        toast.error('Failed to load billing data');
      }
    } catch (error) {
      console.error('Billing error:', error);
      toast.error('Failed to load billing data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading billing data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No billing data available</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'OVERDUE':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Billing & Usage</h2>
          <p className="text-gray-600 mt-1">
            Manage your subscription and view billing history
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <CreditCard className="w-4 h-4" />
          Update Payment Method
        </button>
      </div>

      {/* Current Plan & Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={<CreditCard className="w-6 h-6" />}
          title="Current Plan"
          value={data.tenant.plan.replace('AGENCY_', '')}
          subtitle={data.tenant.status}
          color="blue"
        />
        <MetricCard
          icon={<Users className="w-6 h-6" />}
          title="Active Clients"
          value={`${data.currentUsage.activeClients}/${data.currentUsage.clientLimit}`}
          subtitle={`${data.currentUsage.utilizationPercent}% utilized`}
          color="green"
        />
        <MetricCard
          icon={<DollarSign className="w-6 h-6" />}
          title="Current Month"
          value={`$${data.currentMonth.estimatedTotal.toFixed(2)}`}
          subtitle="Estimated"
          color="purple"
        />
        <MetricCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Year to Date"
          value={`$${data.yearToDate.total.toFixed(2)}`}
          subtitle="Total paid"
          color="orange"
        />
      </div>

      {/* Current Month Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Current Month Breakdown</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-900">Base Plan Fee</p>
              <p className="text-sm text-gray-600">{data.tenant.plan} Plan</p>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              ${data.currentMonth.baseFee.toFixed(2)}
            </p>
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-900">Client Fees</p>
              <p className="text-sm text-gray-600">
                {data.currentUsage.activeClients} clients × ${data.tenant.pricePerClient}/mo
              </p>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              ${data.currentMonth.clientFees.toFixed(2)}
            </p>
          </div>
          <div className="flex items-center justify-between py-3 bg-blue-50 rounded-lg px-4">
            <div>
              <p className="font-semibold text-gray-900">Estimated Total</p>
              <p className="text-sm text-gray-600">Due at end of month</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              ${data.currentMonth.estimatedTotal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Usage Progress */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Client Usage</h3>
          <span className="text-sm text-gray-600">
            {data.currentUsage.activeClients} of {data.currentUsage.clientLimit} clients
          </span>
        </div>
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all ${
                data.currentUsage.utilizationPercent >= 90
                  ? 'bg-red-600'
                  : data.currentUsage.utilizationPercent >= 75
                  ? 'bg-yellow-600'
                  : 'bg-green-600'
              }`}
              style={{ width: `${data.currentUsage.utilizationPercent}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {data.currentUsage.utilizationPercent >= 90 ? (
              <span className="text-red-600 font-medium">
                ⚠️ Approaching client limit. Consider upgrading your plan.
              </span>
            ) : data.currentUsage.utilizationPercent >= 75 ? (
              <span className="text-yellow-600 font-medium">
                You're using {data.currentUsage.utilizationPercent}% of your client limit.
              </span>
            ) : (
              <span className="text-green-600">
                You have {data.currentUsage.clientLimit - data.currentUsage.activeClients} client slots available.
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Billing History</h3>
        </div>

        {data.billingHistory.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No billing history yet</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clients
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Base Fee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client Fees
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.billingHistory.map((record: any) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(new Date(record.periodStart), 'MMM yyyy')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(record.periodStart), 'MMM d')} -{' '}
                          {format(new Date(record.periodEnd), 'MMM d')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.clientCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${record.baseFee.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${record.clientFees.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ${record.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                          {getStatusIcon(record.status)}
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700">
                          <Download className="w-4 h-4" />
                          Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data.pagination.pages > 1 && (
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing page {data.pagination.page} of {data.pagination.pages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => fetchBillingData(page - 1)}
                      disabled={page === 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => fetchBillingData(page + 1)}
                      disabled={page === data.pagination.pages}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Upgrade CTA */}
      {data.currentUsage.utilizationPercent >= 75 && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Need More Clients?</h3>
              <p className="text-blue-100">
                Upgrade your plan to add more clients and unlock additional features.
              </p>
            </div>
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
              Upgrade Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ icon, title, value, subtitle, color }: any) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} mb-4`}>
        {icon}
      </div>
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {subtitle && (
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      )}
    </div>
  );
}

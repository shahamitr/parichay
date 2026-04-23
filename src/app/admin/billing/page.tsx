'use client';

import { useState, useEffect } from 'react';
import { usePageHelp } from '@/hooks/usePageHelp';
import { StatCard, SectionHeader, Card, Button } from '@/components/ui';
import {
  Receipt,
  Download,
  CreditCard,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  TrendingUp,
  Activity,
  ArrowUpRight
} from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'FAILED';
  dueDate: string;
  paidDate?: string;
  description: string;
}

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [billingStats, setBillingStats] = useState({
    totalRevenue: 0,
    pendingAmount: 0,
    paidInvoices: 0,
    overdueInvoices: 0
  });

  // Initialize help for this page
  usePageHelp({ pageContext: 'Billing' });

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      setLoading(true);

      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockInvoices: Invoice[] = [
        {
          id: '1',
          invoiceNumber: 'INV-2024-001',
          amount: 2999,
          status: 'PAID',
          dueDate: '2024-01-15',
          paidDate: '2024-01-14',
          description: 'Professional Plan - January 2024'
        },
        {
          id: '2',
          invoiceNumber: 'INV-2024-002',
          amount: 5999,
          status: 'PENDING',
          dueDate: '2024-02-15',
          description: 'Enterprise Plan - February 2024'
        },
        {
          id: '3',
          invoiceNumber: 'INV-2024-003',
          amount: 2999,
          status: 'FAILED',
          dueDate: '2024-01-30',
          description: 'Professional Plan - February 2024'
        }
      ];

      setInvoices(mockInvoices);

      setBillingStats({
        totalRevenue: 45600,
        pendingAmount: 8998,
        paidInvoices: 12,
        overdueInvoices: 1
      });
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log(`Downloading invoice ${invoiceId}`);
  };

  const handleExportAll = () => {
    console.log('Exporting all billing data');
  };

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

  return (
    <div className="p-8 space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <SectionHeader
          title="Financial Operations"
          description="Global revenue tracking and invoice management system."
        />
        <button 
          onClick={handleExportAll}
          className="flex items-center gap-2 px-6 py-3 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
        >
          <FileText className="w-4 h-4" />
          Export Ledger
        </button>
      </div>

      {/* Billing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Gross Revenue"
          value={`₹${(billingStats.totalRevenue / 1000).toFixed(0)}K`}
          icon={DollarSign}
          trend={{ value: 12, label: "growth", isPositive: true }}
          color="primary"
        />
        <StatCard
          title="Outstanding"
          value={`₹${billingStats.pendingAmount.toLocaleString()}`}
          icon={Clock}
          description="2 invoices pending"
          color="amber"
        />
        <StatCard
          title="Cleared Assets"
          value={billingStats.paidInvoices}
          icon={CheckCircle}
          color="emerald"
        />
        <StatCard
          title="System Alerts"
          value={billingStats.overdueInvoices}
          icon={XCircle}
          description="Requires attention"
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Infrastructure */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-colors" />
          
          <SectionHeader
            title="Capital Routing"
            description="Primary payment gateway configuration"
          />

          <div className="mt-8 p-6 bg-neutral-950 border border-neutral-800/50 rounded-3xl relative">
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-500">
                <CreditCard className="w-6 h-6" />
              </div>
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Primary Node</span>
            </div>
            
            <div className="space-y-1 mb-8">
              <p className="text-xl font-black text-white tracking-widest uppercase italic">•••• •••• •••• 4242</p>
              <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Expiration Protocol: 12/26</p>
            </div>

            <button className="w-full py-4 bg-neutral-900 border border-neutral-800 hover:border-primary-500/50 hover:bg-neutral-800 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-white rounded-2xl transition-all">
              Rotate Credential
            </button>
          </div>
          
          <div className="mt-6 flex items-center gap-3 p-4 bg-primary-500/5 border border-primary-500/10 rounded-2xl">
            <Activity className="w-4 h-4 text-primary-500" />
            <span className="text-[9px] font-black uppercase tracking-widest text-primary-400">Gateway Synchronized</span>
          </div>
        </div>

        {/* Recent Ledger */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
          <SectionHeader
            title="Transaction Ledger"
            description="Historical financial records and settlements"
          />

          <div className="mt-8 overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-950/50">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500 border-b border-neutral-800">Reference</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500 border-b border-neutral-800">Quantum</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500 border-b border-neutral-800">State</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500 border-b border-neutral-800 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="group hover:bg-neutral-800/30 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-black uppercase tracking-tight text-white group-hover:text-primary-500 transition-colors">{invoice.invoiceNumber}</span>
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-0.5">{invoice.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-white">₹{invoice.amount.toLocaleString()}</span>
                        <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mt-0.5">Due {new Date(invoice.dueDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5">
                        <span className={`inline-flex px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest w-fit border ${
                          invoice.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                          invoice.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                          'bg-rose-500/10 text-rose-500 border-rose-500/20'
                        }`}>
                          {invoice.status}
                        </span>
                        {invoice.paidDate && (
                          <span className="text-[8px] font-bold text-neutral-600 uppercase tracking-widest">Settled: {new Date(invoice.paidDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => handleDownloadInvoice(invoice.id)}
                        className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-500 hover:text-white hover:border-neutral-700 transition-all"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
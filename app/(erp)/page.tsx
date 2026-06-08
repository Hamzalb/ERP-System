import type { Metadata } from 'next';
import {
  Users, DollarSign, ShoppingCart, Package, TrendingUp,
  Clock, CheckCircle, AlertTriangle, ArrowRight,
} from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatCurrency, formatRelative, getStatusColor } from '@/lib/utils';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Dashboard' };

// Static mock data — replace with real API calls
const stats = [
  { title: 'Total Revenue', value: formatCurrency(248500), icon: DollarSign, change: 12.5, changeLabel: 'vs last month', color: 'indigo' as const },
  { title: 'Total Employees', value: '142', icon: Users, change: 3.2, changeLabel: 'this month', color: 'emerald' as const },
  { title: 'Active Customers', value: '1,284', icon: Users, change: 8.1, changeLabel: 'vs last month', color: 'sky' as const },
  { title: 'Pending Orders', value: '38', icon: ShoppingCart, change: -2.4, changeLabel: 'vs last month', color: 'amber' as const },
  { title: 'Monthly Sales', value: formatCurrency(84200), icon: TrendingUp, change: 14.2, changeLabel: 'vs last month', color: 'violet' as const },
  { title: 'Low Stock Items', value: '12', icon: Package, change: -5, changeLabel: 'items resolved', color: 'rose' as const },
];

const recentInvoices = [
  { id: 'INV-00042', customer: 'TechCorp Ltd', amount: 8400, status: 'paid', date: '2026-06-07T10:00:00Z' },
  { id: 'INV-00041', customer: 'Alpha Solutions', amount: 3200, status: 'sent', date: '2026-06-06T14:30:00Z' },
  { id: 'INV-00040', customer: 'Beta Industries', amount: 15600, status: 'overdue', date: '2026-05-28T09:00:00Z' },
  { id: 'INV-00039', customer: 'Gamma Corp', amount: 720, status: 'paid', date: '2026-06-05T16:00:00Z' },
  { id: 'INV-00038', customer: 'Delta Systems', amount: 4100, status: 'draft', date: '2026-06-08T08:00:00Z' },
];

const recentActivity = [
  { user: 'Sarah Chen', action: 'approved leave request for', target: 'John Doe', time: '2026-06-08T09:15:00Z', icon: CheckCircle, color: 'text-emerald-500' },
  { user: 'Mike Ross', action: 'created invoice', target: 'INV-00042', time: '2026-06-08T08:40:00Z', icon: DollarSign, color: 'text-indigo-500' },
  { user: 'System', action: 'detected low stock on', target: 'USB-C Cables', time: '2026-06-08T07:00:00Z', icon: AlertTriangle, color: 'text-amber-500' },
  { user: 'Emma Davis', action: 'checked in at', target: '08:52 AM', time: '2026-06-08T06:52:00Z', icon: Clock, color: 'text-sky-500' },
];

const monthlyRevenue = [
  { month: 'Jan', revenue: 62000 }, { month: 'Feb', revenue: 58000 }, { month: 'Mar', revenue: 71000 },
  { month: 'Apr', revenue: 68000 }, { month: 'May', revenue: 74000 }, { month: 'Jun', revenue: 84200 },
];
const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue));

const statusVariant = (s: string) => getStatusColor(s) as 'success' | 'warning' | 'danger' | 'default' | 'info';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <Card className="lg:col-span-2" padding="none">
          <div className="p-5 pb-3">
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <Link href="/reports" className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                View report <ArrowRight className="w-3 h-3" />
              </Link>
            </CardHeader>
            <p className="text-2xl font-bold text-slate-900 tabular">{formatCurrency(84200)}</p>
            <p className="text-xs text-slate-400 mt-0.5">June 2026</p>
          </div>
          {/* Simple bar chart */}
          <div className="px-5 pb-5 flex items-end gap-2 h-36">
            {monthlyRevenue.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className="w-full bg-indigo-500 rounded-t-md hover:bg-indigo-600 transition-colors"
                  style={{ height: `${(m.revenue / maxRevenue) * 100}%`, minHeight: '8px' }}
                  title={formatCurrency(m.revenue)}
                />
                <span className="text-[10px] text-slate-400">{m.month}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent activity */}
        <Card padding="none">
          <div className="p-5 pb-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
          </div>
          <div className="px-5 pb-5 space-y-4">
            {recentActivity.map((act, i) => {
              const Icon = act.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-0.5 ${act.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700">
                      <span className="font-medium">{act.user}</span>{' '}
                      {act.action}{' '}
                      <span className="font-medium">{act.target}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{formatRelative(act.time)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card padding="none">
        <div className="p-5 pb-3">
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
            <Link href="/sales/invoices" className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50">
                {['Invoice', 'Customer', 'Amount', 'Status', 'Date'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-indigo-600">{inv.id}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={inv.customer} size="xs" />
                      <span className="text-slate-700">{inv.customer}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 tabular font-medium text-slate-900">{formatCurrency(inv.amount)}</td>
                  <td className="px-5 py-3">
                    <Badge variant={statusVariant(inv.status)} dot>{inv.status}</Badge>
                  </td>
                  <td className="px-5 py-3 text-slate-500 text-xs">{formatRelative(inv.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

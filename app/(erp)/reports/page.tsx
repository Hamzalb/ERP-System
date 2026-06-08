import type { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { BarChart3, Users, Clock, DollarSign, Package, PhoneCall, ShoppingCart, FileText, ArrowRight } from 'lucide-react';

export const metadata: Metadata = { title: 'Reports' };

const REPORTS = [
  { title: 'Revenue Report', desc: 'Monthly and yearly revenue breakdown', icon: DollarSign, href: '/reports/revenue', color: 'bg-indigo-50 text-indigo-600' },
  { title: 'Expense Report', desc: 'Track all company expenses', icon: FileText, href: '/reports/expenses', color: 'bg-red-50 text-red-600' },
  { title: 'Payroll Report', desc: 'Employee salary and tax summary', icon: DollarSign, href: '/reports/payroll', color: 'bg-emerald-50 text-emerald-600' },
  { title: 'Employee Report', desc: 'Headcount, departments, positions', icon: Users, href: '/reports/employees', color: 'bg-sky-50 text-sky-600' },
  { title: 'Attendance Report', desc: 'Daily and monthly attendance stats', icon: Clock, href: '/reports/attendance', color: 'bg-amber-50 text-amber-600' },
  { title: 'Inventory Report', desc: 'Stock levels and valuation', icon: Package, href: '/reports/inventory', color: 'bg-violet-50 text-violet-600' },
  { title: 'Customer Report', desc: 'Customer acquisition and retention', icon: PhoneCall, href: '/reports/customers', color: 'bg-rose-50 text-rose-600' },
  { title: 'Sales Report', desc: 'Sales pipeline and revenue trends', icon: ShoppingCart, href: '/reports/sales', color: 'bg-teal-50 text-teal-600' },
];

export default function ReportsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Reports</h1>
        <p className="text-sm text-slate-500">Comprehensive business analytics and insights</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {REPORTS.map((r) => {
          const Icon = r.icon;
          return (
            <Link key={r.title} href={r.href}>
              <Card hoverable className="h-full">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${r.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="font-semibold text-slate-900 text-sm mb-1">{r.title}</p>
                <p className="text-xs text-slate-500 mb-3">{r.desc}</p>
                <div className="flex items-center gap-1 text-xs text-indigo-600 font-medium">
                  View Report <ArrowRight className="w-3 h-3" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { Plus, Download, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, Pagination } from '@/components/ui/Table';
import { StatCard } from '@/components/ui/StatCard';
import { Avatar } from '@/components/ui/Avatar';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { DollarSign, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const INVOICES = [
  { _id: '1', invoiceNumber: 'INV-00042', customer: { name: 'TechCorp Ltd' }, total: 8400, status: 'paid', issueDate: '2026-06-01', dueDate: '2026-06-30', currency: 'USD' },
  { _id: '2', invoiceNumber: 'INV-00041', customer: { name: 'Alpha Solutions' }, total: 3200, status: 'sent', issueDate: '2026-05-25', dueDate: '2026-06-25', currency: 'USD' },
  { _id: '3', invoiceNumber: 'INV-00040', customer: { name: 'Beta Industries' }, total: 15600, status: 'overdue', issueDate: '2026-05-01', dueDate: '2026-05-31', currency: 'USD' },
  { _id: '4', invoiceNumber: 'INV-00039', customer: { name: 'Gamma Corp' }, total: 720, status: 'paid', issueDate: '2026-06-05', dueDate: '2026-07-05', currency: 'USD' },
  { _id: '5', invoiceNumber: 'INV-00038', customer: { name: 'Delta Systems' }, total: 4100, status: 'draft', issueDate: '2026-06-08', dueDate: '2026-07-08', currency: 'USD' },
];

const sv = (s: string) => getStatusColor(s) as 'success' | 'warning' | 'danger' | 'default' | 'info';

export default function InvoicesPage() {
  const [page, setPage] = useState(1);

  const columns = [
    { key: 'invoiceNumber', header: 'Invoice #', render: (_: unknown, r: typeof INVOICES[0]) => <span className="font-medium text-indigo-600">{r.invoiceNumber}</span> },
    { key: 'customer', header: 'Customer', render: (_: unknown, r: typeof INVOICES[0]) => (
      <div className="flex items-center gap-2"><Avatar name={r.customer.name} size="xs" /><span>{r.customer.name}</span></div>
    ) },
    { key: 'total', header: 'Amount', render: (_: unknown, r: typeof INVOICES[0]) => <span className="tabular font-semibold">{formatCurrency(r.total, r.currency)}</span> },
    { key: 'status', header: 'Status', render: (_: unknown, r: typeof INVOICES[0]) => <Badge variant={sv(r.status)} dot>{r.status}</Badge> },
    { key: 'issueDate', header: 'Issue Date', render: (_: unknown, r: typeof INVOICES[0]) => formatDate(r.issueDate) },
    { key: 'dueDate', header: 'Due Date', render: (_: unknown, r: typeof INVOICES[0]) => <span className={r.status === 'overdue' ? 'text-red-500 font-medium' : ''}>{formatDate(r.dueDate)}</span> },
    { key: 'actions', header: '', render: () => (
      <div className="flex items-center gap-2">
        <button className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"><Eye className="w-4 h-4" /></button>
        <button className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"><Download className="w-4 h-4" /></button>
      </div>
    ) },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Invoices</h1>
        <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>New Invoice</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={formatCurrency(248500)} icon={DollarSign} color="indigo" />
        <StatCard title="Paid" value="38" icon={CheckCircle} color="emerald" />
        <StatCard title="Pending" value="12" icon={Clock} color="amber" />
        <StatCard title="Overdue" value="4" icon={AlertTriangle} color="rose" />
      </div>

      <Card padding="none">
        <div className="p-5 pb-3"><CardHeader><CardTitle>All Invoices</CardTitle></CardHeader></div>
        <Table columns={columns as any} data={INVOICES as any} />
        <div className="p-4 border-t border-slate-100">
          <Pagination page={page} totalPages={5} onPageChange={setPage} />
        </div>
      </Card>
    </div>
  );
}

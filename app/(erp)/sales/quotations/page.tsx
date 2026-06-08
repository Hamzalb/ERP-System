'use client';
import { useState } from 'react';
import { Plus, FileText, Clock, CheckCircle, XCircle, Send } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, Pagination } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { formatCurrency, formatDate } from '@/lib/utils';

const QUOTATIONS = [
  { _id: '1', quoteNumber: 'QUO-0001', customer: 'TechCorp Ltd', status: 'sent', totalAmount: 18500, validUntil: '2026-06-30', createdAt: '2026-06-01', items: 5 },
  { _id: '2', quoteNumber: 'QUO-0002', customer: 'Alpha Solutions', status: 'accepted', totalAmount: 7200, validUntil: '2026-06-25', createdAt: '2026-06-03', items: 3 },
  { _id: '3', quoteNumber: 'QUO-0003', customer: 'Beta Industries', status: 'draft', totalAmount: 31000, validUntil: '2026-07-15', createdAt: '2026-06-07', items: 8 },
  { _id: '4', quoteNumber: 'QUO-0004', customer: 'Gamma Corp', status: 'declined', totalAmount: 5400, validUntil: '2026-06-10', createdAt: '2026-05-25', items: 2 },
  { _id: '5', quoteNumber: 'QUO-0005', customer: 'Delta Systems', status: 'sent', totalAmount: 12800, validUntil: '2026-07-01', createdAt: '2026-06-05', items: 6 },
];

const sv: Record<string, 'success' | 'warning' | 'danger' | 'default' | 'primary'> = {
  accepted: 'success', sent: 'primary', draft: 'default', declined: 'danger',
};

export default function QuotationsPage() {
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);

  const stats = [
    { label: 'Total Quotes', value: QUOTATIONS.length, icon: FileText, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Pending', value: QUOTATIONS.filter(q => q.status === 'sent').length, icon: Clock, color: 'text-amber-600 bg-amber-50' },
    { label: 'Accepted', value: QUOTATIONS.filter(q => q.status === 'accepted').length, icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Total Value', value: formatCurrency(QUOTATIONS.reduce((s, q) => s + q.totalAmount, 0)), icon: Send, color: 'text-violet-600 bg-violet-50' },
  ];

  const columns = [
    { key: 'quoteNumber', header: 'Quote #', render: (_: unknown, r: typeof QUOTATIONS[0]) => (
      <span className="font-mono text-sm font-semibold text-indigo-600">{r.quoteNumber}</span>
    ) },
    { key: 'customer', header: 'Customer', render: (_: unknown, r: typeof QUOTATIONS[0]) => (
      <span className="text-sm font-medium text-slate-900">{r.customer}</span>
    ) },
    { key: 'items', header: 'Items', render: (_: unknown, r: typeof QUOTATIONS[0]) => (
      <span className="text-sm text-slate-500">{r.items} items</span>
    ) },
    { key: 'totalAmount', header: 'Total', render: (_: unknown, r: typeof QUOTATIONS[0]) => (
      <span className="text-sm font-bold tabular text-slate-900">{formatCurrency(r.totalAmount)}</span>
    ) },
    { key: 'validUntil', header: 'Valid Until', render: (_: unknown, r: typeof QUOTATIONS[0]) => (
      <span className="text-sm text-slate-500">{formatDate(r.validUntil)}</span>
    ) },
    { key: 'status', header: 'Status', render: (_: unknown, r: typeof QUOTATIONS[0]) => (
      <Badge variant={sv[r.status] ?? 'default'} dot className="capitalize">{r.status}</Badge>
    ) },
    { key: 'actions', header: '', render: (_: unknown, r: typeof QUOTATIONS[0]) => (
      <div className="flex gap-1.5">
        {r.status === 'draft' && <button className="text-xs text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded font-medium">Send</button>}
        {r.status === 'accepted' && <button className="text-xs text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded font-medium">Convert</button>}
        <button className="text-xs text-slate-400 hover:bg-slate-100 px-2 py-1 rounded">View</button>
      </div>
    ) },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Quotations</h1>
          <p className="text-sm text-slate-500">{QUOTATIONS.length} quotes total</p>
        </div>
        <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>
          New Quote
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} padding="sm" tilt>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className="text-lg font-bold text-slate-900">{s.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Table columns={columns as any} data={QUOTATIONS as any} />
      <Pagination page={page} totalPages={1} onPageChange={setPage} />

      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Quotation"
        footer={<><Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button><Button>Create Quote</Button></>}>
        <div className="space-y-4">
          <Select label="Customer" required options={[
            { label: 'TechCorp Ltd', value: 'c1' },
            { label: 'Alpha Solutions', value: 'c2' },
            { label: 'Beta Industries', value: 'c3' },
          ]} />
          <Input label="Valid Until" type="date" required />
          <div className="border-2 border-slate-100 rounded-xl p-3 space-y-3">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Items</p>
            <div className="grid grid-cols-3 gap-2">
              <Input label="Product" placeholder="Product name" />
              <Input label="Qty" type="number" placeholder="1" />
              <Input label="Unit Price" type="number" placeholder="0.00" />
            </div>
            <button className="text-xs text-indigo-600 hover:underline">+ Add item</button>
          </div>
          <Input label="Notes" placeholder="Terms and conditions..." />
        </div>
      </Modal>
    </div>
  );
}

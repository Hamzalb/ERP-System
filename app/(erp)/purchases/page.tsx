'use client';
import { useState } from 'react';
import { Plus, ShoppingCart, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, Pagination } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { formatCurrency, formatDate } from '@/lib/utils';

const ORDERS = [
  { _id: '1', poNumber: 'PO-0001', supplier: { name: 'Tech Supplies Co.' }, status: 'received', totalAmount: 12500, expectedDate: '2026-06-01', createdAt: '2026-05-25T10:00:00Z', items: 8 },
  { _id: '2', poNumber: 'PO-0002', supplier: { name: 'Office World' }, status: 'approved', totalAmount: 3200, expectedDate: '2026-06-12', createdAt: '2026-06-01T09:00:00Z', items: 4 },
  { _id: '3', poNumber: 'PO-0003', supplier: { name: 'Global Materials' }, status: 'pending', totalAmount: 8750, expectedDate: '2026-06-20', createdAt: '2026-06-05T14:00:00Z', items: 12 },
  { _id: '4', poNumber: 'PO-0004', supplier: { name: 'FastShip Ltd.' }, status: 'ordered', totalAmount: 5100, expectedDate: '2026-06-15', createdAt: '2026-06-03T11:00:00Z', items: 6 },
  { _id: '5', poNumber: 'PO-0005', supplier: { name: 'Tech Supplies Co.' }, status: 'cancelled', totalAmount: 1800, expectedDate: '2026-05-30', createdAt: '2026-05-20T08:00:00Z', items: 2 },
];

const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'default' | 'primary'> = {
  received: 'success',
  approved: 'primary',
  ordered: 'warning',
  pending: 'default',
  cancelled: 'danger',
};

export default function PurchasesPage() {
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = filterStatus === 'all' ? ORDERS : ORDERS.filter((o) => o.status === filterStatus);

  const stats = [
    { label: 'Total Orders', value: ORDERS.length, icon: ShoppingCart, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Total Spent', value: formatCurrency(ORDERS.filter(o => o.status === 'received').reduce((s, o) => s + o.totalAmount, 0)), icon: TrendingUp, color: 'text-green-600 bg-green-50' },
    { label: 'Pending Orders', value: ORDERS.filter(o => ['pending', 'approved', 'ordered'].includes(o.status)).length, icon: Clock, color: 'text-amber-600 bg-amber-50' },
    { label: 'Received', value: ORDERS.filter(o => o.status === 'received').length, icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
  ];

  const columns = [
    { key: 'poNumber', header: 'PO Number', render: (_: unknown, r: typeof ORDERS[0]) => (
      <span className="font-mono text-sm font-medium text-indigo-600">{r.poNumber}</span>
    ) },
    { key: 'supplier', header: 'Supplier', render: (_: unknown, r: typeof ORDERS[0]) => (
      <span className="text-sm text-slate-900">{r.supplier.name}</span>
    ) },
    { key: 'items', header: 'Items', render: (_: unknown, r: typeof ORDERS[0]) => (
      <span className="text-sm text-slate-600">{r.items} items</span>
    ) },
    { key: 'totalAmount', header: 'Total', render: (_: unknown, r: typeof ORDERS[0]) => (
      <span className="text-sm font-semibold text-slate-900">{formatCurrency(r.totalAmount)}</span>
    ) },
    { key: 'expectedDate', header: 'Expected', render: (_: unknown, r: typeof ORDERS[0]) => (
      <span className="text-sm text-slate-500">{formatDate(r.expectedDate)}</span>
    ) },
    { key: 'status', header: 'Status', render: (_: unknown, r: typeof ORDERS[0]) => (
      <Badge variant={statusVariant[r.status] ?? 'default'} dot>{r.status}</Badge>
    ) },
    { key: 'actions', header: '', render: (_: unknown, r: typeof ORDERS[0]) => (
      <div className="flex gap-1.5">
        {r.status === 'approved' && (
          <button className="text-xs text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded font-medium">Receive</button>
        )}
        {r.status === 'pending' && (
          <button className="text-xs text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded font-medium">Approve</button>
        )}
        <button className="text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-2 py-1 rounded font-medium">View</button>
      </div>
    ) },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Purchase Orders</h1>
          <p className="text-sm text-slate-500">{ORDERS.length} orders total</p>
        </div>
        <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>
          New Order
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} padding="sm">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>
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

      {/* Filters */}
      <Card padding="sm">
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'approved', 'ordered', 'received', 'cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                filterStatus === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </Card>

      <Table columns={columns as any} data={filtered as any} />
      <Pagination page={page} totalPages={Math.ceil(filtered.length / 10) || 1} onPageChange={setPage} />

      {/* New PO Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="New Purchase Order"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button>Create Order</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Supplier"
            required
            options={[
              { label: 'Tech Supplies Co.', value: 'sup1' },
              { label: 'Office World', value: 'sup2' },
              { label: 'Global Materials', value: 'sup3' },
            ]}
          />
          <Input label="Expected Delivery Date" type="date" required />
          <div className="border border-slate-200 rounded-lg p-3 space-y-3">
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Items</p>
            <div className="grid grid-cols-3 gap-2">
              <Input label="Product" placeholder="Product name" />
              <Input label="Qty" type="number" placeholder="0" />
              <Input label="Unit Price" type="number" placeholder="0.00" />
            </div>
            <button className="text-xs text-indigo-600 hover:underline">+ Add item</button>
          </div>
          <Input label="Notes" placeholder="Optional notes..." />
        </div>
      </Modal>
    </div>
  );
}

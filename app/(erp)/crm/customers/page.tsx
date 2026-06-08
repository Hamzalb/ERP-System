'use client';
import { useState } from 'react';
import { Plus, Users, DollarSign, ShoppingCart, Star } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, Pagination } from '@/components/ui/Table';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { formatCurrency, formatDate } from '@/lib/utils';

const CUSTOMERS = [
  { _id: '1', name: 'TechCorp Ltd', email: 'billing@techcorp.com', phone: '+1 555-0100', company: 'TechCorp Ltd', status: 'active', totalRevenue: 48200, totalOrders: 12, createdAt: '2025-03-15T00:00:00Z', segment: 'enterprise' },
  { _id: '2', name: 'Alpha Solutions', email: 'info@alphasolutions.io', phone: '+1 555-0201', company: 'Alpha Solutions', status: 'active', totalRevenue: 22100, totalOrders: 7, createdAt: '2025-06-01T00:00:00Z', segment: 'smb' },
  { _id: '3', name: 'Beta Industries', email: 'accounts@beta.com', phone: '+1 555-0302', company: 'Beta Industries', status: 'active', totalRevenue: 35800, totalOrders: 9, createdAt: '2025-01-20T00:00:00Z', segment: 'enterprise' },
  { _id: '4', name: 'Gamma Corp', email: 'contact@gamma.co', phone: '+1 555-0403', company: 'Gamma Corp', status: 'inactive', totalRevenue: 8400, totalOrders: 3, createdAt: '2025-09-10T00:00:00Z', segment: 'smb' },
  { _id: '5', name: 'Delta Systems', email: 'delta@delta.net', phone: '+1 555-0504', company: 'Delta Systems', status: 'active', totalRevenue: 15600, totalOrders: 5, createdAt: '2025-11-05T00:00:00Z', segment: 'mid-market' },
];

const segmentColor: Record<string, string> = {
  enterprise: 'text-purple-700 bg-purple-50',
  'mid-market': 'text-indigo-700 bg-indigo-50',
  smb: 'text-sky-700 bg-sky-50',
};

export default function CustomersPage() {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = CUSTOMERS.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()),
  );

  const totalRevenue = CUSTOMERS.reduce((s, c) => s + c.totalRevenue, 0);
  const activeCount = CUSTOMERS.filter((c) => c.status === 'active').length;
  const totalOrders = CUSTOMERS.reduce((s, c) => s + c.totalOrders, 0);

  const columns = [
    { key: 'name', header: 'Customer', render: (_: unknown, r: typeof CUSTOMERS[0]) => (
      <div className="flex items-center gap-3">
        <Avatar name={r.name} size="sm" />
        <div>
          <p className="text-sm font-medium text-slate-900">{r.name}</p>
          <p className="text-xs text-slate-400">{r.email}</p>
        </div>
      </div>
    ) },
    { key: 'company', header: 'Company', render: (_: unknown, r: typeof CUSTOMERS[0]) => (
      <span className="text-sm text-slate-700">{r.company}</span>
    ) },
    { key: 'segment', header: 'Segment', render: (_: unknown, r: typeof CUSTOMERS[0]) => (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${segmentColor[r.segment] ?? 'text-slate-600 bg-slate-100'}`}>
        {r.segment}
      </span>
    ) },
    { key: 'totalOrders', header: 'Orders', render: (_: unknown, r: typeof CUSTOMERS[0]) => (
      <span className="text-sm text-slate-600">{r.totalOrders}</span>
    ) },
    { key: 'totalRevenue', header: 'Revenue', render: (_: unknown, r: typeof CUSTOMERS[0]) => (
      <span className="text-sm font-semibold tabular text-slate-900">{formatCurrency(r.totalRevenue)}</span>
    ) },
    { key: 'status', header: 'Status', render: (_: unknown, r: typeof CUSTOMERS[0]) => (
      <Badge variant={r.status === 'active' ? 'success' : 'default'} dot>{r.status}</Badge>
    ) },
    { key: 'createdAt', header: 'Since', render: (_: unknown, r: typeof CUSTOMERS[0]) => (
      <span className="text-xs text-slate-400">{formatDate(r.createdAt)}</span>
    ) },
    { key: 'actions', header: '', render: () => (
      <div className="flex gap-1">
        <button className="text-xs text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded">View</button>
        <button className="text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-2 py-1 rounded">Edit</button>
      </div>
    ) },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Customers</h1>
          <p className="text-sm text-slate-500">{CUSTOMERS.length} customers</p>
        </div>
        <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>
          Add Customer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: CUSTOMERS.length, icon: Users, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Active', value: activeCount, icon: Star, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Total Orders', value: totalOrders, icon: ShoppingCart, color: 'text-sky-600 bg-sky-50' },
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'text-violet-600 bg-violet-50' },
        ].map((s) => (
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

      {/* Search */}
      <Card padding="sm">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers by name or email..."
          className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </Card>

      <Table columns={columns as any} data={filtered as any} />
      <Pagination page={page} totalPages={Math.ceil(filtered.length / 10) || 1} onPageChange={setPage} />

      {/* Add Customer Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Add Customer"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button>Create Customer</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Full Name" placeholder="John Smith" required />
          <Input label="Email" type="email" placeholder="john@company.com" required />
          <Input label="Phone" type="tel" placeholder="+1 555-0100" />
          <Input label="Company" placeholder="Company name" />
          <Select
            label="Segment"
            options={[
              { label: 'Enterprise', value: 'enterprise' },
              { label: 'Mid-Market', value: 'mid-market' },
              { label: 'SMB', value: 'smb' },
            ]}
          />
          <Input label="Address" placeholder="Street address" />
        </div>
      </Modal>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { Plus, Search, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, Pagination } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { formatCurrency } from '@/lib/utils';

const PRODUCTS = [
  { _id: '1', name: 'Wireless Headset Pro', sku: 'WHP-001', category: { name: 'Electronics' }, stock: 45, minStock: 10, salePrice: 129.99, costPrice: 75, status: 'active' },
  { _id: '2', name: 'USB-C Cables (2m)', sku: 'USB-002', category: { name: 'Accessories' }, stock: 8, minStock: 20, salePrice: 14.99, costPrice: 4, status: 'active' },
  { _id: '3', name: 'Laptop Stand Aluminum', sku: 'LSA-003', category: { name: 'Accessories' }, stock: 32, minStock: 5, salePrice: 59.99, costPrice: 22, status: 'active' },
  { _id: '4', name: 'Mechanical Keyboard', sku: 'MKB-004', category: { name: 'Electronics' }, stock: 3, minStock: 8, salePrice: 189.99, costPrice: 95, status: 'active' },
  { _id: '5', name: 'Monitor 27" 4K', sku: 'MON-005', category: { name: 'Electronics' }, stock: 14, minStock: 5, salePrice: 649.99, costPrice: 380, status: 'active' },
];

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);

  const lowStock = PRODUCTS.filter((p) => p.stock <= p.minStock);
  const filtered = PRODUCTS.filter((p) => `${p.name} ${p.sku}`.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    {
      key: 'name', header: 'Product',
      render: (_: unknown, r: typeof PRODUCTS[0]) => (
        <div>
          <p className="font-medium text-sm text-slate-900">{r.name}</p>
          <p className="text-xs text-slate-400 font-mono">{r.sku}</p>
        </div>
      ),
    },
    { key: 'category', header: 'Category', render: (_: unknown, r: typeof PRODUCTS[0]) => r.category.name },
    {
      key: 'stock', header: 'Stock',
      render: (_: unknown, r: typeof PRODUCTS[0]) => (
        <div className="flex items-center gap-2">
          <span className={`tabular font-semibold text-sm ${r.stock <= r.minStock ? 'text-red-600' : 'text-slate-900'}`}>{r.stock}</span>
          {r.stock <= r.minStock && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
        </div>
      ),
    },
    { key: 'minStock', header: 'Min Stock' },
    { key: 'costPrice', header: 'Cost', render: (_: unknown, r: typeof PRODUCTS[0]) => <span className="tabular">{formatCurrency(r.costPrice)}</span> },
    { key: 'salePrice', header: 'Sale Price', render: (_: unknown, r: typeof PRODUCTS[0]) => <span className="tabular font-medium">{formatCurrency(r.salePrice)}</span> },
    { key: 'status', header: 'Status', render: (_: unknown, r: typeof PRODUCTS[0]) => <Badge variant="success" dot>{r.status}</Badge> },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500">{PRODUCTS.length} products · {lowStock.length} low stock</p>
        </div>
        <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>Add Product</Button>
      </div>

      {lowStock.length > 0 && (
        <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span><strong>{lowStock.length} items</strong> are below minimum stock: {lowStock.map((p) => p.name).join(', ')}</span>
        </div>
      )}

      <Card padding="sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="search" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xs h-9 pl-9 pr-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </Card>

      <Table columns={columns as any} data={filtered as any} />

      <Pagination page={page} totalPages={3} onPageChange={setPage} />

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Product" size="lg"
        footer={<><Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button><Button>Create Product</Button></>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Product Name" placeholder="Wireless Headset" required />
          <Input label="SKU" placeholder="WHP-001" required />
          <Input label="Barcode" placeholder="1234567890" />
          <Select label="Category" options={[{ label: 'Electronics', value: 'electronics' }, { label: 'Accessories', value: 'accessories' }]} required />
          <Input label="Cost Price" type="number" placeholder="0.00" />
          <Input label="Sale Price" type="number" placeholder="0.00" required />
          <Input label="Initial Stock" type="number" placeholder="0" />
          <Input label="Min Stock Alert" type="number" placeholder="5" />
        </div>
      </Modal>
    </div>
  );
}

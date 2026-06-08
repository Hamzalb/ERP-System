'use client';
import { useState } from 'react';
import { Plus, Tag, Package } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Table, Pagination } from '@/components/ui/Table';

const CATEGORIES = [
  { _id: '1', name: 'Electronics', description: 'Electronic devices and accessories', productCount: 48, slug: 'electronics' },
  { _id: '2', name: 'Office Supplies', description: 'Stationery and office equipment', productCount: 32, slug: 'office-supplies' },
  { _id: '3', name: 'Furniture', description: 'Desks, chairs, and storage', productCount: 15, slug: 'furniture' },
  { _id: '4', name: 'Software', description: 'Licenses and subscriptions', productCount: 12, slug: 'software' },
  { _id: '5', name: 'Networking', description: 'Routers, switches, cables', productCount: 24, slug: 'networking' },
  { _id: '6', name: 'Consumables', description: 'Ink, paper, batteries', productCount: 67, slug: 'consumables' },
];

const PALETTE = [
  'bg-indigo-100 text-indigo-700', 'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700',
  'bg-sky-100 text-sky-700', 'bg-violet-100 text-violet-700',
];

export default function CategoriesPage() {
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);

  const columns = [
    { key: 'name', header: 'Category', render: (_: unknown, r: typeof CATEGORIES[0], i: number) => (
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${PALETTE[i % PALETTE.length]}`}>
          <Tag className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{r.name}</p>
          <p className="text-xs text-slate-400">{r.slug}</p>
        </div>
      </div>
    ) },
    { key: 'description', header: 'Description', render: (_: unknown, r: typeof CATEGORIES[0]) => (
      <span className="text-sm text-slate-600">{r.description}</span>
    ) },
    { key: 'productCount', header: 'Products', render: (_: unknown, r: typeof CATEGORIES[0]) => (
      <div className="flex items-center gap-1.5">
        <Package className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-sm font-semibold text-slate-900">{r.productCount}</span>
      </div>
    ) },
    { key: 'actions', header: '', render: () => (
      <div className="flex gap-1">
        <button className="text-xs text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded">Edit</button>
        <button className="text-xs text-slate-500 hover:text-red-500 hover:bg-red-50 px-2 py-1 rounded">Delete</button>
      </div>
    ) },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Categories</h1>
          <p className="text-sm text-slate-500">{CATEGORIES.length} categories · {CATEGORIES.reduce((s, c) => s + c.productCount, 0)} products</p>
        </div>
        <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>
          Add Category
        </Button>
      </div>

      {/* Category grid cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {CATEGORIES.map((cat, i) => (
          <Card key={cat._id} hoverable tilt padding="sm" className="text-center cursor-pointer">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${PALETTE[i % PALETTE.length]}`}>
              <Tag className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-slate-900">{cat.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">{cat.productCount} products</p>
          </Card>
        ))}
      </div>

      <Table columns={columns as any} data={CATEGORIES.map((c, i) => ({ ...c, _rowIndex: i })) as any} />
      <Pagination page={page} totalPages={1} onPageChange={setPage} />

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Category"
        footer={<><Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button><Button>Create</Button></>}>
        <div className="space-y-4">
          <Input label="Category Name" placeholder="e.g. Electronics" required />
          <Input label="Slug" placeholder="e.g. electronics" />
          <Input label="Description" placeholder="Brief description..." />
        </div>
      </Modal>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, Pagination } from '@/components/ui/Table';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { formatRelative, getStatusColor } from '@/lib/utils';

const USERS = [
  { _id: '1', name: 'Admin User', email: 'admin@erp.com', roles: [{ name: 'SuperAdmin' }], status: 'active', lastLogin: '2026-06-08T09:00:00Z', avatar: null },
  { _id: '2', name: 'Sarah Chen', email: 'sarah@company.com', roles: [{ name: 'HR' }], status: 'active', lastLogin: '2026-06-08T08:52:00Z', avatar: null },
  { _id: '3', name: 'John Doe', email: 'john@company.com', roles: [{ name: 'Accountant' }], status: 'active', lastLogin: '2026-06-07T17:30:00Z', avatar: null },
  { _id: '4', name: 'Emma Davis', email: 'emma@company.com', roles: [{ name: 'Sales' }], status: 'inactive', lastLogin: '2026-06-05T12:00:00Z', avatar: null },
];

const sv = (s: string) => getStatusColor(s) as 'success' | 'warning' | 'danger' | 'default';

export default function UsersPage() {
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);

  const columns = [
    { key: 'name', header: 'User', render: (_: unknown, r: typeof USERS[0]) => (
      <div className="flex items-center gap-3"><Avatar name={r.name} size="sm" /><div><p className="text-sm font-medium text-slate-900">{r.name}</p><p className="text-xs text-slate-400">{r.email}</p></div></div>
    ) },
    { key: 'roles', header: 'Role', render: (_: unknown, r: typeof USERS[0]) => (
      <div className="flex gap-1">{r.roles.map((role) => <Badge key={role.name} variant="primary">{role.name}</Badge>)}</div>
    ) },
    { key: 'status', header: 'Status', render: (_: unknown, r: typeof USERS[0]) => <Badge variant={sv(r.status)} dot>{r.status}</Badge> },
    { key: 'lastLogin', header: 'Last Login', render: (_: unknown, r: typeof USERS[0]) => r.lastLogin ? <span className="text-sm text-slate-500">{formatRelative(r.lastLogin)}</span> : <span className="text-slate-300">Never</span> },
    { key: 'actions', header: '', render: (_: unknown, r: typeof USERS[0]) => (
      <div className="flex gap-1.5">
        <button className="text-xs text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded font-medium">Edit</button>
        <button className="text-xs text-slate-500 hover:text-red-500 hover:bg-red-50 px-2 py-1 rounded font-medium">Deactivate</button>
      </div>
    ) },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">User Management</h1>
          <p className="text-sm text-slate-500">{USERS.length} users</p>
        </div>
        <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>Add User</Button>
      </div>

      <Table columns={columns as any} data={USERS as any} />
      <Pagination page={page} totalPages={2} onPageChange={setPage} />

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add User"
        footer={<><Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button><Button>Create User</Button></>}>
        <div className="space-y-4">
          <Input label="Full Name" placeholder="John Smith" required />
          <Input label="Email" type="email" placeholder="john@company.com" required />
          <Input label="Password" type="password" placeholder="Min 8 chars, 1 uppercase, 1 number" required />
          <Select label="Role" required options={[{ label: 'Admin', value: 'admin' }, { label: 'HR', value: 'hr' }, { label: 'Accountant', value: 'accountant' }, { label: 'Sales', value: 'sales' }, { label: 'Viewer', value: 'viewer' }]} />
        </div>
      </Modal>
    </div>
  );
}

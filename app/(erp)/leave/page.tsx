'use client';
import { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate, getStatusColor } from '@/lib/utils';
import { toast } from 'sonner';

const LEAVE_REQUESTS = [
  { _id: '1', employee: { firstName: 'John', lastName: 'Doe' }, leaveType: { name: 'Annual Leave', color: '#4F46E5' }, startDate: '2026-06-15', endDate: '2026-06-20', days: 6, status: 'pending', reason: 'Family vacation' },
  { _id: '2', employee: { firstName: 'Emma', lastName: 'Davis' }, leaveType: { name: 'Sick Leave', color: '#EF4444' }, startDate: '2026-06-10', endDate: '2026-06-11', days: 2, status: 'approved', reason: 'Medical appointment' },
  { _id: '3', employee: { firstName: 'Mike', lastName: 'Ross' }, leaveType: { name: 'Annual Leave', color: '#4F46E5' }, startDate: '2026-07-01', endDate: '2026-07-05', days: 5, status: 'rejected', reason: 'Holiday trip' },
];

const BALANCE = [
  { type: 'Annual Leave', color: '#4F46E5', max: 21, used: 6 },
  { type: 'Sick Leave', color: '#EF4444', max: 10, used: 2 },
  { type: 'Personal Leave', color: '#F59E0B', max: 5, used: 0 },
];

export default function LeavePage() {
  const [showModal, setShowModal] = useState(false);
  const sv = (s: string) => getStatusColor(s) as 'success' | 'warning' | 'danger' | 'default';

  const columns = [
    {
      key: 'employee', header: 'Employee',
      render: (_: unknown, r: typeof LEAVE_REQUESTS[0]) => (
        <div className="flex items-center gap-2">
          <Avatar name={`${r.employee.firstName} ${r.employee.lastName}`} size="sm" />
          <span className="font-medium text-sm">{r.employee.firstName} {r.employee.lastName}</span>
        </div>
      ),
    },
    { key: 'leaveType', header: 'Type', render: (_: unknown, r: typeof LEAVE_REQUESTS[0]) => (
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: r.leaveType.color }} />
        {r.leaveType.name}
      </div>
    ) },
    { key: 'startDate', header: 'From', render: (_: unknown, r: typeof LEAVE_REQUESTS[0]) => formatDate(r.startDate) },
    { key: 'endDate', header: 'To', render: (_: unknown, r: typeof LEAVE_REQUESTS[0]) => formatDate(r.endDate) },
    { key: 'days', header: 'Days', render: (_: unknown, r: typeof LEAVE_REQUESTS[0]) => `${r.days}d` },
    { key: 'status', header: 'Status', render: (_: unknown, r: typeof LEAVE_REQUESTS[0]) => <Badge variant={sv(r.status)} dot>{r.status}</Badge> },
    { key: 'actions', header: '', render: (_: unknown, r: typeof LEAVE_REQUESTS[0]) => r.status === 'pending' ? (
      <div className="flex items-center gap-1.5">
        <button onClick={() => toast.success('Leave approved')} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium px-2 py-1 rounded hover:bg-emerald-50">Approve</button>
        <button onClick={() => toast.error('Leave rejected')} className="text-xs text-red-500 hover:text-red-600 font-medium px-2 py-1 rounded hover:bg-red-50">Reject</button>
      </div>
    ) : null },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Leave Management</h1>
          <p className="text-sm text-slate-500">{LEAVE_REQUESTS.filter(r => r.status === 'pending').length} pending requests</p>
        </div>
        <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>
          Request Leave
        </Button>
      </div>

      {/* Leave Balance */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {BALANCE.map((b) => (
          <Card key={b.type}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-3 h-3 rounded-full" style={{ background: b.color }} />
              <span className="text-sm font-medium text-slate-700">{b.type}</span>
            </div>
            <div className="flex items-end justify-between mb-2">
              <p className="text-2xl font-bold text-slate-900">{b.max - b.used}<span className="text-sm text-slate-400 font-normal ml-1">remaining</span></p>
              <p className="text-xs text-slate-400">{b.used}/{b.max} used</p>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${(b.used / b.max) * 100}%`, background: b.color }} />
            </div>
          </Card>
        ))}
      </div>

      {/* Requests table */}
      <Card padding="none">
        <div className="p-5 pb-3"><CardHeader><CardTitle>Leave Requests</CardTitle></CardHeader></div>
        <Table columns={columns as any} data={LEAVE_REQUESTS as any} />
      </Card>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Request Leave"
        footer={<><Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button><Button>Submit Request</Button></>}>
        <div className="space-y-4">
          <Select label="Leave Type" options={[{ label: 'Annual Leave', value: 'annual' }, { label: 'Sick Leave', value: 'sick' }]} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" required />
            <Input label="End Date" type="date" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Reason</label>
            <textarea className="w-full h-24 px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Reason for leave..." />
          </div>
        </div>
      </Modal>
    </div>
  );
}

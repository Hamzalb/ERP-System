'use client';
import { useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertTriangle, Play, Square } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/StatCard';
import { Table } from '@/components/ui/Table';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

const ATTENDANCE = [
  { _id: '1', employee: { firstName: 'Sarah', lastName: 'Chen', employeeId: 'EMP-0001' }, date: '2026-06-08', checkIn: '08:52', checkOut: '17:05', totalHours: 8.2, status: 'present', isLate: false, lateMinutes: 0 },
  { _id: '2', employee: { firstName: 'John', lastName: 'Doe', employeeId: 'EMP-0002' }, date: '2026-06-08', checkIn: '09:35', checkOut: null, totalHours: 0, status: 'late', isLate: true, lateMinutes: 35 },
  { _id: '3', employee: { firstName: 'Emma', lastName: 'Davis', employeeId: 'EMP-0003' }, date: '2026-06-08', checkIn: null, checkOut: null, totalHours: 0, status: 'absent', isLate: false, lateMinutes: 0 },
  { _id: '4', employee: { firstName: 'Mike', lastName: 'Ross', employeeId: 'EMP-0004' }, date: '2026-06-08', checkIn: '08:59', checkOut: '17:02', totalHours: 8.05, status: 'present', isLate: false, lateMinutes: 0 },
];

const statusVariant = (s: string) => ({ present: 'success', absent: 'danger', late: 'warning', holiday: 'info' }[s] || 'default') as 'success' | 'danger' | 'warning' | 'info' | 'default';

export default function AttendancePage() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setCheckedIn(true);
    setLoading(false);
    toast.success('Checked in at ' + new Date().toLocaleTimeString());
  };

  const handleCheckOut = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setCheckedIn(false);
    setLoading(false);
    toast.success('Checked out at ' + new Date().toLocaleTimeString());
  };

  const columns = [
    {
      key: 'employee', header: 'Employee',
      render: (_: unknown, row: typeof ATTENDANCE[0]) => (
        <div className="flex items-center gap-3">
          <Avatar name={`${row.employee.firstName} ${row.employee.lastName}`} size="sm" />
          <div>
            <p className="font-medium text-sm">{row.employee.firstName} {row.employee.lastName}</p>
            <p className="text-xs text-slate-400">{row.employee.employeeId}</p>
          </div>
        </div>
      ),
    },
    { key: 'checkIn', header: 'Check In', render: (_: unknown, r: typeof ATTENDANCE[0]) => r.checkIn ? <span className="font-mono text-sm text-slate-700">{r.checkIn}</span> : <span className="text-slate-300">—</span> },
    { key: 'checkOut', header: 'Check Out', render: (_: unknown, r: typeof ATTENDANCE[0]) => r.checkOut ? <span className="font-mono text-sm text-slate-700">{r.checkOut}</span> : <span className="text-slate-300">—</span> },
    { key: 'totalHours', header: 'Hours', render: (_: unknown, r: typeof ATTENDANCE[0]) => r.totalHours > 0 ? `${r.totalHours}h` : '—' },
    {
      key: 'status', header: 'Status',
      render: (_: unknown, r: typeof ATTENDANCE[0]) => (
        <div className="flex items-center gap-2">
          <Badge variant={statusVariant(r.status)} dot>{r.status}</Badge>
          {r.isLate && <span className="text-xs text-amber-600">+{r.lateMinutes}m late</span>}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Attendance</h1>
          <p className="text-sm text-slate-500 mt-0.5">{formatDate(new Date())}</p>
        </div>
      </div>

      {/* Quick check-in card */}
      <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700">Your Status</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {checkedIn ? '✓ Checked In' : 'Not Checked In'}
            </p>
            <p className="text-sm text-slate-500 mt-0.5">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          {!checkedIn ? (
            <Button size="lg" leftIcon={<Play className="w-4 h-4" />} onClick={handleCheckIn} loading={loading}>
              Check In
            </Button>
          ) : (
            <Button size="lg" variant="danger" leftIcon={<Square className="w-4 h-4" />} onClick={handleCheckOut} loading={loading}>
              Check Out
            </Button>
          )}
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Present" value="118" icon={CheckCircle} color="emerald" />
        <StatCard title="Absent" value="8" icon={XCircle} color="rose" />
        <StatCard title="Late" value="6" icon={AlertTriangle} color="amber" />
        <StatCard title="On Leave" value="10" icon={Clock} color="sky" />
      </div>

      {/* Table */}
      <Card padding="none">
        <div className="p-5 pb-3">
          <CardHeader>
            <CardTitle>Today's Attendance</CardTitle>
          </CardHeader>
        </div>
        <Table columns={columns as any} data={ATTENDANCE as any} />
      </Card>
    </div>
  );
}

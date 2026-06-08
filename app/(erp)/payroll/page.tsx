'use client';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/StatCard';
import { Table } from '@/components/ui/Table';
import { Avatar } from '@/components/ui/Avatar';
import { DollarSign, Users, CheckCircle, Clock } from 'lucide-react';
import { formatCurrency, getStatusColor } from '@/lib/utils';
import { toast } from 'sonner';

const PAYROLL = [
  { _id: '1', employee: { firstName: 'Sarah', lastName: 'Chen', employeeId: 'EMP-0001' }, period: { month: 5, year: 2026 }, baseSalary: 8500, tax: 1275, netSalary: 7225, status: 'paid', currency: 'USD' },
  { _id: '2', employee: { firstName: 'John', lastName: 'Doe', employeeId: 'EMP-0002' }, period: { month: 5, year: 2026 }, baseSalary: 7200, tax: 1080, netSalary: 6120, status: 'approved', currency: 'USD' },
  { _id: '3', employee: { firstName: 'Emma', lastName: 'Davis', employeeId: 'EMP-0003' }, period: { month: 5, year: 2026 }, baseSalary: 5800, tax: 870, netSalary: 4930, status: 'draft', currency: 'USD' },
  { _id: '4', employee: { firstName: 'Mike', lastName: 'Ross', employeeId: 'EMP-0004' }, period: { month: 5, year: 2026 }, baseSalary: 6400, tax: 960, netSalary: 5440, status: 'draft', currency: 'USD' },
];

const sv = (s: string) => getStatusColor(s) as 'success' | 'warning' | 'danger' | 'default';
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const columns = [
  { key: 'employee', header: 'Employee', render: (_: unknown, r: typeof PAYROLL[0]) => (
    <div className="flex items-center gap-3"><Avatar name={`${r.employee.firstName} ${r.employee.lastName}`} size="sm" />
      <div><p className="text-sm font-medium">{r.employee.firstName} {r.employee.lastName}</p><p className="text-xs text-slate-400">{r.employee.employeeId}</p></div>
    </div>
  ) },
  { key: 'period', header: 'Period', render: (_: unknown, r: typeof PAYROLL[0]) => `${months[r.period.month-1]} ${r.period.year}` },
  { key: 'baseSalary', header: 'Base', render: (_: unknown, r: typeof PAYROLL[0]) => <span className="tabular">{formatCurrency(r.baseSalary, r.currency)}</span> },
  { key: 'tax', header: 'Tax (15%)', render: (_: unknown, r: typeof PAYROLL[0]) => <span className="tabular text-red-500">-{formatCurrency(r.tax, r.currency)}</span> },
  { key: 'netSalary', header: 'Net Salary', render: (_: unknown, r: typeof PAYROLL[0]) => <span className="tabular font-bold text-emerald-600">{formatCurrency(r.netSalary, r.currency)}</span> },
  { key: 'status', header: 'Status', render: (_: unknown, r: typeof PAYROLL[0]) => <Badge variant={sv(r.status)} dot>{r.status}</Badge> },
  { key: 'actions', header: '', render: (_: unknown, r: typeof PAYROLL[0]) => r.status === 'draft' ? (
    <button onClick={() => toast.success('Approved')} className="text-xs text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded font-medium">Approve</button>
  ) : null },
];

export default function PayrollPage() {
  const total = PAYROLL.reduce((s, p) => s + p.netSalary, 0);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Payroll</h1>
          <p className="text-sm text-slate-500">May 2026</p>
        </div>
        <Button onClick={() => toast.success('Payroll generated for all active employees')}>Generate Payroll</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Payroll" value={formatCurrency(total)} icon={DollarSign} color="indigo" />
        <StatCard title="Employees" value={PAYROLL.length} icon={Users} color="emerald" />
        <StatCard title="Paid" value={PAYROLL.filter(p=>p.status==='paid').length} icon={CheckCircle} color="sky" />
        <StatCard title="Pending" value={PAYROLL.filter(p=>p.status==='draft').length} icon={Clock} color="amber" />
      </div>

      <Card padding="none">
        <div className="p-5 pb-3"><CardHeader><CardTitle>Payroll Records</CardTitle></CardHeader></div>
        <Table columns={columns as any} data={PAYROLL as any} />
      </Card>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { Plus, Search, Filter, Download, UserCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Table, Pagination } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { formatDate, getStatusColor } from '@/lib/utils';
import type { Metadata } from 'next';

const MOCK_EMPLOYEES = [
  { _id: '1', employeeId: 'EMP-0001', firstName: 'Sarah', lastName: 'Chen', email: 'sarah@company.com', department: { name: 'Engineering' }, position: { title: 'Senior Developer' }, status: 'active', hireDate: '2022-03-15', salary: { amount: 8500, currency: 'USD' } },
  { _id: '2', employeeId: 'EMP-0002', firstName: 'John', lastName: 'Doe', email: 'john@company.com', department: { name: 'HR' }, position: { title: 'HR Manager' }, status: 'active', hireDate: '2021-07-01', salary: { amount: 7200, currency: 'USD' } },
  { _id: '3', employeeId: 'EMP-0003', firstName: 'Emma', lastName: 'Davis', email: 'emma@company.com', department: { name: 'Sales' }, position: { title: 'Sales Rep' }, status: 'active', hireDate: '2023-01-10', salary: { amount: 5800, currency: 'USD' } },
  { _id: '4', employeeId: 'EMP-0004', firstName: 'Mike', lastName: 'Ross', email: 'mike@company.com', department: { name: 'Accounting' }, position: { title: 'Accountant' }, status: 'inactive', hireDate: '2020-09-20', salary: { amount: 6400, currency: 'USD' } },
  { _id: '5', employeeId: 'EMP-0005', firstName: 'Lisa', lastName: 'Wang', email: 'lisa@company.com', department: { name: 'Engineering' }, position: { title: 'DevOps Engineer' }, status: 'active', hireDate: '2023-06-05', salary: { amount: 9100, currency: 'USD' } },
];

export default function EmployeesPage() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = MOCK_EMPLOYEES.filter(
    (e) => `${e.firstName} ${e.lastName} ${e.employeeId} ${e.email}`.toLowerCase().includes(search.toLowerCase()),
  );

  const columns = [
    {
      key: 'name', header: 'Employee',
      render: (_: unknown, row: typeof MOCK_EMPLOYEES[0]) => (
        <div className="flex items-center gap-3">
          <Avatar name={`${row.firstName} ${row.lastName}`} size="sm" />
          <div>
            <p className="font-medium text-slate-900 text-sm">{row.firstName} {row.lastName}</p>
            <p className="text-xs text-slate-400">{row.employeeId}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'email', header: 'Email',
      render: (_: unknown, row: typeof MOCK_EMPLOYEES[0]) => <span className="text-slate-600">{row.email}</span>,
    },
    {
      key: 'department', header: 'Department',
      render: (_: unknown, row: typeof MOCK_EMPLOYEES[0]) => row.department.name,
    },
    {
      key: 'position', header: 'Position',
      render: (_: unknown, row: typeof MOCK_EMPLOYEES[0]) => <span className="text-slate-600">{row.position.title}</span>,
    },
    {
      key: 'status', header: 'Status',
      render: (_: unknown, row: typeof MOCK_EMPLOYEES[0]) => (
        <Badge variant={getStatusColor(row.status) as 'success' | 'warning' | 'danger' | 'default'} dot>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'hireDate', header: 'Hire Date',
      render: (_: unknown, row: typeof MOCK_EMPLOYEES[0]) => (
        <span className="text-slate-500 text-sm">{formatDate(row.hireDate)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Employees</h1>
          <p className="text-sm text-slate-500 mt-0.5">{MOCK_EMPLOYEES.length} total employees</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>Export</Button>
          <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>
            Add Employee
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="search"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Select
            options={[
              { label: 'All Departments', value: '' },
              { label: 'Engineering', value: 'engineering' },
              { label: 'HR', value: 'hr' },
              { label: 'Sales', value: 'sales' },
              { label: 'Accounting', value: 'accounting' },
            ]}
            placeholder="Department"
            className="sm:w-44"
          />
          <Select
            options={[
              { label: 'All Status', value: '' },
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
              { label: 'Terminated', value: 'terminated' },
            ]}
            placeholder="Status"
            className="sm:w-36"
          />
        </div>
      </Card>

      {/* Table */}
      <Table
        columns={columns as any}
        data={filtered as any}
        emptyMessage="No employees found. Add your first employee."
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Showing {filtered.length} of {MOCK_EMPLOYEES.length} employees</p>
        <Pagination page={page} totalPages={3} onPageChange={setPage} />
      </div>

      {/* Add Employee Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Add New Employee"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button>Create Employee</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="First Name" placeholder="John" required />
          <Input label="Last Name" placeholder="Doe" required />
          <Input label="Email" type="email" placeholder="john@company.com" required />
          <Input label="Phone" type="tel" placeholder="+1 555 000 0000" />
          <Select label="Department" options={[{ label: 'Engineering', value: 'eng' }, { label: 'HR', value: 'hr' }]} required />
          <Select label="Position" options={[{ label: 'Developer', value: 'dev' }, { label: 'Manager', value: 'mgr' }]} required />
          <Input label="Hire Date" type="date" required />
          <Input label="Base Salary" type="number" placeholder="5000" />
        </div>
      </Modal>
    </div>
  );
}

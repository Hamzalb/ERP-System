'use client';
import { useState } from 'react';
import { Plus, BookOpen, TrendingUp, TrendingDown, Scale } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, Pagination } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { formatCurrency, formatDate } from '@/lib/utils';

const ACCOUNTS = [
  { _id: '1', code: '1000', name: 'Cash', type: 'asset', balance: 48500 },
  { _id: '2', code: '1100', name: 'Accounts Receivable', type: 'asset', balance: 32800 },
  { _id: '3', code: '1500', name: 'Inventory', type: 'asset', balance: 91200 },
  { _id: '4', code: '2000', name: 'Accounts Payable', type: 'liability', balance: 18400 },
  { _id: '5', code: '3000', name: 'Owner Equity', type: 'equity', balance: 125000 },
  { _id: '6', code: '4000', name: 'Sales Revenue', type: 'revenue', balance: 84200 },
  { _id: '7', code: '5000', name: 'Cost of Goods Sold', type: 'expense', balance: 42100 },
  { _id: '8', code: '5100', name: 'Salaries Expense', type: 'expense', balance: 28600 },
];

const JOURNAL_ENTRIES = [
  { _id: '1', entryNumber: 'JE-0001', date: '2026-06-08', description: 'Sales revenue recognition', lines: 2, status: 'posted', total: 8400 },
  { _id: '2', entryNumber: 'JE-0002', date: '2026-06-07', description: 'Payroll processing June', lines: 4, status: 'posted', total: 28600 },
  { _id: '3', entryNumber: 'JE-0003', date: '2026-06-06', description: 'Vendor payment - Tech Supplies', lines: 2, status: 'posted', total: 12500 },
  { _id: '4', entryNumber: 'JE-0004', date: '2026-06-08', description: 'Inventory purchase', lines: 2, status: 'draft', total: 6200 },
];

const accountTypeColor: Record<string, string> = {
  asset: 'text-indigo-600 bg-indigo-50',
  liability: 'text-red-600 bg-red-50',
  equity: 'text-purple-600 bg-purple-50',
  revenue: 'text-emerald-600 bg-emerald-50',
  expense: 'text-amber-600 bg-amber-50',
};

const totalAssets = ACCOUNTS.filter(a => a.type === 'asset').reduce((s, a) => s + a.balance, 0);
const totalLiabilities = ACCOUNTS.filter(a => a.type === 'liability').reduce((s, a) => s + a.balance, 0);
const totalRevenue = ACCOUNTS.filter(a => a.type === 'revenue').reduce((s, a) => s + a.balance, 0);
const totalExpenses = ACCOUNTS.filter(a => a.type === 'expense').reduce((s, a) => s + a.balance, 0);

export default function AccountingPage() {
  const [tab, setTab] = useState<'accounts' | 'journal'>('accounts');
  const [showJeModal, setShowJeModal] = useState(false);
  const [showAccModal, setShowAccModal] = useState(false);
  const [page, setPage] = useState(1);

  const accountColumns = [
    { key: 'code', header: 'Code', render: (_: unknown, r: typeof ACCOUNTS[0]) => (
      <span className="font-mono text-sm font-medium text-slate-700">{r.code}</span>
    ) },
    { key: 'name', header: 'Account Name', render: (_: unknown, r: typeof ACCOUNTS[0]) => (
      <span className="text-sm font-medium text-slate-900">{r.name}</span>
    ) },
    { key: 'type', header: 'Type', render: (_: unknown, r: typeof ACCOUNTS[0]) => (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${accountTypeColor[r.type]}`}>
        {r.type}
      </span>
    ) },
    { key: 'balance', header: 'Balance', render: (_: unknown, r: typeof ACCOUNTS[0]) => (
      <span className={`text-sm font-semibold tabular ${r.type === 'expense' || r.type === 'liability' ? 'text-red-600' : 'text-slate-900'}`}>
        {formatCurrency(r.balance)}
      </span>
    ) },
    { key: 'actions', header: '', render: () => (
      <button className="text-xs text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded">Edit</button>
    ) },
  ];

  const journalColumns = [
    { key: 'entryNumber', header: 'Entry #', render: (_: unknown, r: typeof JOURNAL_ENTRIES[0]) => (
      <span className="font-mono text-sm text-indigo-600 font-medium">{r.entryNumber}</span>
    ) },
    { key: 'date', header: 'Date', render: (_: unknown, r: typeof JOURNAL_ENTRIES[0]) => (
      <span className="text-sm text-slate-600">{formatDate(r.date)}</span>
    ) },
    { key: 'description', header: 'Description', render: (_: unknown, r: typeof JOURNAL_ENTRIES[0]) => (
      <span className="text-sm text-slate-800">{r.description}</span>
    ) },
    { key: 'lines', header: 'Lines', render: (_: unknown, r: typeof JOURNAL_ENTRIES[0]) => (
      <span className="text-sm text-slate-500">{r.lines}</span>
    ) },
    { key: 'total', header: 'Amount', render: (_: unknown, r: typeof JOURNAL_ENTRIES[0]) => (
      <span className="text-sm font-semibold tabular text-slate-900">{formatCurrency(r.total)}</span>
    ) },
    { key: 'status', header: 'Status', render: (_: unknown, r: typeof JOURNAL_ENTRIES[0]) => (
      <Badge variant={r.status === 'posted' ? 'success' : 'default'} dot>{r.status}</Badge>
    ) },
    { key: 'actions', header: '', render: (_: unknown, r: typeof JOURNAL_ENTRIES[0]) => (
      <div className="flex gap-1">
        {r.status === 'draft' && (
          <button className="text-xs text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded font-medium">Post</button>
        )}
        <button className="text-xs text-slate-500 hover:bg-slate-100 px-2 py-1 rounded">View</button>
      </div>
    ) },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Accounting</h1>
          <p className="text-sm text-slate-500">Chart of accounts & journal entries</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowAccModal(true)}>
            Add Account
          </Button>
          <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowJeModal(true)}>
            New Entry
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Assets', value: totalAssets, icon: BookOpen, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Total Liabilities', value: totalLiabilities, icon: TrendingDown, color: 'text-red-600 bg-red-50' },
          { label: 'Revenue (MTD)', value: totalRevenue, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Expenses (MTD)', value: totalExpenses, icon: Scale, color: 'text-amber-600 bg-amber-50' },
        ].map((s) => (
          <Card key={s.label} padding="sm">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className="text-base font-bold text-slate-900 tabular">{formatCurrency(s.value)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Net Income banner */}
      <Card padding="sm" className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Net Income (MTD)</p>
            <p className="text-2xl font-bold text-emerald-800 tabular mt-0.5">{formatCurrency(totalRevenue - totalExpenses)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-emerald-600">Gross Margin</p>
            <p className="text-lg font-bold text-emerald-700">{((totalRevenue - totalExpenses) / totalRevenue * 100).toFixed(1)}%</p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {(['accounts', 'journal'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t === 'accounts' ? 'Chart of Accounts' : 'Journal Entries'}
          </button>
        ))}
      </div>

      {tab === 'accounts' && (
        <>
          <Table columns={accountColumns as any} data={ACCOUNTS as any} />
          <Pagination page={page} totalPages={1} onPageChange={setPage} />
        </>
      )}

      {tab === 'journal' && (
        <>
          <Table columns={journalColumns as any} data={JOURNAL_ENTRIES as any} />
          <Pagination page={page} totalPages={1} onPageChange={setPage} />
        </>
      )}

      {/* Journal Entry Modal */}
      <Modal
        open={showJeModal}
        onClose={() => setShowJeModal(false)}
        title="New Journal Entry"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowJeModal(false)}>Cancel</Button>
            <Button>Save as Draft</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Date" type="date" required />
          <Input label="Description" placeholder="Entry description..." required />
          <div className="border border-slate-200 rounded-lg p-3 space-y-3">
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Lines (Debit / Credit)</p>
            <div className="grid grid-cols-3 gap-2">
              <Select label="Account" options={ACCOUNTS.map(a => ({ label: `${a.code} – ${a.name}`, value: a._id }))} />
              <Input label="Debit" type="number" placeholder="0.00" />
              <Input label="Credit" type="number" placeholder="0.00" />
            </div>
            <button className="text-xs text-indigo-600 hover:underline">+ Add line</button>
          </div>
        </div>
      </Modal>

      {/* Add Account Modal */}
      <Modal
        open={showAccModal}
        onClose={() => setShowAccModal(false)}
        title="Add Account"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowAccModal(false)}>Cancel</Button>
            <Button>Create Account</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Account Code" placeholder="e.g. 1200" required />
          <Input label="Account Name" placeholder="e.g. Bank Account" required />
          <Select
            label="Account Type"
            required
            options={[
              { label: 'Asset', value: 'asset' },
              { label: 'Liability', value: 'liability' },
              { label: 'Equity', value: 'equity' },
              { label: 'Revenue', value: 'revenue' },
              { label: 'Expense', value: 'expense' },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
}

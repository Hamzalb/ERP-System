'use client';
import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { formatCurrency, getStatusColor } from '@/lib/utils';
import { cn } from '@/lib/utils';

const STAGES = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];

const LEADS = [
  { _id: '1', name: 'TechCorp Ltd', email: 'cto@techcorp.com', company: 'TechCorp Ltd', source: 'website', status: 'qualified', value: 24000 },
  { _id: '2', name: 'Alpha Systems', email: 'sales@alpha.io', company: 'Alpha Systems', source: 'referral', status: 'proposal', value: 8500 },
  { _id: '3', name: 'Beta Industries', email: 'info@beta.com', company: 'Beta Industries', source: 'cold-call', status: 'new', value: 3200 },
  { _id: '4', name: 'Gamma Tech', email: 'gamma@gamma.net', company: 'Gamma Tech', source: 'email', status: 'contacted', value: 15000 },
  { _id: '5', name: 'Delta Corp', email: 'bd@delta.co', company: 'Delta Corp', source: 'event', status: 'won', value: 32000 },
];

const stageColors: Record<string, string> = {
  new: 'bg-slate-100 border-slate-200',
  contacted: 'bg-sky-50 border-sky-100',
  qualified: 'bg-amber-50 border-amber-100',
  proposal: 'bg-violet-50 border-violet-100',
  won: 'bg-emerald-50 border-emerald-100',
  lost: 'bg-red-50 border-red-100',
};

export default function LeadsPage() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [showModal, setShowModal] = useState(false);

  const sv = (s: string) => getStatusColor(s) as 'success' | 'warning' | 'danger' | 'default' | 'info';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Leads</h1>
          <p className="text-sm text-slate-500">{LEADS.length} total leads · {formatCurrency(LEADS.reduce((s, l) => s + l.value, 0))} pipeline</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 rounded-lg p-0.5 text-xs">
            {['kanban', 'list'].map((v) => (
              <button key={v} onClick={() => setView(v as 'kanban' | 'list')}
                className={cn('px-3 py-1.5 rounded-md font-medium capitalize transition-all', view === v ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500')}>
                {v}
              </button>
            ))}
          </div>
          <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>Add Lead</Button>
        </div>
      </div>

      {view === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageleads = LEADS.filter((l) => l.status === stage);
            return (
              <div key={stage} className={cn('flex-shrink-0 w-64 rounded-xl border p-3 space-y-3', stageColors[stage])}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 capitalize">{stage}</span>
                  <span className="text-xs font-medium bg-white px-1.5 py-0.5 rounded-full shadow-sm text-slate-500">{stageleads.length}</span>
                </div>
                {stageleads.map((lead) => (
                  <div key={lead._id} className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar name={lead.name} size="xs" />
                      <p className="text-sm font-medium text-slate-900 truncate">{lead.name}</p>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{lead.company}</p>
                    <p className="text-sm font-bold text-indigo-600 tabular">{formatCurrency(lead.value)}</p>
                    <p className="text-[10px] text-slate-400 mt-1">via {lead.source}</p>
                  </div>
                ))}
                {stageleads.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-3">No leads in this stage</p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <Card padding="none">
          <div className="p-4 border-b border-slate-100">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="search" placeholder="Search leads..." className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {LEADS.map((lead) => (
              <div key={lead._id} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors">
                <Avatar name={lead.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{lead.name}</p>
                  <p className="text-xs text-slate-400">{lead.email}</p>
                </div>
                <span className="text-sm font-bold tabular text-slate-700">{formatCurrency(lead.value)}</span>
                <Badge variant={sv(lead.status)} dot>{lead.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add New Lead"
        footer={<><Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button><Button>Create Lead</Button></>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name" placeholder="John Smith" required />
          <Input label="Email" type="email" placeholder="john@company.com" />
          <Input label="Company" placeholder="Acme Corp" />
          <Input label="Phone" placeholder="+1 555 000 0000" />
          <Select label="Source" options={[{ label: 'Website', value: 'website' }, { label: 'Referral', value: 'referral' }, { label: 'Cold Call', value: 'cold-call' }]} />
          <Input label="Deal Value" type="number" placeholder="0" leftIcon={undefined} />
        </div>
      </Modal>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { formatDate, getStatusColor } from '@/lib/utils';

const PROJECTS = [
  { _id: '1', name: 'ERP Migration', status: 'active', progress: 68, startDate: '2026-01-10', endDate: '2026-09-30', members: ['Sarah Chen', 'John Doe', 'Emma Davis'], manager: 'Sarah Chen' },
  { _id: '2', name: 'Mobile App v2', status: 'active', progress: 35, startDate: '2026-03-01', endDate: '2026-12-31', members: ['Mike Ross', 'Lisa Wang'], manager: 'Mike Ross' },
  { _id: '3', name: 'Website Redesign', status: 'completed', progress: 100, startDate: '2025-11-01', endDate: '2026-05-31', members: ['Emma Davis'], manager: 'Emma Davis' },
  { _id: '4', name: 'Data Warehouse', status: 'planning', progress: 10, startDate: '2026-07-01', endDate: '2027-03-31', members: ['John Doe', 'Sarah Chen'], manager: 'John Doe' },
];

const KANBAN_TASKS = {
  todo: [
    { id: 't1', title: 'Design database schema', priority: 'high', assignee: 'Sarah Chen' },
    { id: 't2', title: 'Set up CI/CD pipeline', priority: 'medium', assignee: 'Mike Ross' },
  ],
  in_progress: [
    { id: 't3', title: 'Implement auth module', priority: 'high', assignee: 'John Doe' },
    { id: 't4', title: 'Build dashboard UI', priority: 'medium', assignee: 'Emma Davis' },
  ],
  review: [
    { id: 't5', title: 'API endpoint tests', priority: 'low', assignee: 'Lisa Wang' },
  ],
  done: [
    { id: 't6', title: 'Project setup', priority: 'low', assignee: 'Sarah Chen' },
    { id: 't7', title: 'Requirements gathering', priority: 'medium', assignee: 'John Doe' },
  ],
};

const priorityColors = { high: 'danger', medium: 'warning', low: 'default', urgent: 'danger' } as const;
const sv = (s: string) => getStatusColor(s) as 'success' | 'warning' | 'danger' | 'default' | 'info';

const colLabel = { todo: 'To Do', in_progress: 'In Progress', review: 'Review', done: 'Done' };

export default function ProjectsPage() {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Projects</h1>
        <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>New Project</Button>
      </div>

      {/* Project cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROJECTS.map((p) => (
          <Card key={p._id} hoverable onClick={() => setSelected(selected === p._id ? null : p._id)} padding="md">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-slate-900">{p.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{formatDate(p.startDate)} — {formatDate(p.endDate)}</p>
              </div>
              <Badge variant={sv(p.status)}>{p.status}</Badge>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                <span>Progress</span>
                <span className="font-semibold text-slate-700">{p.progress}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{ width: `${p.progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex -space-x-1.5">
                {p.members.map((m) => (
                  <Avatar key={m} name={m} size="xs" className="ring-2 ring-white" />
                ))}
              </div>
              <span className="text-xs text-slate-400">Manager: {p.manager}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Kanban board for selected project */}
      {selected && (
        <div>
          <h2 className="text-base font-semibold text-slate-900 mb-4">
            Kanban — {PROJECTS.find((p) => p._id === selected)?.name}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(KANBAN_TASKS).map(([col, tasks]) => (
              <div key={col} className="bg-slate-50 rounded-xl border border-slate-200 p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">{colLabel[col as keyof typeof colLabel]}</span>
                  <span className="text-xs bg-white border border-slate-200 px-1.5 py-0.5 rounded-full text-slate-500">{tasks.length}</span>
                </div>
                {tasks.map((task) => (
                  <div key={task.id} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                    <p className="text-sm font-medium text-slate-900 mb-2">{task.title}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant={priorityColors[task.priority as keyof typeof priorityColors]} className="text-[10px] py-0">
                        {task.priority}
                      </Badge>
                      <Avatar name={task.assignee} size="xs" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Project"
        footer={<><Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button><Button>Create Project</Button></>}>
        <div className="space-y-4">
          <Input label="Project Name" placeholder="My Project" required />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea className="w-full h-20 px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Project description..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" required />
            <Input label="End Date" type="date" />
          </div>
        </div>
      </Modal>
    </div>
  );
}

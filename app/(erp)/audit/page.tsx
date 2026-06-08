import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatDateTime } from '@/lib/utils';

export const metadata: Metadata = { title: 'Audit Logs' };

const LOGS = [
  { _id: '1', actor: { name: 'Admin User', email: 'admin@erp.com' }, action: 'login', resource: 'User', resourceId: 'u1', ip: '192.168.1.1', createdAt: '2026-06-08T09:00:00Z' },
  { _id: '2', actor: { name: 'Sarah Chen', email: 'sarah@company.com' }, action: 'create', resource: 'Employee', resourceId: 'emp-5', ip: '192.168.1.45', createdAt: '2026-06-08T09:15:00Z' },
  { _id: '3', actor: { name: 'Mike Ross', email: 'mike@company.com' }, action: 'update', resource: 'Invoice', resourceId: 'inv-42', ip: '10.0.0.12', createdAt: '2026-06-08T10:00:00Z' },
  { _id: '4', actor: { name: 'Admin User', email: 'admin@erp.com' }, action: 'delete', resource: 'Lead', resourceId: 'ld-7', ip: '192.168.1.1', createdAt: '2026-06-08T10:30:00Z' },
  { _id: '5', actor: { name: 'Emma Davis', email: 'emma@company.com' }, action: 'permission_change', resource: 'Role', resourceId: 'role-3', ip: '192.168.1.88', createdAt: '2026-06-08T11:00:00Z' },
];

const actionVariant = (a: string) => ({ login: 'info', create: 'success', update: 'warning', delete: 'danger', permission_change: 'primary', role_change: 'primary' }[a] || 'default') as 'info' | 'success' | 'warning' | 'danger' | 'primary' | 'default';

export default function AuditPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Audit Logs</h1>
        <p className="text-sm text-slate-500">Track all sensitive operations and changes</p>
      </div>
      <Card padding="none">
        <div className="p-5 pb-3"><CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader></div>
        <div className="divide-y divide-slate-50">
          {LOGS.map((log) => (
            <div key={log._id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
              <Avatar name={log.actor.name} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-slate-900">{log.actor.name}</span>
                  <Badge variant={actionVariant(log.action)}>{log.action}</Badge>
                  <span className="text-sm text-slate-500">{log.resource}</span>
                  <span className="text-xs text-slate-400 font-mono">{log.resourceId}</span>
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                  <span>{log.actor.email}</span>
                  <span>·</span>
                  <span className="font-mono">{log.ip}</span>
                </div>
              </div>
              <span className="text-xs text-slate-400 flex-shrink-0">{formatDateTime(log.createdAt)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

'use client';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Bell, CheckCircle, AlertTriangle, Info, XCircle, Check } from 'lucide-react';
import { formatRelative } from '@/lib/utils';
import { toast } from 'sonner';

const NOTIFICATIONS = [
  { _id: '1', title: 'Leave Request Pending', message: 'John Doe has submitted a leave request for Jun 15-20.', type: 'info', module: 'leave', isRead: false, createdAt: '2026-06-08T09:00:00Z' },
  { _id: '2', title: 'Invoice Paid', message: 'INV-00042 has been paid by TechCorp Ltd — $8,400.', type: 'success', module: 'sales', isRead: false, createdAt: '2026-06-08T08:30:00Z' },
  { _id: '3', title: 'Low Stock Alert', message: 'USB-C Cables stock (8) is below minimum (20).', type: 'warning', module: 'inventory', isRead: true, createdAt: '2026-06-08T07:00:00Z' },
  { _id: '4', title: 'Payroll Generated', message: 'May 2026 payroll has been generated for 142 employees.', type: 'success', module: 'payroll', isRead: true, createdAt: '2026-06-07T18:00:00Z' },
  { _id: '5', title: 'Invoice Overdue', message: 'INV-00040 for Beta Industries is 8 days overdue ($15,600).', type: 'error', module: 'sales', isRead: false, createdAt: '2026-06-07T09:00:00Z' },
];

const typeConfig = {
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' },
  success: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
  error: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
};

export default function NotificationsPage() {
  const unread = NOTIFICATIONS.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500">{unread} unread</p>
        </div>
        <Button variant="outline" size="sm" leftIcon={<Check className="w-4 h-4" />} onClick={() => toast.success('All marked as read')}>
          Mark all read
        </Button>
      </div>

      <Card padding="none">
        <div className="divide-y divide-slate-50">
          {NOTIFICATIONS.map((n) => {
            const config = typeConfig[n.type as keyof typeof typeConfig];
            const Icon = config.icon;
            return (
              <div key={n._id} className={`flex items-start gap-4 px-5 py-4 transition-colors ${!n.isRead ? 'bg-indigo-50/40' : 'hover:bg-slate-50'}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                  <Icon className={`w-4.5 h-4.5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <p className={`text-sm font-medium ${!n.isRead ? 'text-slate-900' : 'text-slate-700'}`}>{n.title}</p>
                    <span className="text-[10px] text-slate-400 flex-shrink-0 mt-0.5">{formatRelative(n.createdAt)}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">{n.message}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="default" className="text-[10px]">{n.module}</Badge>
                    {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

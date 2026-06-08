'use client';
import { useState } from 'react';
import { Plus, Shield, Lock, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';

const ALL_PERMISSIONS = [
  { module: 'Employees', perms: ['employees:read', 'employees:create', 'employees:update', 'employees:delete'] },
  { module: 'Attendance', perms: ['attendance:read', 'attendance:create', 'attendance:update'] },
  { module: 'Leave', perms: ['leave:read', 'leave:create', 'leave:approve'] },
  { module: 'Payroll', perms: ['payroll:read', 'payroll:generate', 'payroll:approve'] },
  { module: 'CRM', perms: ['crm:read', 'crm:create', 'crm:update', 'crm:delete'] },
  { module: 'Sales', perms: ['sales:read', 'sales:create', 'sales:update', 'sales:delete'] },
  { module: 'Purchases', perms: ['purchases:read', 'purchases:create', 'purchases:approve'] },
  { module: 'Inventory', perms: ['inventory:read', 'inventory:create', 'inventory:update'] },
  { module: 'Accounting', perms: ['accounting:read', 'accounting:create', 'accounting:post'] },
  { module: 'Projects', perms: ['projects:read', 'projects:create', 'projects:update'] },
  { module: 'Reports', perms: ['reports:read'] },
  { module: 'Users', perms: ['users:read', 'users:create', 'users:update', 'users:delete'] },
  { module: 'Roles', perms: ['roles:read', 'roles:create', 'roles:update', 'roles:delete'] },
  { module: 'Audit', perms: ['audit:read'] },
  { module: 'Company', perms: ['company:read', 'company:update'] },
];

const ROLES = [
  { _id: '1', name: 'SuperAdmin', description: 'Full system access', isSystem: true, permissions: ['*'], userCount: 1 },
  { _id: '2', name: 'HR Manager', description: 'Manage employees, attendance, leave, payroll', isSystem: false, permissions: ['employees:read','employees:create','employees:update','attendance:read','attendance:create','leave:read','leave:create','leave:approve','payroll:read','payroll:generate','payroll:approve'], userCount: 2 },
  { _id: '3', name: 'Accountant', description: 'Sales, purchases, accounting, reports', isSystem: false, permissions: ['sales:read','purchases:read','accounting:read','accounting:create','accounting:post','reports:read'], userCount: 1 },
  { _id: '4', name: 'Sales Manager', description: 'CRM and sales access', isSystem: false, permissions: ['crm:read','crm:create','crm:update','sales:read','sales:create','sales:update','reports:read'], userCount: 3 },
  { _id: '5', name: 'Viewer', description: 'Read-only access to all modules', isSystem: true, permissions: ['employees:read','attendance:read','leave:read','crm:read','sales:read','inventory:read','reports:read'], userCount: 5 },
];

export default function RolesPage() {
  const [showModal, setShowModal] = useState(false);
  const [editRole, setEditRole] = useState<typeof ROLES[0] | null>(null);
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);

  const openEdit = (role: typeof ROLES[0]) => {
    setEditRole(role);
    setSelectedPerms(role.permissions);
    setShowModal(true);
  };

  const openCreate = () => {
    setEditRole(null);
    setSelectedPerms([]);
    setShowModal(true);
  };

  const togglePerm = (perm: string) => {
    setSelectedPerms((prev) => prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Roles & Permissions</h1>
          <p className="text-sm text-slate-500">{ROLES.length} roles configured</p>
        </div>
        <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={openCreate}>
          New Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {ROLES.map((role) => (
          <Card key={role._id} hoverable>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Shield className="w-4.5 h-4.5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{role.name}</p>
                  <p className="text-[11px] text-slate-400">{role.userCount} {role.userCount === 1 ? 'user' : 'users'}</p>
                </div>
              </div>
              {role.isSystem ? (
                <Badge variant="primary">System</Badge>
              ) : (
                <button
                  onClick={() => openEdit(role)}
                  className="text-xs text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded font-medium"
                >
                  Edit
                </button>
              )}
            </div>

            <p className="text-xs text-slate-500 mb-3">{role.description}</p>

            {role.permissions.includes('*') ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2 py-1.5 rounded-lg">
                <Lock className="w-3.5 h-3.5" />
                Full access — all permissions
              </div>
            ) : (
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium mb-1.5">
                  {role.permissions.length} permissions
                </p>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 6).map((perm) => (
                    <span key={perm} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                      {perm}
                    </span>
                  ))}
                  {role.permissions.length > 6 && (
                    <span className="text-[10px] text-slate-400 px-1">+{role.permissions.length - 6} more</span>
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editRole ? `Edit Role: ${editRole.name}` : 'New Role'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button>{editRole ? 'Save Changes' : 'Create Role'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          {!editRole && (
            <>
              <Input label="Role Name" placeholder="e.g. Warehouse Manager" required />
              <Input label="Description" placeholder="Brief description of this role..." />
            </>
          )}

          <div>
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">Permissions</p>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {ALL_PERMISSIONS.map(({ module, perms }) => (
                <div key={module}>
                  <p className="text-xs font-medium text-slate-900 mb-1.5">{module}</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {perms.map((perm) => {
                      const active = selectedPerms.includes(perm) || selectedPerms.includes('*');
                      return (
                        <button
                          key={perm}
                          onClick={() => togglePerm(perm)}
                          disabled={editRole?.isSystem}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors text-left ${
                            active
                              ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                              : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <div className={`w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0 ${active ? 'bg-indigo-600' : 'bg-white border border-slate-300'}`}>
                            {active && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          {perm}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

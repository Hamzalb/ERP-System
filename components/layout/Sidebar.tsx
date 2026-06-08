'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, UserCheck, Building2, Clock, Calendar,
  DollarSign, PhoneCall, ShoppingCart, Package, BarChart3, Briefcase,
  Bell, FolderOpen, FileText, Shield, Settings, ChevronDown,
  ChevronRight, X, Boxes, CreditCard, BookOpen, LogOut, Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  children?: NavItem[];
  badge?: string | number;
}

const navigation: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  {
    label: 'HR',
    icon: UserCheck,
    children: [
      { label: 'Employees', href: '/employees', icon: Users },
      { label: 'Attendance', href: '/attendance', icon: Clock },
      { label: 'Leave', href: '/leave', icon: Calendar },
      { label: 'Payroll', href: '/payroll', icon: DollarSign },
    ],
  },
  {
    label: 'CRM',
    icon: PhoneCall,
    children: [
      { label: 'Leads', href: '/crm/leads', icon: PhoneCall },
      { label: 'Customers', href: '/crm/customers', icon: Users },
    ],
  },
  {
    label: 'Sales',
    icon: ShoppingCart,
    children: [
      { label: 'Invoices', href: '/sales/invoices', icon: FileText },
      { label: 'Quotations', href: '/sales/quotations', icon: FileText },
    ],
  },
  { label: 'Purchases', href: '/purchases', icon: CreditCard },
  {
    label: 'Inventory',
    icon: Boxes,
    children: [
      { label: 'Products', href: '/inventory/products', icon: Boxes },
      { label: 'Categories', href: '/inventory/categories', icon: Package },
      { label: 'Warehouses', href: '/inventory/warehouses', icon: Building2 },
    ],
  },
  { label: 'Accounting', href: '/accounting', icon: BookOpen },
  { label: 'Projects', href: '/projects', icon: Briefcase },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
  { label: 'Notifications', href: '/notifications', icon: Bell, badge: 3 },
  { label: 'Files', href: '/files', icon: FolderOpen },
  {
    label: 'Admin',
    icon: Shield,
    children: [
      { label: 'Users', href: '/users', icon: Users },
      { label: 'Roles', href: '/roles', icon: Shield },
      { label: 'Audit Logs', href: '/audit', icon: FileText },
      { label: 'Company', href: '/settings/company', icon: Settings },
    ],
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

function NavGroup({ item, level = 0 }: { item: NavItem; level?: number }) {
  const pathname = usePathname();
  const isActive = item.href
    ? item.href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname === item.href || pathname.startsWith(item.href + '/')
    : false;
  const hasActiveChild = item.children?.some(
    (c) => c.href && (pathname === c.href || pathname.startsWith(c.href + '/')),
  );
  const [expanded, setExpanded] = useState(hasActiveChild ?? false);
  const Icon = item.icon;

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setExpanded((p) => !p)}
          className={cn(
            'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
            hasActiveChild
              ? 'text-white/90 bg-white/10'
              : 'text-white/50 hover:text-white/80 hover:bg-white/8',
          )}
          aria-expanded={expanded}
        >
          <Icon className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1 text-left font-medium">{item.label}</span>
          {expanded
            ? <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            : <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
        </button>
        {expanded && (
          <div className="mt-0.5 ml-3 pl-4 border-l border-white/10 space-y-0.5">
            {item.children.map((child) => (
              <NavGroup key={child.label} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href!}
      className={cn(
        'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 relative',
        isActive
          ? 'nav-active text-white font-medium'
          : 'text-white/50 hover:text-white/90 hover:bg-white/8',
      )}
    >
      <Icon className={cn('w-4 h-4 flex-shrink-0', isActive && 'drop-shadow-sm')} />
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span className="bg-indigo-400/30 border border-indigo-400/40 text-indigo-200 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { logout, user } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 mesh-dark',
          'flex flex-col transition-transform duration-200 ease-out',
          'lg:translate-x-0 lg:z-30',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        style={{
          background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 60%, #1e1b4b 100%)',
          boxShadow: '4px 0 24px rgba(0,0,0,.3)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-[60px] px-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            {/* 3D logo mark */}
            <div className="relative w-9 h-9">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center animate-pulse-glow"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)', boxShadow: '0 4px 12px rgba(99,102,241,.5)' }}
              >
                <Sparkles className="w-4.5 h-4.5 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight tracking-tight">ERP System</p>
              <p className="text-[10px] text-indigo-400 leading-tight">Enterprise Suite</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto no-scrollbar space-y-0.5">
          {navigation.map((item) => (
            <NavGroup key={item.label} item={item} />
          ))}
        </nav>

        {/* Bottom divider + version */}
        <div className="px-3 py-3 border-t border-white/[0.06]">
          {user && (
            <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white/80 truncate">{user.name}</p>
                <p className="text-[10px] text-white/30 truncate">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
          <p className="mt-2 text-center text-[10px] text-white/15 font-mono">v1.0.0 · Enterprise</p>
        </div>
      </aside>
    </>
  );
}

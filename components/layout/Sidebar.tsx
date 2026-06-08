'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, UserCheck, Building2, Clock, Calendar,
  DollarSign, PhoneCall, ShoppingCart, Package, BarChart3, Briefcase,
  Bell, FolderOpen, FileText, Search, Shield, Settings, ChevronDown,
  ChevronRight, X, Boxes, CreditCard, BookOpen, LogOut,
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  children?: NavItem[];
  badge?: string | number;
}

const navigation: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
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
  {
    label: 'Purchases',
    icon: CreditCard,
    children: [
      { label: 'Suppliers', href: '/purchases/suppliers', icon: Building2 },
      { label: 'Purchase Orders', href: '/purchases/orders', icon: Package },
    ],
  },
  {
    label: 'Inventory',
    icon: Boxes,
    children: [
      { label: 'Products', href: '/inventory/products', icon: Boxes },
      { label: 'Categories', href: '/inventory/categories', icon: Package },
      { label: 'Warehouses', href: '/inventory/warehouses', icon: Building2 },
    ],
  },
  {
    label: 'Accounting',
    icon: BookOpen,
    children: [
      { label: 'Chart of Accounts', href: '/accounting/accounts', icon: BookOpen },
      { label: 'Journal Entries', href: '/accounting/journal', icon: FileText },
      { label: 'Reports', href: '/accounting/reports', icon: BarChart3 },
    ],
  },
  { label: 'Projects', href: '/projects', icon: Briefcase },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
  { label: 'Notifications', href: '/notifications', icon: Bell },
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
  const isActive = item.href ? pathname === item.href || pathname.startsWith(item.href + '/') : false;
  const hasActiveChild = item.children?.some((c) => c.href && (pathname === c.href || pathname.startsWith(c.href + '/')));
  const [expanded, setExpanded] = useState(hasActiveChild || false);
  const Icon = item.icon;

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setExpanded((p) => !p)}
          className={cn(
            'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
            hasActiveChild
              ? 'text-indigo-700 bg-indigo-50'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
          )}
          aria-expanded={expanded}
        >
          <Icon className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1 text-left font-medium">{item.label}</span>
          {expanded ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </button>
        {expanded && (
          <div className="ml-3 mt-0.5 pl-3 border-l border-slate-100 space-y-0.5">
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
        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
        isActive
          ? 'bg-indigo-600 text-white font-medium shadow-sm'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
      )}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200',
          'flex flex-col transition-transform duration-200 ease-out',
          'lg:translate-x-0 lg:z-30',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-[60px] px-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Boxes className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-tight">ERP System</p>
              <p className="text-[10px] text-slate-400 leading-tight">Enterprise Suite</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto no-scrollbar space-y-0.5">
          {navigation.map((item) => (
            <NavGroup key={item.label} item={item} />
          ))}
        </nav>

        {/* Bottom: logout */}
        <div className="px-3 py-3 border-t border-slate-100">
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

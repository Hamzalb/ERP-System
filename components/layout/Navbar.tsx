'use client';
import { Menu, Search, Bell, ChevronDown, Settings } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const unreadCount = 3; // TODO: from store

  return (
    <header className="fixed top-0 left-0 right-0 lg:left-64 z-20 h-[60px] bg-white border-b border-slate-200 flex items-center px-4 gap-3">
      {/* Hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className={cn('relative flex-1 max-w-lg', !searchFocused && 'max-w-xs')}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="search"
          placeholder="Search employees, invoices, products..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="w-full h-9 pl-9 pr-4 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
        />
        {searchFocused && (
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-400 font-mono">
            ESC
          </kbd>
        )}
      </div>

      <div className="flex-1" />

      {/* Notifications */}
      <Link
        href="/notifications"
        className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
        aria-label={`${unreadCount} unread notifications`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        )}
      </Link>

      {/* Settings */}
      <Link
        href="/settings/company"
        className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
        aria-label="Settings"
      >
        <Settings className="w-5 h-5" />
      </Link>

      {/* Profile */}
      <div className="relative">
        <button
          onClick={() => setProfileOpen((p) => !p)}
          className="flex items-center gap-2 pl-1 pr-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          aria-expanded={profileOpen}
          aria-haspopup
        >
          <Avatar name="Admin User" size="sm" />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-tight">Admin User</p>
            <p className="text-[10px] text-slate-400 leading-tight">SuperAdmin</p>
          </div>
          <ChevronDown className={cn('w-3.5 h-3.5 text-slate-400 transition-transform', profileOpen && 'rotate-180')} />
        </button>

        {profileOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
              <Link href="/profile" className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                <Avatar name="Admin User" size="xs" />
                <div>
                  <p className="font-medium leading-tight">My Profile</p>
                  <p className="text-[10px] text-slate-400">View & edit</p>
                </div>
              </Link>
              <div className="my-1 border-t border-slate-100" />
              <Link href="/settings/company" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                <Settings className="w-4 h-4 text-slate-400" />
                Settings
              </Link>
              <div className="my-1 border-t border-slate-100" />
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

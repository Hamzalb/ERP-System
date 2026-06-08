'use client';
import { Menu, Search, Bell, ChevronDown, Settings, Users, Package, FileText, PhoneCall, User } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface NavbarProps {
  onMenuClick: () => void;
}

interface SearchResult {
  _id: string;
  type: 'employee' | 'customer' | 'product' | 'invoice' | 'lead';
  title: string;
  subtitle: string;
  meta: string;
  href: string;
}

interface SearchResults {
  employees: SearchResult[];
  customers: SearchResult[];
  products: SearchResult[];
  invoices: SearchResult[];
  leads: SearchResult[];
}

const typeIcon: Record<string, React.ElementType> = {
  employee: Users,
  customer: User,
  product: Package,
  invoice: FileText,
  lead: PhoneCall,
};

const typeLabel: Record<string, string> = {
  employee: 'Employees',
  customer: 'Customers',
  product: 'Products',
  invoice: 'Invoices',
  lead: 'Leads',
};

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const unreadCount = 3;

  const debouncedQuery = useDebounce(searchQuery, 300);

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setSearchResults(null); return; }
    setSearchLoading(true);
    try {
      const res = await api.get<{ data: SearchResults }>(`/search?q=${encodeURIComponent(q)}`);
      setSearchResults(res.data.data);
    } catch {
      setSearchResults(null);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    doSearch(debouncedQuery);
  }, [debouncedQuery, doSearch]);

  // Close search dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const allResults: SearchResult[] = searchResults
    ? [
        ...searchResults.employees,
        ...searchResults.customers,
        ...searchResults.products,
        ...searchResults.invoices,
        ...searchResults.leads,
      ]
    : [];

  const hasResults = allResults.length > 0;
  const showDropdown = searchFocused && searchQuery.length >= 2;

  const handleResultClick = (result: SearchResult) => {
    setSearchQuery('');
    setSearchFocused(false);
    setSearchResults(null);
    router.push(result.href);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
  };

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
      <div ref={searchRef} className={cn('relative flex-1', !searchFocused && 'max-w-xs')}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
        <input
          type="search"
          value={searchQuery}
          placeholder="Search employees, invoices, products..."
          onFocus={() => setSearchFocused(true)}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Escape') { setSearchFocused(false); clearSearch(); } }}
          className="w-full h-9 pl-9 pr-4 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
        />

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-96 overflow-y-auto">
            {searchLoading && (
              <div className="px-4 py-3 text-sm text-slate-400 flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                Searching...
              </div>
            )}

            {!searchLoading && !hasResults && (
              <div className="px-4 py-6 text-center text-sm text-slate-400">
                No results for &quot;{searchQuery}&quot;
              </div>
            )}

            {!searchLoading && hasResults && (
              <div className="py-1">
                {(Object.keys(searchResults!) as Array<keyof SearchResults>)
                  .filter((key) => searchResults![key].length > 0)
                  .map((key) => (
                    <div key={key}>
                      <p className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                        {typeLabel[key.slice(0, -1)]}
                      </p>
                      {searchResults![key].map((result) => {
                        const Icon = typeIcon[result.type] ?? Search;
                        return (
                          <button
                            key={result._id}
                            onClick={() => handleResultClick(result)}
                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 text-left transition-colors"
                          >
                            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                              <Icon className="w-3.5 h-3.5 text-slate-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">{result.title}</p>
                              <p className="text-xs text-slate-400 truncate">{result.subtitle}</p>
                            </div>
                            {result.meta && (
                              <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded capitalize flex-shrink-0">
                                {result.meta}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
              </div>
            )}
          </div>
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
          aria-haspopup="true"
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

'use client';
import { Menu, Search, Bell, ChevronDown, Settings, Users, Package, FileText, PhoneCall, User, X } from 'lucide-react';
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
  employee: Users, customer: User, product: Package, invoice: FileText, lead: PhoneCall,
};

const typeColor: Record<string, string> = {
  employee: 'bg-indigo-100 text-indigo-600',
  customer: 'bg-emerald-100 text-emerald-600',
  product:  'bg-amber-100 text-amber-600',
  invoice:  'bg-blue-100 text-blue-600',
  lead:     'bg-violet-100 text-violet-600',
};

const typeLabel: Record<string, string> = {
  employees: 'Employees', customers: 'Customers',
  products: 'Products', invoices: 'Invoices', leads: 'Leads',
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
  const [searchQuery, setSearchQuery]     = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [profileOpen, setProfileOpen]     = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  const router    = useRouter();
  const unreadCount = 3;

  const debouncedQuery = useDebounce(searchQuery, 300);

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setSearchResults(null); return; }
    setSearchLoading(true);
    try {
      const res = await api.get<{ data: SearchResults }>(`/search?q=${encodeURIComponent(q)}`);
      setSearchResults(res.data.data);
    } catch { setSearchResults(null); }
    finally { setSearchLoading(false); }
  }, []);

  useEffect(() => { doSearch(debouncedQuery); }, [debouncedQuery, doSearch]);

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
    ? [...searchResults.employees, ...searchResults.customers, ...searchResults.products, ...searchResults.invoices, ...searchResults.leads]
    : [];

  const showDropdown = searchFocused && searchQuery.length >= 2;

  const handleResultClick = (result: SearchResult) => {
    setSearchQuery(''); setSearchFocused(false); setSearchResults(null);
    router.push(result.href);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 lg:left-64 z-20 h-[60px] glass-nav border-b border-slate-200/60 flex items-center px-4 gap-3"
      style={{ boxShadow: '0 1px 0 rgba(226,232,240,.8), 0 4px 16px rgba(0,0,0,.04)' }}
    >
      {/* Hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div ref={searchRef} className={cn('relative transition-all duration-300', searchFocused ? 'flex-1 max-w-xl' : 'w-64')}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
        <input
          ref={inputRef}
          type="search"
          value={searchQuery}
          placeholder="Search anything..."
          onFocus={() => setSearchFocused(true)}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Escape') { setSearchFocused(false); setSearchQuery(''); } }}
          className={cn(
            'w-full h-9 pl-9 pr-8 rounded-xl border text-sm transition-all duration-200',
            'placeholder:text-slate-400 text-slate-900',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300',
            searchFocused
              ? 'bg-white border-indigo-200 shadow-md shadow-indigo-100/50'
              : 'bg-slate-100 border-transparent hover:bg-slate-100/80',
          )}
        />
        {searchQuery && (
          <button
            onClick={() => { setSearchQuery(''); setSearchResults(null); inputRef.current?.focus(); }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Results dropdown */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 z-50 overflow-hidden animate-slide-up"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,.12), 0 8px 16px rgba(0,0,0,.06)' }}
          >
            {searchLoading && (
              <div className="flex items-center gap-3 px-4 py-3 text-sm text-slate-400">
                <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                Searching...
              </div>
            )}
            {!searchLoading && !allResults.length && (
              <div className="px-4 py-8 text-center">
                <Search className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No results for &ldquo;{searchQuery}&rdquo;</p>
              </div>
            )}
            {!searchLoading && allResults.length > 0 && searchResults && (
              <div className="py-2 max-h-96 overflow-y-auto">
                {(Object.keys(searchResults) as Array<keyof SearchResults>)
                  .filter((key) => searchResults[key].length > 0)
                  .map((key) => (
                    <div key={key}>
                      <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {typeLabel[key]}
                      </p>
                      {searchResults[key].map((result) => {
                        const Icon = typeIcon[result.type] ?? Search;
                        return (
                          <button
                            key={result._id}
                            onClick={() => handleResultClick(result)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-left transition-colors group"
                          >
                            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', typeColor[result.type] ?? 'bg-slate-100 text-slate-500')}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate group-hover:text-indigo-700">{result.title}</p>
                              <p className="text-xs text-slate-400 truncate">{result.subtitle}</p>
                            </div>
                            {result.meta && (
                              <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md capitalize flex-shrink-0">
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
        className="relative w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
        aria-label={`${unreadCount} unread notifications`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </Link>

      {/* Settings */}
      <Link
        href="/settings/company"
        className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
        aria-label="Settings"
      >
        <Settings className="w-5 h-5" />
      </Link>

      {/* Divider */}
      <div className="h-6 w-px bg-slate-200" />

      {/* Profile */}
      <div className="relative">
        <button
          onClick={() => setProfileOpen((p) => !p)}
          className="flex items-center gap-2 pl-1 pr-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          aria-expanded={profileOpen}
          aria-haspopup="true"
        >
          <Avatar name="Admin User" size="sm" />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-tight">Admin User</p>
            <p className="text-[10px] text-indigo-500 leading-tight font-medium">SuperAdmin</p>
          </div>
          <ChevronDown className={cn('w-3.5 h-3.5 text-slate-400 transition-transform duration-200', profileOpen && 'rotate-180')} />
        </button>

        {profileOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
            <div
              className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl z-20 py-1.5 overflow-hidden animate-slide-up"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,.12), 0 4px 12px rgba(0,0,0,.06)', border: '1px solid rgba(226,232,240,.8)' }}
            >
              <div className="px-3 py-2 mb-1">
                <div className="flex items-center gap-2.5">
                  <Avatar name="Admin User" size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 leading-tight">Admin User</p>
                    <p className="text-xs text-slate-400">admin@erp.com</p>
                  </div>
                </div>
              </div>
              <div className="my-1 border-t border-slate-100" />
              <Link href="/settings/company" className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-700 transition-colors">
                <Settings className="w-4 h-4 text-slate-400" />
                Settings
              </Link>
              <div className="my-1 border-t border-slate-100" />
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

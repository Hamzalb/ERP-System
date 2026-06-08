'use client';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: string;
  header: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField?: string;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (row: T) => void;
}

export function Table<T extends Record<string, unknown>>({
  columns, data, keyField = '_id', loading, emptyMessage = 'No data found', className, onRowClick,
}: TableProps<T>) {
  return (
    <div className={cn('overflow-x-auto rounded-2xl border border-slate-200/80 bg-white card-depth', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100" style={{ background: 'linear-gradient(to right, #f8fafc, #f1f5f9)' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap',
                  col.className,
                  col.width && `w-[${col.width}]`,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3.5">
                    <div className="h-4 bg-slate-100 rounded-lg animate-pulse" style={{ width: `${60 + (i * 7) % 30}%` }} />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-16 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <span className="text-2xl text-slate-300">∅</span>
                  </div>
                  <p className="text-slate-400 text-sm">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={String(row[keyField])}
                onClick={() => onRowClick?.(row)}
                className={cn('table-row-hover', onRowClick && 'cursor-pointer')}
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn('px-4 py-3.5 text-slate-700', col.className)}>
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-3.5 py-1.5 text-sm font-medium rounded-xl border-2 border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:border-indigo-300 hover:text-indigo-600 transition-all duration-150"
      >
        ← Previous
      </button>
      <span className="text-sm text-slate-500 tabular px-1">
        Page <span className="font-semibold text-slate-900">{page}</span> of <span className="font-semibold text-slate-900">{totalPages}</span>
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-3.5 py-1.5 text-sm font-medium rounded-xl border-2 border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:border-indigo-300 hover:text-indigo-600 transition-all duration-150"
      >
        Next →
      </button>
    </div>
  );
}

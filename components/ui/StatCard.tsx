'use client';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
  changeLabel?: string;
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'violet';
  className?: string;
}

const colors = {
  indigo: { icon: 'bg-indigo-50 text-indigo-600', border: 'border-indigo-100' },
  emerald: { icon: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
  amber: { icon: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
  rose: { icon: 'bg-rose-50 text-rose-600', border: 'border-rose-100' },
  sky: { icon: 'bg-sky-50 text-sky-600', border: 'border-sky-100' },
  violet: { icon: 'bg-violet-50 text-violet-600', border: 'border-violet-100' },
};

export function StatCard({ title, value, icon: Icon, change, changeLabel, color = 'indigo', className }: StatCardProps) {
  const c = colors[color];
  const isPositive = (change ?? 0) >= 0;

  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 shadow-sm p-5', className)}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', c.icon)}>
          <Icon className="w-4.5 h-4.5" strokeWidth={2} />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900 tabular">{value}</p>
      {change !== undefined && (
        <div className={cn('flex items-center gap-1 mt-2 text-xs font-medium', isPositive ? 'text-emerald-600' : 'text-red-500')}>
          {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          <span>{isPositive ? '+' : ''}{change}%</span>
          {changeLabel && <span className="text-slate-400 font-normal">{changeLabel}</span>}
        </div>
      )}
    </div>
  );
}

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
  indigo: {
    grad: 'from-indigo-500 to-indigo-600',
    glow: 'shadow-indigo-200',
    ring: 'ring-indigo-100',
    accent: 'bg-indigo-50 border-indigo-100',
    dot: 'bg-indigo-500',
  },
  emerald: {
    grad: 'from-emerald-500 to-teal-600',
    glow: 'shadow-emerald-200',
    ring: 'ring-emerald-100',
    accent: 'bg-emerald-50 border-emerald-100',
    dot: 'bg-emerald-500',
  },
  amber: {
    grad: 'from-amber-400 to-orange-500',
    glow: 'shadow-amber-200',
    ring: 'ring-amber-100',
    accent: 'bg-amber-50 border-amber-100',
    dot: 'bg-amber-500',
  },
  rose: {
    grad: 'from-rose-500 to-pink-600',
    glow: 'shadow-rose-200',
    ring: 'ring-rose-100',
    accent: 'bg-rose-50 border-rose-100',
    dot: 'bg-rose-500',
  },
  sky: {
    grad: 'from-sky-400 to-blue-600',
    glow: 'shadow-sky-200',
    ring: 'ring-sky-100',
    accent: 'bg-sky-50 border-sky-100',
    dot: 'bg-sky-500',
  },
  violet: {
    grad: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-200',
    ring: 'ring-violet-100',
    accent: 'bg-violet-50 border-violet-100',
    dot: 'bg-violet-500',
  },
};

export function StatCard({ title, value, icon: Icon, change, changeLabel, color = 'indigo', className }: StatCardProps) {
  const c = colors[color];
  const isPositive = (change ?? 0) >= 0;

  return (
    <div
      className={cn(
        'relative bg-white rounded-2xl overflow-hidden card-3d card-depth cursor-default',
        'border border-slate-100/80',
        className,
      )}
    >
      {/* Top gradient accent bar */}
      <div className={cn('absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r', c.grad)} />

      {/* Background mesh pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_70%_20%,#4f46e5_0%,transparent_60%)]" />

      <div className="relative p-5">
        <div className="flex items-start justify-between mb-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{title}</p>

          {/* 3D Icon container */}
          <div className={cn(
            'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0',
            `bg-gradient-to-br ${c.grad}`,
            `shadow-lg ${c.glow}`,
          )}
            style={{ boxShadow: `0 8px 20px var(--tw-shadow-color, rgba(0,0,0,.15)), inset 0 1px 0 rgba(255,255,255,.3)` }}
          >
            <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Value */}
        <p className="text-2xl font-bold text-slate-900 tabular leading-none mb-2">
          {value}
        </p>

        {/* Change indicator */}
        {change !== undefined && (
          <div className="flex items-center gap-1.5">
            <div className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
              isPositive
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-600',
            )}>
              {isPositive
                ? <TrendingUp className="w-3 h-3" />
                : <TrendingDown className="w-3 h-3" />}
              <span>{isPositive ? '+' : ''}{change}%</span>
            </div>
            {changeLabel && (
              <span className="text-xs text-slate-400">{changeLabel}</span>
            )}
          </div>
        )}
      </div>

      {/* Bottom accent dot */}
      <div className={cn('absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full opacity-40', c.dot)} />
    </div>
  );
}

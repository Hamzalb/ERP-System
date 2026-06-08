'use client';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  hoverable?: boolean;
  onClick?: () => void;
  tilt?: boolean;
  accent?: boolean;
}

const paddings = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6' };

export function Card({ children, className, padding = 'md', hoverable, onClick, tilt, accent }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'relative bg-white rounded-2xl border border-slate-100 card-depth overflow-hidden',
        paddings[padding],
        hoverable && 'cursor-pointer',
        tilt && 'card-3d',
        accent && 'accent-top',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn('text-sm font-semibold text-slate-900', className)}>
      {children}
    </h3>
  );
}

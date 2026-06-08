'use client';
import { cn } from '@/lib/utils';
import { initials } from '@/lib/utils';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
const sizes: Record<Size, string> = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
  xl: 'w-14 h-14 text-lg',
};

const colors = [
  'bg-indigo-100 text-indigo-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-sky-100 text-sky-700',
  'bg-violet-100 text-violet-700',
];

const getColor = (name: string) => colors[name.charCodeAt(0) % colors.length];

interface AvatarProps {
  name: string;
  src?: string;
  size?: Size;
  className?: string;
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover flex-shrink-0', sizes[size], className)}
      />
    );
  }
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold flex-shrink-0',
        sizes[size],
        getColor(name),
        className,
      )}
      aria-label={name}
    >
      {initials(name)}
    </div>
  );
}

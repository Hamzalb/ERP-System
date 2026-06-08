'use client';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg' | 'icon';

const variants: Record<Variant, string> = {
  primary:   'btn-3d-primary text-white focus-visible:ring-indigo-500 font-semibold',
  secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-400 shadow-sm active:translate-y-px',
  outline:   'border-2 border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-700 focus-visible:ring-indigo-400 active:translate-y-px',
  ghost:     'text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400 active:translate-y-px',
  danger:    'bg-gradient-to-br from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 focus-visible:ring-red-500 shadow-md shadow-red-200 active:translate-y-0.5',
};

const sizes: Record<Size, string> = {
  sm:   'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md:   'h-9 px-4 text-sm gap-2 rounded-lg',
  lg:   'h-11 px-6 text-sm gap-2 rounded-xl',
  icon: 'h-9 w-9 rounded-lg',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, leftIcon, rightIcon, children, className, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  ),
);
Button.displayName = 'Button';

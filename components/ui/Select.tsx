'use client';
import { cn } from '@/lib/utils';
import { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string | number }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-slate-700">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full h-10 rounded-xl border-2 bg-slate-50 pl-3.5 pr-9 text-sm text-slate-900 appearance-none transition-all duration-200',
              'focus:outline-none focus:bg-white focus:border-indigo-400 focus:shadow-md focus:shadow-indigo-100/50',
              'hover:border-slate-300',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100',
              error ? 'border-red-300 bg-red-50' : 'border-slate-200',
              className,
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        {error && <p role="alert" className="text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);
Select.displayName = 'Select';

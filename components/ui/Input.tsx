'use client';
import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon: LeftIcon, rightIcon: RightIcon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
            {label}
            {props.required && <span className="text-red-500 ml-0.5" aria-hidden>*</span>}
          </label>
        )}
        <div className="relative">
          {LeftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <LeftIcon className="w-4 h-4 text-slate-400" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            aria-invalid={!!error}
            className={cn(
              'w-full h-10 rounded-xl border-2 bg-slate-50 px-3.5 text-sm text-slate-900 transition-all duration-200',
              'placeholder:text-slate-400',
              'focus:outline-none focus:bg-white focus:border-indigo-400 focus:shadow-md focus:shadow-indigo-100/50',
              'hover:border-slate-300',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100',
              error ? 'border-red-300 bg-red-50 focus:border-red-400 focus:shadow-red-100/50' : 'border-slate-200',
              LeftIcon && 'pl-9',
              RightIcon && 'pr-9',
              className,
            )}
            {...props}
          />
          {RightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <RightIcon className="w-4 h-4 text-slate-400" />
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} role="alert" className="text-xs text-red-500">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-slate-400">
            {hint}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

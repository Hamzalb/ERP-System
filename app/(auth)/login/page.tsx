'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Boxes, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await new Promise((r) => setTimeout(r, 800)); // simulated API call
      toast.success('Welcome back!');
      // router.push('/')
    } catch {
      toast.error('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 flex-col items-start justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Boxes className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl">ERP System</span>
        </div>

        <div>
          <h1 className="text-white text-4xl font-bold leading-tight mb-4">
            Manage your business<br />from one place.
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed max-w-md">
            Complete enterprise resource planning — HR, CRM, Sales, Inventory, Accounting, and more.
          </p>
        </div>

        <div className="flex gap-6">
          {['142 Employees', '1,284 Customers', '$248K Revenue'].map((stat) => (
            <div key={stat}>
              <p className="text-white font-bold text-xl">{stat.split(' ')[0]}</p>
              <p className="text-indigo-300 text-sm">{stat.split(' ').slice(1).join(' ')}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Boxes className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">ERP System</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">Sign in</h2>
          <p className="text-slate-500 text-sm mb-8">Enter your credentials to access the system</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                autoFocus
                aria-invalid={!!errors.email}
                className={cn(
                  'w-full h-10 px-3 rounded-lg border bg-white text-sm text-slate-900',
                  'placeholder:text-slate-400',
                  'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                  errors.email ? 'border-red-400' : 'border-slate-200',
                )}
                placeholder="you@company.com"
                {...register('email')}
              />
              {errors.email && <p role="alert" className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
                <Link href="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-700">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  className={cn(
                    'w-full h-10 pl-3 pr-10 rounded-lg border bg-white text-sm text-slate-900',
                    'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                    errors.password ? 'border-red-400' : 'border-slate-200',
                  )}
                  placeholder="••••••••"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p role="alert" className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-slate-200 text-indigo-600 focus:ring-indigo-500"
                {...register('remember')}
              />
              <label htmlFor="remember" className="text-sm text-slate-600">Remember me for 7 days</label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
              ) : (
                <>Sign in <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Need an account?{' '}
            <Link href="/register" className="text-indigo-600 font-medium hover:text-indigo-700">
              Contact your admin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

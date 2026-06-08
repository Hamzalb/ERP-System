'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowRight, Loader2, Sparkles, TrendingUp, Users, DollarSign, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

const STATS = [
  { icon: Users, label: 'Employees', value: '142', color: 'text-blue-300' },
  { icon: DollarSign, label: 'Revenue', value: '$248K', color: 'text-emerald-300' },
  { icon: TrendingUp, label: 'Growth', value: '+14%', color: 'text-violet-300' },
];

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const { login } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password, data.remember);
      toast.success('Welcome back!', { description: 'Redirecting to dashboard...' });
      router.replace('/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Invalid email or password';
      toast.error('Login failed', { description: msg });
      setError('password', { message: msg });
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* ── Left: 3D Hero Panel ── */}
      <div
        className="hidden lg:flex lg:w-[52%] relative flex-col overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)' }}
      >
        {/* Animated mesh grid */}
        <div className="absolute inset-0 mesh-dark opacity-80" />

        {/* Floating 3D orbs */}
        <div
          className="absolute top-20 right-20 w-64 h-64 rounded-full animate-float-slow"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(99,102,241,.5) 0%, rgba(124,58,237,.2) 50%, transparent 70%)',
            filter: 'blur(1px)',
          }}
        />
        <div
          className="absolute bottom-32 left-16 w-48 h-48 rounded-full animate-float"
          style={{
            background: 'radial-gradient(circle at 40% 40%, rgba(139,92,246,.4) 0%, rgba(79,70,229,.1) 60%, transparent 80%)',
            filter: 'blur(2px)',
            animationDelay: '-2s',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,.08) 0%, transparent 70%)',
          }}
        />

        {/* 3D geometric shapes */}
        <div
          className="absolute top-1/3 right-1/4 w-20 h-20 rounded-2xl border border-indigo-500/30 animate-spin-slow"
          style={{ background: 'rgba(99,102,241,.08)', transform: 'perspective(400px) rotateX(15deg) rotateY(25deg)' }}
        />
        <div
          className="absolute bottom-1/3 left-1/3 w-12 h-12 rounded-xl border border-violet-500/30 animate-float"
          style={{ background: 'rgba(124,58,237,.1)', animationDelay: '-3s', transform: 'perspective(400px) rotateX(-20deg) rotateY(15deg)' }}
        />
        <div
          className="absolute top-2/3 right-1/3 w-8 h-8 rounded-lg border border-indigo-400/40 animate-float-slow"
          style={{ background: 'rgba(129,140,248,.15)', animationDelay: '-1s' }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)', boxShadow: '0 8px 24px rgba(99,102,241,.5)' }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">ERP System</p>
              <p className="text-indigo-400 text-xs">Enterprise Suite</p>
            </div>
          </div>

          {/* Hero text */}
          <div className="mt-auto mb-auto pt-20">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/80 text-xs font-medium">All systems operational</span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
              Manage your<br />
              <span className="text-gradient-hero">entire business</span><br />
              from one place.
            </h1>
            <p className="text-indigo-300/80 text-lg leading-relaxed max-w-sm">
              HR, CRM, Sales, Purchases, Inventory, Accounting — unified in one powerful platform.
            </p>
          </div>

          {/* 3D Stats cards */}
          <div className="flex gap-3">
            {STATS.map(({ icon: Icon, label, value, color }) => (
              <div
                key={label}
                className="flex-1 rounded-2xl p-4 border border-white/10"
                style={{
                  background: 'rgba(255,255,255,.07)',
                  backdropFilter: 'blur(8px)',
                  transform: 'perspective(600px) rotateX(3deg)',
                  boxShadow: '0 8px 24px rgba(0,0,0,.2), inset 0 1px 0 rgba(255,255,255,.1)',
                }}
              >
                <Icon className={cn('w-4 h-4 mb-2', color)} />
                <p className="text-xl font-bold text-white">{value}</p>
                <p className="text-xs text-white/50">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Login Form ── */}
      <div className="flex-1 flex items-center justify-center p-6 relative"
        style={{ background: 'linear-gradient(160deg, #f8fafc 0%, #f1f5f9 100%)' }}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #e0e7ff 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #ede9fe 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

        <div className="relative w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">ERP System</span>
          </div>

          {/* Form card */}
          <div
            className="bg-white rounded-3xl p-8"
            style={{
              boxShadow: '0 4px 6px rgba(0,0,0,.04), 0 20px 60px rgba(79,70,229,.08), 0 40px 80px rgba(0,0,0,.06)',
              border: '1px solid rgba(226,232,240,.8)',
            }}
          >
            {/* Shield icon */}
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
              style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)' }}>
              <Shield className="w-5 h-5 text-indigo-600" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
            <p className="text-slate-500 text-sm mb-7">Sign in to your account to continue</p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email address
                </label>
                <input
                  id="email" type="email" autoComplete="email" autoFocus
                  aria-invalid={!!errors.email}
                  placeholder="you@company.com"
                  className={cn(
                    'w-full h-11 px-4 rounded-xl border-2 bg-slate-50 text-sm text-slate-900 transition-all duration-200',
                    'placeholder:text-slate-400',
                    'focus:outline-none focus:bg-white focus:border-indigo-400 focus:shadow-md focus:shadow-indigo-100/50',
                    errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300',
                  )}
                  {...register('email')}
                />
                {errors.email && (
                  <p role="alert" className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-red-100 flex items-center justify-center text-[8px] font-bold">!</span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label>
                  <Link href="/forgot-password" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    aria-invalid={!!errors.password}
                    placeholder="••••••••"
                    className={cn(
                      'w-full h-11 pl-4 pr-11 rounded-xl border-2 bg-slate-50 text-sm text-slate-900 transition-all duration-200',
                      'focus:outline-none focus:bg-white focus:border-indigo-400 focus:shadow-md focus:shadow-indigo-100/50',
                      errors.password ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300',
                    )}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p role="alert" className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox" id="remember"
                  className="w-4 h-4 rounded border-slate-200 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                  {...register('remember')}
                />
                <label htmlFor="remember" className="text-sm text-slate-600">Keep me signed in for 7 days</label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'w-full h-12 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-150',
                  'disabled:opacity-60 disabled:cursor-not-allowed',
                  'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                )}
                style={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  boxShadow: isSubmitting ? '0 2px 8px rgba(79,70,229,.3)' : '0 4px 0 #3730a3, 0 8px 24px rgba(79,70,229,.35)',
                  transform: isSubmitting ? 'translateY(2px)' : undefined,
                }}
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
                ) : (
                  <>Sign in <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Need access?{' '}
              <Link href="/register" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                Contact your admin
              </Link>
            </p>
          </div>

          {/* Trust badges */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-400">
            {['256-bit SSL', 'SOC 2 Type II', 'GDPR Compliant'].map((badge) => (
              <span key={badge} className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

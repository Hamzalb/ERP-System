'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Mail, Loader2, Sparkles, Key } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const schema = z.object({ email: z.string().email('Invalid email address') });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    toast.success('Reset link sent — check your email');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #f8fafc 0%, #f1f5f9 100%)' }}>

      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-25 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #e0e7ff 0%, transparent 70%)', transform: 'translate(35%, -35%)' }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #ede9fe 0%, transparent 70%)', transform: 'translate(-35%, 35%)' }} />

      <div className="relative w-full max-w-sm animate-slide-up">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', boxShadow: '0 6px 20px rgba(79,70,229,.35)' }}>
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-lg leading-tight block">ERP System</span>
            <span className="text-xs text-slate-400">Enterprise Suite</span>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-3xl p-8"
          style={{
            boxShadow: '0 4px 6px rgba(0,0,0,.04), 0 20px 60px rgba(79,70,229,.08), 0 40px 80px rgba(0,0,0,.06)',
            border: '1px solid rgba(226,232,240,.8)',
          }}>

          {!sent ? (
            <>
              {/* Icon header */}
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)' }}>
                <Key className="w-5 h-5 text-indigo-600" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-1">Forgot password?</h2>
              <p className="text-slate-500 text-sm mb-7">No worries — we'll email you a secure reset link.</p>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Email address
                  </label>
                  <input
                    id="email" type="email" autoFocus autoComplete="email"
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  style={{
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    boxShadow: isSubmitting ? '0 2px 8px rgba(79,70,229,.3)' : '0 4px 0 #3730a3, 0 8px 24px rgba(79,70,229,.35)',
                    transform: isSubmitting ? 'translateY(2px)' : undefined,
                  }}
                >
                  {isSubmitting
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending link...</>
                    : 'Send reset link'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-2">
              <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5"
                style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' }}>
                <Mail className="w-7 h-7 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Check your inbox</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                We sent a password reset link to<br />
                <span className="font-semibold text-slate-900">{getValues('email')}</span>
              </p>
              <p className="text-xs text-slate-400 mt-4">Didn't receive it? Check your spam folder.</p>
            </div>
          )}
        </div>

        <Link href="/login" className="flex items-center justify-center gap-1.5 mt-6 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </Link>
      </div>
    </div>
  );
}

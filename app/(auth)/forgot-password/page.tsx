'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Boxes, ArrowLeft, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const schema = z.object({ email: z.string().email('Invalid email') });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    toast.success('Reset link sent — check your email');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Boxes className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900">ERP System</span>
        </div>

        {!sent ? (
          <>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Forgot password?</h2>
            <p className="text-slate-500 text-sm mb-8">Enter your email and we'll send a reset link</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                <input
                  id="email" type="email" autoFocus
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="you@company.com"
                  {...register('email')}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <button type="submit" disabled={isSubmitting}
                className="w-full h-10 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2">
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : 'Send reset link'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Check your email</h2>
            <p className="text-slate-500 text-sm">We've sent a password reset link to your email address.</p>
          </div>
        )}

        <Link href="/login" className="flex items-center justify-center gap-1.5 mt-6 text-sm text-slate-500 hover:text-slate-700">
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </Link>
      </div>
    </div>
  );
}

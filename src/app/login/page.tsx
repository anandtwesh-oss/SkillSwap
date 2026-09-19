'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { 
  ArrowLeftRight, 
  Lock, 
  Mail, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2,
  Users
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/matches';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validateForm = () => {
    const errs: typeof errors = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const res = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrors({ general: 'Invalid email or password. Please try again.' });
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setErrors({ general: err?.message || 'Login failed. Please check your connection.' });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setErrors({});
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            Welcome Back to SkillSwap
          </h1>
          <p className="text-xs text-slate-500">
            Sign in to continue your peer learning exchanges.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          {errors.general && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                  }}
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.email ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 pl-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.password ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 pl-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* 1-Click Demo Persona Short-cuts */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>1-Click Test Peer Accounts:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('alex.chen@example.com')}
                className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition-all"
              >
                <div className="text-xs font-bold text-slate-800 dark:text-white">Alex Chen</div>
                <div className="text-[10px] text-emerald-700 font-medium truncate">Java ⮂ Python</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('sarah.jenkins@example.com')}
                className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition-all"
              >
                <div className="text-xs font-bold text-slate-800 dark:text-white">Sarah Jenkins</div>
                <div className="text-[10px] text-indigo-700 font-medium truncate">Python ⮂ Java</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('carlos.r@example.com')}
                className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition-all"
              >
                <div className="text-xs font-bold text-slate-800 dark:text-white">Carlos R.</div>
                <div className="text-[10px] text-pink-700 font-medium truncate">UI/UX ⮂ React</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('maya.patel@example.com')}
                className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition-all"
              >
                <div className="text-xs font-bold text-slate-800 dark:text-white">Maya Patel</div>
                <div className="text-[10px] text-cyan-700 font-medium truncate">React ⮂ UI/UX</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Link to Signup */}
        <div className="text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link href="/signup" className="font-bold text-indigo-600 hover:underline">
            Create a Free Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

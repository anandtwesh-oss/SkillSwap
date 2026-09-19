'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { 
  ArrowLeftRight, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Briefcase, 
  MapPin, 
  GraduationCap, 
  BookOpen, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

const categories = [
  'Programming & Tech',
  'AI & Data Science',
  'Design & Creative',
  'Languages',
  'Music & Audio',
  'Business & Marketing'
];

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    title: '',
    location: '',
    teachSkillName: '',
    teachSkillCategory: 'Programming & Tech',
    teachSkillProficiency: 'Advanced',
    learnSkillName: '',
    learnSkillCategory: 'Programming & Tech',
    learnSkillProficiency: 'Beginner'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Full name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      errs.password = 'Password must be at least 8 characters long.';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.teachSkillName.trim()) {
      errs.teachSkillName = 'Please enter at least one skill you can teach.';
    }

    if (!formData.learnSkillName.trim()) {
      errs.learnSkillName = 'Please enter at least one skill you want to learn.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setGeneralError(null);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setGeneralError(data.error || 'Registration failed.');
        }
        setLoading(false);
        return;
      }

      setSuccess(true);

      // Auto sign-in after signup
      const signInRes = await signIn('credentials', {
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        redirect: false
      });

      if (signInRes?.ok) {
        router.push('/matches');
        router.refresh();
      } else {
        router.push('/login');
      }
    } catch (err: any) {
      setGeneralError(err?.message || 'Network error during signup.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            Create Your SkillSwap Account
          </h1>
          <p className="text-xs text-slate-500">
            Join the peer learning community and start trading skills with global peers!
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          {generalError && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{generalError}</span>
            </div>
          )}

          {success ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce-slight">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Account Created!</h3>
              <p className="text-xs text-slate-500">Logging you in and setting up your bilateral matchmaker...</p>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Account Credentials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Full Name *
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Maya Lin"
                      className={`w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-[10px] font-semibold text-rose-500 pl-1">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="maya@example.com"
                      className={`w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.email ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[10px] font-semibold text-rose-500 pl-1">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Password (Min 8 chars) *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.password ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-[10px] font-semibold text-rose-500 pl-1">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.confirmPassword ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-[10px] font-semibold text-rose-500 pl-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Title & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Professional Headline / Role
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Frontend Developer"
                      className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g. San Francisco, CA"
                      className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Initial Skill Exchange Setup */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Your Initial Bilateral Match Criteria</span>
                </div>

                {/* Skill to Teach */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Skill You Can Teach (Offer) *</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={formData.teachSkillName}
                      onChange={(e) => setFormData(prev => ({ ...prev, teachSkillName: e.target.value }))}
                      placeholder="e.g. Python, Figma, React"
                      className={`sm:col-span-2 px-3 py-1.5 bg-white dark:bg-slate-900 border rounded-xl text-xs ${
                        errors.teachSkillName ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    />
                    <select
                      value={formData.teachSkillCategory}
                      onChange={(e) => setFormData(prev => ({ ...prev, teachSkillCategory: e.target.value }))}
                      className="px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  {errors.teachSkillName && (
                    <p className="text-[10px] font-semibold text-rose-500 pl-1">{errors.teachSkillName}</p>
                  )}
                </div>

                {/* Skill to Learn */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1 text-xs font-bold text-indigo-700 dark:text-indigo-400">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Skill You Want to Learn (Wishlist) *</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={formData.learnSkillName}
                      onChange={(e) => setFormData(prev => ({ ...prev, learnSkillName: e.target.value }))}
                      placeholder="e.g. Java, Machine Learning, UI/UX"
                      className={`sm:col-span-2 px-3 py-1.5 bg-white dark:bg-slate-900 border rounded-xl text-xs ${
                        errors.learnSkillName ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    />
                    <select
                      value={formData.learnSkillCategory}
                      onChange={(e) => setFormData(prev => ({ ...prev, learnSkillCategory: e.target.value }))}
                      className="px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  {errors.learnSkillName && (
                    <p className="text-[10px] font-semibold text-rose-500 pl-1">{errors.learnSkillName}</p>
                  )}
                </div>
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
                    <span>Create Account & Join (+100 XP Bonus)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer Link to Login */}
        <div className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-indigo-600 hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}

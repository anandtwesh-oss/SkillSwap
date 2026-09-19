'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, UserSkill } from '@/lib/types';
import { useUser } from './UserContext';
import { 
  ArrowLeftRight, 
  Clock, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  X,
  MessageSquare,
  AlertCircle,
  LogIn
} from 'lucide-react';

interface SwapModalProps {
  peerUser: User;
  suggestedTeachSkill?: string;
  suggestedLearnSkill?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SwapModal: React.FC<SwapModalProps> = ({
  peerUser,
  suggestedTeachSkill,
  suggestedLearnSkill,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { currentUser, refreshCurrentUser, isAuthenticated } = useUser();

  const myTeachSkills = currentUser?.skills.filter(s => s.type === 'TEACH') || [];
  const peerTeachSkills = peerUser.skills.filter(s => s.type === 'TEACH') || [];

  const [teachSkill, setTeachSkill] = useState<string>(
    suggestedTeachSkill || (myTeachSkills[0]?.name || '')
  );
  const [learnSkill, setLearnSkill] = useState<string>(
    suggestedLearnSkill || (peerTeachSkills[0]?.name || '')
  );
  const [message, setMessage] = useState<string>(
    `Hi ${peerUser.name}! I'd love to swap knowledge with you. I can teach you ${teachSkill || 'my skills'} in exchange for learning ${learnSkill || 'your skills'}.`
  );
  const [duration, setDuration] = useState<number>(60);
  const [loading, setLoading] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!teachSkill) errs.teachSkill = 'Please select a skill you can teach.';
    if (!learnSkill) errs.learnSkill = `Please select a skill offered by ${peerUser.name.split(' ')[0]}.`;
    if (!message.trim() || message.trim().length < 5) errs.message = 'Please provide a message of at least 5 characters.';

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!validate()) return;

    setLoading(true);
    setGeneralError(null);
    setFieldErrors({});

    try {
      const res = await fetch('/api/swaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterId: currentUser.id,
          receiverId: peerUser.id,
          teachSkill,
          learnSkill,
          message: message.trim(),
          durationMinutes: duration,
          scheduledTime: new Date(Date.now() + 86400000).toISOString()
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        await refreshCurrentUser();
        setTimeout(() => {
          setSubmitted(false);
          onClose();
          if (onSuccess) onSuccess();
        }, 1500);
      } else {
        if (data.errors) {
          setFieldErrors(data.errors);
        } else {
          setGeneralError(data.error || 'Failed to send swap proposal');
        }
      }
    } catch (err: any) {
      setGeneralError(err.message || 'Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl">
                <ArrowLeftRight className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-lg">Propose Skill Swap</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3 mt-4 bg-white/10 backdrop-blur-md p-3 rounded-2xl">
            <img
              src={peerUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={peerUser.name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/30"
            />
            <div>
              <div className="font-semibold text-sm">{peerUser.name}</div>
              <div className="text-xs text-white/80 line-clamp-1">{peerUser.title}</div>
              <div className="text-[11px] text-amber-200 mt-0.5">★ {peerUser.rating} ({peerUser.reviewCount} reviews) • {peerUser.tier} Tier</div>
            </div>
          </div>
        </div>

        {/* Content */}
        {!isAuthenticated || !currentUser ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
              <LogIn className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-800 dark:text-white">Authentication Required</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                Please sign in with your SkillSwap account to propose a 1-on-1 swap with {peerUser.name}.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <Link
                href="/login"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Log In to Propose Swap
              </Link>
            </div>
          </div>
        ) : submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slight">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-800 dark:text-white">Swap Request Sent!</h4>
            <p className="text-sm text-slate-500 mt-2">
              {peerUser.name} has been notified and can now accept your proposal.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {generalError && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{generalError}</span>
              </div>
            )}

            {/* Bilateral Pair Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* What I offer */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  You Teach (Offer) *
                </label>
                <select
                  value={teachSkill}
                  onChange={(e) => {
                    setTeachSkill(e.target.value);
                    if (fieldErrors.teachSkill) setFieldErrors(prev => ({ ...prev, teachSkill: '' }));
                  }}
                  className={`w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                    fieldErrors.teachSkill ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {myTeachSkills.length === 0 ? (
                    <option value="">No teaching skills found</option>
                  ) : (
                    myTeachSkills.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.proficiency})
                      </option>
                    ))
                  )}
                </select>
                {fieldErrors.teachSkill && (
                  <p className="text-[10px] font-semibold text-rose-500 pl-1">{fieldErrors.teachSkill}</p>
                )}
              </div>

              {/* What I want */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  {peerUser.name.split(' ')[0]} Teaches *
                </label>
                <select
                  value={learnSkill}
                  onChange={(e) => {
                    setLearnSkill(e.target.value);
                    if (fieldErrors.learnSkill) setFieldErrors(prev => ({ ...prev, learnSkill: '' }));
                  }}
                  className={`w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                    fieldErrors.learnSkill ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {peerTeachSkills.length === 0 ? (
                    <option value="">No skills available</option>
                  ) : (
                    peerTeachSkills.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.proficiency})
                      </option>
                    ))
                  )}
                </select>
                {fieldErrors.learnSkill && (
                  <p className="text-[10px] font-semibold text-rose-500 pl-1">{fieldErrors.learnSkill}</p>
                )}
              </div>
            </div>

            {/* Duration Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Session Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[30, 45, 60, 90].map((dur) => (
                  <button
                    type="button"
                    key={dur}
                    onClick={() => setDuration(dur)}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                      duration === dur
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                    }`}
                  >
                    {dur} mins
                  </button>
                ))}
              </div>
            </div>

            {/* Note/Goal Message */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Personalized Proposal Message *
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (fieldErrors.message) setFieldErrors(prev => ({ ...prev, message: '' }));
                }}
                placeholder="Explain what specific topics or projects you want to collaborate on..."
                className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none ${
                  fieldErrors.message ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
                }`}
              />
              {fieldErrors.message && (
                <p className="text-[10px] font-semibold text-rose-500 pl-1">{fieldErrors.message}</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !teachSkill || !learnSkill}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Swap Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

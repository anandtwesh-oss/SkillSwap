'use client';

import React, { useState } from 'react';
import { User, SwapRequest } from '@/lib/types';
import { useUser } from './UserContext';
import { 
  Star, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Trophy, 
  Zap, 
  AlertCircle,
  ThumbsUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReviewModalProps {
  swap: SwapRequest & { requester?: User; receiver?: User };
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const praiseTagOptions = [
  'Crystal Clear Explanations',
  'Super Patient Tutor',
  'Practical Code Examples',
  'Great Hands-on Exercises',
  'Deep Domain Knowledge',
  'Engaging Dialogue & Tips',
  'Structured & Well Prepared'
];

export const ReviewModal: React.FC<ReviewModalProps> = ({
  swap,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { currentUser, refreshCurrentUser } = useUser();

  const isRequester = currentUser?.id === swap.requesterId;
  const targetUser = isRequester ? swap.receiver : swap.requester;
  const targetSkill = isRequester ? swap.learnSkill : swap.teachSkill;

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Crystal Clear Explanations',
    'Super Patient Tutor'
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [earnedPoints, setEarnedPoints] = useState<number>(0);

  if (!isOpen || !currentUser || !targetUser) return null;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!rating || rating < 1 || rating > 5) {
      errs.rating = 'Please choose a rating between 1 and 5 stars.';
    }
    if (!feedback.trim() || feedback.trim().length < 5) {
      errs.feedback = 'Please provide detailed feedback of at least 5 characters.';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setGeneralError(null);
    setFieldErrors({});

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          swapId: swap.id,
          reviewerId: currentUser.id,
          targetUserId: targetUser.id,
          rating,
          feedback: feedback.trim(),
          tags: selectedTags,
          skillTaught: targetSkill
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        const xpEarned = rating === 5 ? 20 : 10;
        setEarnedPoints(xpEarned);

        if (rating === 5) {
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (e) {
            console.log(e);
          }
        }

        await refreshCurrentUser();
        setTimeout(() => {
          setSubmitted(false);
          onClose();
          if (onSuccess) onSuccess();
        }, 2200);
      } else {
        if (data.errors) {
          setFieldErrors(data.errors);
        } else {
          setGeneralError(data.error || 'Failed to submit review');
        }
      }
    } catch (err: any) {
      setGeneralError(err.message || 'Network error');
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
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
              <h3 className="font-bold text-lg">Rate Your Peer Swap</h3>
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
              src={targetUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={targetUser.name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/30"
            />
            <div>
              <div className="font-semibold text-sm">{targetUser.name}</div>
              <div className="text-xs text-white/90">
                Taught you: <span className="font-bold underline">{targetSkill}</span>
              </div>
              <div className="text-[11px] text-amber-100 mt-0.5">
                Current Rating: ★ {targetUser.rating} ({targetUser.reviewCount} reviews)
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/60 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce-slight">
              <Trophy className="w-9 h-9" />
            </div>
            <h4 className="text-xl font-bold text-slate-800 dark:text-white">Feedback Submitted!</h4>
            <p className="text-xs text-slate-500">
              Thank you for supporting the peer learning community.
            </p>
            <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs rounded-full shadow-md">
              <Zap className="w-4 h-4 fill-white" />
              <span>+{earnedPoints} Gamification XP Awarded to {targetUser.name}!</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {generalError && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{generalError}</span>
              </div>
            )}

            {/* Star Rating selector */}
            <div className="text-center py-1 space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Overall Teaching Quality *
              </div>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => {
                        setRating(star);
                        if (fieldErrors.rating) setFieldErrors(prev => ({ ...prev, rating: '' }));
                      }}
                      className="p-1.5 focus:outline-none transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          isFilled
                            ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              {fieldErrors.rating && (
                <p className="text-[10px] font-semibold text-rose-500">{fieldErrors.rating}</p>
              )}
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {rating === 5 && '🌟 Exceptional Mentor (5/5)'}
                {rating === 4 && '👍 Great & Very Helpful (4/5)'}
                {rating === 3 && '👌 Good Session (3/5)'}
                {rating === 2 && '👎 Needs Improvement (2/5)'}
                {rating === 1 && '⚠️ Poor Experience (1/5)'}
              </div>
            </div>

            {/* Praise tags */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Praise Badges (Optional)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {praiseTagOptions.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
                        isSelected
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 font-bold shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback textarea */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Written Review & Feedback *
              </label>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => {
                  setFeedback(e.target.value);
                  if (fieldErrors.feedback) setFieldErrors(prev => ({ ...prev, feedback: '' }));
                }}
                placeholder={`Share what you learned from ${targetUser.name}, exercises you did, or what made this swap great...`}
                className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none ${
                  fieldErrors.feedback ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
                }`}
              />
              {fieldErrors.feedback && (
                <p className="text-[10px] font-semibold text-rose-500 pl-1">{fieldErrors.feedback}</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Post Review (+XP)'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

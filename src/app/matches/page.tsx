'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/components/UserContext';
import { BilateralMatch, User } from '@/lib/types';
import { SkillBadge } from '@/components/SkillBadge';
import { SwapModal } from '@/components/SwapModal';
import { 
  Sparkles, 
  ArrowLeftRight, 
  Zap, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp,
  Award,
  Layers,
  HelpCircle
} from 'lucide-react';

export default function MatchesPage() {
  const { currentUser } = useUser();
  const [matches, setMatches] = useState<BilateralMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterExactOnly, setFilterExactOnly] = useState(false);
  const [selectedPeerForSwap, setSelectedPeerForSwap] = useState<{
    user: User;
    teachSkill?: string;
    learnSkill?: string;
  } | null>(null);

  const fetchMatches = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/matches?userId=${currentUser.id}`);
      const data = await res.json();
      if (data.success) {
        setMatches(data.matches);
      }
    } catch (e) {
      console.error('Error fetching matches', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [currentUser]);

  const displayedMatches = filterExactOnly
    ? matches.filter(m => m.isExactBilateral)
    : matches;

  const exactCount = matches.filter(m => m.isExactBilateral).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-8 sm:p-10 shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Smart 2-Way Bilateral Matching Algorithm</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Reciprocal Skill Matches for {currentUser?.name}
          </h1>
          <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
            Our algorithm scans thousands of skill vectors to find peers where 
            <span className="font-bold text-amber-300"> you offer what they want</span> and 
            <span className="font-bold text-emerald-300"> they offer what you want</span> — ensuring a 100% fair 1-on-1 knowledge exchange!
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold">{exactCount} Perfect 2-Way Matches Found</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold">{matches.length} Total Synergistic Peers</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterExactOnly(false)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              !filterExactOnly
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Potential Matches ({matches.length})
          </button>
          <button
            onClick={() => setFilterExactOnly(true)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterExactOnly
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Exact 2-Way Swaps ({exactCount})</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Matches automatically update as you update your skills</span>
        </div>
      </div>

      {/* Matches Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold">Running Bilateral Matching Engine...</p>
        </div>
      ) : displayedMatches.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
          <ArrowLeftRight className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">No Direct Matches Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Try adding more skills to teach or skills you want to learn in your profile to expand your mutual trade network.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayedMatches.map((match) => {
            const peer = match.user;
            const primaryOffer = match.offersYouTeach[0]?.name;
            const primaryWant = match.wantsYouTeach[0]?.name;

            return (
              <div
                key={peer.id}
                className={`relative bg-white dark:bg-slate-900 rounded-3xl border transition-all p-6 shadow-sm hover:shadow-md flex flex-col justify-between ${
                  match.isExactBilateral
                    ? 'border-emerald-400 dark:border-emerald-600 ring-2 ring-emerald-500/10'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Top Badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-800 dark:text-white">
                          {peer.name}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold rounded-full">
                          {peer.tier}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{peer.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span className="text-amber-500 font-bold flex items-center gap-0.5">
                          ★ {peer.rating}
                        </span>
                        <span>•</span>
                        <span>{peer.reviewCount} reviews</span>
                        <span>•</span>
                        <span className="text-indigo-600 font-semibold">{peer.completedSwaps} swaps</span>
                      </div>
                    </div>
                  </div>

                  {/* Match Confidence Score */}
                  <div className="text-right">
                    <div
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-2xl font-black text-sm shadow-sm ${
                        match.isExactBilateral
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                          : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{match.matchScore}% Match</span>
                    </div>
                    {match.isExactBilateral && (
                      <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 uppercase tracking-wider">
                        ★ 100% Bilateral
                      </div>
                    )}
                  </div>
                </div>

                {/* Bilateral Trade Diagram */}
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 mb-4 border border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>Proposed Knowledge Exchange</span>
                    <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-500" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* What they teach you */}
                    <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400 mb-1">
                        You Learn From {peer.name.split(' ')[0]}:
                      </div>
                      <div className="space-y-1">
                        {match.offersYouTeach.length > 0 ? (
                          match.offersYouTeach.map((s) => (
                            <SkillBadge
                              key={s.id}
                              name={s.name}
                              category={s.category}
                              proficiency={s.proficiency}
                              size="sm"
                            />
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">No direct teach match</span>
                        )}
                      </div>
                    </div>

                    {/* What you teach them */}
                    <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 mb-1">
                        You Teach {peer.name.split(' ')[0]}:
                      </div>
                      <div className="space-y-1">
                        {match.wantsYouTeach.length > 0 ? (
                          match.wantsYouTeach.map((s) => (
                            <SkillBadge
                              key={s.id}
                              name={s.name}
                              category={s.category}
                              proficiency={s.proficiency}
                              size="sm"
                            />
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">No direct learn match</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Match Explanations */}
                  <div className="space-y-1 pt-1">
                    {match.matchReasons.map((reason, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-slate-500 font-medium">
                    {peer.location}
                  </div>
                  <button
                    onClick={() =>
                      setSelectedPeerForSwap({
                        user: peer,
                        teachSkill: primaryWant,
                        learnSkill: primaryOffer
                      })
                    }
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                    <span>Instant Swap Proposal</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Swap Request Modal */}
      {selectedPeerForSwap && (
        <SwapModal
          peerUser={selectedPeerForSwap.user}
          suggestedTeachSkill={selectedPeerForSwap.teachSkill}
          suggestedLearnSkill={selectedPeerForSwap.learnSkill}
          isOpen={!!selectedPeerForSwap}
          onClose={() => setSelectedPeerForSwap(null)}
          onSuccess={() => {
            fetchMatches();
          }}
        />
      )}
    </div>
  );
}

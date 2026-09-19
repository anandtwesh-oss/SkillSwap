'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/components/UserContext';
import { BilateralMatch, User, SwapRequest } from '@/lib/types';
import { SkillBadge } from '@/components/SkillBadge';
import { SwapModal } from '@/components/SwapModal';
import { 
  Sparkles, 
  ArrowLeftRight, 
  Video, 
  Star, 
  Trophy, 
  Zap, 
  ShieldCheck, 
  BookOpen, 
  Users, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  TrendingUp,
  GraduationCap,
  LogIn,
  UserPlus
} from 'lucide-react';

export default function HomePage() {
  const { currentUser, allUsers, isAuthenticated, loading } = useUser();
  const [topMatch, setTopMatch] = useState<BilateralMatch | null>(null);
  const [activeSwap, setActiveSwap] = useState<SwapRequest | null>(null);
  const [selectedPeerForSwap, setSelectedPeerForSwap] = useState<User | null>(null);

  useEffect(() => {
    const targetUserId = currentUser ? currentUser.id : (allUsers[0]?.id || '');
    if (targetUserId) {
      // Fetch top match
      fetch(`/api/matches?userId=${targetUserId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.matches && data.matches.length > 0) {
            setTopMatch(data.matches[0]);
          }
        })
        .catch(console.error);

      // Fetch active swap session if logged in
      if (currentUser) {
        fetch(`/api/swaps?userId=${currentUser.id}&status=ACCEPTED`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.swaps && data.swaps.length > 0) {
              setActiveSwap(data.swaps[0]);
            }
          })
          .catch(console.error);
      }
    }
  }, [currentUser, allUsers]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-[500px] h-[500px] bg-gradient-to-br from-indigo-600/30 via-violet-600/20 to-pink-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Greeting & Hero Copy */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-indigo-300 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse-slow" />
              <span>Peer-to-Peer Knowledge Exchange Network</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Trade Skills Directly.<br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                No Middlemen. Pure Peer Learning.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              {currentUser ? (
                <>
                  Welcome back, <span className="font-bold text-white">{currentUser.name}</span>! Teach what you know best (like{' '}
                  <span className="text-emerald-400 font-semibold">{currentUser.skills.find(s => s.type === 'TEACH')?.name || 'your expertise'}</span>
                  ) and learn what you need (like{' '}
                  <span className="text-indigo-300 font-semibold">{currentUser.skills.find(s => s.type === 'LEARN')?.name || 'new skills'}</span>
                  ) from verified global peers.
                </>
              ) : (
                <>
                  Learn any skill for free by teaching what you know. Our smart 2-way bilateral matching engine pairs you with peers who want what you offer and offer what you want.
                </>
              )}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              {isAuthenticated ? (
                <Link
                  href="/matches"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 via-violet-600 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-105"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Launch 2-Way Matchmaker</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 via-violet-600 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-105"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Get Started (Sign Up)</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>

                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-2xl backdrop-blur-md border border-white/15 transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Log In to Account</span>
                  </Link>
                </>
              )}

              <Link
                href="/explore"
                className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-2xl backdrop-blur-md border border-white/15 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore All Skills</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Dynamic Live Top Match Card */}
          <div className="lg:col-span-5">
            {topMatch ? (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[11px] font-black uppercase tracking-wider rounded-bl-2xl shadow-sm">
                  ★ {topMatch.matchScore}% Match
                </div>

                <div className="text-[11px] font-bold uppercase tracking-widest text-indigo-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>Featured Bilateral Trade</span>
                </div>

                <div className="flex items-center gap-3.5 pt-1">
                  <img
                    src={topMatch.user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'}
                    alt={topMatch.user.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-400"
                  />
                  <div>
                    <h3 className="font-bold text-base text-white">{topMatch.user.name}</h3>
                    <p className="text-xs text-slate-300">{topMatch.user.title}</p>
                    <div className="text-[11px] text-amber-300 font-semibold mt-0.5">
                      ★ {topMatch.user.rating} ({topMatch.user.reviewCount} reviews) • {topMatch.user.tier} Tier
                    </div>
                  </div>
                </div>

                {/* Bilateral Trade Diagram in Hero */}
                <div className="bg-black/30 p-3.5 rounded-2xl border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-emerald-400 font-bold">
                      {topMatch.offersYouTeach[0]?.name || 'Python'}
                    </span>
                    <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-indigo-400 font-bold">
                      {topMatch.wantsYouTeach[0]?.name || 'Java'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {topMatch.matchReasons[0]}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedPeerForSwap(topMatch.user)}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>Initiate Swap with {topMatch.user.name.split(' ')[0]}</span>
                </button>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-center space-y-3">
                <Users className="w-10 h-10 text-indigo-300 mx-auto" />
                <h4 className="font-bold text-white text-sm">Discover Knowledge Peers</h4>
                <p className="text-xs text-slate-300">
                  Join the platform to discover instant bilateral matches with peers worldwide.
                </p>
                <Link
                  href="/signup"
                  className="inline-block px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Session Notification Card if any */}
      {activeSwap && (
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-300 dark:border-emerald-700/50 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-md">
              <Video className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-800 dark:text-white">
                  Active Swap Session in Progress
                </span>
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black rounded-full uppercase">
                  Live
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Trading {activeSwap.teachSkill} for {activeSwap.learnSkill}. Jump into your P2P video room!
              </p>
            </div>
          </div>

          <Link
            href={`/session/${activeSwap.id}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all self-stretch sm:self-auto justify-center"
          >
            <Video className="w-4 h-4" />
            <span>Join Video Call & Chat</span>
          </Link>
        </div>
      )}

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
            100%
          </div>
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Bilateral Matching</div>
          <div className="text-[11px] text-slate-400">Mutual reciprocal trades</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            $0.00
          </div>
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Zero Platform Fees</div>
          <div className="text-[11px] text-slate-400">Pure knowledge exchange</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-black text-amber-500">
            4.95★
          </div>
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Average Peer Rating</div>
          <div className="text-[11px] text-slate-400">Verified reviews & feedback</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">
            1,200+
          </div>
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Hours Exchanged</div>
          <div className="text-[11px] text-slate-400">Across 20+ skill disciplines</div>
        </div>
      </div>

      {/* 4 Core Pillars Section */}
      <div className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
            How Peer-to-Peer Skill Swapping Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Everything you need to exchange mastery, collaborate in real-time, and level up your skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {/* Pillar 1 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-800 dark:text-white">1. Smart Matchmaker</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our bilateral algorithm instantly pairs User A (Java tutor) with User B (Python tutor) for exact mutual synergy.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <ArrowLeftRight className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-800 dark:text-white">2. Swap Workflow</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Propose session times, accept incoming requests, and manage active mentorships in an interactive dashboard.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-800 dark:text-white">3. P2P Collaboration</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Integrated real-time text chat, WebRTC video calling, screen sharing, and synchronized live session scratchpad.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-800 dark:text-white">4. Gamified XP & Tiers</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Earn +50 XP per swap taught, collect 5-star praise badges, and climb the Global Leaderboard from Bronze to Diamond.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Community Members Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
              Featured Knowledge Mentors
            </h2>
            <p className="text-xs text-slate-500">
              Top rated members available for bilateral swaps right now.
            </p>
          </div>
          <Link
            href="/explore"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allUsers.slice(0, 3).map((user) => (
            <div
              key={user.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                      alt={user.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white">{user.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{user.title}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 font-bold rounded-full">
                    {user.tier}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="text-[10px] font-bold uppercase text-emerald-600">
                    Teaches: {user.skills.filter(s => s.type === 'TEACH').map(s => s.name).join(', ')}
                  </div>
                  <div className="text-[10px] font-bold uppercase text-indigo-600">
                    Learns: {user.skills.filter(s => s.type === 'LEARN').map(s => s.name).join(', ')}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="text-xs text-amber-500 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{user.rating} ({user.reviewCount})</span>
                </div>

                <button
                  onClick={() => setSelectedPeerForSwap(user)}
                  className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Propose Swap
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Swap Modal */}
      {selectedPeerForSwap && (
        <SwapModal
          peerUser={selectedPeerForSwap}
          isOpen={!!selectedPeerForSwap}
          onClose={() => setSelectedPeerForSwap(null)}
        />
      )}
    </div>
  );
}

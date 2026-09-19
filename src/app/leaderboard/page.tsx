'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/components/UserContext';
import { LeaderboardEntry } from '@/lib/types';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Flame, 
  Zap, 
  Star, 
  GraduationCap, 
  Sparkles, 
  Award,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';

const tierTiers = [
  { name: 'Bronze', points: '0 - 199 XP', color: 'from-amber-700 to-amber-900', text: 'text-amber-800' },
  { name: 'Silver', points: '200 - 499 XP', color: 'from-slate-400 to-slate-600', text: 'text-slate-600' },
  { name: 'Gold', points: '500 - 799 XP', color: 'from-amber-400 to-yellow-500', text: 'text-amber-600' },
  { name: 'Platinum', points: '800 - 999 XP', color: 'from-cyan-400 to-blue-500', text: 'text-cyan-600' },
  { name: 'Diamond', points: '1000+ XP', color: 'from-indigo-500 via-purple-500 to-pink-500', text: 'text-indigo-600' },
];

export default function LeaderboardPage() {
  const { currentUser } = useUser();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [timeframe, setTimeframe] = useState<'all' | 'weekly'>('all');
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard?timeframe=${timeframe}`);
      const data = await res.json();
      if (data.success) {
        setLeaderboard(data.leaderboard);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe]);

  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  const nextTierPoints = currentUser
    ? currentUser.tier === 'Diamond'
      ? 1500
      : currentUser.tier === 'Platinum'
      ? 1000
      : currentUser.tier === 'Gold'
      ? 800
      : currentUser.tier === 'Silver'
      ? 500
      : 200
    : 200;

  const currentPoints = currentUser?.points || 0;
  const progressPercent = Math.min(100, Math.round((currentPoints / nextTierPoints) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-pink-600 p-8 sm:p-10 text-white shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/20 backdrop-blur-md rounded-full text-xs font-bold text-amber-200">
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>Community Gamification & Leaderboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Top Knowledge Champions
          </h1>
          <p className="text-sm text-white/90 leading-relaxed">
            Earn XP for every peer teaching session completed, high review scores, and multi-skill breakthroughs. Climb the ranks to unlock Diamond status!
          </p>
        </div>

        {/* Current User Tier Card inside banner */}
        {currentUser && (
          <div className="mt-6 bg-white/15 backdrop-blur-md rounded-2xl p-4 max-w-lg border border-white/20">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-300" />
                Your Tier: <span className="underline">{currentUser.tier}</span>
              </span>
              <span className="font-mono font-bold text-amber-200">
                {currentUser.points} / {nextTierPoints} XP
              </span>
            </div>
            <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-300 to-emerald-300 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Rules and XP Points Formula */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-xl">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-800 dark:text-white">+50 XP Points</div>
            <div className="text-xs text-slate-500">Per completed teaching swap</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="p-3 bg-amber-50 dark:bg-amber-950 text-amber-600 rounded-xl">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-800 dark:text-white">+20 XP Points</div>
            <div className="text-xs text-slate-500">For every 5-Star peer review</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-800 dark:text-white">+10 XP Points</div>
            <div className="text-xs text-slate-500">Adding new skill to your profile</div>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {topThree.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 items-end">
          {/* 2nd Place (Silver) */}
          <div className="order-2 md:order-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-center relative flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-black text-sm flex items-center justify-center mb-3 shadow-inner">
              2nd
            </div>
            <img
              src={topThree[1].user.avatar}
              alt={topThree[1].user.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-slate-300 shadow-md mb-3"
            />
            <h3 className="font-bold text-base text-slate-800 dark:text-white">
              {topThree[1].user.name}
            </h3>
            <p className="text-xs text-slate-500 mb-2">{topThree[1].user.title}</p>
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-bold text-xs">
              <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{topThree[1].points} XP</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              ★ {topThree[1].rating} • {topThree[1].hoursTaught}h taught
            </div>
          </div>

          {/* 1st Place (Gold) */}
          <div className="order-1 md:order-2 bg-gradient-to-b from-amber-500/10 to-transparent dark:from-amber-950/20 bg-white dark:bg-slate-900 border-2 border-amber-400 rounded-3xl p-8 shadow-xl text-center relative flex flex-col items-center -mt-4">
            <div className="absolute -top-4 w-10 h-10 rounded-full bg-amber-400 text-amber-950 font-black text-base flex items-center justify-center shadow-lg animate-bounce-slight">
              👑
            </div>
            <img
              src={topThree[0].user.avatar}
              alt={topThree[0].user.name}
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-amber-400 shadow-xl mb-3 mt-2"
            />
            <span className="px-2.5 py-0.5 bg-amber-400 text-amber-950 font-black text-[10px] uppercase rounded-full mb-1">
              Top Mentor #1
            </span>
            <h3 className="font-extrabold text-lg text-slate-800 dark:text-white">
              {topThree[0].user.name}
            </h3>
            <p className="text-xs text-slate-500 mb-3">{topThree[0].user.title}</p>
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-extrabold text-sm shadow-md">
              <Zap className="w-4 h-4 fill-white" />
              <span>{topThree[0].points} XP</span>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-3">
              ★ {topThree[0].rating} ({topThree[0].user.reviewCount} reviews) • {topThree[0].hoursTaught}h taught
            </div>
          </div>

          {/* 3rd Place (Bronze) */}
          <div className="order-3 md:order-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-center relative flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-amber-700/20 text-amber-800 font-black text-sm flex items-center justify-center mb-3">
              3rd
            </div>
            <img
              src={topThree[2].user.avatar}
              alt={topThree[2].user.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-amber-600/40 shadow-md mb-3"
            />
            <h3 className="font-bold text-base text-slate-800 dark:text-white">
              {topThree[2].user.name}
            </h3>
            <p className="text-xs text-slate-500 mb-2">{topThree[2].user.title}</p>
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-bold text-xs">
              <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{topThree[2].points} XP</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              ★ {topThree[2].rating} • {topThree[2].hoursTaught}h taught
            </div>
          </div>
        </div>
      )}

      {/* Global Rankings Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-800 dark:text-white">
            Full Leaderboard Standings
          </h3>
          <span className="text-xs text-slate-400">
            Updated in real-time
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Rank</th>
                <th className="py-3.5 px-6">Knowledge Peer</th>
                <th className="py-3.5 px-6">Tier</th>
                <th className="py-3.5 px-6">Rating</th>
                <th className="py-3.5 px-6">Completed Swaps</th>
                <th className="py-3.5 px-6">Hours Taught</th>
                <th className="py-3.5 px-6 text-right">Gamification XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {leaderboard.map((entry) => {
                const isMe = entry.user.id === currentUser?.id;
                return (
                  <tr
                    key={entry.user.id}
                    className={`transition-colors ${
                      isMe
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/40 font-semibold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-4 px-6 font-mono font-bold text-xs">
                      #{entry.rank}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={entry.user.avatar}
                          alt={entry.user.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <div className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                            <span>{entry.user.name}</span>
                            {isMe && (
                              <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-bold">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500">{entry.user.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 font-bold text-xs rounded-full">
                        {entry.tier}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{entry.rating}</span>
                        <span className="text-slate-400 font-normal text-xs">({entry.reviewCount})</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-700 dark:text-slate-300">
                      {entry.completedSwaps} swaps
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-700 dark:text-slate-300">
                      {entry.hoursTaught} hrs
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="inline-flex items-center gap-1 font-mono font-extrabold text-indigo-600 dark:text-indigo-400 text-sm">
                        <Zap className="w-3.5 h-3.5 fill-indigo-600 dark:fill-indigo-400" />
                        {entry.points} XP
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

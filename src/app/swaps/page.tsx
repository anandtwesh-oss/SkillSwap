'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/components/UserContext';
import { SwapRequest, User } from '@/lib/types';
import { ReviewModal } from '@/components/ReviewModal';
import { 
  ArrowLeftRight, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Video, 
  MessageSquare, 
  Star, 
  AlertCircle,
  Sparkles,
  Layers,
  Check,
  X
} from 'lucide-react';

export default function SwapsDashboardPage() {
  const { currentUser, refreshCurrentUser } = useUser();
  const [swaps, setSwaps] = useState<(SwapRequest & { requester?: User; receiver?: User })[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'incoming' | 'sent' | 'completed'>('active');
  const [reviewSwapTarget, setReviewSwapTarget] = useState<(SwapRequest & { requester?: User; receiver?: User }) | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchSwaps = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/swaps?userId=${currentUser.id}`);
      const data = await res.json();
      if (data.success) {
        setSwaps(data.swaps || []);
      }
    } catch (e) {
      console.error('Error loading swaps', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSwaps();
  }, [currentUser]);

  const handleUpdateStatus = async (swapId: string, status: SwapRequest['status']) => {
    setActionLoadingId(swapId);
    try {
      const res = await fetch(`/api/swaps/${swapId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        await fetchSwaps();
        await refreshCurrentUser();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (!currentUser) return null;

  // Filter swaps by tab
  const incomingPending = swaps.filter(s => s.receiverId === currentUser.id && s.status === 'PENDING');
  const sentPending = swaps.filter(s => s.requesterId === currentUser.id && s.status === 'PENDING');
  const activeSwaps = swaps.filter(s => s.status === 'ACCEPTED');
  const completedSwaps = swaps.filter(s => s.status === 'COMPLETED' || s.status === 'DECLINED');

  const getFilteredList = () => {
    switch (activeTab) {
      case 'active': return activeSwaps;
      case 'incoming': return incomingPending;
      case 'sent': return sentPending;
      case 'completed': return completedSwaps;
      default: return activeSwaps;
    }
  };

  const displayedList = getFilteredList();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            Skill Swap Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your incoming requests, ongoing collaboration sessions, and peer feedback.
          </p>
        </div>

        <Link
          href="/matches"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs rounded-2xl shadow-md hover:scale-105 transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Find New 2-Way Matches</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'active'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Active Sessions ({activeSwaps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('incoming')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'incoming'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Incoming Requests ({incomingPending.length})</span>
          {incomingPending.length > 0 && (
            <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-extrabold rounded-full">
              {incomingPending.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'sent'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          <span>Sent Requests ({sentPending.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'completed'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Completed Swaps ({completedSwaps.length})</span>
        </button>
      </div>

      {/* Content List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading your swap requests...</p>
        </div>
      ) : displayedList.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8 space-y-3">
          <ArrowLeftRight className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            No {activeTab} swaps at the moment
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {activeTab === 'incoming' && 'When other members propose a swap with you, they will appear here.'}
            {activeTab === 'active' && 'Accepted swap sessions ready for video calling and chat will appear here.'}
            {activeTab === 'sent' && 'Proposals you send to peers will be tracked here.'}
            {activeTab === 'completed' && 'Your past learning exchanges and ratings will be recorded here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {displayedList.map((swap) => {
            const isRequester = swap.requesterId === currentUser.id;
            const peer = isRequester ? swap.receiver : swap.requester;
            const iTeach = isRequester ? swap.teachSkill : swap.learnSkill;
            const peerTeaches = isRequester ? swap.learnSkill : swap.teachSkill;

            const isActionPending = actionLoadingId === swap.id;

            return (
              <div
                key={swap.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Left Area: Peer Details & Trade */}
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={peer?.avatar}
                    alt={peer?.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 shrink-0"
                  />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base text-slate-800 dark:text-white">
                        {peer?.name}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold rounded-full">
                        {peer?.tier}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider rounded-full ${
                          swap.status === 'ACCEPTED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                            : swap.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                            : swap.status === 'COMPLETED'
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {swap.status}
                      </span>
                    </div>

                    {/* Bilateral Trade description */}
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-emerald-700">You Teach: {iTeach}</span>
                      <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-bold text-indigo-700">{peer?.name.split(' ')[0]} Teaches: {peerTeaches}</span>
                    </div>

                    {/* Message note */}
                    {swap.message && (
                      <p className="text-xs text-slate-500 italic line-clamp-2">
                        "{swap.message}"
                      </p>
                    )}

                    {/* Meta info */}
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {swap.durationMinutes} minutes
                      </span>
                      <span>•</span>
                      <span>Requested: {new Date(swap.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Right Area: Status Action Controls */}
                <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                  {/* Incoming Pending Actions */}
                  {swap.status === 'PENDING' && !isRequester && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(swap.id, 'ACCEPTED')}
                        disabled={isActionPending}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                      >
                        <Check className="w-4 h-4" />
                        <span>Accept Swap</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(swap.id, 'DECLINED')}
                        disabled={isActionPending}
                        className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold rounded-xl transition-all"
                      >
                        <X className="w-4 h-4" />
                        <span>Decline</span>
                      </button>
                    </>
                  )}

                  {/* Sent Pending Actions */}
                  {swap.status === 'PENDING' && isRequester && (
                    <button
                      onClick={() => handleUpdateStatus(swap.id, 'CANCELLED')}
                      disabled={isActionPending}
                      className="px-3 py-2 text-xs text-slate-400 hover:text-rose-600 rounded-xl transition-colors font-medium"
                    >
                      Cancel Request
                    </button>
                  )}

                  {/* Active Accepted Sessions */}
                  {swap.status === 'ACCEPTED' && (
                    <>
                      <Link
                        href={`/session/${swap.id}`}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition-all hover:scale-105"
                      >
                        <Video className="w-4 h-4" />
                        <span>Enter P2P Room</span>
                      </Link>

                      <button
                        onClick={() => handleUpdateStatus(swap.id, 'COMPLETED')}
                        disabled={isActionPending}
                        className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Mark Completed</span>
                      </button>
                    </>
                  )}

                  {/* Completed Actions */}
                  {swap.status === 'COMPLETED' && (
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/session/${swap.id}`}
                        className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>View Chat Log</span>
                      </Link>

                      <button
                        onClick={() => setReviewSwapTarget(swap)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-xl shadow-sm hover:scale-105 transition-all"
                      >
                        <Star className="w-3.5 h-3.5 fill-white" />
                        <span>Rate Peer (+XP)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {reviewSwapTarget && (
        <ReviewModal
          swap={reviewSwapTarget}
          isOpen={!!reviewSwapTarget}
          onClose={() => setReviewSwapTarget(null)}
          onSuccess={() => {
            fetchSwaps();
          }}
        />
      )}
    </div>
  );
}

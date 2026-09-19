'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/components/UserContext';
import { SwapRequest, User, Message } from '@/lib/types';
import { ReviewModal } from '@/components/ReviewModal';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  MonitorUp, 
  MessageSquare, 
  FileText, 
  CheckCircle, 
  PhoneOff, 
  Sparkles, 
  Users, 
  Clock, 
  Send,
  Code,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function SessionRoomPage() {
  const params = useParams();
  const router = useRouter();
  const swapId = params.id as string;
  const { currentUser, refreshCurrentUser } = useUser();

  const [swap, setSwap] = useState<(SwapRequest & { requester?: User; receiver?: User }) | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'notes' | 'roadmap'>('chat');
  const [sessionNotes, setSessionNotes] = useState(
    '### Peer Learning Session Notes\n\n- **Today\'s Goal**: Walk through core fundamentals and build a mini-project.\n- **Topics Covered**:\n  1. Syntax & Core concepts\n  2. Best practices & typical pitfalls\n  3. Live coding exercise'
  );

  // Video call controls
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(320); // Initial demo timer
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [completing, setCompleting] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load swap details & messages
  const loadSwapData = async () => {
    try {
      const res = await fetch(`/api/swaps/${swapId}`);
      const data = await res.json();
      if (data.success) {
        setSwap(data.swap);
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadSwapData();
    const interval = setInterval(loadSwapData, 3000); // Poll messages
    return () => clearInterval(interval);
  }, [swapId]);

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulated WebRTC Media Stream initialization
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && isCameraOn) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((s) => {
          stream = s;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          // Camera permission or fallback mock
        });
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOn]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          swapId,
          senderId: currentUser.id,
          text: newMessage
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, data.message]);
        setNewMessage('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompleteSession = async () => {
    setCompleting(true);
    try {
      const res = await fetch(`/api/swaps/${swapId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' })
      });
      const data = await res.json();
      if (data.success) {
        setSwap(prev => prev ? { ...prev, status: 'COMPLETED' } : null);
        await refreshCurrentUser();
        setShowReviewModal(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCompleting(false);
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!swap || !currentUser) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500 font-medium">Connecting to P2P Session Room...</p>
        </div>
      </div>
    );
  }

  const isRequester = currentUser.id === swap.requesterId;
  const peerUser = isRequester ? swap.receiver : swap.requester;
  const iAmTeaching = isRequester ? swap.teachSkill : swap.learnSkill;
  const peerIsTeaching = isRequester ? swap.learnSkill : swap.teachSkill;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Session Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={peerUser?.avatar}
              alt={peerUser?.name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-800 dark:text-white text-lg">
                Pair Session with {peerUser?.name}
              </h1>
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold text-xs rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live P2P Connected
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              You teach <span className="font-semibold text-emerald-600">{iAmTeaching}</span> • {peerUser?.name} teaches <span className="font-semibold text-indigo-600">{peerIsTeaching}</span>
            </p>
          </div>
        </div>

        {/* Timer & Session State */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-mono text-sm font-bold text-slate-700 dark:text-slate-300">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>{formatTimer(elapsedSeconds)}</span>
            <span className="text-slate-400 text-xs font-normal">/ {swap.durationMinutes}m</span>
          </div>

          {swap.status !== 'COMPLETED' ? (
            <button
              onClick={handleCompleteSession}
              disabled={completing}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{completing ? 'Completing...' : 'Mark Completed & Review'}</span>
            </button>
          ) : (
            <button
              onClick={() => setShowReviewModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Leave / Edit Review (+XP)</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Collaboration Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Video Calling & Screen Space */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
            {/* Remote Peer Video Stream */}
            <div className="w-full h-full flex flex-col items-center justify-center relative bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900">
              {isScreenSharing ? (
                <div className="w-full h-full p-6 flex flex-col justify-center items-center text-white bg-slate-900">
                  <div className="max-w-md p-6 bg-slate-800/80 rounded-2xl border border-slate-700 text-left font-mono text-xs text-indigo-300">
                    <div className="text-emerald-400 mb-2 font-bold flex items-center gap-1.5">
                      <Code className="w-4 h-4" />
                      Live Code Workspace Stream:
                    </div>
                    <code>
                      {`// SkillSwap P2P Exercise
function exchangeSkills(teacher, learner) {
  const synergy = teacher.expertise + learner.curiosity;
  return { status: "Skill Swapped!", points: 50 };
}
console.log(exchangeSkills("${currentUser.name}", "${peerUser?.name}"));`}
                    </code>
                  </div>
                  <span className="mt-3 text-xs text-slate-400 flex items-center gap-1.5">
                    <MonitorUp className="w-3.5 h-3.5 text-indigo-400" />
                    Screen Share Active (1080p 60fps)
                  </span>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <div className="relative mx-auto">
                    <img
                      src={peerUser?.avatar}
                      alt={peerUser?.name}
                      className="w-28 h-28 rounded-3xl object-cover ring-4 ring-indigo-500/40 shadow-2xl mx-auto animate-pulse-slow"
                    />
                    <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 bg-indigo-600 text-white font-bold text-[10px] rounded-full shadow">
                      Teaching
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{peerUser?.name}</h3>
                    <p className="text-xs text-slate-400">{peerUser?.title}</p>
                  </div>
                </div>
              )}

              {/* Local User Mini-PiP Video */}
              <div className="absolute top-4 right-4 w-36 sm:w-44 aspect-video bg-slate-800 rounded-2xl overflow-hidden border-2 border-indigo-500/60 shadow-xl">
                {isCameraOn ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover transform scale-x-[-1]"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-white p-2 text-center">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover mb-1"
                    />
                    <span className="text-[10px] text-slate-400 font-medium">Camera Off</span>
                  </div>
                )}
                <div className="absolute bottom-1 left-2 text-[9px] font-bold text-white bg-black/60 px-1.5 py-0.2 rounded">
                  You (Local)
                </div>
              </div>
            </div>

            {/* Floating Video Control Bar */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-5 py-2.5 rounded-2xl shadow-2xl">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-3 rounded-xl transition-all ${
                  isMicOn
                    ? 'bg-slate-800 hover:bg-slate-700 text-white'
                    : 'bg-rose-600 text-white'
                }`}
                title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsCameraOn(!isCameraOn)}
                className={`p-3 rounded-xl transition-all ${
                  isCameraOn
                    ? 'bg-slate-800 hover:bg-slate-700 text-white'
                    : 'bg-rose-600 text-white'
                }`}
                title={isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
              >
                {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`p-3 rounded-xl transition-all ${
                  isScreenSharing
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
                title="Share Screen"
              >
                <MonitorUp className="w-5 h-5" />
              </button>

              <div className="h-6 w-px bg-slate-700 mx-1" />

              <button
                onClick={() => router.push('/swaps')}
                className="p-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-all"
                title="Leave Call Room"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Session Tips / Code Snippets */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
            <h4 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Bilateral Swap Guide: {iAmTeaching} ⮂ {peerIsTeaching}
            </h4>
            <p className="text-xs text-slate-500">
              Tip: Spend the first 30 minutes focusing on {peerIsTeaching} with {peerUser?.name}, then switch to {iAmTeaching}. Both participants earn 50 Gamification XP upon completion!
            </p>
          </div>
        </div>

        {/* Right Col: Live Chat & Shared Scratchpad */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col h-[600px] overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-800 p-2 bg-slate-50 dark:bg-slate-950/40">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'chat'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Live Chat ({messages.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'notes'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Shared Notes</span>
            </button>
          </div>

          {/* Tab 1: Chat Feed */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-xs text-slate-400 py-12">
                    No messages yet. Say hi and start your swap session!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}
                      >
                        <img
                          src={msg.senderAvatar}
                          alt={msg.senderName}
                          className="w-7 h-7 rounded-lg object-cover shrink-0 mt-0.5"
                        />
                        <div
                          className={`max-w-[78%] rounded-2xl p-3 text-xs ${
                            isMe
                              ? 'bg-indigo-600 text-white rounded-tr-none'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3 mb-1">
                            <span className="font-bold opacity-90">{msg.senderName}</span>
                            <span className="text-[9px] opacity-70">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Form */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message or code snippet..."
                  className="flex-1 px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Tab 2: Shared Notepad */}
          {activeTab === 'notes' && (
            <div className="flex-1 p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Live Scratchpad (Auto-sync)
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Saved
                </span>
              </div>
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="flex-1 w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Review Modal on Complete */}
      {showReviewModal && swap && (
        <ReviewModal
          swap={swap}
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => {
            loadSwapData();
          }}
        />
      )}
    </div>
  );
}

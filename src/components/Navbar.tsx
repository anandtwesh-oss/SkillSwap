'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useUser } from './UserContext';
import { 
  ArrowLeftRight, 
  Sparkles, 
  Search, 
  Trophy, 
  User as UserIcon, 
  Zap, 
  LogOut,
  LogIn,
  UserPlus,
  ChevronDown,
  RefreshCw,
  Layers,
  ShieldCheck,
  BrainCircuit
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { currentUser, pendingRequestsCount, allUsers } = useUser();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleResetData = async () => {
    if (confirm('Reset database to clean production seed state? (All test data will be refreshed)')) {
      setResetting(true);
      await fetch('/api/seed', { method: 'POST' });
      window.location.reload();
    }
  };

  const navLinks = [
    { href: '/explore', label: 'Explore Skills', icon: Search },
    { 
      href: '/matches', 
      label: '2-Way Matchmaker', 
      icon: Sparkles,
      highlight: true
    },
    { 
      href: '/swaps', 
      label: 'My Swaps', 
      icon: ArrowLeftRight,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : null 
    },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/quiz', label: 'Quiz AI', icon: BrainCircuit },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                SkillSwap
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest text-slate-400 ml-1.5 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                Production
              </span>
            </div>
          </Link>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  } ${
                    link.highlight && !isActive
                      ? 'text-indigo-600 font-semibold hover:bg-indigo-50/50'
                      : ''
                  }`}
                >
                  <Icon className={`w-4 h-4 ${link.highlight ? 'text-indigo-500 animate-pulse-slow' : ''}`} />
                  <span>{link.label}</span>
                  
                  {link.highlight && (
                    <span className="text-[10px] bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                      Smart AI
                    </span>
                  )}

                  {link.badge && (
                    <span className="ml-1 px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-bold rounded-full animate-bounce-slight">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Area: Auth Widget / Persona Menu */}
          <div className="flex items-center gap-3">
            {/* Reset Database Button */}
            <button
              onClick={handleResetData}
              disabled={resetting}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Reset database to default seed state"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
              <span>Reset DB</span>
            </button>

            {status === 'authenticated' && currentUser ? (
              /* Authenticated User Menu */
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-400 transition-all shadow-sm group"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/20"
                  />
                  <div className="text-left hidden sm:block">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[110px]">
                        {currentUser.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold rounded">
                        {currentUser.tier}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                        ★ {currentUser.rating}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-indigo-600 dark:text-indigo-400 font-semibold">
                        <Zap className="w-3 h-3 fill-indigo-600 dark:fill-indigo-400" />
                        {currentUser.points} XP
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div 
                    className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                      <div className="text-xs font-bold text-slate-800 dark:text-white truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {currentUser.email}
                      </div>
                    </div>

                    {/* Navigation links */}
                    <div className="space-y-0.5 py-1">
                      <Link
                        href="/profile"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-indigo-500" />
                        <span>My Profile & Skills</span>
                      </Link>

                      <Link
                        href="/swaps"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <ArrowLeftRight className="w-4 h-4 text-emerald-500" />
                        <span>My Swap Sessions</span>
                      </Link>
                    </div>

                    {/* Switch Account Quick Links */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-1">
                      <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Switch Account (Pair Testing)
                      </div>
                      <Link
                        href="/login"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors"
                      >
                        <span>Select another persona</span>
                        <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900 px-1.5 py-0.2 rounded font-bold">1-Click</span>
                      </Link>
                    </div>

                    {/* Sign Out */}
                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800 mt-1">
                      <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Unauthenticated Actions */
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Log In</span>
                </Link>

                <Link
                  href="/signup"
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold rounded-xl shadow-sm hover:opacity-95 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800 py-2 px-2 bg-white dark:bg-slate-900">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center py-1 px-2 rounded-lg text-[11px] font-medium ${
                isActive ? 'text-indigo-600 font-bold' : 'text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{link.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
};

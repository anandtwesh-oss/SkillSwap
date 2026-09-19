'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/components/UserContext';
import { User, SkillCategory, SkillProficiency } from '@/lib/types';
import { SkillBadge } from '@/components/SkillBadge';
import { SwapModal } from '@/components/SwapModal';
import { 
  Search, 
  Filter, 
  Star, 
  ArrowLeftRight, 
  MapPin, 
  Award, 
  Sparkles,
  BookOpen,
  GraduationCap
} from 'lucide-react';

const categories: (SkillCategory | 'All')[] = [
  'All',
  'Programming & Tech',
  'AI & Data Science',
  'Design & Creative',
  'Languages',
  'Music & Audio',
  'Business & Marketing'
];

const proficiencies: (SkillProficiency | 'All')[] = [
  'All',
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert'
];

export default function ExplorePage() {
  const { currentUser } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProficiency, setSelectedProficiency] = useState<string>('All');
  const [minRating, setMinRating] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const [selectedPeerForSwap, setSelectedPeerForSwap] = useState<{
    user: User;
    teachSkill?: string;
    learnSkill?: string;
  } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedProficiency !== 'All') params.append('proficiency', selectedProficiency);
      if (minRating) params.append('minRating', minRating);

      const res = await fetch(`/api/users?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, selectedCategory, selectedProficiency, minRating]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            Discover Skills & Knowledge Peers
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse verified mentors, developers, designers, polyglots, and creatives ready for 1-on-1 swaps.
          </p>
        </div>

        {/* Search Bar & Filters */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by skill name (e.g. Python, Java, Figma, Japanese), topic, or name..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Min Rating Filter */}
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">All Ratings</option>
              <option value="4.8">★ 4.8+ Top Rated</option>
              <option value="4.5">★ 4.5+ Highly Rated</option>
              <option value="4.0">★ 4.0+ Stars</option>
            </select>

            {/* Proficiency Filter */}
            <select
              value={selectedProficiency}
              onChange={(e) => setSelectedProficiency(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {proficiencies.map((p) => (
                <option key={p} value={p}>
                  {p === 'All' ? 'All Proficiencies' : `${p} Level`}
                </option>
              ))}
            </select>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Discovery Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading Community Members...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <Search className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No Peers Match Your Filters</h3>
          <p className="text-xs text-slate-500 mt-1">Try broadening your search term or category selection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((peer) => {
            const isMe = peer.id === currentUser?.id;
            const teachSkills = peer.skills.filter(s => s.type === 'TEACH');
            const learnSkills = peer.skills.filter(s => s.type === 'LEARN');

            return (
              <div
                key={peer.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top user header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={peer.avatar}
                        alt={peer.name}
                        className="w-13 h-13 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-base text-slate-800 dark:text-white">
                            {peer.name}
                          </h3>
                          {isMe && (
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-bold">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">{peer.title}</p>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          <span>{peer.location}</span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] rounded-lg">
                      {peer.tier}
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                    {peer.bio}
                  </p>

                  {/* Skills Section */}
                  <div className="space-y-3 mb-5">
                    {/* Offers / Teaches */}
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5 flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Teaches ({teachSkills.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {teachSkills.map((s) => (
                          <SkillBadge
                            key={s.id}
                            name={s.name}
                            category={s.category}
                            proficiency={s.proficiency}
                            size="sm"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Wants to learn */}
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1.5 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Wants to Learn ({learnSkills.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {learnSkills.map((s) => (
                          <SkillBadge
                            key={s.id}
                            name={s.name}
                            category={s.category}
                            proficiency={s.proficiency}
                            size="sm"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Rating & CTA */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {peer.rating}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 font-medium">{peer.completedSwaps} swaps</span>
                  </div>

                  {!isMe ? (
                    <button
                      onClick={() =>
                        setSelectedPeerForSwap({
                          user: peer,
                          learnSkill: teachSkills[0]?.name
                        })
                      }
                      className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:hover:bg-indigo-900 dark:text-indigo-300 text-xs font-bold rounded-xl transition-all"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      <span>Propose Swap</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Your Profile</span>
                  )}
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
          suggestedLearnSkill={selectedPeerForSwap.learnSkill}
          isOpen={!!selectedPeerForSwap}
          onClose={() => setSelectedPeerForSwap(null)}
          onSuccess={() => {
            fetchUsers();
          }}
        />
      )}
    </div>
  );
}

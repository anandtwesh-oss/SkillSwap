'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/components/UserContext';
import { UserSkill, SkillCategory, SkillProficiency, Review } from '@/lib/types';
import { SkillBadge } from '@/components/SkillBadge';
import { 
  User as UserIcon, 
  MapPin, 
  Clock, 
  Star, 
  Zap, 
  Trophy, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Award, 
  GraduationCap, 
  BookOpen,
  Sparkles,
  Save,
  LogIn,
  AlertCircle
} from 'lucide-react';

const categories: SkillCategory[] = [
  'Programming & Tech',
  'AI & Data Science',
  'Design & Creative',
  'Languages',
  'Music & Audio',
  'Business & Marketing',
  'Academics & Science'
];

const proficiencies: SkillProficiency[] = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert'
];

export default function ProfilePage() {
  const { currentUser, refreshCurrentUser, loading: userLoading } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  // Edit Bio state
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [bioError, setBioError] = useState<string | null>(null);

  // Add Skill Form state
  const [isAddingTeachSkill, setIsAddingTeachSkill] = useState(false);
  const [isAddingLearnSkill, setIsAddingLearnSkill] = useState(false);

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('Programming & Tech');
  const [newSkillProficiency, setNewSkillProficiency] = useState<SkillProficiency>('Advanced');
  const [newSkillExp, setNewSkillExp] = useState<number>(3);
  const [newSkillDesc, setNewSkillDesc] = useState('');
  const [skillError, setSkillError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setBio(currentUser.bio || '');
      setTitle(currentUser.title || '');
      setLocation(currentUser.location || '');
      fetchReviews();
    }
  }, [currentUser]);

  const fetchReviews = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/reviews?targetUserId=${currentUser.id}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    if (!title.trim()) {
      setBioError('Role / Headline cannot be empty.');
      return;
    }

    setLoading(true);
    setBioError(null);
    try {
      const res = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio, title, location })
      });
      const data = await res.json();
      if (data.success) {
        setIsEditingBio(false);
        await refreshCurrentUser();
      } else {
        setBioError(data.error || 'Failed to update profile.');
      }
    } catch (e: any) {
      setBioError(e.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (type: 'TEACH' | 'LEARN') => {
    if (!currentUser) return;
    if (!newSkillName.trim()) {
      setSkillError('Skill name is required.');
      return;
    }

    setSkillError(null);
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          name: newSkillName.trim(),
          category: newSkillCategory,
          type,
          proficiency: newSkillProficiency,
          yearsExperience: newSkillExp,
          description: newSkillDesc
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewSkillName('');
        setNewSkillDesc('');
        setIsAddingTeachSkill(false);
        setIsAddingLearnSkill(false);
        await refreshCurrentUser();
      } else {
        setSkillError(data.error || 'Failed to add skill.');
      }
    } catch (e: any) {
      setSkillError(e.message || 'Error adding skill.');
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/skills?userId=${currentUser.id}&skillId=${skillId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        await refreshCurrentUser();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
          <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
            <LogIn className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Sign In to View Profile</h2>
          <p className="text-xs text-slate-500">
            Please log in with your SkillSwap account to manage your profile and skills.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md"
            >
              <LogIn className="w-4 h-4" />
              <span>Go to Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const teachSkills = currentUser.skills?.filter(s => s.type === 'TEACH') || [];
  const learnSkills = currentUser.skills?.filter(s => s.type === 'LEARN') || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser.name}
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-indigo-500/20 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-800 dark:text-white">
                  {currentUser.name}
                </h1>
                <span className="px-2.5 py-0.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold text-xs rounded-full shadow-xs">
                  {currentUser.tier} Tier
                </span>
              </div>
              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                {currentUser.title}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {currentUser.location || 'Remote'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {currentUser.timezone || 'UTC'}
                </span>
              </div>
            </div>
          </div>

          {/* Points & Stats Badge */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="text-center px-3 border-r border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-base">
                <Star className="w-4 h-4 fill-amber-500" />
                <span>{currentUser.rating}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">{currentUser.reviewCount} reviews</div>
            </div>

            <div className="text-center px-3 border-r border-slate-200 dark:border-slate-700">
              <div className="font-bold text-base text-slate-800 dark:text-white">
                {currentUser.completedSwaps}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Swaps Done</div>
            </div>

            <div className="text-center px-3">
              <div className="flex items-center justify-center gap-1 text-indigo-600 dark:text-indigo-400 font-extrabold text-base">
                <Zap className="w-4 h-4 fill-indigo-600 dark:fill-indigo-400" />
                <span>{currentUser.points}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Gamification XP</div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              About & Teaching Philosophy
            </span>
            <button
              onClick={() => {
                setIsEditingBio(!isEditingBio);
                setBioError(null);
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingBio ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>

          {isEditingBio ? (
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              {bioError && (
                <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{bioError}</span>
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Headline / Role *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentUser.bio || 'No bio provided yet.'}
            </p>
          )}
        </div>
      </div>

      {/* Skills Management (Teaches vs Wants to Learn) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills I Teach */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-xl">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-800 dark:text-white">Skills I Teach (Offer)</h3>
                <p className="text-xs text-slate-400">Skills you share with peers</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsAddingTeachSkill(!isAddingTeachSkill);
                setSkillError(null);
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-400 font-bold text-xs rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>

          {/* Add Teach Skill Form */}
          {isAddingTeachSkill && (
            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                Add Teaching Skill (+10 XP)
              </h4>
              {skillError && (
                <p className="text-[11px] font-semibold text-rose-500">{skillError}</p>
              )}
              <input
                type="text"
                placeholder="Skill name (e.g. Next.js, Kotlin, French, Piano)"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-slate-800 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as SkillCategory)}
                  className="px-2 py-2 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                  value={newSkillProficiency}
                  onChange={(e) => setNewSkillProficiency(e.target.value as SkillProficiency)}
                  className="px-2 py-2 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs"
                >
                  {proficiencies.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingTeachSkill(false)}
                  className="px-3 py-1.5 text-xs text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleAddSkill('TEACH')}
                  disabled={!newSkillName.trim()}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Save Skill
                </button>
              </div>
            </div>
          )}

          {/* List of Teach Skills */}
          <div className="space-y-2">
            {teachSkills.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-800 dark:text-white">{s.name}</span>
                    <span className="text-[10px] px-2 py-0.2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold rounded-full">
                      {s.proficiency}
                    </span>
                    {s.yearsExperience && (
                      <span className="text-[11px] text-slate-400">({s.yearsExperience} yrs exp)</span>
                    )}
                  </div>
                  {s.description && (
                    <p className="text-xs text-slate-500 mt-0.5">{s.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveSkill(s.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Remove skill"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Skills I Want to Learn */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-xl">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-800 dark:text-white">Skills I Want to Learn</h3>
                <p className="text-xs text-slate-400">Wishlist for bilateral matchmaking</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsAddingLearnSkill(!isAddingLearnSkill);
                setSkillError(null);
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-400 font-bold text-xs rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Target Skill</span>
            </button>
          </div>

          {/* Add Learn Skill Form */}
          {isAddingLearnSkill && (
            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider">
                Add Desired Learning Skill (+10 XP)
              </h4>
              {skillError && (
                <p className="text-[11px] font-semibold text-rose-500">{skillError}</p>
              )}
              <input
                type="text"
                placeholder="Skill name (e.g. Python, Deep Learning, Spanish, UI/UX)"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs text-slate-800 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as SkillCategory)}
                  className="px-2 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                  value={newSkillProficiency}
                  onChange={(e) => setNewSkillProficiency(e.target.value as SkillProficiency)}
                  className="px-2 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs"
                >
                  {proficiencies.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingLearnSkill(false)}
                  className="px-3 py-1.5 text-xs text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleAddSkill('LEARN')}
                  disabled={!newSkillName.trim()}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Save Target Skill
                </button>
              </div>
            </div>
          )}

          {/* List of Learn Skills */}
          <div className="space-y-2">
            {learnSkills.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-800 dark:text-white">{s.name}</span>
                    <span className="text-[10px] px-2 py-0.2 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-bold rounded-full">
                      Target: {s.proficiency}
                    </span>
                  </div>
                  {s.description && (
                    <p className="text-xs text-slate-500 mt-0.5">{s.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveSkill(s.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Remove skill"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges & Achievements Earned */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 dark:bg-amber-950 text-amber-600 rounded-xl">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800 dark:text-white">Earned Badges & Milestones</h3>
              <p className="text-xs text-slate-400">Achievements unlocked through teaching and swapping</p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/50 px-3 py-1 rounded-full">
            {currentUser.badges?.length || 0} Badges Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {currentUser.badges?.map((badge) => (
            <div
              key={badge.id}
              className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-start gap-3.5"
            >
              <div className="text-3xl p-2 bg-white dark:bg-slate-900 rounded-xl shadow-xs">
                {badge.icon}
              </div>
              <div>
                <div className="font-bold text-sm text-slate-800 dark:text-white">{badge.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">{badge.description}</div>
                <div className="text-[10px] text-slate-400 mt-1">Unlocked: {badge.earnedAt}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Received Reviews List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-xl">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800 dark:text-white">
                Peer Reviews & Feedback ({reviews.length})
              </h3>
              <p className="text-xs text-slate-400">What your swap partners say about your mentoring</p>
            </div>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No reviews received yet. Complete a teaching swap session to get your first star!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.reviewerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                      alt={rev.reviewerName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-white">
                        {rev.reviewerName}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Learned <span className="font-semibold text-emerald-600">{rev.skillTaught}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-amber-500 font-bold text-xs">
                    {'★'.repeat(rev.rating)}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                  "{rev.feedback}"
                </p>

                {rev.tags && rev.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {rev.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-full"
                      >
                        ✓ {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

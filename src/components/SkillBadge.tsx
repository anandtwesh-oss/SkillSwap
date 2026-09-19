import React from 'react';
import { SkillCategory, SkillProficiency } from '@/lib/types';

interface SkillBadgeProps {
  name: string;
  category?: SkillCategory | string;
  proficiency?: SkillProficiency;
  type?: 'TEACH' | 'LEARN';
  yearsExperience?: number;
  onRemove?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  'Programming & Tech': { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800' },
  'Design & Creative': { bg: 'bg-pink-50 dark:bg-pink-950/40', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-200 dark:border-pink-800' },
  'Languages': { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' },
  'Music & Audio': { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
  'AI & Data Science': { bg: 'bg-cyan-50 dark:bg-cyan-950/40', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-800' },
  'Business & Marketing': { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' },
  'Academics & Science': { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
};

const proficiencyColors: Record<SkillProficiency, string> = {
  Beginner: 'bg-slate-100 text-slate-700 border-slate-300',
  Intermediate: 'bg-blue-100 text-blue-800 border-blue-300',
  Advanced: 'bg-purple-100 text-purple-800 border-purple-300',
  Expert: 'bg-amber-100 text-amber-900 border-amber-300 font-semibold',
};

export const SkillBadge: React.FC<SkillBadgeProps> = ({
  name,
  category,
  proficiency,
  type,
  yearsExperience,
  onRemove,
  size = 'md'
}) => {
  const catStyle = (category && categoryColors[category]) || {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200'
  };

  const isSmall = size === 'sm';

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-lg border transition-all ${catStyle.bg} ${catStyle.border} ${
        isSmall ? 'px-2 py-0.5 text-xs' : 'px-3 py-1.5 text-sm'
      }`}
    >
      {type && (
        <span
          className={`inline-block rounded px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider ${
            type === 'TEACH'
              ? 'bg-emerald-600 text-white'
              : 'bg-indigo-600 text-white'
          }`}
        >
          {type === 'TEACH' ? 'Teaches' : 'Learns'}
        </span>
      )}

      <span className={`font-semibold ${catStyle.text}`}>{name}</span>

      {proficiency && (
        <span
          className={`rounded-full px-1.5 py-0.5 text-[10px] border ${
            proficiencyColors[proficiency] || 'bg-slate-100 text-slate-700'
          }`}
        >
          {proficiency}
        </span>
      )}

      {yearsExperience && yearsExperience > 0 && (
        <span className="text-[11px] text-slate-700 font-medium">
          ({yearsExperience}y exp)
        </span>
      )}

      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 text-slate-400 hover:text-red-500 transition-colors"
          title="Remove skill"
        >
          ×
        </button>
      )}
    </div>
  );
};

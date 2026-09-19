export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type SkillType = 'TEACH' | 'LEARN';
export type SkillCategory = 
  | 'Programming & Tech' 
  | 'Design & Creative' 
  | 'Languages' 
  | 'Music & Audio' 
  | 'AI & Data Science' 
  | 'Business & Marketing' 
  | 'Academics & Science';

export interface UserSkill {
  id: string;
  userId: string;
  name: string;
  category: SkillCategory;
  type: SkillType; // 'TEACH' = Offer, 'LEARN' = Want
  proficiency: SkillProficiency;
  yearsExperience?: number;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  title: string;
  bio: string;
  location: string;
  timezone: string;
  rating: number;
  reviewCount: number;
  completedSwaps: number;
  hoursTaught: number;
  points: number; // Gamification XP
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  badges: Badge[];
  skills: UserSkill[];
  joinedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: 'teaching' | 'swaps' | 'rating' | 'milestone';
}

export type SwapStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED' | 'COMPLETED';

export interface SwapRequest {
  id: string;
  requesterId: string;
  receiverId: string;
  teachSkill: string; // Skill requester teaches (or offers)
  learnSkill: string; // Skill requester wants to learn from receiver
  requesterSkillProficiency?: SkillProficiency;
  receiverSkillProficiency?: SkillProficiency;
  status: SwapStatus;
  message: string;
  scheduledTime?: string;
  durationMinutes: number;
  sessionRoomId: string;
  hasReviewByRequester?: boolean;
  hasReviewByReceiver?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  swapId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  createdAt: string;
}

export interface Review {
  id: string;
  swapId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  targetUserId: string;
  rating: number; // 1 to 5
  feedback: string;
  tags: string[]; // e.g. "Patient Tutor", "Great Code Explanations", "Well Structured"
  skillTaught: string;
  createdAt: string;
}

export interface BilateralMatch {
  user: User;
  matchScore: number; // 0 to 100 percentage
  isExactBilateral: boolean; // True if exact reciprocal 2-way match
  offersYouTeach: UserSkill[]; // Skills they offer that you want to learn
  wantsYouTeach: UserSkill[]; // Skills they want that you teach
  otherSynergies: string[];
  matchReasons: string[];
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  points: number;
  completedSwaps: number;
  hoursTaught: number;
  rating: number;
  reviewCount: number;
  tier: string;
  badges?: Badge[];
  recentBadges?: string[];
}


import { User, SwapRequest, Message, Review, Badge, SkillCategory, SkillProficiency } from './types';

// Initial pre-seeded database
const initialUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alex Chen',
    email: 'alex.chen@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    title: 'Senior Java Backend Engineer',
    bio: 'Software engineer with 6+ years specializing in Java, Spring Boot, and microservices architecture. Eager to master Python for Machine Learning and AI agents!',
    location: 'San Francisco, CA',
    timezone: 'UTC-7 (PDT)',
    rating: 4.9,
    reviewCount: 18,
    completedSwaps: 14,
    hoursTaught: 28,
    points: 980,
    tier: 'Platinum',
    joinedAt: '2025-11-10T10:00:00.000Z',
    badges: [
      { id: 'b1', name: 'Master Mentor', description: 'Taught over 25 hours', icon: '🎓', earnedAt: '2026-01-15', category: 'teaching' },
      { id: 'b2', name: 'Top Rated Tutor', description: 'Maintained 4.8+ rating over 10+ reviews', icon: '⭐', earnedAt: '2026-02-01', category: 'rating' },
      { id: 'b3', name: 'Polyglot Pioneer', description: 'Exchanged 3+ different skill domains', icon: '🚀', earnedAt: '2026-02-20', category: 'swaps' }
    ],
    skills: [
      { id: 's1', userId: 'user-1', name: 'Java', category: 'Programming & Tech', type: 'TEACH', proficiency: 'Expert', yearsExperience: 6, description: 'Core Java, Spring Boot, Multithreading, Garbage Collection tuning' },
      { id: 's2', userId: 'user-1', name: 'Spring Boot', category: 'Programming & Tech', type: 'TEACH', proficiency: 'Advanced', yearsExperience: 5, description: 'REST APIs, JPA/Hibernate, Spring Security, Microservices' },
      { id: 's3', userId: 'user-1', name: 'Python', category: 'Programming & Tech', type: 'LEARN', proficiency: 'Beginner', description: 'Looking to learn modern Python syntax, pandas, numpy, and FastAPI' },
      { id: 's4', userId: 'user-1', name: 'Machine Learning', category: 'AI & Data Science', type: 'LEARN', proficiency: 'Beginner', description: 'Want to build real-world ML prediction models and neural nets' }
    ]
  },
  {
    id: 'user-2',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    title: 'Data Scientist & Python Specialist',
    bio: 'Data scientist building predictive ML models and data pipelines in Python. Looking to strengthen my backend Java and JVM performance skills for enterprise deployments.',
    location: 'New York, NY',
    timezone: 'UTC-4 (EDT)',
    rating: 5.0,
    reviewCount: 22,
    completedSwaps: 16,
    hoursTaught: 32,
    points: 1150,
    tier: 'Diamond',
    joinedAt: '2025-10-05T08:30:00.000Z',
    badges: [
      { id: 'b4', name: 'Diamond Educator', description: 'Surpassed 1000 gamification points', icon: '💎', earnedAt: '2026-02-10', category: 'milestone' },
      { id: 'b5', name: '5-Star Champion', description: 'Received 15 consecutive 5-star ratings', icon: '🌟', earnedAt: '2026-01-28', category: 'rating' }
    ],
    skills: [
      { id: 's5', userId: 'user-2', name: 'Python', category: 'Programming & Tech', type: 'TEACH', proficiency: 'Expert', yearsExperience: 5, description: 'Python 3.12, PyTorch, Pandas, Scikit-Learn, AsyncIO, Web Scraping' },
      { id: 's6', userId: 'user-2', name: 'Machine Learning', category: 'AI & Data Science', type: 'TEACH', proficiency: 'Advanced', yearsExperience: 4, description: 'Supervised/Unsupervised models, Feature engineering, Model evaluation' },
      { id: 's7', userId: 'user-2', name: 'Java', category: 'Programming & Tech', type: 'LEARN', proficiency: 'Beginner', description: 'Want to understand OOP deeply, JVM concurrency, and Spring Boot' },
      { id: 's8', userId: 'user-2', name: 'SQL', category: 'AI & Data Science', type: 'TEACH', proficiency: 'Expert', yearsExperience: 6, description: 'Complex queries, indexing, CTEs, PostgreSQL optimization' }
    ]
  },
  {
    id: 'user-3',
    name: 'Carlos Rodriguez',
    email: 'carlos.r@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Lead UI/UX & Product Designer',
    bio: 'Crafting pixel-perfect design systems in Figma and conducting user research. Wanting to learn React and Tailwind to build my own interactive prototypes and frontends.',
    location: 'Austin, TX',
    timezone: 'UTC-5 (CDT)',
    rating: 4.8,
    reviewCount: 15,
    completedSwaps: 11,
    hoursTaught: 22,
    points: 760,
    tier: 'Gold',
    joinedAt: '2025-12-01T14:00:00.000Z',
    badges: [
      { id: 'b6', name: 'Design Wizard', description: 'Top rated design mentor', icon: '🎨', earnedAt: '2026-01-20', category: 'teaching' }
    ],
    skills: [
      { id: 's9', userId: 'user-3', name: 'UI/UX Design', category: 'Design & Creative', type: 'TEACH', proficiency: 'Expert', yearsExperience: 7, description: 'Figma components, Auto-layout, Typography, User Flows, Prototyping' },
      { id: 's10', userId: 'user-3', name: 'Figma', category: 'Design & Creative', type: 'TEACH', proficiency: 'Expert', yearsExperience: 6, description: 'Design systems, tokens, interactive variables, micro-interactions' },
      { id: 's11', userId: 'user-3', name: 'React', category: 'Programming & Tech', type: 'LEARN', proficiency: 'Beginner', description: 'Learn hooks, state management, Next.js routing, and component architecture' },
      { id: 's12', userId: 'user-3', name: 'Tailwind CSS', category: 'Programming & Tech', type: 'LEARN', proficiency: 'Intermediate', description: 'Convert Figma designs directly to responsive clean Tailwind utility classes' }
    ]
  },
  {
    id: 'user-4',
    name: 'Maya Patel',
    email: 'maya.patel@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Frontend React Architect',
    bio: 'Frontend developer passionate about React, Next.js, and TypeScript. In exchange, I want to level up my Figma design system skills and learn conversational Spanish.',
    location: 'Seattle, WA',
    timezone: 'UTC-7 (PDT)',
    rating: 4.9,
    reviewCount: 19,
    completedSwaps: 15,
    hoursTaught: 30,
    points: 920,
    tier: 'Platinum',
    joinedAt: '2025-11-20T12:00:00.000Z',
    badges: [
      { id: 'b7', name: 'Code Maestro', description: 'Over 20 code mentoring sessions', icon: '💻', earnedAt: '2026-02-05', category: 'teaching' }
    ],
    skills: [
      { id: 's13', userId: 'user-4', name: 'React', category: 'Programming & Tech', type: 'TEACH', proficiency: 'Expert', yearsExperience: 6, description: 'React 18/19, Server Components, Custom Hooks, Performance tuning' },
      { id: 's14', userId: 'user-4', name: 'Tailwind CSS', category: 'Programming & Tech', type: 'TEACH', proficiency: 'Expert', yearsExperience: 4, description: 'Responsive layouts, dark mode, animations, custom theme plugins' },
      { id: 's15', userId: 'user-4', name: 'UI/UX Design', category: 'Design & Creative', type: 'LEARN', proficiency: 'Beginner', description: 'Want to understand visual hierarchy, typography pairings, and UX wireframing' },
      { id: 's16', userId: 'user-4', name: 'Spanish', category: 'Languages', type: 'LEARN', proficiency: 'Beginner', description: 'Conversational Spanish for travel and everyday fluency' }
    ]
  },
  {
    id: 'user-5',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    title: 'Classical Pianist & Music Producer',
    bio: 'Trained concert pianist and sound producer for 10+ years. Happy to teach piano technique, music theory, and harmony in return for beginner French or Web Development!',
    location: 'London, UK',
    timezone: 'UTC+0 (GMT)',
    rating: 5.0,
    reviewCount: 14,
    completedSwaps: 10,
    hoursTaught: 20,
    points: 710,
    tier: 'Gold',
    joinedAt: '2025-12-15T09:00:00.000Z',
    badges: [
      { id: 'b8', name: 'Melody Master', description: 'Recognized music instructor', icon: '🎹', earnedAt: '2026-01-30', category: 'teaching' }
    ],
    skills: [
      { id: 's17', userId: 'user-5', name: 'Piano', category: 'Music & Audio', type: 'TEACH', proficiency: 'Expert', yearsExperience: 12, description: 'Classical piano, chord progressions, sight-reading, technique' },
      { id: 's18', userId: 'user-5', name: 'Music Theory', category: 'Music & Audio', type: 'TEACH', proficiency: 'Expert', yearsExperience: 10, description: 'Harmony, scales, ear training, songwriting composition' },
      { id: 's19', userId: 'user-5', name: 'French', category: 'Languages', type: 'LEARN', proficiency: 'Beginner', description: 'Everyday French grammar, pronunciation, and dialogue' },
      { id: 's20', userId: 'user-5', name: 'Python', category: 'Programming & Tech', type: 'LEARN', proficiency: 'Beginner', description: 'Basic coding for music generation and audio DSP scripts' }
    ]
  },
  {
    id: 'user-6',
    name: 'David Kim',
    email: 'david.kim@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'Native Korean & Japanese Polyglot',
    bio: 'Bilingual language instructor with expertise in Japanese (JLPT N1) and Korean. Looking to learn Acoustic Guitar and Music Production.',
    location: 'Tokyo, Japan',
    timezone: 'UTC+9 (JST)',
    rating: 4.9,
    reviewCount: 17,
    completedSwaps: 13,
    hoursTaught: 26,
    points: 840,
    tier: 'Platinum',
    joinedAt: '2025-11-01T04:00:00.000Z',
    badges: [
      { id: 'b9', name: 'Global Citizen', description: 'Cross-cultural language educator', icon: '🌏', earnedAt: '2026-01-10', category: 'teaching' }
    ],
    skills: [
      { id: 's21', userId: 'user-6', name: 'Japanese', category: 'Languages', type: 'TEACH', proficiency: 'Expert', yearsExperience: 8, description: 'JLPT prep, Kanji mastery, conversational fluency, business etiquette' },
      { id: 's22', userId: 'user-6', name: 'Korean', category: 'Languages', type: 'TEACH', proficiency: 'Expert', yearsExperience: 10, description: 'Hangul, grammar fundamentals, natural slang, pronunciation' },
      { id: 's23', userId: 'user-6', name: 'Piano', category: 'Music & Audio', type: 'LEARN', proficiency: 'Beginner', description: 'Want to learn how to play basic chords and soundtrack melodies' },
      { id: 's24', userId: 'user-6', name: 'Guitar', category: 'Music & Audio', type: 'LEARN', proficiency: 'Beginner', description: 'Acoustic fingerpicking and rhythm guitar' }
    ]
  }
];

const initialSwaps: SwapRequest[] = [
  {
    id: 'swap-1',
    requesterId: 'user-1',
    receiverId: 'user-2',
    teachSkill: 'Java',
    learnSkill: 'Python',
    requesterSkillProficiency: 'Expert',
    receiverSkillProficiency: 'Expert',
    status: 'ACCEPTED',
    message: 'Hey Sarah! I saw you want to learn Java concurrency and Spring Boot. I would love to learn Python and PyTorch fundamentals from you in exchange!',
    scheduledTime: '2026-08-22T15:00:00.000Z',
    durationMinutes: 60,
    sessionRoomId: 'room-alex-sarah-101',
    hasReviewByRequester: false,
    hasReviewByReceiver: false,
    createdAt: '2026-08-20T10:00:00.000Z',
    updatedAt: '2026-08-20T11:30:00.000Z'
  },
  {
    id: 'swap-2',
    requesterId: 'user-3',
    receiverId: 'user-4',
    teachSkill: 'UI/UX Design',
    learnSkill: 'React',
    requesterSkillProficiency: 'Expert',
    receiverSkillProficiency: 'Expert',
    status: 'COMPLETED',
    message: 'Hi Maya! I can teach you advanced Figma design systems and auto-layout if you can guide me through React hooks and component state.',
    scheduledTime: '2026-08-19T18:00:00.000Z',
    durationMinutes: 45,
    sessionRoomId: 'room-carlos-maya-202',
    hasReviewByRequester: true,
    hasReviewByReceiver: true,
    createdAt: '2026-08-18T09:00:00.000Z',
    updatedAt: '2026-08-19T19:00:00.000Z'
  },
  {
    id: 'swap-3',
    requesterId: 'user-6',
    receiverId: 'user-5',
    teachSkill: 'Japanese',
    learnSkill: 'Piano',
    requesterSkillProficiency: 'Expert',
    receiverSkillProficiency: 'Expert',
    status: 'PENDING',
    message: 'Hello Elena! I would be delighted to teach you Japanese conversational skills in exchange for piano keyboard lessons!',
    scheduledTime: '2026-08-23T14:00:00.000Z',
    durationMinutes: 60,
    sessionRoomId: 'room-david-elena-303',
    hasReviewByRequester: false,
    hasReviewByReceiver: false,
    createdAt: '2026-08-21T08:00:00.000Z',
    updatedAt: '2026-08-21T08:00:00.000Z'
  }
];

const initialMessages: Message[] = [
  {
    id: 'msg-1',
    swapId: 'swap-1',
    senderId: 'user-1',
    senderName: 'Alex Chen',
    senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    text: 'Hey Sarah! Thanks for accepting the swap. I have prepared a quick curriculum on Java memory management and Spring Boot REST controllers.',
    createdAt: '2026-08-20T11:35:00.000Z'
  },
  {
    id: 'msg-2',
    swapId: 'swap-1',
    senderId: 'user-2',
    senderName: 'Sarah Jenkins',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    text: 'Awesome Alex! On my side, I have a Jupyter notebook ready with Python syntax fundamentals and pandas exercises. See you in the session room!',
    createdAt: '2026-08-20T11:42:00.000Z'
  }
];

const initialReviews: Review[] = [
  {
    id: 'rev-1',
    swapId: 'swap-2',
    reviewerId: 'user-3',
    reviewerName: 'Carlos Rodriguez',
    reviewerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    targetUserId: 'user-4',
    rating: 5,
    feedback: 'Maya is a brilliant React tutor! She explained hooks and useEffect with crystal clear diagrams. I built my first component in 30 minutes.',
    tags: ['Crystal Clear Explanations', 'Super Patient', 'Practical Code Examples'],
    skillTaught: 'React',
    createdAt: '2026-08-19T19:10:00.000Z'
  },
  {
    id: 'rev-2',
    swapId: 'swap-2',
    reviewerId: 'user-4',
    reviewerName: 'Maya Patel',
    reviewerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    targetUserId: 'user-3',
    rating: 5,
    feedback: 'Carlos unlocked the secrets of Figma auto-layout and design systems for me! My UI workflows are twice as fast now. Highly recommended.',
    tags: ['Design Master', 'Great Resources', 'Very Encouraging'],
    skillTaught: 'UI/UX Design',
    createdAt: '2026-08-19T19:15:00.000Z'
  }
];

// Global in-memory / cache store (survives hot reloads during server runtime)
class DatabaseStore {
  private users: User[] = [...initialUsers];
  private swaps: SwapRequest[] = [...initialSwaps];
  private messages: Message[] = [...initialMessages];
  private reviews: Review[] = [...initialReviews];
  private activeUserId: string = 'user-1'; // Default active persona: Alex Chen

  // User methods
  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getActiveUserId(): string {
    return this.activeUserId;
  }

  setActiveUserId(id: string): void {
    if (this.getUserById(id)) {
      this.activeUserId = id;
    }
  }

  getActiveUser(): User {
    return this.getUserById(this.activeUserId) || this.users[0];
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.users[idx] = { ...this.users[idx], ...updates };
    return this.users[idx];
  }

  addSkill(userId: string, skill: Omit<User['skills'][0], 'id' | 'userId'>): User | null {
    const user = this.getUserById(userId);
    if (!user) return null;
    const newSkill = {
      ...skill,
      id: 's-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      userId
    };
    user.skills.push(newSkill);
    // Award 10 XP points for adding a new skill
    user.points += 10;
    this.updateUserTier(user);
    return user;
  }

  removeSkill(userId: string, skillId: string): User | null {
    const user = this.getUserById(userId);
    if (!user) return null;
    user.skills = user.skills.filter(s => s.id !== skillId);
    return user;
  }

  // Swap methods
  getSwaps(): SwapRequest[] {
    return this.swaps;
  }

  getSwapById(id: string): SwapRequest | undefined {
    return this.swaps.find(s => s.id === id);
  }

  getSwapsForUser(userId: string): SwapRequest[] {
    return this.swaps.filter(s => s.requesterId === userId || s.receiverId === userId);
  }

  createSwap(data: {
    requesterId: string;
    receiverId: string;
    teachSkill: string;
    learnSkill: string;
    message: string;
    scheduledTime?: string;
    durationMinutes?: number;
  }): SwapRequest {
    const requester = this.getUserById(data.requesterId);
    const receiver = this.getUserById(data.receiverId);

    const requesterSkill = requester?.skills.find(s => s.name.toLowerCase() === data.teachSkill.toLowerCase());
    const receiverSkill = receiver?.skills.find(s => s.name.toLowerCase() === data.learnSkill.toLowerCase());

    const newSwap: SwapRequest = {
      id: 'swap-' + Date.now(),
      requesterId: data.requesterId,
      receiverId: data.receiverId,
      teachSkill: data.teachSkill,
      learnSkill: data.learnSkill,
      requesterSkillProficiency: requesterSkill?.proficiency || 'Intermediate',
      receiverSkillProficiency: receiverSkill?.proficiency || 'Intermediate',
      status: 'PENDING',
      message: data.message || 'I would love to swap skills with you!',
      scheduledTime: data.scheduledTime || new Date(Date.now() + 86400000).toISOString(),
      durationMinutes: data.durationMinutes || 60,
      sessionRoomId: `room-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      hasReviewByRequester: false,
      hasReviewByReceiver: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.swaps.unshift(newSwap);
    return newSwap;
  }

  updateSwapStatus(swapId: string, status: SwapRequest['status']): SwapRequest | null {
    const swap = this.getSwapById(swapId);
    if (!swap) return null;
    swap.status = status;
    swap.updatedAt = new Date().toISOString();

    if (status === 'COMPLETED') {
      // Award 50 points to both users and increment swap counts
      const reqUser = this.getUserById(swap.requesterId);
      const recUser = this.getUserById(swap.receiverId);

      if (reqUser) {
        reqUser.completedSwaps += 1;
        reqUser.hoursTaught += Math.round((swap.durationMinutes || 60) / 60);
        reqUser.points += 50;
        this.updateUserTier(reqUser);
      }
      if (recUser) {
        recUser.completedSwaps += 1;
        recUser.hoursTaught += Math.round((swap.durationMinutes || 60) / 60);
        recUser.points += 50;
        this.updateUserTier(recUser);
      }
    }

    return swap;
  }

  // Message methods
  getMessagesBySwapId(swapId: string): Message[] {
    return this.messages.filter(m => m.swapId === swapId).sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  addMessage(swapId: string, senderId: string, text: string): Message | null {
    const sender = this.getUserById(senderId);
    if (!sender) return null;

    const newMsg: Message = {
      id: 'msg-' + Date.now(),
      swapId,
      senderId,
      senderName: sender.name,
      senderAvatar: sender.avatar,
      text,
      createdAt: new Date().toISOString()
    };

    this.messages.push(newMsg);
    return newMsg;
  }

  // Review methods
  getReviewsForUser(targetUserId: string): Review[] {
    return this.reviews.filter(r => r.targetUserId === targetUserId).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getAllReviews(): Review[] {
    return this.reviews;
  }

  addReview(data: {
    swapId: string;
    reviewerId: string;
    targetUserId: string;
    rating: number;
    feedback: string;
    tags: string[];
    skillTaught: string;
  }): Review | null {
    const reviewer = this.getUserById(data.reviewerId);
    const targetUser = this.getUserById(data.targetUserId);
    const swap = this.getSwapById(data.swapId);

    if (!reviewer || !targetUser || !swap) return null;

    const newReview: Review = {
      id: 'rev-' + Date.now(),
      swapId: data.swapId,
      reviewerId: data.reviewerId,
      reviewerName: reviewer.name,
      reviewerAvatar: reviewer.avatar,
      targetUserId: data.targetUserId,
      rating: Math.max(1, Math.min(5, data.rating)),
      feedback: data.feedback,
      tags: data.tags || [],
      skillTaught: data.skillTaught,
      createdAt: new Date().toISOString()
    };

    this.reviews.unshift(newReview);

    // Update target user's aggregated rating
    const userReviews = this.reviews.filter(r => r.targetUserId === data.targetUserId);
    const totalScore = userReviews.reduce((sum, r) => sum + r.rating, 0);
    targetUser.reviewCount = userReviews.length;
    targetUser.rating = Number((totalScore / userReviews.length).toFixed(1));

    // Award bonus XP for great review: +20 points for 5-star review, +10 for 4-star
    if (data.rating === 5) targetUser.points += 20;
    else if (data.rating >= 4) targetUser.points += 10;

    // Check if new badge unlocked
    if (targetUser.reviewCount >= 10 && targetUser.rating >= 4.8 && !targetUser.badges.some(b => b.id === 'b2')) {
      targetUser.badges.push({
        id: 'b2',
        name: 'Top Rated Tutor',
        description: 'Maintained 4.8+ rating over 10+ reviews',
        icon: '⭐',
        earnedAt: new Date().toISOString().split('T')[0],
        category: 'rating'
      });
    }

    this.updateUserTier(targetUser);

    // Mark review flag on swap
    if (swap.requesterId === data.reviewerId) {
      swap.hasReviewByRequester = true;
    } else {
      swap.hasReviewByReceiver = true;
    }

    return newReview;
  }

  // Tier updates
  private updateUserTier(user: User): void {
    if (user.points >= 1000) user.tier = 'Diamond';
    else if (user.points >= 800) user.tier = 'Platinum';
    else if (user.points >= 500) user.tier = 'Gold';
    else if (user.points >= 200) user.tier = 'Silver';
    else user.tier = 'Bronze';
  }

  resetToDefaults(): void {
    this.users = JSON.parse(JSON.stringify(initialUsers));
    this.swaps = JSON.parse(JSON.stringify(initialSwaps));
    this.messages = JSON.parse(JSON.stringify(initialMessages));
    this.reviews = JSON.parse(JSON.stringify(initialReviews));
    this.activeUserId = 'user-1';
  }
}

// Global singleton instance
const globalDb = (global as any).__SKILLSWAP_DB__ || new DatabaseStore();
if (process.env.NODE_ENV !== 'production') {
  (global as any).__SKILLSWAP_DB__ = globalDb;
}

export const db = globalDb as DatabaseStore;

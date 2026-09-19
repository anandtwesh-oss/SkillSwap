import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding persistent database with real production users...');

  // Hash standard demo password
  const defaultPassword = await bcrypt.hash('Password123!', 10);

  // Clear existing records if seeding
  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.swapRequest.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.user.deleteMany();

  // 1. Alex Chen
  const alex = await prisma.user.create({
    data: {
      name: 'Alex Chen',
      email: 'alex.chen@example.com',
      password: defaultPassword,
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
      skills: {
        create: [
          { name: 'Java', category: 'Programming & Tech', type: 'TEACH', proficiency: 'Expert', yearsExperience: 6, description: 'Core Java, Spring Boot, Multithreading, Garbage Collection tuning' },
          { name: 'Spring Boot', category: 'Programming & Tech', type: 'TEACH', proficiency: 'Advanced', yearsExperience: 5, description: 'REST APIs, JPA/Hibernate, Spring Security, Microservices' },
          { name: 'Python', category: 'Programming & Tech', type: 'LEARN', proficiency: 'Beginner', description: 'Looking to learn modern Python syntax, pandas, numpy, and FastAPI' },
          { name: 'Machine Learning', category: 'AI & Data Science', type: 'LEARN', proficiency: 'Beginner', description: 'Want to build real-world ML prediction models and neural nets' }
        ]
      },
      badges: {
        create: [
          { name: 'Master Mentor', description: 'Taught over 25 hours', icon: '🎓', earnedAt: '2026-01-15', category: 'teaching' },
          { name: 'Top Rated Tutor', description: 'Maintained 4.8+ rating over 10+ reviews', icon: '⭐', earnedAt: '2026-02-01', category: 'rating' },
          { name: 'Polyglot Pioneer', description: 'Exchanged 3+ different skill domains', icon: '🚀', earnedAt: '2026-02-20', category: 'swaps' }
        ]
      }
    }
  });

  // 2. Sarah Jenkins
  const sarah = await prisma.user.create({
    data: {
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@example.com',
      password: defaultPassword,
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
      skills: {
        create: [
          { name: 'Python', category: 'Programming & Tech', type: 'TEACH', proficiency: 'Expert', yearsExperience: 5, description: 'Python 3.12, PyTorch, Pandas, Scikit-Learn, AsyncIO, Web Scraping' },
          { name: 'Machine Learning', category: 'AI & Data Science', type: 'TEACH', proficiency: 'Advanced', yearsExperience: 4, description: 'Supervised/Unsupervised models, Feature engineering, Model evaluation' },
          { name: 'Java', category: 'Programming & Tech', type: 'LEARN', proficiency: 'Beginner', description: 'Want to understand OOP deeply, JVM concurrency, and Spring Boot' },
          { name: 'SQL', category: 'AI & Data Science', type: 'TEACH', proficiency: 'Expert', yearsExperience: 6, description: 'Complex queries, indexing, CTEs, PostgreSQL optimization' }
        ]
      },
      badges: {
        create: [
          { name: 'Diamond Educator', description: 'Surpassed 1000 gamification points', icon: '💎', earnedAt: '2026-02-10', category: 'milestone' },
          { name: '5-Star Champion', description: 'Received 15 consecutive 5-star ratings', icon: '🌟', earnedAt: '2026-01-28', category: 'rating' }
        ]
      }
    }
  });

  // 3. Carlos Rodriguez
  const carlos = await prisma.user.create({
    data: {
      name: 'Carlos Rodriguez',
      email: 'carlos.r@example.com',
      password: defaultPassword,
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
      skills: {
        create: [
          { name: 'UI/UX Design', category: 'Design & Creative', type: 'TEACH', proficiency: 'Expert', yearsExperience: 7, description: 'Figma components, Auto-layout, Typography, User Flows, Prototyping' },
          { name: 'Figma', category: 'Design & Creative', type: 'TEACH', proficiency: 'Expert', yearsExperience: 6, description: 'Design systems, tokens, interactive variables, micro-interactions' },
          { name: 'React', category: 'Programming & Tech', type: 'LEARN', proficiency: 'Beginner', description: 'Learn hooks, state management, Next.js routing, and component architecture' },
          { name: 'Tailwind CSS', category: 'Programming & Tech', type: 'LEARN', proficiency: 'Intermediate', description: 'Convert Figma designs directly to responsive clean Tailwind utility classes' }
        ]
      },
      badges: {
        create: [
          { name: 'Design Wizard', description: 'Top rated design mentor', icon: '🎨', earnedAt: '2026-01-20', category: 'teaching' }
        ]
      }
    }
  });

  // 4. Maya Patel
  const maya = await prisma.user.create({
    data: {
      name: 'Maya Patel',
      email: 'maya.patel@example.com',
      password: defaultPassword,
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
      skills: {
        create: [
          { name: 'React', category: 'Programming & Tech', type: 'TEACH', proficiency: 'Expert', yearsExperience: 6, description: 'React 18/19, Server Components, Custom Hooks, Performance tuning' },
          { name: 'Tailwind CSS', category: 'Programming & Tech', type: 'TEACH', proficiency: 'Expert', yearsExperience: 4, description: 'Responsive layouts, dark mode, animations, custom theme plugins' },
          { name: 'UI/UX Design', category: 'Design & Creative', type: 'LEARN', proficiency: 'Beginner', description: 'Want to understand visual hierarchy, typography pairings, and UX wireframing' },
          { name: 'Spanish', category: 'Languages', type: 'LEARN', proficiency: 'Beginner', description: 'Conversational Spanish for travel and everyday fluency' }
        ]
      },
      badges: {
        create: [
          { name: 'Code Maestro', description: 'Over 20 code mentoring sessions', icon: '💻', earnedAt: '2026-02-05', category: 'teaching' }
        ]
      }
    }
  });

  // 5. Elena Rostova
  const elena = await prisma.user.create({
    data: {
      name: 'Elena Rostova',
      email: 'elena.rostova@example.com',
      password: defaultPassword,
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
      skills: {
        create: [
          { name: 'Piano', category: 'Music & Audio', type: 'TEACH', proficiency: 'Expert', yearsExperience: 12, description: 'Classical piano, chord progressions, sight-reading, technique' },
          { name: 'Music Theory', category: 'Music & Audio', type: 'TEACH', proficiency: 'Expert', yearsExperience: 10, description: 'Harmony, scales, ear training, songwriting composition' },
          { name: 'French', category: 'Languages', type: 'LEARN', proficiency: 'Beginner', description: 'Everyday French grammar, pronunciation, and dialogue' },
          { name: 'Python', category: 'Programming & Tech', type: 'LEARN', proficiency: 'Beginner', description: 'Basic coding for music generation and audio DSP scripts' }
        ]
      },
      badges: {
        create: [
          { name: 'Melody Master', description: 'Recognized music instructor', icon: '🎹', earnedAt: '2026-01-30', category: 'teaching' }
        ]
      }
    }
  });

  // 6. David Kim
  const david = await prisma.user.create({
    data: {
      name: 'David Kim',
      email: 'david.kim@example.com',
      password: defaultPassword,
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
      skills: {
        create: [
          { name: 'Japanese', category: 'Languages', type: 'TEACH', proficiency: 'Expert', yearsExperience: 8, description: 'JLPT prep, Kanji mastery, conversational fluency, business etiquette' },
          { name: 'Korean', category: 'Languages', type: 'TEACH', proficiency: 'Expert', yearsExperience: 10, description: 'Hangul, grammar fundamentals, natural slang, pronunciation' },
          { name: 'Piano', category: 'Music & Audio', type: 'LEARN', proficiency: 'Beginner', description: 'Want to learn how to play basic chords and soundtrack melodies' },
          { name: 'Guitar', category: 'Music & Audio', type: 'LEARN', proficiency: 'Beginner', description: 'Acoustic fingerpicking and rhythm guitar' }
        ]
      },
      badges: {
        create: [
          { name: 'Global Citizen', description: 'Cross-cultural language educator', icon: '🌏', earnedAt: '2026-01-10', category: 'teaching' }
        ]
      }
    }
  });

  // Create active swap between Alex and Sarah
  const swap1 = await prisma.swapRequest.create({
    data: {
      requesterId: alex.id,
      receiverId: sarah.id,
      teachSkill: 'Java',
      learnSkill: 'Python',
      requesterSkillProficiency: 'Expert',
      receiverSkillProficiency: 'Expert',
      status: 'ACCEPTED',
      message: 'Hey Sarah! I saw you want to learn Java concurrency and Spring Boot. I would love to learn Python and PyTorch fundamentals from you in exchange!',
      scheduledTime: new Date(Date.now() + 86400000),
      durationMinutes: 60,
      sessionRoomId: 'room-alex-sarah-101',
      messages: {
        create: [
          {
            senderId: alex.id,
            text: 'Hey Sarah! Thanks for accepting the swap. I have prepared a quick curriculum on Java memory management and Spring Boot REST controllers.'
          },
          {
            senderId: sarah.id,
            text: 'Awesome Alex! On my side, I have a Jupyter notebook ready with Python syntax fundamentals and pandas exercises. See you in the session room!'
          }
        ]
      }
    }
  });

  // Create completed swap between Carlos and Maya
  const swap2 = await prisma.swapRequest.create({
    data: {
      requesterId: carlos.id,
      receiverId: maya.id,
      teachSkill: 'UI/UX Design',
      learnSkill: 'React',
      requesterSkillProficiency: 'Expert',
      receiverSkillProficiency: 'Expert',
      status: 'COMPLETED',
      message: 'Hi Maya! I can teach you advanced Figma design systems and auto-layout if you can guide me through React hooks and component state.',
      scheduledTime: new Date(Date.now() - 86400000),
      durationMinutes: 45,
      sessionRoomId: 'room-carlos-maya-202',
      hasReviewByRequester: true,
      hasReviewByReceiver: true,
      reviews: {
        create: [
          {
            reviewerId: carlos.id,
            targetUserId: maya.id,
            rating: 5,
            feedback: 'Maya is a brilliant React tutor! She explained hooks and useEffect with crystal clear diagrams. I built my first component in 30 minutes.',
            tags: JSON.stringify(['Crystal Clear Explanations', 'Super Patient Tutor', 'Practical Code Examples']),
            skillTaught: 'React'
          },
          {
            reviewerId: maya.id,
            targetUserId: carlos.id,
            rating: 5,
            feedback: 'Carlos unlocked the secrets of Figma auto-layout and design systems for me! My UI workflows are twice as fast now. Highly recommended.',
            tags: JSON.stringify(['Design Master', 'Great Resources', 'Very Encouraging']),
            skillTaught: 'UI/UX Design'
          }
        ]
      }
    }
  });

  console.log('Database successfully seeded with persistent data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const defaultPassword = await bcrypt.hash('Password123!', 10);

    // Clean up
    await prisma.review.deleteMany();
    await prisma.message.deleteMany();
    await prisma.swapRequest.deleteMany();
    await prisma.userSkill.deleteMany();
    await prisma.badge.deleteMany();
    await prisma.user.deleteMany();

    // Recreate Alex
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

    // Recreate Sarah
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

    // Recreate Carlos
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

    // Recreate Maya
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

    // Active Swap
    await prisma.swapRequest.create({
      data: {
        requesterId: alex.id,
        receiverId: sarah.id,
        teachSkill: 'Java',
        learnSkill: 'Python',
        status: 'ACCEPTED',
        message: 'Hey Sarah! I saw you want to learn Java concurrency and Spring Boot. I would love to learn Python and PyTorch fundamentals from you in exchange!',
        durationMinutes: 60,
        sessionRoomId: 'room-alex-sarah-101',
        messages: {
          create: [
            { senderId: alex.id, text: 'Hey Sarah! Excited for our upcoming session.' },
            { senderId: sarah.id, text: 'Hey Alex! Jupyter notebooks are ready to go.' }
          ]
        }
      }
    });

    return NextResponse.json({ success: true, message: 'Database reset and re-seeded successfully' });
  } catch (error: any) {
    console.error('Error re-seeding database:', error);
    return NextResponse.json({ success: false, error: error.message || 'Seed failed' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, 
      email, 
      password, 
      title, 
      location, 
      teachSkillName, 
      teachSkillCategory, 
      teachSkillProficiency, 
      learnSkillName, 
      learnSkillCategory, 
      learnSkillProficiency 
    } = body;

    const errors: Record<string, string> = {};

    // Validate name
    if (!name || name.trim().length < 2) {
      errors.name = 'Full name must be at least 2 characters.';
    }

    // Validate email
    if (!email || !EMAIL_REGEX.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    // Validate password
    if (!password || password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    // Return early if initial validation failed
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check duplicate email
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, errors: { email: 'An account with this email already exists. Please log in.' } },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database with initial skills
    const skillsToCreate: any[] = [];
    if (teachSkillName && teachSkillName.trim()) {
      skillsToCreate.push({
        name: teachSkillName.trim(),
        category: teachSkillCategory || 'Programming & Tech',
        type: 'TEACH',
        proficiency: teachSkillProficiency || 'Advanced',
        yearsExperience: 2,
        description: `Offering peer instruction in ${teachSkillName.trim()}`
      });
    }

    if (learnSkillName && learnSkillName.trim()) {
      skillsToCreate.push({
        name: learnSkillName.trim(),
        category: learnSkillCategory || 'Programming & Tech',
        type: 'LEARN',
        proficiency: learnSkillProficiency || 'Beginner',
        description: `Eager to learn ${learnSkillName.trim()}`
      });
    }

    // Pick avatar
    const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}`;

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        avatar,
        title: title?.trim() || 'Knowledge Explorer',
        location: location?.trim() || 'Remote',
        points: 100, // Initial bonus XP
        tier: 'Bronze',
        skills: {
          create: skillsToCreate
        },
        badges: {
          create: [
            {
              name: 'Welcome Pioneer',
              description: 'Joined the SkillSwap peer network',
              icon: '👋',
              earnedAt: new Date().toISOString().split('T')[0],
              category: 'milestone'
            }
          ]
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        title: true,
        points: true,
        tier: true,
        rating: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully! You can now log in.',
      user: newUser
    }, { status: 201 });

  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during registration. Please try again.' },
      { status: 500 }
    );
  }
}

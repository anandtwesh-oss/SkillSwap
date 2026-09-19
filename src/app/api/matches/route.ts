import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { findBilateralMatches } from '@/lib/matching';
import { User, UserSkill } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let userId = searchParams.get('userId');

    const allUsersFromDb = await prisma.user.findMany({
      include: {
        skills: true,
        badges: true
      }
    });

    if (allUsersFromDb.length === 0) {
      return NextResponse.json({ success: true, matches: [], exactBilateralCount: 0, totalMatches: 0 });
    }

    if (!userId) {
      userId = allUsersFromDb[0].id;
    }

    const activeUserDb = allUsersFromDb.find(u => u.id === userId);
    if (!activeUserDb) {
      return NextResponse.json({ success: false, error: 'Target user not found' }, { status: 404 });
    }

    // Convert Prisma types to frontend User types
    const mappedUsers: User[] = allUsersFromDb.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      avatar: u.avatar || '',
      title: u.title || '',
      bio: u.bio || '',
      location: u.location || '',
      timezone: u.timezone || 'UTC',
      rating: u.rating,
      reviewCount: u.reviewCount,
      completedSwaps: u.completedSwaps,
      hoursTaught: u.hoursTaught,
      points: u.points,
      tier: u.tier as any,
      joinedAt: u.createdAt.toISOString(),
      badges: u.badges.map(b => ({
        id: b.id,
        name: b.name,
        description: b.description,
        icon: b.icon,
        earnedAt: b.earnedAt,
        category: b.category as any
      })),
      skills: u.skills.map(s => ({
        id: s.id,
        userId: s.userId,
        name: s.name,
        category: s.category as any,
        type: s.type as any,
        proficiency: s.proficiency as any,
        yearsExperience: s.yearsExperience || 1,
        description: s.description || ''
      }))
    }));

    const activeUser = mappedUsers.find(u => u.id === userId)!;
    const matches = findBilateralMatches(activeUser, mappedUsers);

    return NextResponse.json({
      success: true,
      activeUser,
      matches,
      totalMatches: matches.length,
      exactBilateralCount: matches.filter(m => m.isExactBilateral).length
    });
  } catch (error: any) {
    console.error('Error calculating matches:', error);
    return NextResponse.json({ success: false, error: error.message || 'Matching engine error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || 'all';

    const users = await prisma.user.findMany({
      include: {
        badges: true,
        skills: true
      },
      orderBy: { points: 'desc' }
    });

    const leaderboard = users.map((user, index) => {
      const { password, ...safeUser } = user;
      return {
        rank: index + 1,
        user: safeUser,
        points: user.points,
        completedSwaps: user.completedSwaps,
        hoursTaught: user.hoursTaught,
        rating: user.rating,
        reviewCount: user.reviewCount,
        tier: user.tier,
        badges: user.badges
      };
    });

    return NextResponse.json({
      success: true,
      timeframe,
      leaderboard,
      topTutor: leaderboard[0] || null
    });
  } catch (error: any) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ success: false, error: error.message || 'Database error' }, { status: 500 });
  }
}

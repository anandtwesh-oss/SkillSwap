import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase()?.trim();
    const category = searchParams.get('category');
    const type = searchParams.get('type'); // 'TEACH' or 'LEARN'
    const minRating = searchParams.get('minRating');
    const proficiency = searchParams.get('proficiency');

    let users = await prisma.user.findMany({
      include: {
        skills: true,
        badges: true,
      },
      orderBy: { points: 'desc' }
    });

    if (query) {
      users = users.filter(u =>
        u.name.toLowerCase().includes(query) ||
        (u.title && u.title.toLowerCase().includes(query)) ||
        (u.bio && u.bio.toLowerCase().includes(query)) ||
        u.skills.some(s => s.name.toLowerCase().includes(query))
      );
    }

    if (category && category !== 'All') {
      users = users.filter(u =>
        u.skills.some(s => s.category === category && (!type || s.type === type))
      );
    }

    if (proficiency && proficiency !== 'All') {
      users = users.filter(u =>
        u.skills.some(s => s.proficiency === proficiency && (!type || s.type === type))
      );
    }

    if (minRating) {
      const min = parseFloat(minRating);
      users = users.filter(u => u.rating >= min);
    }

    // Do not return hashed password in response
    const safeUsers = users.map(({ password, ...rest }) => rest);

    return NextResponse.json({ success: true, users: safeUsers });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Database query failed' },
      { status: 500 }
    );
  }
}

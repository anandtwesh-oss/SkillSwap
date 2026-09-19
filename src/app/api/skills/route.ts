import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const allSkills = await prisma.userSkill.findMany();
    
    const skillMap = new Map<string, { name: string; category: string; teachCount: number; learnCount: number }>();

    for (const skill of allSkills) {
      const key = skill.name.toLowerCase();
      if (!skillMap.has(key)) {
        skillMap.set(key, {
          name: skill.name,
          category: skill.category,
          teachCount: 0,
          learnCount: 0
        });
      }
      const item = skillMap.get(key)!;
      if (skill.type === 'TEACH') item.teachCount++;
      else item.learnCount++;
    }

    const skills = Array.from(skillMap.values()).sort((a, b) => (b.teachCount + b.learnCount) - (a.teachCount + a.learnCount));

    return NextResponse.json({ success: true, skills });
  } catch (error: any) {
    console.error('Error fetching skills:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, category, type, proficiency, yearsExperience, description } = body;

    if (!userId || !name || !category || !type || !proficiency) {
      return NextResponse.json({ success: false, error: 'Missing required skill fields' }, { status: 400 });
    }

    // Create skill
    const newSkill = await prisma.userSkill.create({
      data: {
        userId,
        name: name.trim(),
        category,
        type,
        proficiency,
        yearsExperience: Number(yearsExperience) || 1,
        description: description || ''
      }
    });

    // Award 10 XP points for adding a new skill and recalculate tier
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      const newPoints = user.points + 10;
      let newTier = user.tier;
      if (newPoints >= 1000) newTier = 'Diamond';
      else if (newPoints >= 800) newTier = 'Platinum';
      else if (newPoints >= 500) newTier = 'Gold';
      else if (newPoints >= 200) newTier = 'Silver';

      await prisma.user.update({
        where: { id: userId },
        data: { points: newPoints, tier: newTier }
      });
    }

    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { skills: true, badges: true }
    });

    return NextResponse.json({ success: true, skill: newSkill, user: updatedUser });
  } catch (error: any) {
    console.error('Error adding skill:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const skillId = searchParams.get('skillId');

    if (!userId || !skillId) {
      return NextResponse.json({ success: false, error: 'User ID and Skill ID are required' }, { status: 400 });
    }

    await prisma.userSkill.deleteMany({
      where: {
        id: skillId,
        userId: userId
      }
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { skills: true, badges: true }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error('Error removing skill:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

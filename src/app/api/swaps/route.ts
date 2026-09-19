import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    const whereClause: any = {
      OR: [
        { requesterId: userId },
        { receiverId: userId }
      ]
    };

    if (status) {
      whereClause.status = status;
    }

    const swaps = await prisma.swapRequest.findMany({
      where: whereClause,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            title: true,
            tier: true,
            rating: true,
            reviewCount: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            title: true,
            tier: true,
            rating: true,
            reviewCount: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, swaps });
  } catch (error: any) {
    console.error('Error fetching swaps:', error);
    return NextResponse.json({ success: false, error: error.message || 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { requesterId, receiverId, teachSkill, learnSkill, message, scheduledTime, durationMinutes } = body;

    const errors: Record<string, string> = {};

    if (!requesterId) errors.requesterId = 'Requester identity missing.';
    if (!receiverId) errors.receiverId = 'Target peer required.';
    if (!teachSkill || !teachSkill.trim()) errors.teachSkill = 'Please select a skill you will teach.';
    if (!learnSkill || !learnSkill.trim()) errors.learnSkill = 'Please select a skill you want to learn.';
    if (!message || message.trim().length < 5) errors.message = 'Please include a proposal message (at least 5 characters).';

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // Check skills proficiencies
    const reqSkill = await prisma.userSkill.findFirst({
      where: { userId: requesterId, name: teachSkill, type: 'TEACH' }
    });
    const recSkill = await prisma.userSkill.findFirst({
      where: { userId: receiverId, name: learnSkill, type: 'TEACH' }
    });

    const sessionRoomId = `room-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    const newSwap = await prisma.swapRequest.create({
      data: {
        requesterId,
        receiverId,
        teachSkill: teachSkill.trim(),
        learnSkill: learnSkill.trim(),
        requesterSkillProficiency: reqSkill?.proficiency || 'Intermediate',
        receiverSkillProficiency: recSkill?.proficiency || 'Intermediate',
        status: 'PENDING',
        message: message.trim(),
        scheduledTime: scheduledTime ? new Date(scheduledTime) : new Date(Date.now() + 86400000),
        durationMinutes: Number(durationMinutes) || 60,
        sessionRoomId,
        messages: {
          create: [
            {
              senderId: requesterId,
              text: message.trim()
            }
          ]
        }
      },
      include: {
        requester: true,
        receiver: true
      }
    });

    return NextResponse.json({ success: true, swap: newSwap }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating swap:', error);
    return NextResponse.json({ success: false, error: error.message || 'Database error' }, { status: 500 });
  }
}

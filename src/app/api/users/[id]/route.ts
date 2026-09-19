import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        skills: true,
        badges: true,
        receivedReviews: {
          include: {
            reviewer: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        requestedSwaps: {
          include: { receiver: true }
        },
        receivedSwaps: {
          include: { requester: true }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found in database' }, { status: 404 });
    }

    const { password, ...safeUser } = user;

    // Transform reviews for client format
    const formattedReviews = user.receivedReviews.map(r => ({
      id: r.id,
      swapId: r.swapId,
      reviewerId: r.reviewerId,
      reviewerName: r.reviewer.name,
      reviewerAvatar: r.reviewer.avatar || '',
      targetUserId: r.targetUserId,
      rating: r.rating,
      feedback: r.feedback,
      tags: typeof r.tags === 'string' ? JSON.parse(r.tags || '[]') : r.tags,
      skillTaught: r.skillTaught,
      createdAt: r.createdAt.toISOString()
    }));

    return NextResponse.json({
      success: true,
      user: safeUser,
      reviews: formattedReviews
    });
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { bio, title, location, timezone, avatar } = body;

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...(bio !== undefined && { bio }),
        ...(title !== undefined && { title }),
        ...(location !== undefined && { location }),
        ...(timezone !== undefined && { timezone }),
        ...(avatar !== undefined && { avatar }),
      },
      include: {
        skills: true,
        badges: true
      }
    });

    const { password, ...safeUser } = updatedUser;

    return NextResponse.json({ success: true, user: safeUser });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ success: false, error: error.message || 'Update failed' }, { status: 500 });
  }
}

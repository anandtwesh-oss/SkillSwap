import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const swap = await prisma.swapRequest.findUnique({
      where: { id: params.id },
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
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!swap) {
      return NextResponse.json({ success: false, error: 'Swap request not found' }, { status: 404 });
    }

    const formattedMessages = swap.messages.map(m => ({
      id: m.id,
      swapId: m.swapId,
      senderId: m.senderId,
      senderName: m.sender.name,
      senderAvatar: m.sender.avatar || '',
      text: m.text,
      createdAt: m.createdAt.toISOString()
    }));

    return NextResponse.json({
      success: true,
      swap,
      messages: formattedMessages
    });
  } catch (error: any) {
    console.error('Error fetching swap:', error);
    return NextResponse.json({ success: false, error: error.message || 'Database error' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ success: false, error: 'Status is required' }, { status: 400 });
    }

    const existingSwap = await prisma.swapRequest.findUnique({
      where: { id: params.id }
    });

    if (!existingSwap) {
      return NextResponse.json({ success: false, error: 'Swap not found' }, { status: 404 });
    }

    const updatedSwap = await prisma.swapRequest.update({
      where: { id: params.id },
      data: { status }
    });

    // If session completed, award +50 points to both users and update tiers
    if (status === 'COMPLETED' && existingSwap.status !== 'COMPLETED') {
      const durationHours = Math.max(1, Math.round(existingSwap.durationMinutes / 60));

      const updatePoints = async (userId: string) => {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user) {
          const newPoints = user.points + 50;
          let newTier = user.tier;
          if (newPoints >= 1000) newTier = 'Diamond';
          else if (newPoints >= 800) newTier = 'Platinum';
          else if (newPoints >= 500) newTier = 'Gold';
          else if (newPoints >= 200) newTier = 'Silver';

          await prisma.user.update({
            where: { id: userId },
            data: {
              completedSwaps: { increment: 1 },
              hoursTaught: { increment: durationHours },
              points: newPoints,
              tier: newTier
            }
          });
        }
      };

      await Promise.all([
        updatePoints(existingSwap.requesterId),
        updatePoints(existingSwap.receiverId)
      ]);

      // Add system message
      await prisma.message.create({
        data: {
          swapId: params.id,
          senderId: existingSwap.requesterId,
          text: '🎉 Skill swap session marked as Completed! Please rate and review your peer.'
        }
      });
    } else if (status === 'ACCEPTED') {
      await prisma.message.create({
        data: {
          swapId: params.id,
          senderId: existingSwap.receiverId,
          text: 'I have accepted your skill swap proposal! Looking forward to our session.'
        }
      });
    }

    return NextResponse.json({ success: true, swap: updatedSwap });
  } catch (error: any) {
    console.error('Error updating swap status:', error);
    return NextResponse.json({ success: false, error: error.message || 'Update failed' }, { status: 500 });
  }
}

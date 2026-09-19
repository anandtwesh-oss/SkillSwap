import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const swapId = searchParams.get('swapId');

    if (!swapId) {
      return NextResponse.json({ success: false, error: 'swapId is required' }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: { swapId },
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
    });

    const formatted = messages.map(m => ({
      id: m.id,
      swapId: m.swapId,
      senderId: m.senderId,
      senderName: m.sender.name,
      senderAvatar: m.sender.avatar || '',
      text: m.text,
      createdAt: m.createdAt.toISOString()
    }));

    return NextResponse.json({ success: true, messages: formatted });
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ success: false, error: error.message || 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { swapId, senderId, text } = body;

    if (!swapId || !senderId || !text || !text.trim()) {
      return NextResponse.json({ success: false, error: 'swapId, senderId, and text are required' }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        swapId,
        senderId,
        text: text.trim()
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    const formatted = {
      id: message.id,
      swapId: message.swapId,
      senderId: message.senderId,
      senderName: message.sender.name,
      senderAvatar: message.sender.avatar || '',
      text: message.text,
      createdAt: message.createdAt.toISOString()
    };

    return NextResponse.json({ success: true, message: formatted }, { status: 201 });
  } catch (error: any) {
    console.error('Error sending message:', error);
    return NextResponse.json({ success: false, error: error.message || 'Database error' }, { status: 500 });
  }
}

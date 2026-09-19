import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('targetUserId');

    const whereClause: any = {};
    if (targetUserId) whereClause.targetUserId = targetUserId;

    const reviews = await prisma.review.findMany({
      where: whereClause,
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
    });

    const formatted = reviews.map(r => ({
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

    return NextResponse.json({ success: true, reviews: formatted });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ success: false, error: error.message || 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { swapId, reviewerId, targetUserId, rating, feedback, tags, skillTaught } = body;

    const errors: Record<string, string> = {};
    if (!swapId) errors.swapId = 'Swap session ID required.';
    if (!reviewerId) errors.reviewerId = 'Reviewer identity missing.';
    if (!targetUserId) errors.targetUserId = 'Target peer required.';
    if (!rating || rating < 1 || rating > 5) errors.rating = 'Please provide a star rating between 1 and 5.';
    if (!feedback || feedback.trim().length < 5) errors.feedback = 'Please provide constructive feedback (at least 5 characters).';
    if (!skillTaught) errors.skillTaught = 'Subject taught is required.';

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const newReview = await prisma.review.create({
      data: {
        swapId,
        reviewerId,
        targetUserId,
        rating: Number(rating),
        feedback: feedback.trim(),
        tags: JSON.stringify(tags || []),
        skillTaught
      },
      include: {
        reviewer: {
          select: { id: true, name: true, avatar: true }
        }
      }
    });

    // Update target user's aggregated rating and XP
    const allUserReviews = await prisma.review.findMany({
      where: { targetUserId }
    });

    const totalStars = allUserReviews.reduce((sum, r) => sum + r.rating, 0);
    const newAverage = Number((totalStars / allUserReviews.length).toFixed(1));

    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (targetUser) {
      let bonusXp = rating === 5 ? 20 : rating >= 4 ? 10 : 0;
      let newPoints = targetUser.points + bonusXp;
      let newTier = targetUser.tier;
      if (newPoints >= 1000) newTier = 'Diamond';
      else if (newPoints >= 800) newTier = 'Platinum';
      else if (newPoints >= 500) newTier = 'Gold';
      else if (newPoints >= 200) newTier = 'Silver';

      await prisma.user.update({
        where: { id: targetUserId },
        data: {
          rating: newAverage,
          reviewCount: allUserReviews.length,
          points: newPoints,
          tier: newTier
        }
      });
    }

    // Mark swap review flag
    const swap = await prisma.swapRequest.findUnique({ where: { id: swapId } });
    if (swap) {
      if (swap.requesterId === reviewerId) {
        await prisma.swapRequest.update({
          where: { id: swapId },
          data: { hasReviewByRequester: true }
        });
      } else {
        await prisma.swapRequest.update({
          where: { id: swapId },
          data: { hasReviewByReceiver: true }
        });
      }
    }

    const updatedTargetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        name: true,
        points: true,
        tier: true,
        rating: true,
        reviewCount: true
      }
    });

    return NextResponse.json({
      success: true,
      review: {
        ...newReview,
        reviewerName: newReview.reviewer.name,
        reviewerAvatar: newReview.reviewer.avatar || '',
        tags: tags || []
      },
      targetUser: updatedTargetUser
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ success: false, error: error.message || 'Database error' }, { status: 500 });
  }
}

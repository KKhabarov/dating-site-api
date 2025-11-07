import prisma from '../config/database';
import { NotFoundError, ValidationError } from '../utils/errors';

export class LikeService {
  static async likeUser(fromUserId: string, toUserId: string) {
    if (fromUserId === toUserId) {
      throw new ValidationError('Cannot like yourself');
    }

    // Check if user exists
    const toUser = await prisma.user.findUnique({ where: { id: toUserId } });
    if (!toUser) {
      throw new NotFoundError('User not found');
    }

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId,
          toUserId,
        },
      },
    });

    if (existingLike) {
      throw new ValidationError('You already liked this user');
    }

    const like = await prisma.like.create({
      data: {
        fromUserId,
        toUserId,
      },
      include: {
        toUser: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return like;
  }

  static async unlikeUser(fromUserId: string, toUserId: string) {
    const like = await prisma.like.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId,
          toUserId,
        },
      },
    });

    if (!like) {
      throw new NotFoundError('Like not found');
    }

    await prisma.like.delete({
      where: {
        fromUserId_toUserId: {
          fromUserId,
          toUserId,
        },
      },
    });

    return { message: 'User unliked successfully' };
  }

  static async getLikesGiven(userId: string) {
    const likes = await prisma.like.findMany({
      where: { fromUserId: userId },
      include: {
        toUser: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            bio: true,
            location: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return likes;
  }

  static async getLikesReceived(userId: string) {
    const likes = await prisma.like.findMany({
      where: { toUserId: userId },
      include: {
        fromUser: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            bio: true,
            location: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return likes;
  }
}

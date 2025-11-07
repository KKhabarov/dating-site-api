import prisma from '../config/database';
import { NotFoundError } from '../utils/errors';

export class MessageService {
  static async getConversations(userId: string) {
    // Get all messages where user is sender or receiver
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ fromUserId: userId }, { toUserId: userId }],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        toUser: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    // Group by conversation partner
    const conversationsMap = new Map<string, {
      user: { id: string; name: string; avatar: string | null };
      lastMessage: typeof messages[0];
      unreadCount: number;
    }>();

    messages.forEach((message: typeof messages[0]) => {
      const partnerId = message.fromUserId === userId ? message.toUserId : message.fromUserId;
      const partner =
        message.fromUserId === userId ? message.toUser : message.fromUser;

      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          user: partner,
          lastMessage: message,
          unreadCount: 0,
        });
      }

      // Count unread messages
      if (message.toUserId === userId && !message.read) {
        const conv = conversationsMap.get(partnerId);
        if (conv) {
          conv.unreadCount += 1;
        }
      }
    });

    return Array.from(conversationsMap.values());
  }

  static async getConversation(userId: string, otherUserId: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: {
          OR: [
            { fromUserId: userId, toUserId: otherUserId },
            { fromUserId: otherUserId, toUserId: userId },
          ],
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          fromUser: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      }),
      prisma.message.count({
        where: {
          OR: [
            { fromUserId: userId, toUserId: otherUserId },
            { fromUserId: otherUserId, toUserId: userId },
          ],
        },
      }),
    ]);

    return {
      messages: messages.reverse(),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async sendMessage(fromUserId: string, toUserId: string, content: string) {
    // Check if recipient exists
    const toUser = await prisma.user.findUnique({ where: { id: toUserId } });
    if (!toUser) {
      throw new NotFoundError('Recipient not found');
    }

    const message = await prisma.message.create({
      data: {
        fromUserId,
        toUserId,
        content,
        read: false,
      },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return message;
  }

  static async markAsRead(messageId: string, userId: string) {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundError('Message not found');
    }

    // Only recipient can mark as read
    if (message.toUserId !== userId) {
      throw new NotFoundError('Message not found');
    }

    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { read: true },
    });

    return updatedMessage;
  }
}

import prisma from '../config/database';
import { NotFoundError, ValidationError, ForbiddenError } from '../utils/errors';

export class ConnectionService {
  static async getConnections(userId: string, status?: string) {
    const where: {
      OR: Array<{ fromUserId: string } | { toUserId: string }>;
      status?: string;
    } = {
      OR: [{ fromUserId: userId }, { toUserId: userId }],
    };

    if (status) {
      where.status = status;
    }

    const connections = await prisma.connection.findMany({
      where,
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

    return connections;
  }

  static async sendConnectionRequest(fromUserId: string, toUserId: string) {
    if (fromUserId === toUserId) {
      throw new ValidationError('Cannot connect with yourself');
    }

    // Check if user exists
    const toUser = await prisma.user.findUnique({ where: { id: toUserId } });
    if (!toUser) {
      throw new NotFoundError('User not found');
    }

    // Check if connection already exists
    const existingConnection = await prisma.connection.findFirst({
      where: {
        OR: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      },
    });

    if (existingConnection) {
      throw new ValidationError('Connection request already exists');
    }

    const connection = await prisma.connection.create({
      data: {
        fromUserId,
        toUserId,
        status: 'PENDING',
      },
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
    });

    return connection;
  }

  static async updateConnectionStatus(
    connectionId: string,
    userId: string,
    status: 'ACCEPTED' | 'DECLINED'
  ) {
    const connection = await prisma.connection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      throw new NotFoundError('Connection not found');
    }

    // Only the recipient can accept/decline
    if (connection.toUserId !== userId) {
      throw new ForbiddenError('You can only update connections sent to you');
    }

    const updatedConnection = await prisma.connection.update({
      where: { id: connectionId },
      data: { status },
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
    });

    return updatedConnection;
  }

  static async deleteConnection(connectionId: string, userId: string) {
    const connection = await prisma.connection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      throw new NotFoundError('Connection not found');
    }

    // Only participants can delete
    if (connection.fromUserId !== userId && connection.toUserId !== userId) {
      throw new ForbiddenError('You can only delete your own connections');
    }

    await prisma.connection.delete({
      where: { id: connectionId },
    });

    return { message: 'Connection deleted successfully' };
  }
}

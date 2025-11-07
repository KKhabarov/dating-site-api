import prisma from '../config/database';
import { NotFoundError } from '../utils/errors';

export class UserService {
  static async getUsers(
    page = 1,
    limit = 20,
    interests?: string[],
    skills?: string[]
  ) {
    const skip = (page - 1) * limit;

    const where: {
      interests?: { hasSome: string[] };
      skills?: { hasSome: string[] };
    } = {};
    if (interests && interests.length > 0) {
      where.interests = { hasSome: interests };
    }
    if (skills && skills.length > 0) {
      where.skills = { hasSome: skills };
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          bio: true,
          location: true,
          interests: true,
          skills: true,
          goals: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        location: true,
        interests: true,
        skills: true,
        goals: true,
        createdAt: true,
        updatedAt: true,
        photos: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  static async updateUser(userId: string, data: Partial<{
    name: string;
    avatar: string;
    bio: string;
    location: string;
    interests: string[];
    skills: string[];
    goals: string;
  }>) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        location: true,
        interests: true,
        skills: true,
        goals: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  static async searchUsers(query: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const where = {
      OR: [
        { name: { contains: query, mode: 'insensitive' as const } },
        { bio: { contains: query, mode: 'insensitive' as const } },
        { goals: { contains: query, mode: 'insensitive' as const } },
      ],
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          bio: true,
          location: true,
          interests: true,
          skills: true,
          goals: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

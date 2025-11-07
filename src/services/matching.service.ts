import prisma from '../config/database';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  interests: string[];
  skills: string[];
  goals: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface MatchScore {
  userId: string;
  score: number;
  user: UserProfile;
}

export class MatchingService {
  static async getSuggestedMatches(currentUserId: string, limit = 10) {
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: {
        interests: true,
        skills: true,
        location: true,
      },
    });

    if (!currentUser) {
      return [];
    }

    // Get all users except current user
    const allUsers = await prisma.user.findMany({
      where: {
        id: { not: currentUserId },
      },
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

    // Calculate match scores
    const matchScores: MatchScore[] = allUsers.map((user: UserProfile) => {
      let score = 0;

      // Shared interests: 10 points each
      const sharedInterests = user.interests.filter((interest: string) =>
        currentUser.interests.includes(interest)
      );
      score += sharedInterests.length * 10;

      // Shared skills: 15 points each
      const sharedSkills = user.skills.filter((skill: string) => currentUser.skills.includes(skill));
      score += sharedSkills.length * 15;

      // Location match: 5 points
      if (user.location && currentUser.location && user.location === currentUser.location) {
        score += 5;
      }

      return {
        userId: user.id,
        score,
        user,
      };
    });

    // Sort by score descending and return top matches
    return matchScores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((match) => ({
        ...match.user,
        matchScore: match.score,
      }));
  }
}

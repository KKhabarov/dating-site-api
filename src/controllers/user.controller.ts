import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { MatchingService } from '../services/matching.service';

export class UserController {
  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const interests = req.query.interests
        ? (req.query.interests as string).split(',')
        : undefined;
      const skills = req.query.skills ? (req.query.skills as string).split(',') : undefined;

      const result = await UserService.getUsers(page, limit, interests, skills);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);

      res.status(200).json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const user = await UserService.updateUser(userId, req.body);

      res.status(200).json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMatches(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const limit = parseInt(req.query.limit as string) || 10;
      const matches = await MatchingService.getSuggestedMatches(userId, limit);

      res.status(200).json({
        status: 'success',
        data: { matches },
      });
    } catch (error) {
      next(error);
    }
  }

  static async searchUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query.q as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      if (!query) {
        res.status(400).json({
          status: 'error',
          message: 'Search query is required',
        });
        return;
      }

      const result = await UserService.searchUsers(query, page, limit);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

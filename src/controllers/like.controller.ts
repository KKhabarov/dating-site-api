import { Request, Response, NextFunction } from 'express';
import { LikeService } from '../services/like.service';

export class LikeController {
  static async likeUser(req: Request, res: Response, next: NextFunction) {
    try {
      const fromUserId = req.user!.userId;
      const { userId: toUserId } = req.params;

      const like = await LikeService.likeUser(fromUserId, toUserId);

      res.status(201).json({
        status: 'success',
        data: { like },
      });
    } catch (error) {
      next(error);
    }
  }

  static async unlikeUser(req: Request, res: Response, next: NextFunction) {
    try {
      const fromUserId = req.user!.userId;
      const { userId: toUserId } = req.params;

      const result = await LikeService.unlikeUser(fromUserId, toUserId);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getLikesGiven(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const likes = await LikeService.getLikesGiven(userId);

      res.status(200).json({
        status: 'success',
        data: { likes },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getLikesReceived(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const likes = await LikeService.getLikesReceived(userId);

      res.status(200).json({
        status: 'success',
        data: { likes },
      });
    } catch (error) {
      next(error);
    }
  }
}

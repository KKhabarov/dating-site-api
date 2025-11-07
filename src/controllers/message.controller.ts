import { Request, Response, NextFunction } from 'express';
import { MessageService } from '../services/message.service';

export class MessageController {
  static async getConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const conversations = await MessageService.getConversations(userId);

      res.status(200).json({
        status: 'success',
        data: { conversations },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { userId: otherUserId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const result = await MessageService.getConversation(userId, otherUserId, page, limit);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const fromUserId = req.user!.userId;
      const { userId: toUserId } = req.params;
      const { content } = req.body;

      const message = await MessageService.sendMessage(fromUserId, toUserId, content);

      res.status(201).json({
        status: 'success',
        data: { message },
      });
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const message = await MessageService.markAsRead(id, userId);

      res.status(200).json({
        status: 'success',
        data: { message },
      });
    } catch (error) {
      next(error);
    }
  }
}

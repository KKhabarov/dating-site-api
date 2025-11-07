import { Request, Response, NextFunction } from 'express';
import { ConnectionService } from '../services/connection.service';

export class ConnectionController {
  static async getConnections(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const status = req.query.status as string | undefined;

      const connections = await ConnectionService.getConnections(userId, status);

      res.status(200).json({
        status: 'success',
        data: { connections },
      });
    } catch (error) {
      next(error);
    }
  }

  static async sendConnectionRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const fromUserId = req.user!.userId;
      const { toUserId } = req.body;

      const connection = await ConnectionService.sendConnectionRequest(fromUserId, toUserId);

      res.status(201).json({
        status: 'success',
        data: { connection },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateConnection(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const { status } = req.body;

      const connection = await ConnectionService.updateConnectionStatus(id, userId, status);

      res.status(200).json({
        status: 'success',
        data: { connection },
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteConnection(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const result = await ConnectionService.deleteConnection(id, userId);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

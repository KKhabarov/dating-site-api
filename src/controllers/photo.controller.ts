import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { NotFoundError, ForbiddenError } from '../utils/errors';

export class PhotoController {
  static async uploadPhoto(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { url, filename } = req.body;

      // Get the current max order for user's photos
      const maxOrderPhoto = await prisma.photo.findFirst({
        where: { userId },
        orderBy: { order: 'desc' },
      });

      const order = maxOrderPhoto ? maxOrderPhoto.order + 1 : 0;

      const photo = await prisma.photo.create({
        data: {
          userId,
          url,
          filename,
          order,
        },
      });

      res.status(201).json({
        status: 'success',
        data: { photo },
      });
    } catch (error) {
      next(error);
    }
  }

  static async deletePhoto(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const photo = await prisma.photo.findUnique({
        where: { id },
      });

      if (!photo) {
        throw new NotFoundError('Photo not found');
      }

      if (photo.userId !== userId) {
        throw new ForbiddenError('You can only delete your own photos');
      }

      await prisma.photo.delete({
        where: { id },
      });

      res.status(200).json({
        status: 'success',
        message: 'Photo deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async reorderPhotos(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { photoIds } = req.body;

      // Verify all photos belong to the user
      const photos = await prisma.photo.findMany({
        where: {
          id: { in: photoIds },
          userId,
        },
      });

      if (photos.length !== photoIds.length) {
        throw new NotFoundError('Some photos not found or do not belong to you');
      }

      // Update order for each photo
      await Promise.all(
        photoIds.map((photoId: string, index: number) =>
          prisma.photo.update({
            where: { id: photoId },
            data: { order: index },
          })
        )
      );

      const updatedPhotos = await prisma.photo.findMany({
        where: { userId },
        orderBy: { order: 'asc' },
      });

      res.status(200).json({
        status: 'success',
        data: { photos: updatedPhotos },
      });
    } catch (error) {
      next(error);
    }
  }
}

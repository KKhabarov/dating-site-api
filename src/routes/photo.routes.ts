import { Router } from 'express';
import { PhotoController } from '../controllers/photo.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { photoSchema, reorderPhotosSchema } from '../utils/validators';

const router = Router();

router.use(authenticate);

router.post('/', validate(photoSchema), PhotoController.uploadPhoto);
router.delete('/:id', PhotoController.deletePhoto);
router.put('/reorder', validate(reorderPhotosSchema), PhotoController.reorderPhotos);

export default router;

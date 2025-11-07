import { Router } from 'express';
import { LikeController } from '../controllers/like.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/:userId', LikeController.likeUser);
router.delete('/:userId', LikeController.unlikeUser);
router.get('/given', LikeController.getLikesGiven);
router.get('/received', LikeController.getLikesReceived);

export default router;

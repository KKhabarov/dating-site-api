import { Router } from 'express';
import { MessageController } from '../controllers/message.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { messageSchema } from '../utils/validators';

const router = Router();

router.use(authenticate);

router.get('/conversations', MessageController.getConversations);
router.get('/:userId', MessageController.getConversation);
router.post('/:userId', validate(messageSchema), MessageController.sendMessage);
router.put('/:id/read', MessageController.markAsRead);

export default router;

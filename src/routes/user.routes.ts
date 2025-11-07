import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { updateUserSchema } from '../utils/validators';

const router = Router();

router.use(authenticate);

router.get('/', UserController.getUsers);
router.get('/matches', UserController.getMatches);
router.get('/search', UserController.searchUsers);
router.get('/:id', UserController.getUserById);
router.put('/me', validate(updateUserSchema), UserController.updateProfile);

export default router;

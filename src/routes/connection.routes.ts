import { Router } from 'express';
import { ConnectionController } from '../controllers/connection.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { connectionSchema, updateConnectionSchema } from '../utils/validators';

const router = Router();

router.use(authenticate);

router.get('/', ConnectionController.getConnections);
router.post('/', validate(connectionSchema), ConnectionController.sendConnectionRequest);
router.put('/:id', validate(updateConnectionSchema), ConnectionController.updateConnection);
router.delete('/:id', ConnectionController.deleteConnection);

export default router;

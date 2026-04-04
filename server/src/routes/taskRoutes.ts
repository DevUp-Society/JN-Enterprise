import { Router } from 'express';
import { getTasks, completeTask } from '../controllers/taskController';
import { verifyToken } from '../middleware/authMiddleware';
import { validateRequest, taskCompleteSchema } from '../middleware/validate';

const router = Router();

// Task management access for all workforce members
router.get('/', verifyToken, getTasks);
router.patch('/:id/complete', verifyToken, validateRequest(taskCompleteSchema), completeTask);

export default router;

import { Router } from 'express';
import { getWorkforce, createPersonnel, deactivatePersonnel } from '../controllers/userController';
import { verifyToken, isAdmin } from '../middleware/authMiddleware';

const router = Router();

router.get('/workforce', verifyToken, isAdmin, getWorkforce);
router.post('/enroll', verifyToken, isAdmin, createPersonnel);
router.patch('/deactivate/:id', verifyToken, isAdmin, deactivatePersonnel);

export default router;

import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { verifyToken, isAdmin } from '../middleware/authMiddleware';

const router = Router();

// Stats are typically for Admin/Manager oversight
router.get('/stats', verifyToken, isAdmin, getDashboardStats);

export default router;

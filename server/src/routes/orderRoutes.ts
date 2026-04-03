import { Router } from 'express';
import { getOrders, updateOrderStatus } from '../controllers/orderController';
import { verifyToken, isAdmin } from '../middleware/authMiddleware';

const router = Router();

// Universal Order Registry
router.get('/', verifyToken, getOrders);

// Worker Specific Scoping (Fulfillment Buffer)
router.get('/worker', verifyToken, getOrders); 

// Status Transition Lifecycle
router.patch('/:id/status', verifyToken, updateOrderStatus);

export default router;

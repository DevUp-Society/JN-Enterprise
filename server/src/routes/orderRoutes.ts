import { Router } from 'express';
import { getOrders, updateOrderStatus, createOrder, procurementSchema } from '../controllers/orderController';
import { verifyToken, isAdmin } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validate';

const router = Router();

// Universal Order Registry
router.get('/', verifyToken, getOrders);
router.post('/', verifyToken, validateRequest(procurementSchema), createOrder);

// Worker Specific Scoping (Fulfillment Buffer)
router.get('/worker', verifyToken, getOrders); 

// Status Transition Lifecycle
router.patch('/:id/status', verifyToken, updateOrderStatus);

export default router;

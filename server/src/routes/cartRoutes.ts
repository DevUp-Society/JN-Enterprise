import { Router } from 'express';
import { getCart, addToCart, updateCartQuantity, removeFromCart, clearCart } from '../controllers/cartController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.use(verifyToken);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartQuantity);
router.delete('/:productId', removeFromCart);
router.delete('/', clearCart);

export default router;

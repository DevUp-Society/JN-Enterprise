import { Router } from 'express';
import { getProducts, updateProduct } from '../controllers/productController';
import { verifyToken, isAdmin } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getProducts);
router.patch('/:id', verifyToken, isAdmin, updateProduct);

export default router;

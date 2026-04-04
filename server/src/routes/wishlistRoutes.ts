import { Router } from 'express';
import { getWishlist, toggleWishlist } from '../controllers/wishlistController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.use(verifyToken);

router.get('/', getWishlist);
router.post('/toggle', toggleWishlist);

export default router;

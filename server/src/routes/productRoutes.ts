import { Router } from 'express';
import { 
  getProducts, 
  getProductById,
  updateProduct, 
  createProduct, 
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories
} from '../controllers/productController';
import { verifyToken, isAdmin } from '../middleware/authMiddleware';
import { validateRequest, productSchema } from '../middleware/validate';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

// Admin Category Management
router.post('/categories', verifyToken, isAdmin, createCategory);
router.patch('/categories/:id', verifyToken, isAdmin, updateCategory);
router.delete('/categories/:id', verifyToken, isAdmin, deleteCategory);
router.put('/categories/reorder', verifyToken, isAdmin, reorderCategories);

router.post('/', verifyToken, isAdmin, upload.single('image'), validateRequest(productSchema), createProduct);
router.patch('/:id', verifyToken, isAdmin, validateRequest(productSchema), updateProduct);

export default router;

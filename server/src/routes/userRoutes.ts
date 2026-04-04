import { Router } from 'express';
import { getUsers, createUser, updateUserPermissions, deleteUser } from '../controllers/userController';
import { verifyToken, isAdmin } from '../middleware/authMiddleware';

const router = Router();

router.get('/', verifyToken, isAdmin, getUsers);
router.post('/create', verifyToken, isAdmin, createUser);
router.patch('/permissions/:userId', verifyToken, isAdmin, updateUserPermissions);
router.delete('/:id', verifyToken, isAdmin, deleteUser);

export default router;

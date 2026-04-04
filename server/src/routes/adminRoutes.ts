import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken, isAdmin } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

router.get('/stats', verifyToken, isAdmin, async (req: Request, res: Response) => {
  try {
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();

    res.status(200).json({
      users: userCount,
      products: productCount,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

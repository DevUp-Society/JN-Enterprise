import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient() as any;

export const getWishlist = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  try {
    const items = await (prisma as any).wishlistItem.findMany({
      where: { userId },
      include: { product: true },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
};

export const toggleWishlist = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { productId } = req.body;

  try {
    const existing = await (prisma as any).wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      await (prisma as any).wishlistItem.delete({
        where: {
          userId_productId: { userId, productId },
        },
      });
      res.json({ message: 'Removed from wishlist', isAdded: false });
    } else {
      await (prisma as any).wishlistItem.create({
        data: { userId, productId },
      });
      res.json({ message: 'Added to wishlist', isAdded: true });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error toggling wishlist' });
  }
};

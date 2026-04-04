import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient() as any;

/**
 * @desc Get the primary stored cart for the user
 */
export const getCart = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  try {
    const cart = await prisma.storedCart.findUnique({
      where: { userId_name: { userId, name: 'Cart' } },
      include: { items: { include: { product: true } } },
    });
    
    if (!cart) return res.json([]);
    
    // Transform to match current frontend expectations
    const transformed = cart.items.map((item: any) => ({
      ...item,
      productId: item.productId,
      quantity: item.quantity,
      product: item.product
    }));
    
    res.json(transformed);
  } catch (error) {
    console.error('FETCH_CART_FAILURE:', error);
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { productId, quantity = 1 } = req.body;

  try {
    // 1. Ensure User has 'Cart'
    const cart = await prisma.storedCart.upsert({
      where: { userId_name: { userId, name: 'Cart' } },
      update: {},
      create: { userId, name: 'Cart' }
    });

    // 2. Upsert Item in 'Cart' using unique constraint [cartId, productId]
    const cartItem = await prisma.storedCartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      update: { quantity: { increment: quantity } },
      create: { cartId: cart.id, productId, quantity }
    });
    
    res.json(cartItem);
  } catch (error) {
    console.error('ADD_TO_CART_FAILURE:', error);
    res.status(500).json({ message: 'Error adding to cart' });
  }
};

export const updateCartQuantity = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { productId, quantity } = req.body;

  try {
    const cart = await prisma.storedCart.findUnique({
      where: { userId_name: { userId, name: 'Cart' } }
    });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const cartItem = await prisma.storedCartItem.update({
      where: { cartId_productId: { cartId: cart.id, productId } },
      data: { quantity },
    });
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating quantity' });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { productId } = req.params;

  try {
    const cart = await prisma.storedCart.findUnique({
      where: { userId_name: { userId, name: 'Cart' } }
    });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    await prisma.storedCartItem.delete({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from cart' });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  try {
    const cart = await prisma.storedCart.findUnique({
      where: { userId_name: { userId, name: 'Cart' } }
    });
    if (cart) {
      await prisma.storedCartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart' });
  }
};

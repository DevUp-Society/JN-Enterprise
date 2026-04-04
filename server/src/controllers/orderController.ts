import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { z } from 'zod';

/**
 * @desc    Validate Add to Procurement Request
 */
export const procurementSchema = z.object({
  body: z.object({
    companyId: z.string().uuid(),
    items: z.array(z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive(),
      pricePaid: z.number().positive(),
    })).min(1, 'At least one industrial unit must be specified.'),
  }),
});

/**
 * @desc    Add items to procurement (Create Order with Atomicity)
 * @route   POST /api/orders
 * @access  Private (Retailer)
 */
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyId, items } = req.body as { companyId: string, items: any[] };

    // Task 3: Prisma Transaction for fulfilling procurement request
    const result = await prisma.$transaction(async (tx) => {
      // 1. Calculate Total Value
      const totalValue = items.reduce((acc: number, item: any) => acc + (item.pricePaid * item.quantity), 0);

      // 2. Create the Order entry
      const order = await (tx as any).order.create({
        data: {
          company: { connect: { id: companyId } },
          user: { connect: { id: (req as any).user?.id } },
          totalValue,
          status: 'PENDING',
          managerName: req.body.managerName || null,
          hubIdentifier: req.body.hubIdentifier || null,
          shippingAddress: req.body.shippingAddress || null,
          contactPhone: req.body.contactPhone || null,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              pricePaid: item.pricePaid,
            })),
          },
        },
        include: { items: true },
      });

      // 3. Atomically update inventory and log fulfillment
      for (const item of items) {
        const product = await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: { decrement: item.quantity },
            version: { increment: 1 }, // Atomic version increment for optimistic locking if needed
          },
        });

        // 4. Verification Check: fulfillment safety
        if (product.stockQuantity < 0) {
          throw new Error(`INSUFFICIENT_INVENTORY: Node ${product.sku} exhausted.`);
        }

        // 5. Create Inventory Log
        await tx.inventoryLog.create({
          data: {
            productId: item.productId,
            type: 'STOCK_OUT',
            quantity: item.quantity,
            reason: `PROCUREMENT_ORDER_${order.id}`,
          },
        });
      }

      // 6. Audit Log
      await tx.auditLog.create({
        data: {
          action: 'PROCUREMENT_FULFILLED',
          userId: (req as any).user?.id || 'SYSTEM',
          details: { orderId: order.id, companyId, totalValue },
        },
      });

      return order;
    });

    res.status(201).json({
      status: 'SUCCESS',
      message: 'Procurement transaction finalized and inventory synchronized.',
      order: result,
    });
  } catch (error: any) {
    console.error('PROCUREMENT_ENGINE_FAILURE:', error);
    if (error.message.includes('INSUFFICIENT_INVENTORY')) {
      return res.status(409).json({
        status: 'ERROR',
        message: 'COLLISION_DETECTED: Industrial inventory exhausted during procurement phase.',
      });
    }
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to synchronize procurement transaction with global ledger.',
    });
  }
};

/**
 * @desc    Fetch industrial orders with filtering
 * @route   GET /api/orders
 */
export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, companyId } = req.query as { status?: string, companyId?: string };
    
    const where: any = {};
    if (status && status !== 'ALL') where.status = status;
    if (companyId) where.companyId = companyId;

    const orders = await prisma.order.findMany({
      where,
      include: {
        company: true,
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      status: 'SUCCESS',
      results: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await (prisma as any).order.update({
      where: { id: id as string },
      data: { status, updatedAt: new Date() },
    });

    res.status(200).json({
      status: 'SUCCESS',
      order: updated,
    });
  } catch (error) {
    next(error);
  }
};

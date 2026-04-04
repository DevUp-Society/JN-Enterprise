import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

/**
 * @desc    Fetch all tasks with relations for Task Management
 * @route   GET /api/tasks
 * @access  Private (Admin/Manager/Worker)
 */
export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    res.status(200).json({
      status: 'SUCCESS',
      results: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error('Error fetching Tasks:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to retrieve control tower task list.',
    });
  }
};

/**
 * @desc    Atomic Task Completion: Updates status, decrements stock, and creates inventory log
 * @route   PATCH /api/tasks/:id/complete
 * @access  Private (Worker/Admin/Manager)
 */
export const completeTask = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Precise Retrieval Protocol with Version State
      const task = await tx.task.findUnique({
        where: { id: id as string },
        include: { product: true },
      });

      if (!task) throw new Error('TASK_NOT_FOUND');
      if (task.status === 'COMPLETED') throw new Error('TASK_ALREADY_COMPLETED');

      // 2. Inventory Decrement - Pessimistic Lock Protocol
       // We use raw SQL to acquire a FOR UPDATE lock on the product row
       const products = await tx.$queryRaw<any[]>`
         SELECT "id", "version", "stockQuantity" FROM "Product" 
         WHERE "id" = ${task.productId} 
         FOR UPDATE
       `;
       
       const dbProduct = products[0];
       
       console.log(`[LOCK_PROTOCOL] LOCK_ACQUIRED: PRODUCT=${task.productId} | DB_VERSION=${dbProduct?.version} | REQ_VERSION=${task.product.version}`);

       if (!dbProduct || dbProduct.version !== task.product.version) {
         throw new Error('CONCURRENCY_PROTOCOL_CONFLICT');
       }

       if (dbProduct.stockQuantity <= 0) {
         throw new Error('INSUFFICIENT_STOCK_FAILURE');
       }

       const updatedProduct = await tx.product.update({
         where: { id: task.productId },
         data: { 
           stockQuantity: { decrement: 1 },
           version: { increment: 1 } 
         },
       });

      // 3. Status Transition
      const updatedTask = await tx.task.update({
        where: { id: task.id },
        data: { status: 'COMPLETED' },
      });

      // 4. Audit Log Persistence
      await tx.inventoryLog.create({
        data: {
          productId: task.productId,
          taskId: task.id,
          type: 'STOCK_OUT',
          quantity: 1,
          reason: `Industrial Fulfillment Order : Task_${task.id.split('-')[0].toUpperCase()}`,
        },
      });

      // 5. Industrial Audit Protocol
      await tx.auditLog.create({
        data: {
          action: 'STOCK_UPDATE',
          userId: (req as any).user.id,
          details: {
            taskId: task.id,
            productId: task.productId,
            previousVersion: dbProduct.version,
            newVersion: updatedProduct.version
          }
        }
      });

      return { updatedTask, updatedProduct };
    });

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Atomic fulfillment protocol confirmed. Optimistic lock synchronized.',
      data: result,
    });
  } catch (error: any) {
    console.error('CRITICAL_TRANSACTION_FAILURE:', error.message);
    
    let statusCode = 500;
    let fallbackMessage = 'Operational failure in fulfillment transaction. System rolled back.';

    if (error.message === 'CONCURRENCY_PROTOCOL_CONFLICT') {
       statusCode = 409;
       fallbackMessage = 'CONCURRENCY_PROTOCOL_CONFLICT: Asset state was modified by another terminal. Retry fulfillment.';
       
       // Async Audit of Conflict detection
       prisma.auditLog.create({
         data: {
           action: 'CONFLICT_DETECTED',
           userId: (req as any).user?.id || 'SYSTEM',
           details: { taskId: id, protocol: 'PESSIMISTIC_V1' }
         }
       }).catch(e => console.error('AUDIT_FAIL:', e));

    } else if (error.code === 'P2025') {
       statusCode = 404;
       fallbackMessage = 'Specified operational resource not found in the registry.';
    } else if (error.message === 'INSUFFICIENT_STOCK_FAILURE') {
       statusCode = 400;
       fallbackMessage = 'Inventory critical: Insufficient stock to complete task fulfillment.';
    } else if (error.message === 'TASK_NOT_FOUND') {
       statusCode = 404;
       fallbackMessage = 'Specified operational task not found in the registry.';
    }

    console.log(`[CHAOS_FAIL] STATUS=${statusCode} | MESSAGE=${fallbackMessage}`);

    res.status(statusCode).json({
      status: 'ERROR',
      message: fallbackMessage,
    });
  }
};

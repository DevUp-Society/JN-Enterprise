import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

/**
 * @desc    Fetch summary stats for the Control Tower Dashboard
 * @route   GET /api/dashboard/stats
 * @access  Private (Admin/Manager)
 */
export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allProducts = await (prisma as any).product.findMany({
      select: {
        stockQuantity: true,
        minThreshold: true,
      },
    });
    
    const totalProducts = allProducts.length;
    const lowStockCount = allProducts.filter((p: any) => p.stockQuantity <= p.minThreshold).length;

    const activeTasks = await (prisma as any).task.count({
      where: {
        status: {
          in: ['PENDING', 'IN_PROGRESS'],
        },
      },
    });

    const totalWorkers = await (prisma as any).user.count({
      where: {
        role: 'WORKER',
      },
    });

    res.status(200).json({
      status: 'SUCCESS',
      stats: {
        totalProducts,
        lowStockCount,
        activeTasks,
        totalWorkers,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to retrieve control tower statistics.',
    });
  }
};

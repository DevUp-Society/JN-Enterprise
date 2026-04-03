import { Request, Response, NextFunction } from 'express';

// For now, using a simple in-memory simulation since we don't have an order.json yet
// In a real production app, this would use Prisma or fs.readFileSync

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, worker } = req.query;
    
    // Simulating database/file retrieval
    const orders = [
      { id: "ORD-9901", retailer: "Nordic Goods Co.", itemsCount: 15, value: 42500, status: "PENDING", worker: "Unassigned", items: [{ sku: "SKU-101", name: "Arctic Parka", qty: 15 }] },
      { id: "ORD-9902", retailer: "Urban Thread Collective", itemsCount: 120, value: 12400, status: "PROCESSING", worker: "Michael Vance", items: [{ sku: "SKU-902", name: "Premium Tee", qty: 120 }] },
      { id: "ORD-9903", retailer: "Apex Logistics", itemsCount: 3200, value: 642000, status: "PACKED", worker: "Sarah Chen", items: [{ sku: "SKU-888", name: "Industrial Cargo", qty: 3200 }] },
      { id: "ORD-9904", retailer: "Metropolis Boutique", itemsCount: 80, value: 8500, status: "SHIPPED", worker: "Michael Vance", items: [{ sku: "SKU-501", name: "City Chino", qty: 80 }] },
      { id: "ORD-9905", retailer: "Nordic Goods Co.", itemsCount: 50, value: 5000, status: "PENDING", worker: "Unassigned", items: [{ sku: "SKU-102", name: "Utility Layer", qty: 50 }] },
    ];

    let filtered = orders;
    if (status && status !== 'ALL') filtered = filtered.filter(o => o.status === status);
    if (worker) filtered = filtered.filter(o => o.worker === worker);

    res.status(200).json({
      status: 'SUCCESS',
      results: filtered.length,
      orders: filtered
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, workerId } = req.body;

    // In a real production system: 
    // const order = await prisma.order.update({ where: { id }, data: { status, updatedAt: new Date() } });
    // await prisma.auditLog.create({ data: { type: 'STATUS_CHANGE', entityId: id, userId: workerId, metadata: { to: status } } });

    console.log(`[AUDIT] Order ${id} status changed to ${status} by Worker ${workerId || 'SYSTEM'}`);

    res.status(200).json({
      status: 'SUCCESS',
      orderId: id,
      newStatus: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

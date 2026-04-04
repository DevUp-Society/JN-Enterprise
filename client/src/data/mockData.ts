// Phase 8: Centralized Mock Data Registry

export const RETAILERS_MOCK = [
  { 
    id: "RT-801", 
    name: "Urban Thread Collective", 
    location: "New York, USA", 
    lastOrder: "2024-03-28", 
    totalItems: 420, 
    lifetimeRevenue: 84500, 
    orders: [
      { sku: "SKU-902", name: "Premium Cotton Tee", qty: 200 }, 
      { sku: "SKU-402", name: "Slate Woven Textile", qty: 220 }
    ] 
  },
  { 
    id: "RT-922", 
    name: "Nordic Goods Co.", 
    location: "Oslo, Norway", 
    lastOrder: "2024-04-02", 
    totalItems: 1540, 
    lifetimeRevenue: 245000, 
    orders: [
      { sku: "SKU-101", name: "Arctic Parka Shell", qty: 540 }, 
      { sku: "SKU-102", name: "Thermal Utility Layer", qty: 1000 }
    ] 
  },
  { 
    id: "RT-143", 
    name: "Metropolis Boutique", 
    location: "London, UK", 
    lastOrder: "2024-03-15", 
    totalItems: 120, 
    lifetimeRevenue: 12400, 
    orders: [
      { sku: "SKU-501", name: "City Chino Slim", qty: 120 }
    ] 
  },
  { 
    id: "RT-556", 
    name: "Apex Logistics", 
    location: "Dubai, UAE", 
    lastOrder: "2024-04-01", 
    totalItems: 3200, 
    lifetimeRevenue: 642000, 
    orders: [
      { sku: "SKU-888", name: "Industrial Cargo Unit", qty: 3200 }
    ] 
  }
];

export const WORKERS_MOCK = [
  { id: "W-01", name: "Michael Vance", email: "m.vance@jn.com", dept: "Logistics", role: "WORKER", lastLogin: "2h ago", status: "ACTIVE" },
  { id: "W-02", name: "Sarah Chen", email: "s.chen@jn.com", dept: "Warehousing", role: "WORKER", lastLogin: "5m ago", status: "ACTIVE" },
  { id: "W-03", name: "David Miller", email: "d.miller@jn.com", dept: "Quality Control", role: "WORKER", lastLogin: "Yesterday", status: "DEACTIVATED" },
  { id: "A-01", name: "Admin Manager", email: "admin@jn.com", dept: "Management", role: "ADMIN", lastLogin: "Now", status: "ACTIVE" },
];

export const ORDERS_MOCK = [
  { 
    id: "ORD-9901", 
    retailer: "Nordic Goods Co.", 
    itemsCount: 15, 
    value: 42500, 
    status: "PENDING", 
    worker: "Unassigned", 
    items: [{ sku: "SKU-101", name: "Arctic Parka", qty: 15 }] 
  },
  { 
    id: "ORD-9902", 
    retailer: "Urban Thread Collective", 
    itemsCount: 120, 
    value: 12400, 
    status: "PROCESSING", 
    worker: "Michael Vance", 
    items: [{ sku: "SKU-902", name: "Premium Tee", qty: 120 }] 
  },
  { 
    id: "ORD-9903", 
    retailer: "Apex Logistics", 
    itemsCount: 3200, 
    value: 642000, 
    status: "PACKED", 
    worker: "Sarah Chen", 
    items: [{ sku: "SKU-888", name: "Industrial Cargo", qty: 3200 }] 
  },
  { 
    id: "ORD-9904", 
    retailer: "Metropolis Boutique", 
    itemsCount: 80, 
    value: 8500, 
    status: "SHIPPED", 
    worker: "Michael Vance", 
    items: [{ sku: "SKU-501", name: "City Chino", qty: 80 }] 
  },
  { 
    id: "ORD-9905", 
    retailer: "Nordic Goods Co.", 
    itemsCount: 50, 
    value: 5000, 
    status: "PENDING", 
    worker: "Unassigned", 
    items: [{ sku: "SKU-102", name: "Utility Layer", qty: 50 }] 
  },
];











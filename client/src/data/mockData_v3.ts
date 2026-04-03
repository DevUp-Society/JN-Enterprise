// JN Enterprise v3.0 - Master Data Registry
// Industrial Command Stress Test Data (100+ Products, 50+ Orders, 20+ Retailers)

export const CATEGORIES = ["Textiles", "Electronics", "Plastic Goods", "General Bazaar"];
export const ORDER_STATUSES = ["PENDING", "PROCESSING", "PACKED", "SHIPPED", "DELIVERED"];

// 1. Generate 100+ Products
export const PRODUCTS_V3 = Array.from({ length: 110 }).map((_, i) => {
  const category = CATEGORIES[i % CATEGORIES.length];
  const idNum = (i + 1).toString().padStart(3, '0');
  let sku = "";
  let name = "";
  
  if (category === "Textiles") {
    sku = `JN-TX-${idNum}`;
    name = ["Silk Blend Saree", "Cotton Drill Webbing", "Denim Roll 50m", "Linen Drapery", "Woven Label Pack"][i % 5];
  } else if (category === "Electronics") {
    sku = `JN-EL-${idNum}`;
    name = ["LED Driver Unit", "SMD Capacitor Tray", "Power Relays", "Control Switch Board", "Heat Sink Fin"][i % 5];
  } else if (category === "Plastic Goods") {
    sku = `JN-PL-${idNum}`;
    name = ["Storage Bin (Blue)", "Polymer Pellets", "Nylon Mesh Filter", "PVC Pipe Fitting", "PET Bottle Preform"][i % 5];
  } else {
    sku = `JN-BZ-${idNum}`;
    name = ["Toy Car (Friction)", "Kitchen Tool Set", "Ceramic Soap Dish", "Enamel Pot 2L", "Stationery Kit"][i % 5];
  }

  return {
    id: `PRD-${idNum}`,
    sku,
    name: `${name} ${Math.floor(i / 5) + 1}`,
    category,
    price: Math.floor(Math.random() * 500) + 10,
    stock: Math.floor(Math.random() * 600), // Random stock 0-600
    image: `https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&q=80&w=200`
  };
});

// 2. Generate 20+ Retailers
export const RETAILERS_V3 = Array.from({ length: 22 }).map((_, i) => {
  const names = ["Global Bazaar Co.", "Industrial Hub", "Metro Retail", "Elite Sourcing", "Vance Logistics", "Chen Electronics", "Apex Group"];
  const locations = ["Mumbai, India", "Dubai, UAE", "London, UK", "New York, USA", "Singapore", "Berlin, Germany"];
  
  return {
    id: `RT-${(800 + i)}`,
    name: `${names[i % names.length]} ${Math.floor(i / names.length) + 1}`,
    location: locations[i % locations.length],
    lastOrder: `2024-04-0${(i % 9) + 1}`,
    totalItems: Math.floor(Math.random() * 5000) + 100,
    lifetimeRevenue: Math.floor(Math.random() * 1000000) + 50000,
  };
});

// 3. Generate 50+ Orders
export const ORDERS_V3 = Array.from({ length: 55 }).map((_, i) => {
  const retailer = RETAILERS_V3[i % RETAILERS_V3.length];
  const itemsCount = Math.floor(Math.random() * 200) + 1;
  const status = ORDER_STATUSES[i % ORDER_STATUSES.length];
  const worker = ["Michael Vance", "Sarah Chen", "Ajay Kumar", "Suresh Raini", "Priya Singh"][i % 5];
  
  return {
    id: `ORD-${(9900 + i)}`,
    retailer: retailer.name,
    retailerId: retailer.id,
    itemsCount,
    value: Math.floor(Math.random() * 50000) + 500,
    status,
    worker: status === "PENDING" ? "Unassigned" : worker,
    priority: itemsCount > 150 ? "HIGH" : "NORMAL",
    createdAt: new Date(Date.now() - (Math.floor(Math.random() * 45) * 24 * 60 * 60 * 1000)).toISOString(),
    items: Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, j) => {
      const product = PRODUCTS_V3[(i + j) % PRODUCTS_V3.length];
      return { 
        sku: product.sku, 
        name: product.name, 
        qty: Math.floor(itemsCount / 2) || 1,
        requestedCount: Math.floor(Math.random() * 100) + 10 // For "Pulse" logic
      };
    })
  };
});
// 4. Intelligence Data (v4.0)
export const HEATMAP_DATA = [
  { city: "Hyderabad", demand: 85, color: "#C6AD8F" },
  { city: "Mumbai", demand: 72, color: "#C6AD8F" },
  { city: "Bangalore", demand: 64, color: "#C6AD8F" },
  { city: "Delhi", demand: 58, color: "#C6AD8F" },
  { city: "Chennai", demand: 42, color: "#C6AD8F" },
  { city: "Pune", demand: 31, color: "#C6AD8F" },
];

export const INITIAL_BROADCAST = {
  id: "BRD-001",
  message: "SYSTEM NOMINAL: All Registry Nodes Synchronized.",
  active: false,
  createdAt: new Date().toISOString()
};

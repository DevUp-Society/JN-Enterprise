import { PRODUCTS_V3, ORDERS_V3, RETAILERS_V3, HEATMAP_DATA, INITIAL_BROADCAST } from '../data/mockData_v3';

const STORAGE_KEYS = {
  PRODUCTS: 'jn_v14_products',
  ORDERS: 'jn_v14_orders',
  PARTNERS: 'jn_v14_partners',
  ACTIVITIES: 'jn_v14_activities',
  BROADCAST: 'jn_v14_broadcast',
  ISSUES: 'jn_v14_issues',
  THEME: 'jn_v14_theme',
  USERS: 'jn_v14_users'
};

export class DataService {
  private static initialize() {
    try {
      if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(PRODUCTS_V3));
      }
      if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(ORDERS_V3));
      }
      if (!localStorage.getItem(STORAGE_KEYS.PARTNERS)) {
        const enrichedPartners = RETAILERS_V3.map((r, idx) => ({
          ...r,
          location: r.location || (idx % 2 === 0 ? 'Mumbai, Maharastra' : 'Hyderabad, Telangana'),
          lastOrderDate: new Date(Date.now() - (idx * 86400000 * 2)).toISOString(),
          orderVolume: Math.floor(Math.random() * 20) + 5
        }));
        localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(enrichedPartners));
      }
      if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
        localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify([
          { id: 'ACT-001', type: 'INFO', message: 'Master Registry v14.0 Synchronized', time: 'Just Now' }
        ]));
      }
      if (!localStorage.getItem(STORAGE_KEYS.BROADCAST)) {
        localStorage.setItem(STORAGE_KEYS.BROADCAST, JSON.stringify(INITIAL_BROADCAST));
      }
      if (!localStorage.getItem(STORAGE_KEYS.ISSUES)) {
        localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify([]));
      }
      if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([
          { id: 'USR-001', name: 'Jaswanth Reddy', email: 'admin@jn.com', role: 'ADMIN', lastActive: new Date().toISOString() },
          { id: 'USR-002', name: 'Worker Alpha', email: 'worker1@jn.com', role: 'WORKER', lastActive: new Date(Date.now() - 3600000).toISOString() },
          { id: 'USR-003', name: 'Worker Beta', email: 'worker2@jn.com', role: 'WORKER', lastActive: new Date(Date.now() - 7200000).toISOString() },
          { id: 'USR-004', name: 'Admin Secondary', email: 'admin2@jn.com', role: 'ADMIN', lastActive: new Date(Date.now() - 86400000).toISOString() },
        ]));
      }
    } catch (e) {
      console.error("DATA_SERVICE_INIT_FAILURE", e);
    }
  }

  private static safeParse(key: string, fallback: any = []) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  static getProducts() {
    this.initialize();
    return this.safeParse(STORAGE_KEYS.PRODUCTS, []);
  }

  static getOrders() {
    this.initialize();
    return this.safeParse(STORAGE_KEYS.ORDERS, []);
  }

  static getPartners() {
    this.initialize();
    return this.safeParse(STORAGE_KEYS.PARTNERS, []);
  }

  static getUsers() {
    this.initialize();
    return this.safeParse(STORAGE_KEYS.USERS, []);
  }

  static createUser(userData: any) {
    const users = this.getUsers();
    const newUser = {
      ...userData,
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      lastActive: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([newUser, ...users]));
    this.addActivity('IAM_SYNC', `NEW_USER_DECOUPLED: ${newUser.name} [${newUser.role}]`);
    return newUser;
  }

  // Legacy Fallback for v13.x compatibility
  static getRetailers() { return this.getPartners(); }

  static getPartnerById(id: string) {
    return this.getPartners().find((p: any) => p.id === id);
  }

  static getOrdersByPartner(partnerId: string) {
    const partner = this.getPartnerById(partnerId);
    if (!partner) return [];
    return this.getOrders().filter((o: any) => o.retailer === partner.name);
  }

  static getOrderById(id: string) {
    this.initialize();
    const order = this.getOrders().find((o: any) => o.id === id);
    if (!order) return null;
    
    // Ensure high-fidelity structure for fulfillment manifesto
    const items = (order.items || []).map((item: any) => ({
      ...item,
      id: item.id || `ITEM-${Math.random().toString(36).substr(2, 9)}`,
      product: item.product || {
        name: item.name || 'Unknown Industrial Unit',
        sku: item.sku || 'SKU-PENDING',
        imageUrl: item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200'
      }
    }));

    return {
      ...order,
      company: order.company || { name: order.retailer || 'UNKNOWN_RETAIL_NODE' },
      items
    };
  }

  static getOrderManifest(orderId: string) {
    const order = this.getOrderById(orderId);
    return order ? order.items : [];
  }

  static getIssues() {
    this.initialize();
    return this.safeParse(STORAGE_KEYS.ISSUES, []);
  }

  static getPendingIssuesCount() {
    return this.getIssues().filter((i: any) => i.status === 'PENDING').length;
  }

  static getActivities() {
    this.initialize();
    return this.safeParse(STORAGE_KEYS.ACTIVITIES, []);
  }

  static getBroadcast() {
    this.initialize();
    return this.safeParse(STORAGE_KEYS.BROADCAST, null);
  }

  static sendBroadcast(message: string) {
    const broadcast = {
      id: `BRD-${Date.now()}`,
      message,
      active: true,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.BROADCAST, JSON.stringify(broadcast));
    this.addActivity('BROADCAST', `Admin Broadcast: ${message}`);
  }

  static clearBroadcast() {
    localStorage.removeItem(STORAGE_KEYS.BROADCAST);
  }

  static updateOrderStatus(orderId: string, status: string, worker?: string) {
    const orders = this.getOrders();
    const index = orders.findIndex((o: any) => o.id === orderId);
    if (index !== -1) {
      orders[index].status = status;
      if (worker) orders[index].worker = worker;
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      return true;
    }
    return false;
  }

  static reportIssue(orderId: string, type: string) {
    const issues = this.getIssues();
    const newIssue = {
      id: `ISS-${Date.now()}`,
      orderId,
      type,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify([newIssue, ...issues]));
    this.addActivity('LOGISTICS_ERR', `ISSUE_REPORTED: ${type} [ORDER: ${orderId}]`);
    return newIssue;
  }

  static getAnalyticsSummary(startDate: Date, endDate: Date) {
    const orders = this.getOrders().filter((o: any) => {
      const d = new Date(o.createdAt);
      return d >= startDate && d <= endDate;
    });

    const netRevenue = orders.reduce((sum: number, o: any) => sum + (o.total || o.value || 0), 0);
    const orderVolume = orders.length;
    const aov = orderVolume > 0 ? netRevenue / orderVolume : 0;

    return { netRevenue, orderVolume, aov, timeData: [] };
  }

  // Intelligence Core Legacy Fallbacks
  static getWholesaleHeatmap() { return HEATMAP_DATA; }
  static getStockOutProjections() { return {}; }
  static getCategoryHealth() { return []; }
  static getCategoryMatrix() { return []; }
  static getRevenueForecast() { return 0; }
  static getTopRetailers() { return this.getPartners().slice(0, 5); }
  static getSystemHealth() { return { latency: 42, serverLoad: 14.5, uptime: 99.8 }; }
  static getSystemLogs() { return [`[${new Date().toLocaleTimeString()}] SYSTEM_NOMINAL`]; }
  
  static searchGlobal(query: string) {
    const q = query.toLowerCase();
    const products = this.getProducts().filter((p: any) => p.name.toLowerCase().includes(q));
    const retailers = this.getPartners().filter((r: any) => r.name.toLowerCase().includes(q));
    return { products, retailers };
  }

  static getTheme() { return localStorage.getItem(STORAGE_KEYS.THEME) || 'light'; }
  static setTheme(theme: string) { localStorage.setItem(STORAGE_KEYS.THEME, theme); }

  static addActivity(type: string, message: string) {
    const activities = this.getActivities();
    const newActivity = { id: `ACT-${Date.now()}`, type, message, time: 'Just Now' };
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify([newActivity, ...activities].slice(0, 50)));
  }

  static persistProduct(product: any) {
    const products = this.getProducts();
    const newProduct = {
      ...product,
      id: product.id || `PRD-${Date.now()}`,
      sku: product.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([newProduct, ...products]));
    this.addActivity('INVENTORY_SYNC', `NEW_REGISTRY_ADDED: ${newProduct.name}`);
    return newProduct;
  }
}











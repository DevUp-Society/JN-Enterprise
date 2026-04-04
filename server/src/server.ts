import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Route Modules
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import userRoutes from './routes/userRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import taskRoutes from './routes/taskRoutes';
import cartRoutes from './routes/cartRoutes';
import wishlistRoutes from './routes/wishlistRoutes';

// Middleware
import { errorMiddleware } from './middleware/errorMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing
app.use(helmet()); 
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

// CORS Protocol
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:5178'
];

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Request Audit Logger
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[AUDIT] ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health Endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'UP',
    identity: 'JN_ENTERPRISE_CORE',
    message: 'Server is running with Product Engine ready',
    timestamp: new Date().toISOString(),
  });
});

// Production API Routing
app.use('/api/auth', authRoutes);
app.use('/api/admin/system', adminRoutes);
app.use('/api/admin/inventory', productRoutes);
app.use('/api/admin/orders', orderRoutes);
app.use('/api/admin/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/products', productRoutes); 
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Global Error Protocol
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`JN Enterprise Protocol Initialized on Port ${PORT}`);
});

export default app;

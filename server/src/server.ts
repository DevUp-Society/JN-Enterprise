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
  'http://localhost:5175'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS protocol violation: Unauthorized Origin.'), false);
    }
    return callback(null, true);
  },
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
    timestamp: new Date().toISOString(),
  });
});

// Production API Routing
app.use('/api/auth', authRoutes);
app.use('/api/admin/system', adminRoutes);
app.use('/api/admin/inventory', productRoutes);
app.use('/api/admin/orders', orderRoutes);
app.use('/api/admin/users', userRoutes);
app.use('/api/products', productRoutes); // Legacy compatibility

// Global Error Protocol
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`JN Enterprise Protocol Initialized on Port ${PORT}`);
});

export default app;

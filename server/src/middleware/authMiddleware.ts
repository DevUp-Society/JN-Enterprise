import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const verifyToken = (req: any, res: Response, next: NextFunction) => {
  let token = req.cookies?.token;

  // Also check Authorization header (e.g., "Bearer <token>")
  if (!token && req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'No protocol token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Categorical authorization token is not valid' });
  }
};

export const isAdmin = (req: any, res: Response, next: NextFunction) => {
  if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Industrial Administrative permission required' });
  }
};

export const isRetailer = (req: any, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'RETAILER') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Retailer partner authorization required' });
  }
};

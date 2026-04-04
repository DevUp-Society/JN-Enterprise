import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${err.stack}`);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(status).json({
    status: 'ERROR',
    code: status,
    message: process.env.NODE_ENV === 'production' && status === 500 
      ? 'An unexpected error occurred on the server.' 
      : message,
    timestamp: new Date().toISOString()
  });
};

import { Request, Response, NextFunction } from 'express';
import { ZodError, z, ZodTypeAny } from 'zod';

/**
 * @desc    Higher-order middleware to validate incoming requests against a Zod schema.
 * @param   {ZodTypeAny} schema - The Zod schema to validate against (body, query, params).
 */
export const validateRequest = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'VALIDATION_ERROR',
          message: 'One or more fields failed industrial-grade schema validation.',
          errors: error.issues.map((err) => ({
            field: err.path.join('.').replace('body.', ''),
            message: err.message,
            code: err.code
          })),
        });
      }
      return res.status(500).json({
        status: 'ERROR',
        message: 'Internal data validation circuit failure.',
      });
    }
  };
};

/**
 * @desc    Standard Industrial Product Schema
 */
export const productSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    sku: z.string().min(5, 'SKU must be at least 5 alphanumeric characters'),
    category: z.string().min(1, 'Category is required'),
    price: z.number().positive('Unit price must be positive'),
    stockQuantity: z.number().int().min(0, 'Inventory cannot be negative'),
    minThreshold: z.number().int().min(1).optional(),
    description: z.string().optional(),
    image: z.string().url('Invalid industrial media URL').optional(),
  }),
});

/**
 * @desc    Task Completion Ledger Schema
 */
export const taskCompleteSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid terminal task ID format'),
  }),
});

import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { z } from 'zod';

/**
 * @desc    Fetch industrial products with advanced filtering, searching, and sorting
 * @route   GET /api/products
 * @access  Public / Private
 */
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      page = '1', 
      limit = '10', 
      category, 
      search_query, 
      sort,
      categoryId
    } = req.query as any;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Dynamic Filter Construction
    const where: any = {};
    
    if (categoryId) {
      const idList = Array.isArray(categoryId) ? categoryId : categoryId.toString().split(',');
      where.categoryId = { in: idList };
    } else if (category) {
      where.category = {
        name: { contains: category, mode: 'insensitive' }
      };
    }

    if (search_query) {
      where.OR = [
        { name: { contains: search_query, mode: 'insensitive' } },
        { sku: { contains: search_query, mode: 'insensitive' } },
        { description: { contains: search_query, mode: 'insensitive' } },
      ];
    }

    // Dynamic Sorting
    let orderBy: any = { createdAt: 'desc' };
    if (sort) {
      if (sort === 'price_asc') orderBy = { price: 'asc' };
      if (sort === 'price_desc') orderBy = { price: 'desc' };
      if (sort === 'name_asc') orderBy = { name: 'asc' };
      if (sort === 'name_desc') orderBy = { name: 'desc' };
    }

    const [products, total] = await (prisma as any).$transaction([
      (prisma as any).product.findMany({
        where,
        skip,
        take,
        include: {
          category: true,
          createdBy: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy,
      }),
      (prisma as any).product.count({ where }),
    ]);

    // Volume Tiering Logic Integration
    // Assume req.user contains the authenticated user with company information
    const userRole = (req as any).user?.role;
    const userCompany = (req as any).user?.company; // This would be populated by middleware or separate fetch
    
    // Simulating pricing tier for "Premium Retailer" session context
    const tier = userCompany?.tier || 'STANDARD';
    
    const tieredProducts = products.map((p: any) => {
      let finalPrice = Number(p.price);
      if (tier === 'PREMIUM') finalPrice *= 0.85; // 15% Discount
      if (tier === 'ENTERPRISE') finalPrice *= 0.70; // 30% Discount
      
      return {
        ...p,
        originalPrice: p.price,
        tieredPrice: finalPrice,
        appliedTier: tier
      };
    });

    const totalPages = Math.ceil(total / take);

    res.status(200).json({
      status: 'SUCCESS',
      results: tieredProducts.length,
      pagination: {
        total,
        page: parseInt(page),
        limit: take,
        totalPages,
        hasNextPage: parseInt(page) < totalPages,
      },
      products: tieredProducts,
    });
  } catch (error) {
    console.error('PRODUCT_DISCOVERY_ENGINE_FAILURE:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to synchronize industrial product registry.',
    });
  }
};

/**
 * @desc    Fetch single industrial product specifications
 * @route   GET /api/products/:id
 */
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    console.log(`[SPEC_SYNC] Start retrieval for identifier: ${id}`);
    
    // Attempt 1: Standard ID (UUID)
    let product = await (prisma as any).product.findUnique({
      where: { id },
      include: {
        category: true,
        createdBy: { select: { id: true, name: true, email: true } }
      }
    });

    // Attempt 2: SKU Fallback
    if (!product) {
      console.log(`[SPEC_SYNC] ID search yielded NULL. Retrying via SKU lookup...`);
      product = await (prisma as any).product.findUnique({
        where: { sku: id },
        include: {
          category: true,
          createdBy: { select: { id: true, name: true, email: true } }
        }
      });
    }

    if (!product) {
       console.error(`[SPEC_SYNC] FATAL: Registry node [${id}] not found in any sequence.`);
       return res.status(404).json({
         status: 'ERROR',
         message: `NODE_NOT_FOUND: Identifier [${id}] is invalid.`
       });
    }

    console.log(`[SPEC_SYNC] SUCCESS: Node [${product.id}] synchronized.`);

    res.status(200).json({
      status: 'SUCCESS',
      product
    });
  } catch (error) {
    console.error('PRODUCT_FETCH_FAILURE:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to synchronize product specification node.'
    });
  }
};

/**
 * @desc    Fetch Categories Hub
 * @route   GET /api/categories
 * @access  Public
 */
/**
 * @desc    Fetch Categories Hub (Sorted & Active)
 * @route   GET /api/products/categories
 */
export const getCategories = async (req: Request, res: Response) => {
  try {
    let categories = await (prisma as any).category.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    // Auto-initialize orderIndex ONLY if all are 0 (never reordered)
    const needsInitialization = categories.length > 0 && categories.every((c: any) => c.orderIndex === 0);

    if (needsInitialization) {
      console.log(`[CAT_SYNC] Initialising zero-index hierarchy for ${categories.length} nodes_`);
      await (prisma as any).$transaction(async (tx: any) => {
        for (let i = 0; i < categories.length; i++) {
          await tx.category.update({
            where: { id: categories[i].id },
            data: { orderIndex: i }
          });
        }
      });
      // Refetch
      categories = await (prisma as any).category.findMany({
        orderBy: { orderIndex: 'asc' },
        include: { _count: { select: { products: true } } }
      });
    }

    res.status(200).json({ status: 'SUCCESS', categories });
  } catch (error) {
    console.error('FETCH_CATEGORIES_FAILURE:', error);
    res.status(500).json({ status: 'ERROR', message: 'Failed to fetch industrial categories.' });
  }
};

/**
 * @desc    Create new Category
 * @route   POST /api/products/categories
 */
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, logoUrl } = req.body;
    
    // Get max order index
    const lastCategory = await (prisma as any).category.findFirst({
      orderBy: { orderIndex: 'desc' }
    });
    const nextIndex = (lastCategory?.orderIndex ?? -1) + 1;

    const category = await (prisma as any).category.create({
      data: { name, logoUrl, orderIndex: nextIndex }
    });

    res.status(201).json({ status: 'SUCCESS', category });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: 'Failed to create category node.' });
  }
};

/**
 * @desc    Update Category
 * @route   PATCH /api/products/categories/:id
 */
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, logoUrl, isActive } = req.body;

    const category = await (prisma as any).category.update({
      where: { id },
      data: { name, logoUrl, isActive }
    });

    res.status(200).json({ status: 'SUCCESS', category });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: 'Failed to update category node.' });
  }
};

/**
 * @desc    Delete Category (Restricted)
 * @route   DELETE /api/products/categories/:id
 */
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // The Prisma schema now handles cascading deletes for associated products.

    await (prisma as any).category.delete({ where: { id } });
    res.status(200).json({ status: 'SUCCESS', message: 'Category node purged.' });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: 'Failed to purge category node.' });
  }
};

/**
 * @desc    Reorder Categories (Atomic Transaction)
 * @route   PUT /api/products/categories/reorder
 */
export const reorderCategories = async (req: Request, res: Response) => {
  try {
    const { items } = req.body; // Array of { id: string, orderIndex: number }

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ status: 'ERROR', message: 'INVALID_PAYLOAD: Sequence items must be provided in array format.' });
    }

    console.log(`[CAT_SYNC] Committing sequence registry shift for ${items.length} nodes_`);

    await (prisma as any).$transaction(async (tx: any) => {
      // Step 1: Ensure absolute commitment of EACH categorical index
      for (const item of items) {
        await tx.category.update({
          where: { id: item.id },
          data: { orderIndex: item.orderIndex }
        });
      }
    });

    console.log('[CAT_SYNC] GLOBAL_SEQUENCE_PERSISTENCE_SUCCESS');
    res.status(200).json({ status: 'SUCCESS', message: 'Global categorical sequence synchronized.' });
  } catch (error) {
    console.error('REORDER_CATEGORIES_FAILURE:', error);
    res.status(500).json({ status: 'ERROR', message: 'Failed to synchronize categorical sequence.' });
  }
};

/**
 * @desc    Update an industrial product unit
 * @route   PATCH /api/admin/inventory/:id
 * @access  Private (Admin)
 */
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Handle multiple images if provided
    const imageFiles = (req as any).files as Express.Multer.File[];
    if (imageFiles && imageFiles.length > 0) {
      const imagePaths = imageFiles.map(file => `/uploads/${file.filename}`);
      updateData.images = JSON.stringify(imagePaths);
      updateData.image = imagePaths[0];
    }

    // Parse numeric fields if they arrive as strings
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.stockQuantity) updateData.stockQuantity = parseInt(updateData.stockQuantity);
    if (updateData.minThreshold) updateData.minThreshold = parseInt(updateData.minThreshold);

    const updatedProduct = await (prisma as any).product.update({
      where: { id: id as string },
      data: updateData,
    });

    res.status(200).json({
      status: 'SUCCESS',
      product: updatedProduct,
    });
  } catch (error: any) {
    console.error('Error updating Product:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Product node not found in industrial registry.',
      });
    }
    res.status(500).json({
      status: 'ERROR',
      message: 'Critical error during product state update.',
    });
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, sku, description, categoryId, price, stockQuantity, minThreshold, specs } = req.body;
    
    // Handle multiple images
    const imageFiles = (req as any).files as Express.Multer.File[];
    const imagePaths = imageFiles?.map(file => `/uploads/${file.filename}`) || [];
    const primaryImage = imagePaths.length > 0 ? imagePaths[0] : null;

    // Strict numerical coercion for registry integrity
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stockQuantity);
    const parsedThreshold = parseInt(minThreshold) || 5;

    if (isNaN(parsedPrice) || isNaN(parsedStock)) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'VALUATION_FAILURE: Price and Stock Quantity must be valid numeric sequences.'
      });
    }
    
    // Attempt to identify the systems officer (admin) responsible for this node
    let creatorId = (req as any).user?.id;
    
    // Explicit verification of administrative identity in current DB state
    const verifiedUser = await (prisma as any).user.findUnique({
      where: { id: creatorId }
    });

    if (!verifiedUser) {
      // Fallback: search for first available admin role if current identity is stale
      const adminUser = await (prisma as any).user.findFirst({ 
        where: { 
          role: { in: ['ADMIN', 'SUPER_ADMIN'] } 
        } 
      });
      creatorId = adminUser?.id;
    } else {
      creatorId = verifiedUser.id;
    }

    if (!creatorId) {
      console.error('[REGISTRY_FATAL] No validated administrative identity found to authorize node expansion.');
      return res.status(401).json({
        status: 'ERROR',
        message: 'ARCHIVE_ACCESS_DENIED: Stale or invalid administrative identity.',
      });
    }

    // Verify category existence to prevent P2003
    const categoryExists = await (prisma as any).category.findUnique({
      where: { id: categoryId }
    });

    if (!categoryExists) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'CATEGORICAL_ERROR: Specified category identifier does not exist in the registry.',
      });
    }

    const newProduct = await (prisma as any).product.create({
      data: {
        name,
        sku,
        description: description || '',
        categoryId,
        price: parsedPrice,
        stockQuantity: parsedStock,
        minThreshold: parsedThreshold,
        creatorId,
        image: primaryImage,
        images: JSON.stringify(imagePaths),
        specs: specs || '[]',
        version: 0
      },
    });

    res.status(201).json({
      status: 'SUCCESS',
      message: 'Product registry node successfully synchronized with media.',
      product: newProduct,
    });
  } catch (error: any) {
    console.error('CREATE_PRODUCT_FAILURE:', error);
    
    if (error.code === 'P2002') {
      return res.status(400).json({
        status: 'ERROR',
        message: 'COLLISION_DETECTED: Product SKU already exists in the registry.',
      });
    }

    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to persist industrial product node. Check categorical constraints.',
    });
  }
};

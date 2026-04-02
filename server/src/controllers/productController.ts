import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  sizes: string[];
  image: string;
}

const PRODUCTS_FILE = path.join(__dirname, '..', 'data', 'products.json');

const getProductsData = (): Product[] => {
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products data:', error);
    return [];
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = (req.query.search as string || '').toLowerCase();
    const category = req.query.category as string || 'All';
    const minPrice = parseInt(req.query.minPrice as string) || 0;
    const maxPrice = parseInt(req.query.maxPrice as string) || 10000;

    const allProducts = getProductsData();

    // Filtering logic
    let filteredProducts = allProducts.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search);
      const matchesCategory = category === 'All' || p.category === category;
      const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Pagination logic
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.status(200).json({
      products: paginatedProducts,
      total: filteredProducts.length,
      page,
      pages: Math.ceil(filteredProducts.length / limit),
      hasMore: endIndex < filteredProducts.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching products', error });
  }
};

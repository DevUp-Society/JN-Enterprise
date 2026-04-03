<<<<<<< HEAD
import { Request, Response, NextFunction } from 'express';
=======
import { Request, Response } from 'express';
>>>>>>> origin/siri
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

<<<<<<< HEAD
const saveProductsData = (products: Product[]) => {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving products data:', error);
  }
};

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
=======
export const getProducts = async (req: Request, res: Response) => {
>>>>>>> origin/siri
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = (req.query.search as string || '').toLowerCase();
    const category = req.query.category as string || 'All';
<<<<<<< HEAD

    const allProducts = getProductsData();

    let filteredProducts = allProducts.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search) || p.id.toLowerCase().includes(search);
      const matchesCategory = category === 'All' || p.category === category;
      return matchesSearch && matchesCategory;
    });

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.status(200).json({
      status: 'SUCCESS',
=======
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
>>>>>>> origin/siri
      products: paginatedProducts,
      total: filteredProducts.length,
      page,
      pages: Math.ceil(filteredProducts.length / limit),
      hasMore: endIndex < filteredProducts.length
    });
  } catch (error) {
<<<<<<< HEAD
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    let allProducts = getProductsData();
    const productIndex = allProducts.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return res.status(404).json({ status: 'ERROR', message: 'Product node not found in registry' });
    }

    allProducts[productIndex] = { ...allProducts[productIndex], ...updateData };
    saveProductsData(allProducts);

    res.status(200).json({
      status: 'SUCCESS',
      product: allProducts[productIndex]
    });
  } catch (error) {
    next(error);
=======
    res.status(500).json({ message: 'Server error while fetching products', error });
>>>>>>> origin/siri
  }
};

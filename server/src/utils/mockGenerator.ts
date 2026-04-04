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

const CATEGORIES = ['Outerwear', 'Suits', 'Shirts', 'Accessories', 'Shoes'];
const SIZES = ['S', 'M', 'L', 'XL'];

const generateProducts = (count: number): Product[] => {
  const products: Product[] = [];
  for (let i = 1; i <= count; i++) {
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    products.push({
      id: `PROD-${i.toString().padStart(4, '0')}`,
      name: `${category} Piece #${i}`,
      price: Math.floor(Math.random() * (5000 - 100 + 1)) + 100,
      category,
      stock: Math.floor(Math.random() * 500) + 10,
      sizes: SIZES,
      image: `https://picsum.photos/seed/${i}/400/500`, // Using dummy images for now
    });
  }
  return products;
};

const main = () => {
  const count = 2000;
  const products = generateProducts(count);
  const dataDir = path.join(__dirname, '..', 'data');
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const filePath = path.join(dataDir, 'products.json');
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  console.log(`Successfully generated ${count} products in ${filePath}`);
};

main();

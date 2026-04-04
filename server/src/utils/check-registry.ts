import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const prisma = new PrismaClient();

async function checkCategories() {
  console.log('DATABASE_URL_CHECK:', process.env.DATABASE_URL?.split('@')[1] || 'UNDEFINED');
  
  try {
    const cats = await prisma.category.findMany({
      orderBy: { orderIndex: 'asc' },
      select: {
        id: true,
        name: true,
        orderIndex: true
      }
    });
    console.log('CATEGORY_COUNT:', cats.length);
    cats.forEach((c, i) => {
      console.log(`[${i}] ${c.name} (Index: ${c.orderIndex}) ID: ${c.id}`);
    });
  } catch (err) {
    console.error('REGISTRY_ACCESS_FAILURE', err);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategories();

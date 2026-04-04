const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function check() {
  try {
    const cats = await prisma.category.findMany({
      orderBy: { orderIndex: 'asc' },
      include: { _count: { select: { products: true } } }
    });
    console.log('--- REGISTRY_REPORT ---');
    cats.forEach(c => {
      console.log(`[INDEX: ${c.orderIndex}] ${c.name} (${c._count.products} products)`);
    });
    console.log('--- END_REPORT ---');
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

check();

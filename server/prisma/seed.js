const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 INITIALIZING INDUSTRIAL RESET PROTOCOL...');

  // 1. Destructive Clean-up (Dependencies First)
  console.log('🧹 Purging existing registries...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.task.deleteMany();
  await prisma.inventoryLog.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  // We keep AuditLog and Users for administrative consistency

  // 2. Resolve Admin Identity
  let admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: 'admin@jnenterprise.com',
        password: 'admin-password-secure',
        name: 'Lead Curator',
        role: 'ADMIN'
      }
    });
  }

  // 3. Define Industrial Sector Hierarchy
  const categories = [
    { name: 'Hardware & Fasteners', logoUrl: 'https://cdn-icons-png.flaticon.com/512/3062/3062332.png', orderIndex: 0 },
    { name: 'Technical Textiles', logoUrl: 'https://cdn-icons-png.flaticon.com/512/1048/1048950.png', orderIndex: 1 },
    { name: 'Electronics & PLC', logoUrl: 'https://cdn-icons-png.flaticon.com/512/91/91372.png', orderIndex: 2 },
    { name: 'Logistics & Storage', logoUrl: 'https://cdn-icons-png.flaticon.com/512/2897/2897785.png', orderIndex: 3 },
    { name: 'Industrial Safety', logoUrl: 'https://cdn-icons-png.flaticon.com/512/2311/2311523.png', orderIndex: 4 },
    { name: 'Raw Materials', logoUrl: 'https://cdn-icons-png.flaticon.com/512/2311/2311523.png', orderIndex: 5 }
  ];

  console.log('🏗️  Building Category Control Tower...');
  const catRecords = [];
  for (const cat of categories) {
    const record = await prisma.category.create({
      data: { 
        name: cat.name, 
        logoUrl: cat.logoUrl, 
        orderIndex: cat.orderIndex,
        isActive: true 
      }
    });
    catRecords.push(record);
  }

  // 4. Populate Product Nodes
  console.log('📦  Injecting high-fidelity product nodes...');
  
  const productTemplates = [
    { prefix: 'ZINC', name: 'High-Tensile Zinc Bolt', price: 45.00 },
    { prefix: 'CORE', name: 'Reinforced Fiber Mesh', price: 120.50 },
    { prefix: 'LOGI', name: 'Heavy-Duty Cargo Pallet', price: 340.00 },
    { prefix: 'SAFE', name: 'Impact-Resistant Visor', price: 85.00 },
    { prefix: 'CTRL', name: 'Automated PLC Unit X-1', price: 4500.00 },
    { prefix: 'RAW', name: 'Solid Aluminum Rod (10m)', price: 890.00 }
  ];

  for (const cat of catRecords) {
    const template = productTemplates.find(t => cat.name.toUpperCase().includes(t.prefix)) || productTemplates[0];
    
    // Create 7 products per category for layout demonstration
    for (let i = 1; i <= 7; i++) {
        await prisma.product.create({
            data: {
              name: `${template.name} - Version ${i}.0`,
              sku: `SKU-${cat.id.slice(0, 4)}-${template.prefix}-${i}`,
              description: `Precision-engineered ${template.name} for industrial infrastructure projects. Grade ${8+i} resilience guaranteed.`,
              price: template.price + (i * 25),
              stockQuantity: 50 * i,
              minThreshold: 10,
              categoryId: cat.id,
              creatorId: admin.id,
              image: `https://picsum.photos/seed/jn${cat.name}${i}/600/400`
            }
        });
    }
    console.log(`✅ Sector populated: ${cat.name}`);
  }

  console.log('🚀 SEEDING_PROTOCOL_SUCCESSFUL: Registry is now fully populated.');
}

main()
  .catch((e) => {
    console.error('❌ SEED_FAILURE:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

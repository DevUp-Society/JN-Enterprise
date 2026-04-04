import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@jn.com';
  const plainPassword = 'admin123';
  const hashedPassword = await bcrypt.hash(plainPassword, 12);

  console.log('🏗️ INITIALIZING_SUPER_ADMIN_PROVISIONING...');

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    console.log('♻️ Admin already exists. Updating authority node...');
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        role: 'SUPER_ADMIN' as any,
        isSuperAdmin: true
      }
    });
  } else {
    console.log('✨ Provisioning new Super Admin node...');
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: 'JN Super Admin',
        role: 'SUPER_ADMIN' as any,
        isSuperAdmin: true,
        permissions: {
           create: {
              canViewInventory: true,
              canManageProducts: true,
              canManageOrders: true,
              canViewAnalytics: true,
              canManageUsers: true,
              canManageAdmins: true
           }
        }
      }
    });
    console.log('✅ Created Super Admin:', user.email);
  }

  // Ensure 'Cart' exists for this admin just in case they use it
  await (prisma as any).storedCart.upsert({
    where: { userId_name: { userId: (await prisma.user.findUnique({ where: { email } }))!.id, name: 'Cart' } },
    update: {},
    create: { userId: (await prisma.user.findUnique({ where: { email } }))!.id, name: 'Cart' }
  });

  console.log('🚀 PROVISIONING_COMPLETE: admin@jn.com / admin123');
}

main()
  .catch((e) => {
    console.error('❌ PROVISIONING_FAILURE:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

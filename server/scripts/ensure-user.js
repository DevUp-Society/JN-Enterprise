const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'user@jn.com' },
    update: {
      password: 'user123', // In a real app, hash this!
      role: 'ADMIN',
      name: 'System Admin'
    },
    create: {
      email: 'user@jn.com',
      password: 'user123',
      role: 'ADMIN',
      name: 'System Admin'
    }
  });
  console.log('User created/updated:', user.email);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());

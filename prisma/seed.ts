import { PrismaClient } from 'src/prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seed...');

  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.users.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      isActive: true,
    },
  });

  console.log('✅ Admin user created!');

  const products = [
    {
      name: 'Laptop Dell Inspiron 15',
      costUsd: 450,
      profitMargin: 25,
      priceVes: 16425,
    },
    {
      name: 'Mouse Logitech MX Master 3',
      costUsd: 85,
      profitMargin: 30,
      priceVes: 4042.5,
    },
    {
      name: 'Teclado Mecánico Keychron K2',
      costUsd: 95,
      profitMargin: 28,
      priceVes: 4446,
    },
    {
      name: 'Monitor LG 27" 4K',
      costUsd: 320,
      profitMargin: 22,
      priceVes: 14272,
    },
    {
      name: 'Auriculares Sony WH-1000XM5',
      costUsd: 280,
      profitMargin: 26,
      priceVes: 12908,
    },
    {
      name: 'Webcam Logitech C920',
      costUsd: 65,
      profitMargin: 32,
      priceVes: 3136,
    },
    {
      name: 'SSD Samsung 1TB',
      costUsd: 110,
      profitMargin: 24,
      priceVes: 4984,
    },
    {
      name: 'RAM Corsair 16GB DDR4',
      costUsd: 75,
      profitMargin: 29,
      priceVes: 3537.5,
    },
    {
      name: 'Tarjeta Gráfica RTX 3060',
      costUsd: 380,
      profitMargin: 20,
      priceVes: 16644,
    },
    {
      name: 'Silla Gamer Secretlab',
      costUsd: 420,
      profitMargin: 23,
      priceVes: 18879,
    },
    {
      name: 'Micrófono Blue Yeti',
      costUsd: 130,
      profitMargin: 27,
      priceVes: 6032.5,
    },
    {
      name: 'Hub USB-C Anker',
      costUsd: 55,
      profitMargin: 35,
      priceVes: 2716.25,
    },
  ];

  for (const product of products) {
    await prisma.products.create({
      data: product,
    });
  }

  console.log(`✅ Seed completed! Created ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

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
  console.log('🌱 Starting seed...');

  // Limpiar datos existentes
  await prisma.historyPrices.deleteMany();
  await prisma.products.deleteMany();
  await prisma.categories.deleteMany();
  await prisma.users.deleteMany();
  console.log('🗑️  Cleared existing data');

  // Crear usuario admin
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.users.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      isActive: true,
    },
  });

  console.log('✅ Admin user created');

  // Crear categorías
  const categories = await prisma.categories.createManyAndReturn({
    data: [
      { name: 'Computadoras', isActive: true },
      { name: 'Periféricos', isActive: true },
      { name: 'Componentes', isActive: true },
      { name: 'Audio', isActive: true },
      { name: 'Accesorios', isActive: true },
      { name: 'Monitores', isActive: true },
      { name: 'Mobiliario', isActive: true },
    ],
  });

  const categoriesMap = {
    computadoras: categories.find((c) => c.name === 'Computadoras')!.id,
    perifericos: categories.find((c) => c.name === 'Periféricos')!.id,
    componentes: categories.find((c) => c.name === 'Componentes')!.id,
    audio: categories.find((c) => c.name === 'Audio')!.id,
    accesorios: categories.find((c) => c.name === 'Accesorios')!.id,
    monitores: categories.find((c) => c.name === 'Monitores')!.id,
    mobiliario: categories.find((c) => c.name === 'Mobiliario')!.id,
  };

  console.log(`✅ Created ${categories.length} categories`);

  // Crear productos con categorías
  const products = [
    {
      name: 'Laptop Dell Inspiron 15',
      costUsd: 450,
      buyPriceVes: 16425,
      profitMargin: 25,
      priceVes: 16425,
      categoryId: categoriesMap.computadoras,
    },
    {
      name: 'Mouse Logitech MX Master 3',
      costUsd: 85,
      buyPriceVes: 4042.5,
      profitMargin: 30,
      priceVes: 4042.5,
      categoryId: categoriesMap.perifericos,
    },
    {
      name: 'Teclado Mecánico Keychron K2',
      costUsd: 95,
      buyPriceVes: 4446,
      profitMargin: 28,
      priceVes: 4446,
      categoryId: categoriesMap.perifericos,
    },
    {
      name: 'Monitor LG 27" 4K',
      costUsd: 320,
      buyPriceVes: 14272,
      profitMargin: 22,
      priceVes: 14272,
      categoryId: categoriesMap.monitores,
    },
    {
      name: 'Auriculares Sony WH-1000XM5',
      costUsd: 280,
      buyPriceVes: 12908,
      profitMargin: 26,
      priceVes: 12908,
      categoryId: categoriesMap.audio,
    },
    {
      name: 'Webcam Logitech C920',
      costUsd: 65,
      buyPriceVes: 3136,
      profitMargin: 32,
      priceVes: 3136,
      categoryId: categoriesMap.perifericos,
    },
    {
      name: 'SSD Samsung 1TB',
      costUsd: 110,
      buyPriceVes: 4984,
      profitMargin: 24,
      priceVes: 4984,
      categoryId: categoriesMap.componentes,
    },
    {
      name: 'RAM Corsair 16GB DDR4',
      costUsd: 75,
      buyPriceVes: 3537.5,
      profitMargin: 29,
      priceVes: 3537.5,
      categoryId: categoriesMap.componentes,
    },
    {
      name: 'Tarjeta Gráfica RTX 3060',
      costUsd: 380,
      buyPriceVes: 16644,
      profitMargin: 20,
      priceVes: 16644,
      categoryId: categoriesMap.componentes,
    },
    {
      name: 'Silla Gamer Secretlab',
      costUsd: 420,
      buyPriceVes: 18879,
      profitMargin: 23,
      priceVes: 18879,
      categoryId: categoriesMap.mobiliario,
    },
    {
      name: 'Micrófono Blue Yeti',
      costUsd: 130,
      buyPriceVes: 6032.5,
      profitMargin: 27,
      priceVes: 6032.5,
      categoryId: categoriesMap.audio,
    },
    {
      name: 'Hub USB-C Anker',
      costUsd: 55,
      buyPriceVes: 2716.25,
      profitMargin: 35,
      priceVes: 2716.25,
      categoryId: categoriesMap.accesorios,
    },
  ];

  await prisma.products.createMany({
    data: products,
  });

  console.log(`✅ Created ${products.length} products`);
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

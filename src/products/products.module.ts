import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { Logger } from '@nestjs/common';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, Logger],
  imports: [PrismaModule],
})
export class ProductsModule {}

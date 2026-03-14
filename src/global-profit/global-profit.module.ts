import { Module } from '@nestjs/common';
import { GlobalProfitService } from './global-profit.service';
import { GlobalProfitController } from './global-profit.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { Logger } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [GlobalProfitController],
  providers: [GlobalProfitService, Logger],
})
export class GlobalProfitModule {}

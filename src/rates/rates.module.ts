import { Module } from '@nestjs/common';
import { RatesService } from './rates.service';
import { RatesController } from './rates.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { Logger } from '@nestjs/common';

@Module({
  controllers: [RatesController],
  providers: [RatesService, Logger],
  imports: [PrismaModule],
})
export class RatesModule {}

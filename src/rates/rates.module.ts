import { Module } from '@nestjs/common';
import { RatesService } from './rates.service';
import { RatesController } from './rates.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { Logger } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [PrismaModule, ScheduleModule.forRoot()],
  exports: [RatesService],
  controllers: [RatesController],
  providers: [RatesService, Logger],
})
export class RatesModule {}

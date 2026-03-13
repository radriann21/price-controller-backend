import { Module } from '@nestjs/common';
import { HistoryPricesService } from './history-prices.service';
import { HistoryPricesController } from './history-prices.controller';

@Module({
  controllers: [HistoryPricesController],
  providers: [HistoryPricesService],
})
export class HistoryPricesModule {}

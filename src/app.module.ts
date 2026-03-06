import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RatesModule } from './rates/rates.module';
import { LoggerModule } from 'pino-nestjs';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { HistoryPricesModule } from './history-prices/history-prices.module';

@Module({
  imports: [
    RatesModule,
    LoggerModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ProductsModule,
    HistoryPricesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

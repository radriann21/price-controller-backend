import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { GetRateResponse } from './interfaces/rates.interface';
import axios from 'axios';

@Injectable()
export class RatesService {
  private readonly API_URL: string;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private logger: Logger,
  ) {
    this.API_URL = this.config.getOrThrow<string>('API_URL')!;
  }

  async getAndCreateNewRate() {
    try {
      const newRate = await this.fetchExternalRate();

      if (!newRate) {
        throw new BadGatewayException('No se encontro el precio actual');
      }

      return await this.prisma.exchangeRates.create({
        data: {
          source: 'BCV',
          rate: newRate.price,
        },
      });
    } catch (err) {
      this.logger.error('Ha ocurrido un error:', err);
      throw new InternalServerErrorException('No se encontro el precio actual');
    }
  }

  private async fetchExternalRate(): Promise<GetRateResponse> {
    const { data } = await axios.get<GetRateResponse>(this.API_URL);
    return data;
  }
}

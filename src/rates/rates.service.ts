import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubjectData } from './interfaces/subject.interface';
import { USER_AGENTS } from 'src/common/constants/UserAgents';
import axios from 'axios';
import * as https from 'https';
import * as cheerio from 'cheerio';

@Injectable()
export class RatesService implements OnModuleInit {
  private readonly API_URL: string;
  private readonly rateUpdateSubject = new Subject<SubjectData>();

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private logger: Logger,
  ) {
    this.API_URL = this.config.getOrThrow<string>('API_URL')!;
  }

  cronUpdate() {
    return this.rateUpdateSubject.asObservable().pipe(
      map((rate) => ({
        data: rate,
      })),
    );
  }

  async onModuleInit() {
    this.logger.log('Iniciando servicio de rate.');
    try {
      await this.getAndCreateNewRate();
      this.logger.log('Tasa inicial cargada');
    } catch (error) {
      this.logger.error('Error al cargar la tasa inicial', error);
    }
  }

  @Cron(CronExpression.EVERY_4_HOURS)
  async handleRateUpdate() {
    this.logger.log('Actualizando rate de manera automatica');
    try {
      const updatedRate = await this.getAndCreateNewRate();
      this.logger.log('Actualizado correctamente');

      this.rateUpdateSubject.next({
        message: 'Tasa actualizada en segundo plano',
        rate: updatedRate,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error('Error al actualizar el rate', error);
    }
  }

  async getAndCreateNewRate() {
    try {
      const newRate = await this.fetchExternalRate();
      const lastRate = await this.prisma.exchangeRates.findFirst({
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!newRate) {
        throw new BadGatewayException('No se encontro el precio actual');
      }

      if (!lastRate || Number(lastRate.rate) !== Number(newRate.price)) {
        return await this.prisma.exchangeRates.create({
          data: {
            source: 'BCV',
            rate: newRate.price,
          },
        });
      }

      return lastRate;
    } catch (err) {
      this.logger.error('Ha ocurrido un error:', err);
      throw new InternalServerErrorException('No se encontro el precio actual');
    }
  }

  async getActualRate() {
    try {
      const rate = await this.prisma.exchangeRates.findFirst({
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!rate) {
        throw new NotFoundException('No se encontro el precio actual');
      }

      const FIVE_HOURS_MS = 5 * 60 * 60 * 1000;
      const rateAge = Date.now() - rate.createdAt.getTime();

      if (rateAge > FIVE_HOURS_MS) {
        this.logger.warn('Tasa desactualizada, actualizando...');
        return await this.getAndCreateNewRate();
      }

      return rate;
    } catch (err) {
      this.logger.error(
        'Ha ocurrido un error al obtener el precio actual',
        err,
      );
      throw new InternalServerErrorException('No se encontro el precio actual');
    }
  }

  private async fetchExternalRate() {
    const axiosClient = axios.create({
      headers: {
        'User-Agent':
          USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)].value,
      },
      timeout: 10000,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
        checkServerIdentity: (hostname) => {
          if (hostname === this.API_URL) {
            return undefined;
          }
          return new Error('Hostname no esperado');
        },
      }),
    });

    const { data }: { data: string } = await axiosClient.get<string>(
      this.API_URL,
    );

    const $ = cheerio.load(data);
    const rawPrice = $('#dolar .centrado strong').text().trim();
    const cleanPrice = parseFloat(rawPrice.replace(',', '.'));

    this.logger.log(`Precio actual: ${cleanPrice}`);
    return { price: cleanPrice };
  }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateGlobalProfitDto } from './dto/create-global-profit.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class GlobalProfitService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  async createOrUpdate(createGlobalProfitDto: CreateGlobalProfitDto) {
    try {
      return await this.prisma.globalProfitMargin.upsert({
        where: { id: 1 },
        update: {
          profitMargin: createGlobalProfitDto.profitMargin,
        },
        create: {
          id: 1,
          profitMargin: createGlobalProfitDto.profitMargin,
        },
      });
    } catch (error) {
      this.logger.error('Ocurrio un error desconocido.', error);
      throw new InternalServerErrorException('Ocurrio un error desconocido.');
    }
  }

  async findOne() {
    return await this.prisma.globalProfitMargin.findFirst();
  }
}

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  async findOne(username: string) {
    try {
      const user = await this.prisma.users.findFirst({
        where: {
          username,
        },
        select: {
          id: true,
          username: true,
        },
      });

      if (!user) {
        this.logger.error(`User with username ${username} not found`);
        throw new NotFoundException(`User with username ${username} not found`);
      }

      return user;
    } catch (error) {
      this.logger.error('Un error en el servidor', error);
      throw new InternalServerErrorException('Un error en el servidor');
    }
  }
}

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { Logger } from '@nestjs/common';

@Module({
  controllers: [UsersController],
  providers: [UsersService, Logger],
  imports: [PrismaModule],
  exports: [UsersService],
})
export class UsersModule {}
